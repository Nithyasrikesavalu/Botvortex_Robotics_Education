import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["success", "info", "warning", "error"],
            default: "info",
        },
        read: {
            type: Boolean,
            default: false,
        },
        action: {
            type: String,
            default: "view",
        },
        icon: {
            type: String, // String representation of lucide-react icon name if needed, or generic type
            default: "Bell",
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
