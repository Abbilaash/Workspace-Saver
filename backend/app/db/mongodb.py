from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_wrapper = MongoDB()

async def connect_to_mongo():
    uri = settings.MONGODB_URI
    db_name = settings.MONGODB_DATABASE
    host_info = uri.split("@")[-1] if "@" in uri else uri
    print(f"Connecting to MongoDB at ...@{host_info} (db: {db_name})...")
    db_wrapper.client = AsyncIOMotorClient(uri)
    db_wrapper.db = db_wrapper.client[db_name]
    print(f"Connected to database: {db_name}")

async def close_mongo_connection():
    if db_wrapper.client:
        db_wrapper.client.close()
        print("Closed MongoDB connection.")

def get_database():
    return db_wrapper.db
