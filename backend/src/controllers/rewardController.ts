import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../config/database.js';
import { sendNotification } from '../services/notificationService.js';

export function getRewardsCatalog(_req: Request, res: Response) {
  try {
    const rewards = db.prepare('SELECT * FROM rewards WHERE is_active = 1 ORDER BY points_cost ASC').all();
    return res.json({ rewards });
  } catch (err: any) {
    console.error('Get rewards error:', err);
    return res.status(500).json({ message: 'Failed to fetch rewards catalog.', error: err.message });
  }
}

export function getRewardHistory(req: Request, res: Response) {
  try {
    const user = req.user!;
    const transactions = db
      .prepare('SELECT * FROM reward_transactions WHERE user_id = ? ORDER BY created_at DESC')
      .all(user.id);

    const userProfile = db.prepare('SELECT points, rank FROM users WHERE id = ?').get(user.id) as any;

    return res.json({
      balance: userProfile?.points || 0,
      rank: userProfile?.rank || 'Green Starter',
      transactions
    });
  } catch (err: any) {
    console.error('Get reward history error:', err);
    return res.status(500).json({ message: 'Failed to fetch reward history.', error: err.message });
  }
}

export function redeemReward(req: Request, res: Response) {
  try {
    const user = req.user!;
    const { reward_id } = req.body;

    const reward = db.prepare('SELECT * FROM rewards WHERE id = ? AND is_active = 1').get(reward_id) as any;
    if (!reward) {
      return res.status(404).json({ message: 'Reward item not found.' });
    }

    const currentUser = db.prepare('SELECT points, rank FROM users WHERE id = ?').get(user.id) as any;
    if (!currentUser || currentUser.points < reward.points_cost) {
      return res.status(400).json({
        message: `Insufficient points balance. You need ${reward.points_cost} points, but have ${currentUser?.points || 0}.`
      });
    }

    const nowIso = new Date().toISOString();
    const newBalance = currentUser.points - reward.points_cost;

    // Deduct points
    db.prepare('UPDATE users SET points = ? WHERE id = ?').run(newBalance, user.id);

    // Insert transaction
    const txId = `tx-${crypto.randomUUID().slice(0, 8)}`;
    db.prepare(`
      INSERT INTO reward_transactions (id, user_id, amount, type, reason, badge_unlocked, created_at)
      VALUES (?, ?, ?, 'REDEEMED', ?, ?, ?)
    `).run(
      txId,
      user.id,
      -reward.points_cost,
      `Redeemed: ${reward.title} (${reward.partner_name || 'CleanSight'})`,
      reward.type === 'badge' ? reward.title : null,
      nowIso
    );

    // Send notification
    sendNotification(
      user.id,
      `Reward Redeemed: ${reward.title}`,
      `You successfully redeemed ${reward.title}! Your voucher code is ${reward.code || 'CS-' + txId.toUpperCase()}.`,
      'REWARD'
    );

    return res.json({
      message: 'Reward redeemed successfully!',
      voucherCode: reward.code || `CS-${txId.toUpperCase()}`,
      newBalance,
      reward
    });
  } catch (err: any) {
    console.error('Redeem reward error:', err);
    return res.status(500).json({ message: 'Failed to redeem reward.', error: err.message });
  }
}

export function getLeaderboard(req: Request, res: Response) {
  try {
    const { filter = 'all-time' } = req.query; // 'weekly' | 'monthly' | 'all-time'

    // Calculate leaderboard of citizens
    const leaderboardQuery = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.avatar, 
        u.city, 
        u.points, 
        u.rank,
        COUNT(r.id) as total_reports,
        SUM(CASE WHEN r.status IN ('CLEANED', 'CLOSED') THEN 1 ELSE 0 END) as verified_cleaned
      FROM users u
      LEFT JOIN reports r ON u.id = r.user_id
      WHERE u.role = 'citizen'
      GROUP BY u.id
      ORDER BY u.points DESC, verified_cleaned DESC
      LIMIT 20
    `;

    const rawLeaders = db.prepare(leaderboardQuery).all() as any[];

    const rankedLeaders = rawLeaders.map((leader, index) => {
      let badge = '🌱 Bronze';
      if (index === 0) badge = '🌟 Platinum Champion';
      else if (index <= 2) badge = '🥇 Gold Hero';
      else if (index <= 5) badge = '🥈 Silver Star';

      return {
        rank: index + 1,
        id: leader.id,
        name: leader.name,
        avatar: leader.avatar,
        city: leader.city || 'Pune',
        points: leader.points,
        verifiedReports: leader.verified_cleaned || Math.floor(leader.points / 45),
        badgeTitle: leader.rank,
        badgeIcon: badge
      };
    });

    return res.json({
      filter,
      leaders: rankedLeaders
    });
  } catch (err: any) {
    console.error('Get leaderboard error:', err);
    return res.status(500).json({ message: 'Failed to fetch leaderboard.', error: err.message });
  }
}
