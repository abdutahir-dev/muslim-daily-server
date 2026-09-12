import { deenbotDb } from '../db/connection.js';

export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const username = req.user.username;

        const result = await deenbotDb.run(
            'INSERT INTO community_groups (name, description, created_by, created_at) VALUES (?, ?, ?, ?)',
            [name, description, username, new Date().toISOString()]
        );

        const groupId = result.lastID;

        // Automatically join the creator to the group
        await deenbotDb.run(
            'INSERT INTO group_members (group_id, username, joined_at) VALUES (?, ?, ?)',
            [groupId, username, new Date().toISOString()]
        );

        res.status(201).json({ id: groupId, name, description });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Group name already exists' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getGroups = async (req, res) => {
    try {
        const groups = await deenbotDb.all('SELECT * FROM community_groups');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const username = req.user.username;

        await deenbotDb.run(
            'INSERT INTO group_members (group_id, username, joined_at) VALUES (?, ?, ?)',
            [groupId, username, new Date().toISOString()]
        );

        res.json({ message: 'Successfully joined group' });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'You are already a member of this group' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createChallenge = async (req, res) => {
    try {
        const { groupId, title, description, type, targetValue, startDate, endDate } = req.body;
        const username = req.user.username;

        const result = await deenbotDb.run(
            'INSERT INTO challenges (group_id, title, description, type, target_value, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [groupId, title, description, type, targetValue, startDate, endDate, username]
        );

        const challengeId = result.lastID;

        res.status(201).json({ id: challengeId, title, description });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCommunityChallenges = async (req, res) => {
    try {
        const challenges = await deenbotDb.all(`
            SELECT c.*, g.name as group_name 
            FROM challenges c
            LEFT JOIN community_groups g ON c.group_id = g.id
            WHERE c.end_date >= ?
        `, [new Date().toISOString()]);
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateChallengeProgress = async (req, res) => {
    try {
        const { challengeId, progress } = req.body;
        const username = req.user.username;

        await deenbotDb.run(
            `INSERT INTO challenge_participants (challenge_id, username, current_progress, updated_at) 
             VALUES (?, ?, ?, ?)
             ON CONFLICT(challenge_id, username) DO UPDATE SET 
             current_progress = current_progress + ?,
             updated_at = ?`,
            [challengeId, username, progress, new Date().toISOString(), progress, new Date().toISOString()]
        );

        // Check if completed
        const challenge = await deenbotDb.get('SELECT target_value FROM challenges WHERE id = ?', [challengeId]);
        const participant = await deenbotDb.get('SELECT current_progress FROM challenge_participants WHERE challenge_id = ? AND username = ?', [challengeId, username]);

        if (participant.current_progress >= challenge.target_value) {
            await deenbotDb.run(
                'UPDATE challenge_participants SET status = "completed" WHERE challenge_id = ? AND username = ?',
                [challengeId, username]
            );
        }

        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const leaderboard = await deenbotDb.all(`
            SELECT username, current_progress, status 
            FROM challenge_participants 
            WHERE challenge_id = ? 
            ORDER BY current_progress DESC
            LIMIT 10
        `, [challengeId]);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getGroupActivity = async (req, res) => {
    try {
        const { groupId } = req.params;
        // Get activities of all users in this group
        const activities = await deenbotDb.all(`
            SELECT ua.* 
            FROM user_activities ua
            JOIN group_members gm ON ua.username = gm.username
            WHERE gm.group_id = ?
            ORDER BY ua.timestamp DESC
            LIMIT 50
        `, [groupId]);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
