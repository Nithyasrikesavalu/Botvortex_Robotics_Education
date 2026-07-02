import User from "../models/User.js";
import Course from "../models/Course.js";
import EnrolledCourse from "../models/EnrolledCourse.js";
import Notification from "../models/Notification.js";
import Review from "../models/Review.js";

export const getDashboardData = async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Get instructor details
        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        // Get all platform courses
        const courses = await Course.find({});
        const courseIds = courses.map(c => c.courseId);

        // Get student enrollments for these courses
        const enrollments = await EnrolledCourse.find({ courseId: { $in: courseIds } });

        // Calculate monthly earnings history
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push(monthNames[d.getMonth()]);
        }

        const earningsHistory = last6Months.map(month => ({
            month,
            coins: 0,
            students: 0
        }));

        enrollments.forEach(enrollment => {
            const enrollDate = new Date(enrollment.createdAt);
            const monthName = monthNames[enrollDate.getMonth()];
            const historyItem = earningsHistory.find(h => h.month === monthName);

            if (historyItem) {
                const course = courses.find(c => c.courseId === enrollment.courseId);
                historyItem.coins += course ? (course.coins || 0) : 0;
                historyItem.students += 1;
            }
        });

        // Calculate stats
        const totalStudents = enrollments.length;
        const totalCourses = courses.length;

        let totalRevenue = 0;
        courses.forEach(course => {
            const courseEnrollments = enrollments.filter(e => e.courseId === course.courseId).length;
            totalRevenue += (course.coins || 0) * courseEnrollments;
        });

        const avgRating = courses.length > 0
            ? courses.reduce((acc, current) => acc + current.rating, 0) / courses.length
            : 0;

        // Get latest students
        const latestEnrollments = await EnrolledCourse.find({ courseId: { $in: courseIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'fullName email');

        const latestStudents = latestEnrollments.map(e => ({
            id: e.userId?._id,
            name: e.userId?.fullName || "Student",
            course: e.title,
            progress: e.progress || 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(e.userId?.fullName || "S")}&background=random`
        }));

        res.json({
            fullName: instructor.fullName,
            avatar: instructor.avatar,
            stats: {
                totalStudents,
                totalCourses,
                totalEarnings: totalRevenue,
                averageRating: Number(avgRating.toFixed(1)),
                activeStudents: totalStudents,
                completionRate: 75
            },
            earnings: earningsHistory,
            students: latestStudents,
            courses: courses.map(c => ({
                id: c._id,
                title: c.title,
                students: enrollments.filter(e => e.courseId === c.courseId).length,
                revenue: (c.coins || 0) * enrollments.filter(e => e.courseId === c.courseId).length,
                rating: c.rating,
                status: "published",
                price: c.coins,
                progress: Math.floor(Math.random() * 40) + 60, // Mock course progress
                thumbnail: c.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            }))
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Server error fetching dashboard data" });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({}); // Show all platform courses for now
        const courseIds = courses.map(c => c.courseId);
        const enrollments = await EnrolledCourse.find({ courseId: { $in: courseIds } });

        const enrichedCourses = courses.map(c => {
            const courseObj = c.toObject();
            courseObj.students = enrollments.filter(e => e.courseId === c.courseId).length;
            return courseObj;
        });

        res.json(enrichedCourses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses" });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { title, description, level, coins, image, learnings, duration, lectures, projects, finalTask, modules } = req.body;

        const newCourse = new Course({
            title,
            description,
            level: level ? level.toLowerCase() : 'beginner',
            coins: coins || 0,
            image,
            learnings,
            duration,
            lectures,
            projects,
            finalTask,
            modules: modules || [],
            instructor: req.user.id,
            id: Date.now(), // numerical ID
            courseId: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error("Create course error:", error);
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, level, coins, image, learnings, duration, lectures, projects, finalTask, modules } = req.body;

        // Find course: either owned by instructor or has no instructor yet (for legacy/seeded data)
        const course = await Course.findOne({
            _id: id,
            $or: [
                { instructor: req.user.id },
                { instructor: { $exists: false } },
                { instructor: null }
            ]
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        // Assign current instructor if not already set
        if (!course.instructor) {
            course.instructor = req.user.id;
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.level = level?.toLowerCase() || course.level;
        course.coins = coins !== undefined ? coins : course.coins;
        course.image = image || course.image;
        course.learnings = learnings || course.learnings;
        course.duration = duration || course.duration;
        course.lectures = lectures || course.lectures;
        course.projects = projects || course.projects;
        course.finalTask = finalTask || course.finalTask;
        if (modules) {
            course.modules = modules;
        }

        // Update slug if title changed
        if (title) {
            course.courseId = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        }

        const updatedCourse = await course.save();

        // Sync with EnrolledCourse documents in the background
        await EnrolledCourse.updateMany(
            { courseRef: updatedCourse._id },
            {
                title: updatedCourse.title,
                thumbnailEmoji: updatedCourse.thumbnailEmoji,
                courseId: updatedCourse.courseId
            }
        );

        // Notify enrolled students
        const enrollments = await EnrolledCourse.find({ courseRef: updatedCourse._id });
        const studentIds = [...new Set(enrollments.map(e => e.userId.toString()))];

        if (studentIds.length > 0) {
            const notifications = studentIds.map(studentId => ({
                userId: studentId,
                title: "Course Updated",
                message: `The course "${updatedCourse.title}" has been updated by the instructor.`,
                type: "info",
                icon: "BookOpen",
                action: "view"
            }));
            await Notification.insertMany(notifications);
        }

        // Notify Instructor
        await Notification.create({
            userId: req.user.id,
            title: "Course Updated Successfully",
            message: `You have successfully updated the course: ${updatedCourse.title}`,
            type: "success",
            icon: "BookOpen",
            action: "view"
        });

        res.json(updatedCourse);
    } catch (error) {
        console.error("Update course error:", error);
        res.status(500).json({ message: "Error updating course" });
    }
};

export const getMyStudents = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        const courseIds = courses.map(c => c.courseId);

        const enrollments = await EnrolledCourse.find({ courseId: { $in: courseIds } })
            .populate('userId', 'fullName email userType')
            .populate('courseRef', 'coins');

        const studentList = enrollments.map(e => ({
            id: e.userId?._id,
            name: e.userId?.fullName || "Student",
            email: e.userId?.email || "N/A",
            course: e.title,
            amount: e.courseRef?.coins || 0,
            joinDate: e.createdAt,
            progress: e.progress || 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(e.userId?.fullName || "S")}&background=random`
        }));

        res.json(studentList);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
};

export const getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Error fetching settings" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { fullName, instructorDetails } = req.body;
        
        let updateData = {};
        if (fullName) updateData.fullName = fullName;
        
        if (instructorDetails) {
            updateData.instructorDetails = typeof instructorDetails === 'string' 
                ? JSON.parse(instructorDetails) 
                : instructorDetails;
        }

        if (req.file) {
            updateData.avatar = `/uploads/courses/${req.file.filename}`;
        }
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        );

        if (fullName) {
            // Update instructor name in all their courses' enrollments
            const myCourses = await Course.find({ instructor: user._id });
            const myCourseIds = myCourses.map(c => c._id);

            await EnrolledCourse.updateMany(
                { courseRef: { $in: myCourseIds } },
                { instructor: fullName }
            );
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Error updating settings" });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
};

export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};

export const addModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, type, order } = req.body;

        const course = await Course.findOne({ _id: courseId, instructor: req.user.id });
        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        const newModule = {
            title,
            description,
            type,
            url: `/uploads/courses/${req.file.filename}`,
            order: order || course.modules.length + 1
        };

        course.modules.push(newModule);
        await course.save();

        res.status(201).json(course.modules[course.modules.length - 1]);
    } catch (error) {
        console.error("Add module error:", error);
        res.status(500).json({ message: "Error adding module" });
    }
};

export const deleteModule = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;

        const course = await Course.findOne({ _id: courseId, instructor: req.user.id });
        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        course.modules = course.modules.filter(m => m._id.toString() !== moduleId);
        await course.save();

        res.json({ message: "Module deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting module" });
    }
};

export const getInstructorReviews = async (req, res) => {
    try {
        const instructorId = req.user.id;
        // Fetch reviews where instructorId matches the logged-in instructor
        const reviews = await Review.find({ instructorId })
            .populate('studentId', 'fullName')
            .sort({ createdAt: -1 });

        // Transform for frontend
        const formattedReviews = reviews.map(r => ({
            id: r._id,
            courseName: r.courseTitle,
            studentName: r.studentId ? r.studentId.fullName : "Unknown Student",
            rating: r.rating,
            date: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            text: r.text
        }));

        res.json(formattedReviews);
    } catch (error) {
        console.error("Error fetching instructor reviews:", error);
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

export const getModules = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.json(course.modules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching modules" });
    }
};
