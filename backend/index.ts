import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongooseConnect from './db';
import authRoutes from './routes/auth';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', // adjust Vite dev origin
  credentials: true
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// connect db and start
mongooseConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
