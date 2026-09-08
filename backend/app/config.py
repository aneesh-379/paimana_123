"""
PAIMANA Backend Service Configuration
"""

import os


class Settings:
    PROJECT_NAME: str = "PAIMANA AI Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    MODELS_DIR: str = os.path.join(DATA_DIR, "models")
    PROCESSED_DIR: str = os.path.join(DATA_DIR, "processed")


settings = Settings()
