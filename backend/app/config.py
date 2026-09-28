import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load .env file from backend directory or parent directory
load_dotenv()
backend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", ".env")
if os.path.exists(backend_env):
    load_dotenv(backend_env)

class Settings(BaseSettings):
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "workspace_saver")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "default-secret-key-change-in-prod")
    JWT_EXPIRE_DAYS: int = int(os.getenv("JWT_EXPIRE_DAYS", "180")) # 6 months (180 days)
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    PORT: int = int(os.getenv("PORT", "8000"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
