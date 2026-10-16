
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Existing routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// New outfit routes
const outfitRoutes = require("./routes/OutfitRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/outfits", outfitRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Closetly Backend is Running Successfully!");
});

// Database connection
const connectDB = require("./config/database");

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
