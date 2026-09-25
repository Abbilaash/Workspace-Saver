from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_wrapper = MongoDB()

async def connect_to_mongo():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    db_wrapper.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_wrapper.db = db_wrapper.client[settings.MONGODB_DATABASE]
    print(f"Connected to database: {settings.MONGODB_DATABASE}")

async def close_mongo_connection():
    if db_wrapper.client:
        db_wrapper.client.close()
        print("Closed MongoDB connection.")

def get_database():
    return db_wrapper.db
