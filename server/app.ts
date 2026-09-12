import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import baseApp from '../src/app.js';

dotenv.config();

const app: Express = express();

/**
 * 1. Request logging middleware using 'morgan'
 * Logs API request activity for debugging and observability
 */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/**
 * 2. Security headers using 'helmet'
 * Protects the API from common web vulnerabilities
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
  })
);

/**
 * 3. CORS middleware implementation reading from CORS_ORIGINS
 * Dynamically validates origin headers against the configured whitelist
 */
const allowedOrigins: string[] = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin: string) => origin.trim()).filter(Boolean)
  : ['*'];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Delegate all requests to the underlying application router (routes, docs, swagger)
app.use(baseApp);

export { app };
export default app;
