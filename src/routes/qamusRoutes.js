import express from 'express';
import * as qamusController from '../controllers/qamusController.js';

const router = express.Router();

// General metadata & status
router.get('/', qamusController.getInfo);
router.get('/manifest', qamusController.getManifest);
router.get('/grammar-classes', qamusController.getGrammarOntology);
router.get('/ontology', qamusController.getGrammarOntology);

// Search & daily discovery
router.get('/search', qamusController.search);
router.get('/daily', qamusController.getDailyWord);
router.get('/word-of-the-day', qamusController.getDailyWord);
router.get('/random', qamusController.getRandomWord);

// Taxonomies: roots, sections, categories
router.get('/roots', qamusController.getRoots);
router.get('/roots/:root', qamusController.getRootEntries);
router.get('/sections', qamusController.getSections);
router.get('/categories', qamusController.getCategories);
router.get('/categories/:category', qamusController.getCategoryEntries);

// Quran Ayah vocabulary transclusion
router.get('/ayah/:ref', qamusController.getAyahVocabulary);
router.get('/quran/:surah/:ayah', qamusController.getAyahVocabulary);

// Entries listing and detail
router.get('/entries', qamusController.getEntries);
router.get('/entries/:id', qamusController.getEntry);
router.get('/:id', qamusController.getEntry);

export default router;
