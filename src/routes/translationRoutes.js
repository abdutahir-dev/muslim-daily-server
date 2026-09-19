import express from 'express';
import * as translationController from '../controllers/translationController.js';

const router = express.Router();

// Metadata & Pairs
router.get('/', translationController.getOverview);
router.get('/pairs', translationController.getPairs);

// Actions
router.post('/translate', translationController.translate);
router.post('/detect', translationController.detect);

export default router;
