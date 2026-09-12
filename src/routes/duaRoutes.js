import express from 'express';
import * as duaController from '../controllers/duaController.js';
import { authenticateToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', duaController.listDuas);
router.get('/categories', duaController.listCategories);

// daily endpoints - must appear before `/:id` so "daily" isn't treated as an id
router.get('/daily', duaController.getDaily);
router.get('/random', duaController.getRandomDua);
router.post('/daily/override', authenticateToken, adminOnly, duaController.overrideDaily);

router.get('/:id', duaController.getDua);
router.get('/categories/:id', duaController.getCategoryById)

// admin CRUD
router.post('/', authenticateToken, adminOnly, duaController.createDua);
router.put('/:id', authenticateToken, adminOnly, duaController.updateDua);
router.delete('/:id', authenticateToken, adminOnly, duaController.deleteDua);

export default router;
