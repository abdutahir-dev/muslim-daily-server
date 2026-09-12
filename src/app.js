import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import quranRoutes from './routes/quranRoutes.js';
import prayerRoutes from './routes/prayerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import duaRoutes from './routes/duaRoutes.js';
import hadithRoutes from './routes/hadithRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import userInfoRoutes from './routes/userInfoRoutes.js'

import fastingRoutes from './routes/fastingRoutes.js';
import journalRoutes from './routes/journalRoutes.js';

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middlewares
app.use(cors({
    origin: '*', // Adjust this to match your production UI domain when deploying
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    allowOrigin: '*'
}));
app.use(limiter);
app.use(helmet()); // Security Headers
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // HTTP request logger

app.use(express.json({ limit: '10mb' })); // Protect against large payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quran', quranRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/user', userRoutes);
app.use('/api', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/duas', duaRoutes);
app.use('/api/hadith', hadithRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/user-info', userInfoRoutes);
app.use('/api/fasting', fastingRoutes);
app.use('/api/journal', journalRoutes);

// Legacy/Compatibility routes
app.use('/api', quranRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server.'
    });
});



export default app;
