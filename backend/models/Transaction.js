import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
            default: "credit"
        },
        amount: {
            type: Number,
            required: true // The money paid (e.g. 99, 199)
        },
        coins: {
            type: Number,
            required: true // The coins received (e.g. 100, 250)
        },
        paymentMethod: {
            type: String,
            required: true
        },
        packageId: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed"
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
