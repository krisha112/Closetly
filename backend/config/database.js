const mongoose = require("mongoose");

const connectDB = async () => {

    if (!process.env.MONGODB_URI) {
        console.log("⚠️ MongoDB not configured. Running without database.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.log("❌ MongoDB Connection Failed");
        console.log(error.message);
    }
};

module.exports = connectDB;