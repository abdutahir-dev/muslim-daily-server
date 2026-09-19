import express from 'express';
import * as asmaulHusnaController from '../controllers/asmaulHusnaController.js';

const router = express.Router();

// List all 99 names with optional language selection, search, and pagination
router.get('/', (req, res, next) => {
  if (req.query.view === 'overview') {
    return asmaulHusnaController.getOverview(req, res, next);
  }
  return asmaulHusnaController.getAllNames(req, res, next);
});

// Specific discovery and metadata endpoints
router.get('/overview', asmaulHusnaController.getOverview);
router.get('/stats', asmaulHusnaController.getStats);
router.get('/search', asmaulHusnaController.searchNames);
router.get('/random', asmaulHusnaController.getRandomName);
router.get('/daily', asmaulHusnaController.getDailyName);

// Lookup single name by number (1-99), Arabic name, or transliteration
router.get('/:identifier', asmaulHusnaController.getNameByIdentifier);

export default router;
