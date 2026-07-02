import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error fetching course catalog" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const isNumeric = !isNaN(req.params.id);
        const query = isNumeric ? { id: req.params.id } : { courseId: req.params.id };
        const course = await Course.findOne(query);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Admin helper to seed courses initially
export const seedCourses = async (req, res) => {
    try {
        const { courses, instructorId } = req.body;
        if (!courses || !Array.isArray(courses)) {
            return res.status(400).json({ message: "Invalid course data" });
        }

        // Add courseId if missing (slugified title) and assign instructor
        const coursesWithIds = courses.map(course => ({
            ...course,
            instructor: instructorId || course.instructor,
            courseId: course.courseId || course.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
            thumbnailEmoji: course.thumbnailEmoji || "🚀",
            id: course.id || Math.floor(Math.random() * 1000000) // Temporary random numeric ID if missing
        }));

        const result = await Course.insertMany(coursesWithIds);
        res.status(201).json({ message: `${result.length} courses seeded successfully` });
    } catch (error) {
        console.error("Error seeding courses:", error);
        res.status(500).json({ message: "Error seeding database", error: error.message });
    }
};
