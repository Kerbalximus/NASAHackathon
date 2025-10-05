from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App config
    app_name: str = "Planets Image Classification Service"
    discription: str = "API for classification of planets images"
    version: str = "1.0.0"
    log_level: str = Field("info", env="LOG_LEVEL")

    v1_api_prefix: str = "/api/v1"

    # Model config
    classification_model_path: str = Field(..., env="CLASSIFICATION_MODEL_PATH")

    # Labels for classification
    labels: tuple[str, ...] = (
        "Other",
        "Crater",
        "Dark Dune",
        "Slope Streak",
        "Bright Dune",
        "Impact ejecta",
        "Swiss cheese",
        "Spider",
    )

    labels = (
        "Other",
        "Crater",
        "Dark Dune",
        "Slope Streak",
        "Bright Dune",
        "Impact ejecta",
        "Swiss cheese",
        "Spider",
    )
    class Config:
        env_file = ".env"



settings = Settings()
