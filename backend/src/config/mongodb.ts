import mongoose from 'mongoose';
import {
  MongoUser,
  MongoReport,
  MongoHotspot,
  MongoReward,
  MongoPenalty
} from '../models/mongo/index.js';

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<cluster-url>') || uri.includes('YOUR_CLUSTER_NAME') || uri.includes('<YOUR_CLUSTER_HOST>')) {
    console.log('ℹ️  MongoDB URI not fully configured or contains placeholder. CleanSight running in standalone local storage mode.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB database...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    });

    isConnected = true;
    console.log('✅ Successfully connected to MongoDB database!');
    console.log(`📦 Database: ${mongoose.connection.name || 'cleansight'}`);

    // Seed MongoDB collections if empty
    await seedMongoIfEmpty();

    return true;
  } catch (err: any) {
    console.warn('⚠️  Could not connect to MongoDB:', err.message);
    console.warn('👉 Ensure your MongoDB Atlas cluster is online, IP access (0.0.0.0/0) is enabled, and the cluster URL in .env is correct.');
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function seedMongoIfEmpty() {
  try {
    const userCount = await MongoUser.countDocuments();
    if (userCount > 0) {
      console.log(`ℹ️  MongoDB already contains ${userCount} users. Skipping seed.`);
      return;
    }

    console.log('🌱 Populating initial MongoDB collections with CleanSight civic data...');

    // Demo Users
    await MongoUser.insertMany([
      {
        id: 'usr-cit-1',
        name: 'Rahul Sharma',
        email: 'citizen@cleansight.org',
        password: '$2a$10$wKxN749nI4g0p/vO/20FweV48x5q7Y5l8c7p7/o29lE01X2wJ.b.O', // citizen123
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        phone: '+91 98201 12345',
        city: 'Pune',
        points: 1850,
        rank: 'Clean City Champion'
      },
      {
        id: 'usr-col-1',
        name: 'Suresh Kumar',
        email: 'collector@cleansight.org',
        password: '$2a$10$wKxN749nI4g0p/vO/20FweV48x5q7Y5l8c7p7/o29lE01X2wJ.b.O', // collector123
        role: 'collector',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        phone: '+91 98204 45678',
        city: 'Pune',
        points: 420,
        rank: 'Lead Sanitation Field Officer'
      },
      {
        id: 'usr-adm-1',
        name: 'Rajesh Deshmukh',
        email: 'admin@cleansight.org',
        password: '$2a$10$wKxN749nI4g0p/vO/20FweV48x5q7Y5l8c7p7/o29lE01X2wJ.b.O', // admin123
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        phone: '+91 98206 67890',
        city: 'Pune',
        points: 9999,
        rank: 'Municipal Commissioner'
      }
    ]);

    // Initial Hotspots
    await MongoHotspot.insertMany([
      {
        id: 'hot-1',
        areaName: 'Kothrud Paud Road Market',
        city: 'Pune',
        latitude: 18.5074,
        longitude: 73.8077,
        totalReports: 47,
        unresolvedReports: 12,
        severity: 'High',
        cleanlinessScore: 38
      },
      {
        id: 'hot-2',
        areaName: 'Baner High Street Junction',
        city: 'Pune',
        latitude: 18.559,
        longitude: 73.7868,
        totalReports: 31,
        unresolvedReports: 5,
        severity: 'Medium',
        cleanlinessScore: 61
      },
      {
        id: 'hot-3',
        areaName: 'Shivajinagar Railway Line Perimeter',
        city: 'Pune',
        latitude: 18.5314,
        longitude: 73.8446,
        totalReports: 62,
        unresolvedReports: 24,
        severity: 'High',
        cleanlinessScore: 31
      }
    ]);

    // Rewards
    await MongoReward.insertMany([
      {
        id: 'rew-1',
        title: 'Pune Metro Eco Pass',
        description: '₹150 discount coupon for Pune Metro Smart Card recharge',
        pointsCost: 500,
        type: 'transit',
        icon: 'Subway',
        partnerName: 'Maha Metro Rail Corporation',
        code: 'METROECO150'
      },
      {
        id: 'rew-2',
        title: 'Organic Food Voucher',
        description: '₹200 discount at Organic Mandi Pune outlets',
        pointsCost: 400,
        type: 'grocery',
        icon: 'Leaf',
        partnerName: 'Organic Mandi Pune',
        code: 'CLEAN200'
      }
    ]);

    console.log('✅ MongoDB database successfully initialized with demo civic collections!');
  } catch (err: any) {
    console.error('Error during MongoDB seed:', err);
  }
}
