from fastapi import APIRouter
from app.api.endpoints import races

api_router = APIRouter()
api_router.include_router(races.router)
