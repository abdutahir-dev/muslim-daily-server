import express from 'express';
import * as resourceController from '../controllers/resourceController.js';

const router = express.Router();

router.get('/quotes/random', resourceController.getRandomQuote);

export default router;
