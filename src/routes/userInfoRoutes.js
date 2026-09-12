import express from "express";
import * as userInfoController from "../controllers/userInfoController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Create user
 */
router.post("/", authenticateToken, userInfoController.createUser);

/**
 * Get all users
 */
router.get("/", authenticateToken, userInfoController.getAllUsers);

/**
 * Get user by ID
 */
router.get("/:id", authenticateToken, userInfoController.getUserById);

/**
 * Update user
 */
router.put("/:id", authenticateToken, userInfoController.updateUser);

/**
 * Delete user
 */
router.delete("/:id", authenticateToken, userInfoController.deleteUser);

router.post("/upsert", authenticateToken, userInfoController.upsertUser);

export default router;