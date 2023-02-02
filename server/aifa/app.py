from fastapi import FastAPI

from .routers import user
from .services.database import init_database

init_database()

app = FastAPI()
app.include_router(user.router)


@app.on_event("startup")
async def start_database():
    await init_database()


@app.get("/")
async def root():
    return {"message": "Hello World!"}
