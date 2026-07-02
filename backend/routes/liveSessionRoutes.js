import express from 'express';
import { createLiveSession, getLiveSessions } from '../controllers/liveSessionController.js';
import { protect, isInstructor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, isInstructor, createLiveSession)
  .get(protect, getLiveSessions);

export default router;
