import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { db } from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role = 'citizen', phone, city = 'Pune' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${crypto.randomUUID().slice(0, 8)}`;
    const createdAt = new Date().toISOString();

    const allowedRoles = ['citizen', 'collector', 'admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'citizen';

    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar, phone, city, points, rank, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 50, 'Green Starter', ?)
    `).run(userId, name, email.toLowerCase(), hashedPassword, assignedRole, avatar, phone || '', city, createdAt);

    // Initial welcome reward transaction
    db.prepare(`
      INSERT INTO reward_transactions (id, user_id, amount, type, reason, badge_unlocked, created_at)
      VALUES (?, ?, 50, 'EARNED', 'Welcome Bonus for joining CleanSight', 'Green Starter', ?)
    `).run(`tx-${crypto.randomUUID().slice(0, 8)}`, userId, createdAt);

    const token = jwt.sign(
      { id: userId, name, email: email.toLowerCase(), role: assignedRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase(),
        role: assignedRole,
        avatar,
        phone,
        city,
        points: 50,
        rank: 'Green Starter'
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as any;
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: 'Login successful!',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
}

export async function firebaseLogin(req: Request, res: Response) {
  try {
    const { email, name, uid, avatar, role = 'citizen', phone = '', city = 'Pune' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required from Firebase auth.' });
    }

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as any;

    if (!user) {
      // Create new user for first-time Firebase login
      const userId = `usr-${(uid || crypto.randomUUID()).slice(0, 8)}`;
      const createdAt = new Date().toISOString();
      const userAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`;
      const hashedPassword = await bcrypt.hash(crypto.randomUUID(), 10);

      db.prepare(`
        INSERT INTO users (id, name, email, password, role, avatar, phone, city, points, rank, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 50, 'Green Starter', ?)
      `).run(userId, name || email.split('@')[0], email.toLowerCase(), hashedPassword, role, userAvatar, phone, city, createdAt);

      // Welcome transaction
      db.prepare(`
        INSERT INTO reward_transactions (id, user_id, amount, type, reason, badge_unlocked, created_at)
        VALUES (?, ?, 50, 'EARNED', 'Firebase Civic Onboarding Bonus', 'Green Starter', ?)
      `).run(`tx-${crypto.randomUUID().slice(0, 8)}`, userId, createdAt);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    } else if (avatar && (!user.avatar || user.avatar.includes('dicebear'))) {
      // Update avatar if Firebase provides picture
      db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, user.id);
      user.avatar = avatar;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: 'Firebase authentication successful!',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    console.error('Firebase login error:', err);
    return res.status(500).json({ message: 'Firebase authentication failed.', error: err.message });
  }
}

export function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = db.prepare('SELECT id, name, email, role, avatar, phone, city, points, rank, created_at FROM users WHERE id = ?').get(req.user.id) as any;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // User statistics
    const reportStats = db.prepare(`
      SELECT 
        COUNT(*) as total_reports,
        SUM(CASE WHEN status IN ('VERIFIED', 'ASSIGNED', 'COLLECTOR ON THE WAY', 'CLEANING IN PROGRESS', 'CLEANED', 'CLOSED') THEN 1 ELSE 0 END) as verified_reports,
        SUM(CASE WHEN status IN ('CLEANED', 'CLOSED') THEN 1 ELSE 0 END) as cleaned_reports
      FROM reports 
      WHERE user_id = ?
    `).get(req.user.id) as any;

    return res.json({
      ...user,
      stats: {
        totalReports: reportStats?.total_reports || 0,
        verifiedReports: reportStats?.verified_reports || 0,
        cleanedReports: reportStats?.cleaned_reports || 0
      }
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Error fetching profile.', error: err.message });
  }
}

export function getDemoCredentials(_req: Request, res: Response) {
  const demoUsers = [
    {
      role: 'citizen',
      name: 'Rahul Sharma (Top Hero)',
      email: 'citizen@cleansight.org',
      password: 'citizen123',
      points: 1850,
      description: 'Active citizen with 42 submitted reports & 1850 reward points'
    },
    {
      role: 'collector',
      name: 'Suresh Kumar (Field Staff)',
      email: 'collector@cleansight.org',
      password: 'collector123',
      points: 450,
      description: 'Cleaning staff assigned to Pune Central zone with active cleanups'
    },
    {
      role: 'admin',
      name: 'Rajesh Deshmukh (Municipal Commissioner)',
      email: 'admin@cleansight.org',
      password: 'admin123',
      points: 0,
      description: 'Full municipal authority to verify, dispatch, penalize & approve rewards'
    }
  ];

  return res.json({ demoUsers });
}
