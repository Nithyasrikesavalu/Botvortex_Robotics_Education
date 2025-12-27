import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    getProfile,
    updateProfile,
    getEnrolledCourses,
    enrollInCourse,
    updateCourseProgress,
    initializeDemoCourses,
    deleteAccount,
    addCoins
} from "../controllers/studentController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.delete("/profile", deleteAccount);

// Courses
router.get("/courses", getEnrolledCourses);
router.post("/courses", enrollInCourse); // Enroll
router.put("/courses/:courseId", updateCourseProgress); // Update progress
router.post("/courses/init-demo", initializeDemoCourses); // Dev helper
router.post("/add-coins", addCoins); // Add coins

export default router;
