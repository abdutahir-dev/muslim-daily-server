import express from 'express';
import * as quranController from '../controllers/quranController.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Quran Data - Caching for 1 hour (3600s)
router.get('/surahs', cacheMiddleware(3600), quranController.getSurahs);
router.get('/surahs/:id', cacheMiddleware(3600), quranController.getSurah);
router.get('/surahs/:id/ayahs', cacheMiddleware(1800), quranController.getAyahs);
router.get('/ayahs/random', quranController.getRandomAyahs);
router.get('/ayahs/single', quranController.getSingleRandomAyah);
router.get('/ayahs/tafsir', cacheMiddleware(3600), quranController.getTafsir);
router.get('/styles', cacheMiddleware(86400), quranController.getQiraatStyles);
router.get('/surahs/:id/styles', cacheMiddleware(1800), quranController.getAyahsByStyle);
router.get('/resources/translations', cacheMiddleware(86400), quranController.getTranslationsMetadata);
router.get('/resources/tafsirs', cacheMiddleware(86400), quranController.getTafsirsMetadata);

export default router;
