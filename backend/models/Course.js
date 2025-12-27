import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Keeping numerical ID for consistency with legacy data if needed
    courseId: { type: String, unique: true }, // Slug or unique string ID
    image: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    levelClass: { type: String, default: '' },
    duration: { type: String, default: '' },
    lectures: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    students: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    learnings: [{ type: String }],
    thumbnailEmoji: { type: String, default: '🚀' }
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);
