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


// Get Notifications
router.get("/", getNotifications);


// Mark All Notifications As Read
router.patch("/read-all", markAllAsRead);


// Mark One Notification As Read
router.patch("/:id/read", markAsRead);


module.exports = router;