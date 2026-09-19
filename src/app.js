import express from 'express';
import path from 'path';
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
import firebaseRoutes from './routes/firebaseRoutes.js';
import qamusRoutes from './routes/qamusRoutes.js';
import asmaulHusnaRoutes from './routes/asmaulHusnaRoutes.js';
import dictionaryRoutes from './routes/dictionaryRoutes.js';
import translationRoutes from './routes/translationRoutes.js';
import docsRouter from './docs/docsRouter.js';

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Parse allowed origins from CORS_ORIGINS environment variable
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : ['*'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, same-origin) or matching allowedOrigins/github.io
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || (origin && origin.endsWith('.github.io'))) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
}));
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // HTTP request logger

app.use(express.json({ limit: '10mb' })); // Protect against large payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentation and Swagger UI routes
app.use(docsRouter);

// Interactive UI testing playground at /ui
const publicUiDir = path.join(process.cwd(), 'public/ui');
app.use('/ui', express.static(publicUiDir));
app.get(/^\/ui(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(publicUiDir, 'index.html'));
});

// Postman Collections download directory at /postman
const postmanDir = path.join(process.cwd(), 'postman');
app.use('/postman', express.static(postmanDir));
app.use('/public/postman', express.static(postmanDir));
app.use('/api/postman', express.static(postmanDir));

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
app.use('/api/firebase', firebaseRoutes);

// Qamus Arabic Lexicon routes (accessible under /qamus and /api/qamus)
app.use('/qamus', qamusRoutes);
app.use('/api/qamus', qamusRoutes);

// Asmaul Husna (99 Names of Allah) routes (accessible under /asmaul-husna and /api/asmaul-husna)
app.use('/asmaul-husna', asmaulHusnaRoutes);
app.use('/api/asmaul-husna', asmaulHusnaRoutes);

// Trilingual Dictionary routes (accessible under /dictionary and /api/dictionary)
app.use('/dictionary', dictionaryRoutes);
app.use('/api/dictionary', dictionaryRoutes);

// Translation routes (accessible under /translation and /api/translation)
app.use('/translation', translationRoutes);
app.use('/api/translation', translationRoutes);

// Legacy/Compatibility routes
app.use('/api', quranRoutes);

app.get('/', (req, res) => {
    // If request is from browser navigation, redirect to documentation portal
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect('/docs');
    }

    res.json({
        name: 'Muslim Daily API Server',
        status: 'running',
        version: '2.0.0',
        documentation: '/docs',
        swagger: '/swagger',
        openApiSpec: '/api/openapi.json',
        endpoints: {
            ui: '/ui',
            docs: '/docs',
            swagger: '/swagger',
            dictionary: '/dictionary',
            dictionaryApi: '/api/dictionary',
            translation: '/translation',
            translationApi: '/api/translation',
            asmaulHusna: '/asmaul-husna',
            asmaulHusnaApi: '/api/asmaul-husna',
            qamus: '/qamus',
            qamusApi: '/api/qamus',
            auth: '/api/auth',
            firebase: '/api/firebase',
            quran: '/api/quran',
            prayers: '/api/prayers',
            hadith: '/api/hadith',
            duas: '/api/duas',
            calendar: '/api/calendar',
            audio: '/api/audio',
            social: '/api/social',
            fasting: '/api/fasting',
            journal: '/api/journal',
            userInfo: '/api/user-info',
            analytics: '/api/analytics',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
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
