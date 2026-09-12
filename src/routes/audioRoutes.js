import { Router } from 'express';
import { streamAudio } from '../controllers/audioController.js';

const router = Router();

// GET /api/audio/:surahId/:ayahId?reciter=Mishari_Rashid_Alafasy_24kbps
router.get('/:surahId/:ayahId', streamAudio);

export default router;
