import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import EnrolledCourse from '../models/EnrolledCourse.js';
import Transaction from '../models/Transaction.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Review from '../models/Review.js';

// --- Student Profile Controllers ---

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        let profile = await StudentProfile.findOne({ userId });

        // Fetch enrolled courses for the user
        const enrolledCourses = await EnrolledCourse.find({ userId }).lean();
        const coursesEnrolled = enrolledCourses.length;
        const completedCoursesList = enrolledCourses.filter(c => c.progress >= 100 || c.certificate || c.finalTaskCompleted);
        const coursesCompleted = completedCoursesList.length;

        // Fetch task submissions
        const tasksCompleted = await TaskSubmission.countDocuments({ studentId: userId });

        const baseProfile = profile ? profile.toObject() : {
            personal: {},
            education: {},
            academic: {}
        };

        // Add derived stats to the response
        const stats = {
            coursesEnrolled,
            coursesCompleted,
            tasksCompleted,
            completedCoursesList
            // You can add more aggregated stats here (e.g., total learning hours, certificates earned)
        };

        res.json({
            ...baseProfile,
            ...stats,
            fullName: user?.fullName,
            email: user?.email,
            userType: user?.userType,
            coins: user?.coins || 0
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const updateQuery = {};

        // Helper to construct dot notation for MongoDB updates
        // This ensures we merge data instead of replacing entire nested objects
        const buildDotNotation = (obj, prefix = '') => {
            Object.keys(obj).forEach(key => {
                if (key === 'personal' || key === 'education' || key === 'academic' || key === 'settings') {
                    // For top-level known sections, iterate their keys
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        Object.keys(obj[key]).forEach(subKey => {
                            // Special handling for settings to avoid going too deep if not needed, 
                            // ignoring purely deep merge for now unless necessary. 
                            // Safe to just do section.field
                            updateQuery[`${key}.${subKey}`] = obj[key][subKey];
                        });
                    }
                }
            });
        };

        // If simple structure is passed (e.g. from StudentProfile.jsx sending full object), this works too.
        // But let's be explicit based on our schema sections.

        ['personal', 'education', 'academic', 'settings'].forEach(section => {
            if (updates[section]) {
                Object.keys(updates[section]).forEach(key => {
                    updateQuery[`${section}.${key}`] = updates[section][key];
                });
            }
        });

        // Upsert: update if exists, create if not
        const profile = await StudentProfile.findOneAndUpdate(
            { userId },
            { $set: updateQuery },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error updating profile" });
    }
};

// --- Enrolled Courses Controllers ---

export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const courses = await EnrolledCourse.find({ userId });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error fetching courses" });
    }
};

export const enrollInCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Check if already enrolled
        const existing = await EnrolledCourse.findOne({ userId, courseId });
        if (existing) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Get Student
        const student = await User.findById(userId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Get Course Details (could be from DB or from request body for dummy courses)
        const course = await Course.findOne({ courseId });
        
        let coursePrice = 0;
        let courseTitle = req.body.title || "Unknown Course";
        let instructorName = req.body.instructor || "Unknown Instructor";
        let thumbnailEmoji = req.body.thumbnailEmoji || "🎓";
        
        let totalLessons = 10;
        if (req.body.totalLessons) {
            if (typeof req.body.totalLessons === 'number') {
                totalLessons = req.body.totalLessons;
            } else if (typeof req.body.totalLessons === 'string') {
                const parsed = parseInt(req.body.totalLessons.replace(/\D/g, ''), 10);
                if (!isNaN(parsed)) totalLessons = parsed;
            }
        }
        
        let instructor = null;

        if (course) {
            coursePrice = course.coins || 0;
            courseTitle = course.title;
            thumbnailEmoji = course.thumbnailEmoji || thumbnailEmoji;
            instructor = await User.findById(course.instructor);
            if (instructor) instructorName = instructor.fullName;
        } else {
            // For dummy frontend courses, we might still want to charge coins if passed in body
            coursePrice = req.body.coins || 0;
        }

        // Check if student has enough coins
        if (student.coins < coursePrice) {
            return res.status(400).json({ message: "Insufficient coins to enroll in this course" });
        }

        // Start Transaction simulation (Deduction/Addition)
        student.coins -= coursePrice;
        await student.save();

        if (instructor) {
            instructor.coins = (instructor.coins || 0) + coursePrice;
            await instructor.save();

            // Create Notification for Instructor
            await Notification.create({
                userId: instructor._id,
                title: "New Student Enrollment",
                message: `${student.fullName} has enrolled in your course: ${course.title}`,
                type: "success",
                icon: "UserPlus",
                action: "view"
            });
        }

        // Create Transaction record for Student
        await Transaction.create({
            userId: student._id,
            type: "debit",
            amount: 0,
            coins: coursePrice,
            paymentMethod: "coins",
            status: "completed"
        });

        // Create Enrollment
        const newEnrollment = new EnrolledCourse({
            userId,
            courseId: courseId,
            title: courseTitle,
            instructor: instructorName,
            courseRef: course ? course._id : null,
            progress: 0,
            totalLessons: totalLessons,
            thumbnailEmoji: thumbnailEmoji
        });

        await newEnrollment.save();
        res.status(201).json(newEnrollment);
    } catch (error) {
        console.error("Error enrolling in course:", error);
        import('fs').then(fs => fs.writeFileSync('enroll_error.log', error.stack));
        res.status(500).json({ message: "Server error enrolling in course" });
    }
};

export const updateCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const updates = req.body; // Expecting fields to update like progress, completedLessons, etc.

        const course = await EnrolledCourse.findOneAndUpdate(
            { userId, courseId },
            { $set: updates, lastActive: Date.now() },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course enrollment not found" });
        }

        res.json(course);
    } catch (error) {
        console.error("Error updating course progress:", error);
        res.status(500).json({ message: "Server error updating progress" });
    }
};

// Initialize default courses for demo purposes (Optional helper)
export const initializeDemoCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if user has courses
        const count = await EnrolledCourse.countDocuments({ userId });
        if (count > 0) {
            return res.json({ message: "User already has courses" });
        }

        const initialEnrolled = [
            {
                courseId: "C-ROB-101",
                title: "Advanced Robotics & AI",
                instructor: "Dr. Sarah Chen",
                progress: 78,
                completedLessons: 18,
                totalLessons: 24,
                testsCompleted: 3,
                testsTotal: 4,
                certificate: false,
                milestones: [
                    { id: 1, title: "Intro & Tools", done: true },
                    { id: 2, title: "Kinematics", done: true },
                    { id: 3, title: "Perception", done: true },
                    { id: 4, title: "Neural Control", done: false }
                ],
                achievements: ["Top 10% - Robotics Challenge"],
                thumbnailEmoji: "🤖"
            },
            {
                courseId: "C-ML-201",
                title: "Machine Learning Fundamentals",
                instructor: "Prof. Alex Rodriguez",
                progress: 45,
                completedLessons: 9,
                totalLessons: 20,
                testsCompleted: 1,
                testsTotal: 3,
                certificate: false,
                milestones: [
                    { id: 1, title: "Python Refresher", done: true },
                    { id: 2, title: "Supervised Learning", done: false },
                    { id: 3, title: "Unsupervised Learning", done: false }
                ],
                achievements: [],
                thumbnailEmoji: "🧠"
            },
            {
                courseId: "C-PY-001",
                title: "Python for Robotics",
                instructor: "Dr. James Wilson",
                progress: 100,
                completedLessons: 12,
                totalLessons: 12,
                testsCompleted: 2,
                testsTotal: 2,
                certificate: true,
                grade: "A+",
                milestones: [
                    { id: 1, title: "Syntax & Basics", done: true },
                    { id: 2, title: "Package Ecosystem", done: true },
                    { id: 3, title: "Project: Robot CLI", done: true }
                ],
                achievements: ["Completed Python for Robotics"],
                thumbnailEmoji: "🐍"
            }
        ];

        const coursesToInsert = initialEnrolled.map(c => ({ ...c, userId }));
        const insertedCourses = await EnrolledCourse.insertMany(coursesToInsert);

        res.json({
            message: "Demo courses initialized",
            count: insertedCourses.length,
            courses: insertedCourses
        });
    } catch (error) {
        console.error("Error initializing demo courses:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete associated data
        await StudentProfile.deleteOne({ userId });
        await EnrolledCourse.deleteMany({ userId });

        // Delete the user record
        const User = (await import('../models/User.js')).default;
        await User.findByIdAndDelete(userId);

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Server error deleting account" });
    }
};

// --- Review Controllers ---

export const submitReview = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId, rating, text } = req.body;

        if (!courseId || !rating || !text) {
            return res.status(400).json({ message: "Course ID, rating, and text are required" });
        }

        // Find the enrolled course to get details
        const enrollment = await EnrolledCourse.findOne({ userId: studentId, courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You can only review courses you are enrolled in." });
        }

        // Get instructor. Assuming enrollment.instructor has the instructor name, but we need the instructor ID.
        // Wait, course might not have instructor ID in EnrolledCourse if it was dummy.
        // Let's try to find the instructor.
        let instructorId = null;
        if (enrollment.courseRef) {
            const actualCourse = await Course.findById(enrollment.courseRef);
            if (actualCourse && actualCourse.instructor) {
                instructorId = actualCourse.instructor;
            }
        }
        
        if (!instructorId) {
            // Find an instructor in the system as a fallback
            const fallbackInstructor = await User.findOne({ userType: 'instructor' });
            if (fallbackInstructor) instructorId = fallbackInstructor._id;
        }

        if (!instructorId) {
            return res.status(400).json({ message: "Instructor not found for this course." });
        }

        const review = await Review.create({
            studentId,
            instructorId,
            courseId,
            courseTitle: enrollment.title,
            rating,
            text
        });

        res.status(201).json(review);
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Server error submitting review" });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const studentId = req.user.id;
        const reviews = await Review.find({ studentId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

export const addCoins = async (req, res) => {
    try {
        const userId = req.user.id;
        const { coins, amount, paymentMethod, packageId } = req.body;

        if (!coins || coins <= 0) {
            return res.status(400).json({ message: "Invalid coin amount" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Update User Balance
        user.coins = (user.coins || 0) + coins;
        await user.save();

        // 2. Create Transaction Log
        const transaction = new Transaction({
            userId,
            type: "credit",
            amount: amount || 0, // Store actual money paid
            coins,
            paymentMethod: paymentMethod || "unknown",
            packageId: packageId || "custom",
            status: "completed"
        });
        await transaction.save();

        res.json({
            message: "Coins added successfully and transaction logged",
            totalCoins: user.coins,
            transactionId: transaction._id
        });
    } catch (error) {
        console.error("Error adding coins & logging transaction:", error);
        res.status(500).json({ message: "Server error updating balance" });
    }
};
