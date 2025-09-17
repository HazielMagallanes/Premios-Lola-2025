import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import "dotenv/config";
import { initializeDatabase } from './src/config/database';
import adminRoutes from './src/routes/adminRoutes';
import voteRoutes from './src/routes/voteRoutes';
import userRoutes from './src/routes/userRoutes';
import stateRoutes from './src/routes/stateRoutes';
import path from 'node:path';

// Initialize database and tables
initializeDatabase();

config({ path: "./.env.local", override: true });

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  "http://localhost:8000",
  "http://localhost:4173",
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
app.use('/', adminRoutes);
app.use('/', stateRoutes);
app.use('/', userRoutes);
app.use('/', voteRoutes);
app.use('/static', express.static(path.join(__dirname, 'public'))); 

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});