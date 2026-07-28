const express = require("express");

const router = express.Router();

const {
    addNotification
} = require("../controllers/notificationController");

// Create Notification
router.post("/", addNotification);

module.exports = router;