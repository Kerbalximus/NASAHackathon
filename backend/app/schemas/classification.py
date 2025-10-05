from typing import Literal
from pydantic import BaseModel, Field

Label = Literal[
    "Other",
    "Crater",
    "Dark Dune",
    "Slope Streak",
    "Bright Dune",
    "Impact ejecta",
    "Swiss cheese",
    "Spider",
]


class ClassifyResponse(BaseModel):
    class_id: int = Field(..., ge=0, le=7)
    label: Label
    confidence: float
