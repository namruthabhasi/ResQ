from pydantic import BaseModel, Field
from typing import List, Optional

# --- Shelter Schemas ---
class ShelterBase(BaseModel):
    name: str
    address: str
    capacity: int
    contact_number: str
    available_facilities: Optional[str] = None

class ShelterCreate(ShelterBase):
    pass

class Shelter(ShelterBase):
    id: int

    class Config:
        from_attributes = True


# --- Emergency Contact Schemas ---
class EmergencyContactBase(BaseModel):
    name: str
    role: str
    phone_number: str
    organization: str

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContact(EmergencyContactBase):
    id: int

    class Config:
        from_attributes = True


# --- Survival Guide Schemas ---
class SurvivalGuideBase(BaseModel):
    category: str
    stage: str
    content: str

class SurvivalGuideCreate(SurvivalGuideBase):
    pass

class SurvivalGuide(SurvivalGuideBase):
    id: int

    class Config:
        from_attributes = True


# --- First Aid Guide Schemas ---
class FirstAidGuideBase(BaseModel):
    title: str
    symptoms: Optional[str] = None
    immediate_actions: List[str]
    warnings: Optional[List[str]] = None
    seek_help_trigger: Optional[str] = None

class FirstAidGuideCreate(FirstAidGuideBase):
    pass

class FirstAidGuide(FirstAidGuideBase):
    id: int

    class Config:
        from_attributes = True


# --- Emergency Checklist Schemas ---
class EmergencyChecklistBase(BaseModel):
    title: str
    items: List[str]

class EmergencyChecklistCreate(EmergencyChecklistBase):
    pass

class EmergencyChecklist(EmergencyChecklistBase):
    id: int

    class Config:
        from_attributes = True


# --- Chat Schemas ---
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    disaster_context: Optional[str] = None  # e.g., "flood", "fire"
