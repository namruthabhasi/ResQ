from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from .database import engine, Base, get_db
from .seeds import seed_database
from . import crud, schemas, ollama_client

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

# Seed database on module loading if needed
db = next(get_db())
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="ResQ Backend API",
    description="Offline-first emergency disaster response platform support API",
    version="1.0.0"
)

# Enable CORS for frontend web server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open to all origins for easy local offline connection
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/status")
async def get_status(db: Session = Depends(get_db)):
    """
    Diagnostic endpoint to check system status.
    """
    db_status = "healthy"
    try:
        # Simple query to verify SQLite connection
        db.execute(Base.metadata.tables["shelters"].select().limit(1))
    except Exception:
        db_status = "unhealthy"

    # Quick ping to Ollama
    ai_status = "online"
    try:
        import httpx
        async with httpx.AsyncClient(timeout=1.0) as client:
            res = await client.get("http://localhost:11434/")
            if res.status_code != 200:
                ai_status = "error"
    except Exception:
        ai_status = "offline"

    return {
        "status": "active",
        "database": db_status,
        "ollama_ai": ai_status,
        "app_name": "ResQ Disaster Assistant"
    }


# --- Chat AI Assistant ---
@app.post("/api/chat")
async def chat_assistant(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    """
    Chat endpoint powered by Ollama running Gemma locally.
    Falls back to a local database keyword search if Ollama is offline.
    """
    result = await ollama_client.query_ollama(
        messages=[msg.model_dump() for msg in request.messages],
        disaster_context=request.disaster_context
    )
    
    # If Ollama is offline or un-reachable, query local database
    if result.get("status") == "offline" or result.get("offline_fallback"):
        last_message = request.messages[-1].content.lower() if request.messages else ""
        from . import models
        
        # 1. Check First Aid Guides
        first_aid_guides = db.query(models.FirstAidGuide).all()
        for guide in first_aid_guides:
            title_keywords = [word.strip(",.()").lower() for word in guide.title.split()]
            
            # Append specific trigger keywords
            if "cpr" in guide.title.lower():
                title_keywords.append("cpr")
            if "bleed" in guide.title.lower():
                title_keywords.extend(["bleed", "bleeding", "cut", "wound", "blood", "hemorrhage"])
            if "burn" in guide.title.lower():
                title_keywords.extend(["burn", "burns", "scald"])
            if "fracture" in guide.title.lower():
                title_keywords.extend(["fracture", "fractures", "broken", "bone", "bones"])
            if "chok" in guide.title.lower():
                title_keywords.extend(["chok", "choking", "asphyxiate", "suffocate"])
            if "snake" in guide.title.lower():
                title_keywords.extend(["snake", "bite", "venom"])
            if "heat" in guide.title.lower():
                title_keywords.extend(["heat", "stroke", "sunstroke", "exhaustion"])
            if "drown" in guide.title.lower():
                title_keywords.extend(["drown", "drowning", "water"])
            
            if any(kw in last_message for kw in title_keywords if len(kw) > 2 or kw == "cpr"):
                actions_list = "\n".join([f"- {act}" for act in guide.immediate_actions])
                warnings_list = ""
                if guide.warnings:
                    warnings_list = "\n\n**⚠️ Warnings:**\n" + "\n".join([f"- {warn}" for warn in guide.warnings])
                
                help_trigger = f"\n\n**Professional Help:** {guide.seek_help_trigger}" if guide.seek_help_trigger else ""
                
                content = (
                    f"ℹ️ **ResQ Offline Assistant (Local Database Match)**\n\n"
                    f"### {guide.title}\n\n"
                    f"**Immediate Actions:**\n{actions_list}"
                    f"{warnings_list}"
                    f"{help_trigger}"
                )
                return {
                    "status": "success",
                    "content": content,
                    "model": "local_sqlite_fallback"
                }

        # 2. Check Survival Guides (Disasters)
        categories = ["flood", "earthquake", "fire", "cyclone", "landslide"]
        matched_cat = None
        for cat in categories:
            if cat in last_message:
                matched_cat = cat.capitalize()
                break
        
        if matched_cat:
            guides = db.query(models.SurvivalGuide).filter(models.SurvivalGuide.category == matched_cat).all()
            if guides:
                content = f"ℹ️ **ResQ Offline Assistant (Local Database Match)**\n\n"
                for guide in guides:
                    content += f"{guide.content}\n\n"
                return {
                    "status": "success",
                    "content": content,
                    "model": "local_sqlite_fallback"
                }
                
    return result


# --- Shelters API ---
@app.get("/api/shelters", response_model=List[schemas.Shelter])
def read_shelters(query: Optional[str] = None, db: Session = Depends(get_db)):
    if query:
        return crud.search_shelters(db, query)
    return crud.get_shelters(db)

@app.post("/api/shelters", response_model=schemas.Shelter, status_code=status.HTTP_201_CREATED)
def create_shelter(shelter: schemas.ShelterCreate, db: Session = Depends(get_db)):
    return crud.create_shelter(db, shelter)

@app.put("/api/shelters/{shelter_id}", response_model=schemas.Shelter)
def update_shelter(shelter_id: int, shelter: schemas.ShelterCreate, db: Session = Depends(get_db)):
    db_shelter = crud.update_shelter(db, shelter_id, shelter)
    if not db_shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return db_shelter

@app.delete("/api/shelters/{shelter_id}")
def delete_shelter(shelter_id: int, db: Session = Depends(get_db)):
    success = crud.delete_shelter(db, shelter_id)
    if not success:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return {"detail": "Shelter deleted successfully"}


# --- Emergency Contacts API ---
@app.get("/api/contacts", response_model=List[schemas.EmergencyContact])
def read_contacts(db: Session = Depends(get_db)):
    return crud.get_contacts(db)

@app.post("/api/contacts", response_model=schemas.EmergencyContact, status_code=status.HTTP_201_CREATED)
def create_contact(contact: schemas.EmergencyContactCreate, db: Session = Depends(get_db)):
    return crud.create_contact(db, contact)

@app.put("/api/contacts/{contact_id}", response_model=schemas.EmergencyContact)
def update_contact(contact_id: int, contact: schemas.EmergencyContactCreate, db: Session = Depends(get_db)):
    db_contact = crud.update_contact(db, contact_id, contact)
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return db_contact

@app.delete("/api/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    success = crud.delete_contact(db, contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"detail": "Contact deleted successfully"}


# --- Survival Guides API ---
@app.get("/api/guides", response_model=List[schemas.SurvivalGuide])
def read_survival_guides(category: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_survival_guides(db, category)

@app.post("/api/guides", response_model=schemas.SurvivalGuide, status_code=status.HTTP_201_CREATED)
def create_survival_guide(guide: schemas.SurvivalGuideCreate, db: Session = Depends(get_db)):
    return crud.create_survival_guide(db, guide)

@app.put("/api/guides/{guide_id}", response_model=schemas.SurvivalGuide)
def update_survival_guide(guide_id: int, guide: schemas.SurvivalGuideCreate, db: Session = Depends(get_db)):
    db_guide = crud.update_survival_guide(db, guide_id, guide)
    if not db_guide:
        raise HTTPException(status_code=404, detail="Survival guide not found")
    return db_guide

@app.delete("/api/guides/{guide_id}")
def delete_survival_guide(guide_id: int, db: Session = Depends(get_db)):
    success = crud.delete_survival_guide(db, guide_id)
    if not success:
        raise HTTPException(status_code=404, detail="Survival guide not found")
    return {"detail": "Survival guide deleted successfully"}


# --- First Aid Guides API ---
@app.get("/api/firstaid", response_model=List[schemas.FirstAidGuide])
def read_first_aid(db: Session = Depends(get_db)):
    return crud.get_first_aid_guides(db)


# --- Checklists API ---
@app.get("/api/checklists", response_model=List[schemas.EmergencyChecklist])
def read_checklists(db: Session = Depends(get_db)):
    return crud.get_checklists(db)


# --- Reset / Reseed Database (Admin Command) ---
@app.post("/api/admin/reseed")
def force_reseed_db(db: Session = Depends(get_db)):
    """
    Resets and seeds SQLite database to default.
    """
    try:
        # Clear tables
        db.query(models.Shelter).delete()
        db.query(models.EmergencyContact).delete()
        db.query(models.FirstAidGuide).delete()
        db.query(models.EmergencyChecklist).delete()
        db.query(models.SurvivalGuide).delete()
        db.commit()
        
        # Reseed
        seed_database(db)
        return {"detail": "Database reseeded successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database reseeding failed: {str(e)}")
