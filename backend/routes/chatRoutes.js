import express from 'express';
import { getContacts, getMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(protect);

router.get('/contacts', getContacts);
router.post('/send', sendMessage);
router.get('/:userId', getMessages);

export default router;
