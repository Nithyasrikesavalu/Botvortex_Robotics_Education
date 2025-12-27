import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personal: {
        name: { type: String, default: '' },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        role: { type: String, default: '' },
        studentId: { type: String, default: '' },
        phone: { type: String, default: '' },
        studentAccount: { type: String, default: '' },
        email: { type: String, default: '' },
        gender: { type: String, default: '' },
        dob: { type: String, default: '' },
        language: { type: String, default: 'English' },
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        timezone: { type: String, default: '' }
    },
    education: {
        degree: { type: String, default: '' },
        period: { type: String, default: '' },
        university: { type: String, default: '' },
        certificate: { type: String, default: '' },
        certPeriod: { type: String, default: '' },
        certInstitution: { type: String, default: '' }
    },
    academic: {
        semester: { type: String, default: '' },
        gpa: { type: String, default: '' },
        creditsCompleted: { type: String, default: '' },
        standing: { type: String, default: '' },
        advisor: { type: String, default: '' },
        major: { type: String, default: '' },
        specialization: { type: String, default: '' }
    },
    settings: {
        account: { type: Object, default: {} },
        privacy: { type: Object, default: {} },
        learning: { type: Object, default: {} },
        payment: { type: Object, default: {} }
    }
}, { timestamps: true });

export default mongoose.model('StudentProfile', StudentProfileSchema);
