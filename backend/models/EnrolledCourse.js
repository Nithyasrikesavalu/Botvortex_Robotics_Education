import mongoose from 'mongoose';

const EnrolledCourseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: { type: String, required: true },
    title: { type: String, required: true },
    instructor: { type: String, default: '' },
    progress: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    testsCompleted: { type: Number, default: 0 },
    testsTotal: { type: Number, default: 0 },
    certificate: { type: Boolean, default: false },
    grade: { type: String, default: null },
    lastActive: { type: Date, default: Date.now },
    milestones: [{
        id: Number,
        title: String,
        done: Boolean
    }],
    achievements: [String],
    thumbnailEmoji: { type: String, default: '🎓' }
}, { timestamps: true });

// Compound index to ensure a user can enroll in a specific course only once
EnrolledCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('EnrolledCourse', EnrolledCourseSchema);
