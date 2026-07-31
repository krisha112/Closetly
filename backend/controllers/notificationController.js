//import the Notification model, interacts with the mongodb database 
const Notification = require("../models/Notification");

// Create Notification, fetched from the frontend, and saves it to the database. The notification is created with the userId of the user who receives the notification, the message of the notification, and the type of the notification. The notification is then saved to the database and a success message is sent back to the frontend. If there is an error, an error message is sent back to the frontend.
const addNotification = async (req, res) => {

    try {

        const { userId, message, type } = req.body;
        // Create a new notification instance with the provided userId, message, and type
        const notification = new Notification({
            userId,
            message,
            type
        });
        // Save the notification to the database
        const savedNotification = await notification.save();
        // Send a success response back to the frontend with the saved notification data
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

module.exports = {
    addNotification
};