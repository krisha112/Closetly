const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    // stores the userId of the user who receives the notification
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // stores the message of the notification
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    // stores the type of the notification
    type: {
        type: String,
        enum: [
            "clothes",
            "outfit",
            "profile",
            "wishlist",
            "system"
        ],
        required: true
    },

    // read/unread status
    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

notificationSchema.index({
    userId: 1,
    createdAt: -1
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);