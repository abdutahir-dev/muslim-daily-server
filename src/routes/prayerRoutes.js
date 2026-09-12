import express from 'express';
import * as prayerController from '../controllers/prayerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = express.Router();

router.get('/times', prayerController.getPrayerTimes);
router.get('/status/:username/:date', authenticateToken, prayerController.getPrayerStatus);
router.post('/log-activity', authenticateToken, validateRequest(schemas.prayer.log), prayerController.updatePrayerLog);
router.post('/update', authenticateToken, prayerController.updatePrayerLog);
router.get('/weekly/:username', authenticateToken, prayerController.getWeeklyStats);
router.get('/monthly/:username/:month', authenticateToken, prayerController.getMonthlyStats);
router.get('/analysis/:username', authenticateToken, prayerController.getAdvancedAnalysis);
router.get('/qada/:username', authenticateToken, prayerController.getQadaStats);
router.get('/weekly-prayers/:weekStart', authenticateToken, prayerController.getWeeklyPrayerTimes);

export default router;
