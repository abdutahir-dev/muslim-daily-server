import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/settings/:username', authenticateToken, userController.getSettings);
router.post('/settings', authenticateToken, userController.updateSettings);
router.post('/location', authenticateToken, userController.updateLocation);

router.get('/bookmarks/:username', authenticateToken, userController.getBookmarks);
router.post('/bookmarks/toggle', authenticateToken, userController.toggleBookmark);
router.post('/bookmarks/delete', authenticateToken, userController.deleteBookmark);

router.get('/favorites/:username', authenticateToken, userController.getFavorites);
router.post('/favorites/toggle', authenticateToken, userController.toggleFavorite);
router.post('/favorites/delete', authenticateToken, userController.deleteFavorite);

export default router;
