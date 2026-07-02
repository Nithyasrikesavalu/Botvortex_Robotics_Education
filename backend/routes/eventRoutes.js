import express from 'express';
import { createEvent, getEvents, deleteEvent } from '../controllers/eventController.js';
import { protect, isInstructor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, isInstructor, createEvent)
  .get(protect, getEvents);

router.route('/:id')
  .delete(protect, isInstructor, deleteEvent);

export default router;
