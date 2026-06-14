'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Trust the X-Forwarded-For header if running behind a proxy (Nginx,
// Heroku, etc). Required for express-rate-limit to identify clients.
app.set('trust proxy', 1);

// Security headers (CSP, X-Frame-Options, etc).
app.use(helmet());

// CORS: allow only configured frontend origin(s).
app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / curl / Postman (no Origin header).
      if (!origin) return cb(null, true);
      if (config.corsOrigin.includes('*') || config.corsOrigin.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Request logger (skipped in test for cleaner output).
if (config.env !== 'test') {
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
}

// Body parsing.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Basic global rate-limit so a misbehaving client can't hammer us.
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300, // 300 req / IP / minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many requests, please try again later.' },
    },
  })
);

// Tighter limit on the auth endpoints.
app.use(
  '/api/auth/login',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many login attempts, try again in 15 minutes.' },
    },
  })
);

// Root info endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Quick Bite API',
      version: '1.0.0',
      docs: '/api/health',
    },
  });
});

// Mount API
app.use('/api', routes);

// 404 + error handlers (must be last).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
