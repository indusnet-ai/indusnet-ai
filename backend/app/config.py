import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./copilot.db"
    OPENAI_API_KEY: str = ""
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS Settings
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3005,http://127.0.0.1:3000,http://127.0.0.1:3005,https://indusnetai.com,https://www.indusnetai.com,https://indusnet-ai.com,https://www.indusnet-ai.com"

    # Supabase Settings
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None

    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "info@indusnet-ai.com"
    SMTP_PASSWORD: str = ""

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

