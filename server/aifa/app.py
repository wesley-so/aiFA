from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import config
from .routers import stock, user
from .services.database import init_database

app = FastAPI()
app.include_router(user.router)
app.include_router(stock.router)

origins = ["http://localhost:8000", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=config["cors_origins"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def start_database():
    await init_database()


@app.get("/")
async def root():
    return {"message": "Hello World!"}
