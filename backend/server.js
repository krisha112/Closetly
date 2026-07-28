const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const notificationRoutes = require("./routes/notificationRoutes");
// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Closetly Backend is Running Successfully!");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
