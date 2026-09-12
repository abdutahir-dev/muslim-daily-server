import express from 'express';
import { deenbotDb } from '../db/connection.js';

const router = express.Router();

// GET /api/fasting/status/:username/:date
router.get('/status/:username/:date', async (req, res) => {
    try {
        const { username, date } = req.params;
        const status = await deenbotDb.get(
            'SELECT * FROM fasting_logs WHERE username = ? AND date = ?',
            [username, date]
        );
        res.json(status || { username, date, fasting_type: 'none', is_fasting: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/fasting/update
router.post('/update', async (req, res) => {
    try {
        const { username, date, fasting_type, is_fasting } = req.body;
        await deenbotDb.run(
            `INSERT INTO fasting_logs (username, date, fasting_type, is_fasting)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(username, date) DO UPDATE SET
             fasting_type = excluded.fasting_type,
             is_fasting = excluded.is_fasting`,
            [username, date, fasting_type, is_fasting ? 1 : 0]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
