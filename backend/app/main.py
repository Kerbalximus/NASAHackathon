from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import structlog

from app.core.config import settings
from app.core.logging import configure_logging
from app.api.v1.health import router as health_router
from app.api.v1.classification import router as classification_router

configure_logging()
log = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    log.info("Starting Transcription Microservice")

    yield

    log.info("Transcription Microservice stopped")


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=settings.discription,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://planets-map.select"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health_router)
app.include_router(classification_router, prefix=settings.v1_api_prefix)


@app.get("/")
async def root():
    return {"message": "Welcome to the Planets Image Classification Service!"}
