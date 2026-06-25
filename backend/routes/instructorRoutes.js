import express from "express";
import {
    getDashboardData,
    getMyCourses,
    createCourse,
    updateCourse,
    getMyStudents,
    getSettings,
    updateSettings,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    addModule,
    deleteModule,
    getModules
} from "../controllers/instructorController.js";
import { protect, isInstructor } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Apply protection to all instructor routes
router.use(protect);
router.use(isInstructor);

router.get("/dashboard", getDashboardData);
router.get("/courses", getMyCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.get("/students", getMyStudents);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);
router.put("/notifications/read-all", markAllNotificationsRead);

// Module management
router.post("/courses/:courseId/modules/video", upload.single('video'), addModule);
router.post("/courses/:courseId/modules/pdf", upload.single('pdf'), addModule);
router.delete("/courses/:courseId/modules/:moduleId", deleteModule);
router.get("/courses/:courseId/modules", getModules);

export default router;
