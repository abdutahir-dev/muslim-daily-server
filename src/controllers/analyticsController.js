import { getDb } from '../db/connection.js';

export const logActivity = async (req, res) => {
    const { username, type, value, metadata } = req.body;

    if (!username || !type) {
        return res.status(400).json({ error: 'Username and type are required' });
    }

    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO user_activities (username, type, value, metadata, timestamp) VALUES (?, ?, ?, ?, ?)',
            [username, type, value, JSON.stringify(metadata || {}), new Date().toISOString()]
        );
        res.status(201).json({ message: 'Activity logged successfully' });
    } catch (err) {
        console.error('Failed to log activity:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getActivityHistory = async (req, res) => {
    const { username } = req.params;

    try {
        const db = await getDb();
        const activities = await db.all(
            'SELECT * FROM user_activities WHERE username = ? ORDER BY timestamp DESC LIMIT 100',
            [username]
        );
        res.json(activities.map(a => ({ ...a, metadata: JSON.parse(a.metadata) })));
    } catch (err) {
        console.error('Failed to get activity history:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStats = async (req, res) => {
    const { username } = req.params;

    try {
        const db = await getDb();

        // Example stats: count per type in the last 30 days
        const stats = await db.all(`
            SELECT type, COUNT(*) as count, SUM(CAST(value as INTEGER)) as total_value
            FROM user_activities 
            WHERE username = ? AND timestamp > date('now', '-30 days')
            GROUP BY type
        `, [username]);

        res.json(stats);
    } catch (err) {
        console.error('Failed to get stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// new endpoints using analyticsService
import * as analyticsService from '../services/analyticsService.js';

export const getSummary = async (req, res) => {
    try {
        const username = req.params.username;
        const period = req.query.period || 'weekly';
        const data = await analyticsService.getSummary(username, period);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Failed to compute summary' });
    }
};

export const getStreak = async (req, res) => {
    try {
        const username = req.params.username;
        const streak = await analyticsService.getReadingStreak(username);
        res.json({ streak });
    } catch (e) {
        res.status(500).json({ error: 'Failed to compute streak' });
    }
};

export const getTopCategories = async (req, res) => {
    try {
        const username = req.params.username;
        const period = req.query.period || 'monthly';
        const limit = parseInt(req.query.limit) || 5;
        const data = await analyticsService.topCategories(username, period, limit);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Failed to load categories' });
    }
};
