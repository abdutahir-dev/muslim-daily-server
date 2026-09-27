import express from 'express';
import { deenbotDb } from '../db/connection.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/journal/:username/:date
router.get('/:username/:date', authenticateToken, async (req, res) => {
    try {
        const { username, date } = req.params;
        const entry = await deenbotDb.get(
            'SELECT * FROM journal_entries WHERE username = ? AND date = ?',
            [username, date]
        );
        res.json(entry || { username, date, notes: '', mood: '' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/journal/update
router.post('/update', authenticateToken, async (req, res) => {
    try {
        const { username, date, notes, mood } = req.body;
        await deenbotDb.run(
            `INSERT INTO journal_entries (username, date, notes, mood)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(username, date) DO UPDATE SET
             notes = excluded.notes,
             mood = excluded.mood`,
            [username, date, notes, mood]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
