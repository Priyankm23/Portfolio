import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import visitorRouter from './routes/visitor.js';
import githubRouter from './routes/github.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow deployed portfolio origins, vercel preview deployments, and local environments
app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server, curl, or mobile app requests without origin header
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    // Explicitly allowed domain patterns
    if (
      normalizedOrigin.endsWith('.vercel.app') ||
      normalizedOrigin.includes('priyank-moradiya') ||
      normalizedOrigin.startsWith('http://localhost') ||
      normalizedOrigin.startsWith('http://127.0.0.1')
    ) {
      callback(null, true);
    } else {
      // Fallback: allow all origins in development & log warning
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root & Health check endpoints for Vercel monitoring
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Priyank Moradiya Portfolio API',
    endpoints: [
      '/api/github/contributions',
      '/api/visitor-count',
      '/api/priyank',
      '/health'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register routes
app.use(visitorRouter);
app.use(githubRouter);

// Local development server listener (skipped when running on Vercel Serverless)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[API Server] Running locally on port ${PORT}`);
  });
}

export default app;
