import express from 'express';
import multer from 'multer';
import { createTask, getTasks, submitTask, getAllSubmissions, gradeSubmission, claimTaskCoins } from '../controllers/taskController.js';
import { protect, isInstructor } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer storage configuration for task submission PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.route('/')
  .post(protect, isInstructor, createTask)
  .get(protect, getTasks);

router.route('/all/submissions')
  .get(protect, isInstructor, getAllSubmissions);

router.route('/submissions/:id/grade')
  .put(protect, isInstructor, gradeSubmission);

router.route('/:id/submit')
  .post(protect, upload.single('taskPdf'), submitTask);

router.route('/:id/claim-coins')
  .post(protect, claimTaskCoins);

export default router;
