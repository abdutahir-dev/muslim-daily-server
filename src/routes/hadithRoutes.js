import express from 'express';
import * as hadithController from '../controllers/hadithController.js';
import { authenticateToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// compatibility endpoints
router.get('/books', hadithController.getBooks);
router.get('/list-by-book/:bookId', hadithController.getHadithsByBook);
router.get('/search', hadithController.searchHadiths);

// new edition/section based API
router.get('/editions', hadithController.getEditions);
router.get('/editions/:editionId/sections', hadithController.getSections);
router.get('/sections/:sectionId/hadiths', hadithController.getHadiths);
router.get('/:editionId/:sectionId/hadiths', hadithController.getHadithsBySection);
// daily hadith endpoint - place before wildcard id route
router.get('/daily', hadithController.getDaily);
router.post('/daily/override', authenticateToken, adminOnly, hadithController.postOverrideDaily);

router.get('/:id', hadithController.getHadith);

export default router;
