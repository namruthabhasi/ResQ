from sqlalchemy.orm import Session
from . import models, schemas

# --- Shelter CRUD ---
def get_shelters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Shelter).offset(skip).limit(limit).all()

def search_shelters(db: Session, query: str):
    return db.query(models.Shelter).filter(
        (models.Shelter.name.contains(query)) |
        (models.Shelter.address.contains(query)) |
        (models.Shelter.available_facilities.contains(query))
    ).all()

def create_shelter(db: Session, shelter: schemas.ShelterCreate):
    db_shelter = models.Shelter(**shelter.model_dump())
    db.add(db_shelter)
    db.commit()
    db.refresh(db_shelter)
    return db_shelter

def update_shelter(db: Session, shelter_id: int, shelter: schemas.ShelterCreate):
    db_shelter = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if not db_shelter:
        return None
    for key, value in shelter.model_dump().items():
        setattr(db_shelter, key, value)
    db.commit()
    db.refresh(db_shelter)
    return db_shelter

def delete_shelter(db: Session, shelter_id: int):
    db_shelter = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if db_shelter:
        db.delete(db_shelter)
        db.commit()
        return True
    return False


# --- Emergency Contacts CRUD ---
def get_contacts(db: Session):
    return db.query(models.EmergencyContact).all()

def create_contact(db: Session, contact: schemas.EmergencyContactCreate):
    db_contact = models.EmergencyContact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def update_contact(db: Session, contact_id: int, contact: schemas.EmergencyContactCreate):
    db_contact = db.query(models.EmergencyContact).filter(models.EmergencyContact.id == contact_id).first()
    if not db_contact:
        return None
    for key, value in contact.model_dump().items():
        setattr(db_contact, key, value)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: int):
    db_contact = db.query(models.EmergencyContact).filter(models.EmergencyContact.id == contact_id).first()
    if db_contact:
        db.delete(db_contact)
        db.commit()
        return True
    return False


# --- Survival Guides CRUD ---
def get_survival_guides(db: Session, category: str = None):
    query = db.query(models.SurvivalGuide)
    if category:
        query = query.filter(models.SurvivalGuide.category == category)
    return query.all()

def create_survival_guide(db: Session, guide: schemas.SurvivalGuideCreate):
    db_guide = models.SurvivalGuide(**guide.model_dump())
    db.add(db_guide)
    db.commit()
    db.refresh(db_guide)
    return db_guide

def update_survival_guide(db: Session, guide_id: int, guide: schemas.SurvivalGuideCreate):
    db_guide = db.query(models.SurvivalGuide).filter(models.SurvivalGuide.id == guide_id).first()
    if not db_guide:
        return None
    for key, value in guide.model_dump().items():
        setattr(db_guide, key, value)
    db.commit()
    db.refresh(db_guide)
    return db_guide

def delete_survival_guide(db: Session, guide_id: int):
    db_guide = db.query(models.SurvivalGuide).filter(models.SurvivalGuide.id == guide_id).first()
    if db_guide:
        db.delete(db_guide)
        db.commit()
        return True
    return False


# --- First Aid Guides CRUD ---
def get_first_aid_guides(db: Session):
    return db.query(models.FirstAidGuide).all()

def create_first_aid_guide(db: Session, guide: schemas.FirstAidGuideCreate):
    db_guide = models.FirstAidGuide(**guide.model_dump())
    db.add(db_guide)
    db.commit()
    db.refresh(db_guide)
    return db_guide


# --- Emergency Checklists CRUD ---
def get_checklists(db: Session):
    return db.query(models.EmergencyChecklist).all()

def create_checklist(db: Session, checklist: schemas.EmergencyChecklistCreate):
    db_checklist = models.EmergencyChecklist(**checklist.model_dump())
    db.add(db_checklist)
    db.commit()
    db.refresh(db_checklist)
    return db_checklist
