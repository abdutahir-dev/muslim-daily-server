import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRequest(schemas.auth.register), authController.register);
router.post('/login', validateRequest(schemas.auth.login), authController.login);
router.get('/me', authenticateToken, authController.getMe);

export default router;
