from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.models import Race, RaceEntry
from turf.analytics.engine import TurfAnalyticsEngine

router = APIRouter(prefix="/api/races", tags=["races"])

class HorseInput(BaseModel):
    horse_name: str
    jockey: str
    trainer: str
    odds: float
    form_score: float = 75.0
    distance_score: float = 75.0
    track_score: float = 75.0
    jockey_score: float = 75.0
    trainer_score: float = 75.0

class RaceCreateRequest(BaseModel):
    track: str
    date: str
    race_number: int
    distance: str
    surface: str
    going: str = "Good"
    entries: List[HorseInput]

@router.post("/")
def create_and_analyze_race(payload: RaceCreateRequest, db: Session = Depends(get_db)):
    """Crea una carrera, ejecuta el motor cuantitativo y guarda los resultados."""
    # 1. Transformar datos de entrada para el motor
    entries_dict_list = [entry.dict() for entry in payload.entries]
    
    # 2. Calcular Ratings y Edge mediante el motor analítico
    analyzed_results = TurfAnalyticsEngine.evaluate_market_edge(entries_dict_list)
    
    # 3. Guardar en base de datos PostgreSQL
    db_race = Race(
        track=payload.track,
        date=payload.date,
        race_number=payload.race_number,
        distance=payload.distance,
        surface=payload.surface,
        going=payload.going
    )
    db.add(db_race)
    db.commit()
    db.refresh(db_race)
    
    # Guardar las entradas analizadas
    for res in analyzed_results:
        db_entry = RaceEntry(
            race_id=db_race.id,
            horse_name=res["horse_name"],
            jockey=res["jockey"],
            trainer=res["trainer"],
            odds=res["odds"],
            rating=res["rating"],
            model_prob=res["model_prob"],
            market_prob=res["market_prob"],
            edge=res["edge"]
        )
        db.add(db_entry)
    db.commit()
    
    return {
        "status": "success",
        "race_id": db_race.id,
        "track": db_race.track,
        "analysis": analyzed_results
    }

@router.get("/")
def get_races(db: Session = Depends(get_db)):
    """Lista todas las carreras registradas."""
    races = db.query(Race).all()
    return [{"id": r.id, "track": r.track, "date": r.date, "race_number": r.race_number, "distance": r.distance} for r in races]
