import jwt from 'jsonwebtoken';
import { deenbotDb } from '../db/connection.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production');
        const user = await deenbotDb.get('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export const adminOnly = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ error: 'Admin access required.' });
    }
};
