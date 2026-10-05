import express from 'express';
import cors from 'cors';
import path from 'node:path';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import { seedDatabase } from './seed/seedData.js';
import { connectMongoDB, isMongoConnected } from './config/mongodb.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'CleanSight – AI Garbage Detector & Collector',
    database: {
      sqlite: 'connected',
      mongodb: isMongoConnected() ? 'connected' : 'disconnected'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRouter);

// Initialize DB and start server
async function startServer() {
  try {
    initDatabase();
    await seedDatabase();

    // Connect to MongoDB if MONGODB_URI is provided
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 CleanSight Backend API running on http://localhost:${PORT}`);
      console.log(`📡 Ready for AI Garbage Detection & Municipal Operations`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  }
}

startServer();
