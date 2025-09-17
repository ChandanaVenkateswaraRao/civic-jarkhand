import express from 'express';
import { registerUser, loginUser, createWorker } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Import middleware

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW PROTECTED ROUTE: Only admins can access this
router.post('/worker', protect, admin, createWorker);

export default router;