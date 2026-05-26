import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import visitorRouter from './routes/visitor.js';
import githubRouter from './routes/github.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register routes
app.use(visitorRouter);
app.use(githubRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
