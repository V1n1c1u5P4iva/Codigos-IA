from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models  # noqa: F401  (registers the tables on Base.metadata)
from .config import settings
from .database import Base, engine
from .routers import auth, tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates the tables on startup. For production, use Alembic migrations.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Task Manager API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)