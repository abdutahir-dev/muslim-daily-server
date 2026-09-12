import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { deenbotDb } from '../db/connection.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await deenbotDb.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const result = await deenbotDb.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'user']
        );

        const user = { id: result.lastID, username, email, role: 'user' };
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production');

        res.status(201).json({ success: true, user, token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await deenbotDb.get(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // Fallback for existing unhashed passwords during migration
        if (!isMatch && password === user.password) {
            // Upgrade password to hash
            const hashedPassword = await bcrypt.hash(password, 8);
            await deenbotDb.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
        } else if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production');

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            },
            token,
            settings: JSON.parse(user.settings || '{}'),
            bookmarks: JSON.parse(user.bookmarks || '[]'),
            favorites: JSON.parse(user.favorites || '[]')
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await deenbotDb.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            settings: JSON.parse(user.settings || '{}'),
            bookmarks: JSON.parse(user.bookmarks || '[]'),
            favorites: JSON.parse(user.favorites || '[]')
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};
