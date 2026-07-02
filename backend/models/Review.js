import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    helpful: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
