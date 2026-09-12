import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', authenticateToken, analyticsController.logActivity);
router.get('/history/:username', authenticateToken, analyticsController.getActivityHistory);
router.get('/stats/:username', authenticateToken, analyticsController.getStats);

// enhanced analytics
router.get('/summary/:username', authenticateToken, analyticsController.getSummary);
router.get('/streak/:username', authenticateToken, analyticsController.getStreak);
router.get('/categories/:username', authenticateToken, analyticsController.getTopCategories);

export default router;
