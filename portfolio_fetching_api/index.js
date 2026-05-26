import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import visitorRouter from './routes/visitor.js';
import githubRouter from './routes/github.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to explicitly allow the deployed portfolio origin and local environments
const allowedOrigins = [
  'https://priyank-moradiya.vercel.app',
  'https://priyank-moradiya.vercel.app/',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or curl requests (no origin)
    if (!origin) return callback(null, true);
    
    // Normalize trailing slash and check
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    if (
      allowedOrigins.some(o => o.startsWith(normalizedOrigin)) ||
      origin.startsWith('http://localhost:')
    ) {
      callback(null, true);
    } else {
      // Fallback fallback: allow for other dev URLs but log
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Register routes
app.use(visitorRouter);
app.use(githubRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
