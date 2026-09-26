import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/authRoutes';
import { authStore } from './server/authStore';
import { aiRouter } from './server/aiRoutes';
import { leadRouter } from './server/leadRoutes';
import {
  botAndScraperDefenseMiddleware,
  globalApiRateLimitMiddleware,
  abuseProtectionService,
} from './server/abuseProtection';

const PORT = 3000;

async function startServer() {
  // Initialize persistent user data store
  await authStore.init();

  const app = express();

  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Body parsing with safe limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Health check (exempt from strict rate limits)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'IronForge Authentication & Performance Server',
      timestamp: new Date().toISOString(),
      abuseProtection: 'active',
    });
  });

  // Real-time Abuse & Rate Limiting Telemetry endpoint
  app.get('/api/abuse/status', (req, res) => {
    res.json({
      status: 'active',
      telemetry: abuseProtectionService.getTelemetry(),
    });
  });

  // Dev helper to reset rate limits & IP blocks during manual/automated testing
  app.post('/api/abuse/reset-limits', (req, res) => {
    abuseProtectionService.resetAll();
    res.json({ success: true, message: 'All rate limits and abuse buckets successfully reset.' });
  });

  // Mount Bot & Scraper Defense and Global API Rate Limiting across all /api routes
  app.use('/api', botAndScraperDefenseMiddleware);
  app.use('/api', globalApiRateLimitMiddleware);

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/leads', leadRouter);

  // Vite middleware in development vs Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v5 syntax for SPA catch-all
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IRONFORGE SERVER] Secure Server with Abuse Protection running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
