from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Closetly database
db = client["closetly"]

# Users collection
users_collection = db["users"]

password_reset_tokens = db["password_reset_tokens"]