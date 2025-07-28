from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, transactions, score, forecast

app = FastAPI()

# Optional: allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(upload.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(score.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
