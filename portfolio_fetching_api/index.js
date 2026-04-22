import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import priyankRouter from './routes/priyank.js';
import githubRouter from './routes/github.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Register routes
app.use(priyankRouter);
app.use(githubRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
