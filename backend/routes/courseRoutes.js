import express from "express";
import { getCourses, getCourseById, seedCourses } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/seed", seedCourses); // Helper to populate data from frontend

export default router;
