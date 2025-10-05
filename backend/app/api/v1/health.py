from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import structlog

router = APIRouter(prefix="/health", tags=["Health"])
log = structlog.get_logger(__name__)


@router.get("/liveness")
async def liveness_check():
    """
    Liveness check endpoint to verify the service is alive.
    This endpoint can be used by load balancers to determine if the service is responsive.
    """
    return {"status": "alive", "message": "App is alive and responsive."}


@router.get("/readiness")
async def readiness_check(request: Request):
    """
    Readiness check endpoint to verify the service is ready to handle requests.
    This endpoint can be used by load balancers to determine if the service is ready to accept traffic.
    """
    try:
        return {"status": "ready", "message": "App is ready to handle requests."}
    except Exception as e:
        log.error("readiness.mongo_ping_failed", error=str(e))
        return JSONResponse(
            status_code=503,
            content={
                "status": "not ready",
                "message": "App is not ready to handle requests.",
            },
        )
