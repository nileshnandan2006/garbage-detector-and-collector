import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongoDB, seedMongoIfEmpty } from '../config/mongodb.js';

dotenv.config();

async function runSeed() {
  console.log('🚀 Running MongoDB Direct Seed Utility...');
  const success = await connectMongoDB();
  if (success) {
    console.log('✨ Seed check finished.');
  } else {
    console.log('❌ Could not connect to MongoDB. Check MONGODB_URI in backend/.env');
  }
  await mongoose.disconnect();
  process.exit(0);
}

runSeed();
