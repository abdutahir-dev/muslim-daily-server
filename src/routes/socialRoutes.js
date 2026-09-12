import express from 'express';
import * as socialController from '../controllers/socialController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = express.Router();

// Groups
router.post('/groups', authenticateToken, validateRequest(schemas.social.createGroup), socialController.createGroup);
router.get('/groups', authenticateToken, socialController.getGroups);
router.post('/groups/join', authenticateToken, validateRequest(schemas.social.joinGroup), socialController.joinGroup);
router.get('/groups/:groupId/activity', authenticateToken, socialController.getGroupActivity);

// Challenges
router.post('/challenges', authenticateToken, socialController.createChallenge);
router.get('/challenges', authenticateToken, socialController.getCommunityChallenges);
router.post('/challenges/progress', authenticateToken, socialController.updateChallengeProgress);
router.get('/challenges/:challengeId/leaderboard', authenticateToken, socialController.getLeaderboard);

export default router;
