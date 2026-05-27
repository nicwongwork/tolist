import express from 'express';
import cors from 'cors';
import { pool } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[Config Error] DATABASE_URL is missing in environment variables!');
    process.exit(1);
  }

  const sanitizedUrl = dbUrl.replace(/:([^:@]+)@/, ':******@');
  console.log(`Attempting to connect to database: ${sanitizedUrl}`);

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL database connected successfully (Port: 5434).');

    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error:', error);
    process.exit(1);
  }
};

startServer();