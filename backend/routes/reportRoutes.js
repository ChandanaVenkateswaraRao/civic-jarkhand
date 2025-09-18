import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getWorkerReports
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getReports).post(protect, createReport);
router.get('/worker', protect, getWorkerReports);
router.route('/:id').get(protect, getReportById).put(protect, admin, updateReportStatus);

export default router;