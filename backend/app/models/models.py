from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Race(Base):
    __tablename__ = "races"
    
    id = Column(Integer, primary_key=True, index=True)
    track = Column(String, index=True)
    date = Column(String, index=True)
    race_number = Column(Integer)
    distance = Column(String)
    surface = Column(String)
    going = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    entries = relationship("RaceEntry", back_populates="race", cascade="all, delete-orphan")

class RaceEntry(Base):
    __tablename__ = "race_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"))
    horse_name = Column(String, index=True)
    jockey = Column(String)
    trainer = Column(String)
    barrier = Column(Integer, nullable=True)
    odds = Column(Float)
    rating = Column(Float, nullable=True)
    model_prob = Column(Float, nullable=True)
    market_prob = Column(Float, nullable=True)
    edge = Column(Float, nullable=True)
    
    race = relationship("Race", back_populates="entries")

class VideoProject(Base):
    __tablename__ = "video_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=True)
    status = Column(String, default="QUEUED") # QUEUED, PROCESSING, COMPLETED, FAILED
    output_path = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
