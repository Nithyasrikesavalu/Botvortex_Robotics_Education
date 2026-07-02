import express from 'express';
import { checkIn, checkOut, getAttendanceRecords } from '../controllers/attendanceController.js';
import { protect, isInstructor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/', protect, isInstructor, getAttendanceRecords);

export default router;
