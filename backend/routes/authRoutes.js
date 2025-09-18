import express from 'express';
import { registerUser, loginUser, createWorker } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/worker', protect, admin, createWorker);

export default router;