import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './src/config/database';
import voteRoutes from './src/routes/voteRoutes';
import userRoutes from './src/routes/userRoutes';
import stateRoutes from './src/routes/stateRoutes';

// Load environment variables
dotenv.config();

// Initialize database and tables
initializeDatabase();

const app = express();
const port = process.env.PORT || 3304;

app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://lolacine-3d94c.web.app/',
  'https://lolacine.ghostix.com.ar',
  'https://lolacine-3d94c.web.app',
  'https://lolacine-3d94c.web.app/admin',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Register routes
app.use('/', stateRoutes);
app.use('/', userRoutes);
app.use('/', voteRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});