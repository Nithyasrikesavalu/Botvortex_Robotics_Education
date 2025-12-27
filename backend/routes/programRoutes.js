import express from "express";
import { requestProgramDetails } from "../controllers/programController.js";

const router = express.Router();

router.post("/request-details", requestProgramDetails);

export default router;
