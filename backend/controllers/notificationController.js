// Import the Notification model
const Notification = require("../models/Notification");


// =====================================================
// CREATE NOTIFICATION
// =====================================================

const addNotification = async (req, res) => {

    try {

        const { userId, message, type } = req.body;

        const notification = new Notification({
            userId,
            message,
            type
        });

        const savedNotification = await notification.save();

        res.status(201).json({
            success: true,
            message: "Notification Created Successfully",
            data: savedNotification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// GET USER NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {

    try {

        const { userId } = req.query;

        // For now, userId is required.
        // Later this can come from authentication.
        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "userId is required"
            });

        }

        const notifications = await Notification
            .find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {

            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

const markAllAsRead = async (req, res) => {

    try {

        const { userId } = req.body;

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "userId is required"
            });

        }

        const result = await Notification.updateMany(
            {
                userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    addNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
};