import express from 'express';
import * as dictionaryController from '../controllers/dictionaryController.js';
import * as translationController from '../controllers/translationController.js';

const router = express.Router();

// Metadata & Overview
router.get('/overview', dictionaryController.getOverview);
router.get('/stats', dictionaryController.getStats);
router.get('/categories', dictionaryController.getCategories);
router.get('/parts-of-speech', dictionaryController.getPartsOfSpeech);

// Search & Autocomplete
router.get('/search', dictionaryController.getAllEntries);
router.get('/autocomplete', dictionaryController.getAutocomplete);

// Contemplation & Discovery
router.get('/daily', dictionaryController.getDailyWord);
router.get('/random', dictionaryController.getRandomWord);

// Direct Word & ID Lookup
router.get('/lookup/:word', dictionaryController.lookupWord);
router.get('/entry/:id', dictionaryController.getEntryById);

// Translation & Detection (also mounted under /dictionary for convenience)
router.post('/translate', translationController.translate);
router.post('/detect', translationController.detect);

// Root Collection endpoint (supports query params: q, lang, category, pos, page, limit)
router.get('/', dictionaryController.getAllEntries);

export default router;
