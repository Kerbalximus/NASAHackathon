from fastapi import APIRouter, UploadFile, File
from app.schemas.classification import ClassifyResponse
from app.services.classification import classify_image

router = APIRouter(prefix="/classify", tags=["Classification"])

@router.post("/image")
async def classify_image_endpoint(file: UploadFile = File(...)) -> ClassifyResponse:
    content = await file.read()
    result = classify_image(content)
    return result