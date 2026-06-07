from sqlalchemy import Column, Integer, String, Text, JSON
from .database import Base

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False, default=0)
    contact_number = Column(String, nullable=False)
    available_facilities = Column(String, nullable=True)  # Comma separated facilities list (e.g. "Water, Food, Medical Support")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    organization = Column(String, nullable=False)

class SurvivalGuide(Base):
    __tablename__ = "survival_guides"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)  # flood, earthquake, fire, cyclone, landslide
    stage = Column(String, nullable=False)     # before, during, after, prevention
    content = Column(Text, nullable=False)      # markdown or text instruction details

class FirstAidGuide(Base):
    __tablename__ = "first_aid_guides"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)      # Bleeding, CPR Guidance, Burns, etc.
    symptoms = Column(Text, nullable=True)      # Description of symptoms
    immediate_actions = Column(JSON, nullable=False)  # List of actions (JSON array)
    warnings = Column(JSON, nullable=True)           # List of warnings (JSON array)
    seek_help_trigger = Column(Text, nullable=True)  # When to seek professional help

class EmergencyChecklist(Base):
    __tablename__ = "emergency_checklists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)      # Family Emergency Kit, Flood Survival Kit, etc.
    items = Column(JSON, nullable=False)        # List of items (JSON array of strings or dicts)
