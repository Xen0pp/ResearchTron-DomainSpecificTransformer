from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import auth, chat

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ML Chat MVP API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP only, in production restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
# We handle GET /chats by including chat router but exposing a route with path "s" since prefix is /chat

@app.get("/")
def read_root():
    return {"message": "Welcome to the ML Chat MVP API"}
