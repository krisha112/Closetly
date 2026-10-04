const express = require("express");

const router = express.Router();

const {
    addNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");


// Create Notification
router.post("/", addNotification);

// Get User Notifications
router.get("/", getNotifications);

// Mark One Notification as Read
router.patch("/:id/read", markAsRead);

// Mark All Notifications as Read
router.patch("/read-all", markAllAsRead);


module.exports = router;