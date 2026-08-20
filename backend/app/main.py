from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TurfContent AI API")

# Configuración de CORS para tu futuro frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.3.0"}

@app.get("/")
def root():
    return {"message": "TurfContent AI Backend activo"}
