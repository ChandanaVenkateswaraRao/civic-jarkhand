import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getWorkerReports,
  getLeaderboard, // Ensure this is imported
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- General and specific routes MUST come FIRST ---

// Matches GET /api/reports and POST /api/reports
router.route('/').get(protect, getReports).post(protect, createReport);

// Matches GET /api/reports/leaderboard
router.get('/leaderboard', getLeaderboard);

// Matches GET /api/reports/worker
router.get('/worker', protect, getWorkerReports);


// --- Dynamic routes with parameters (like /:id) MUST come LAST ---

// Matches GET /api/reports/someId and PUT /api/reports/someId
router.route('/:id').get(protect, getReportById).put(protect, admin, updateReportStatus);


export default router;