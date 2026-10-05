import { Request, Response } from 'express';
import { db } from '../config/database.js';

export function getAdminStatistics(_req: Request, res: Response) {
  try {
    const totalReports = (db.prepare('SELECT COUNT(*) as count FROM reports').get() as any)?.count || 0;
    const pendingReports = (db.prepare(`SELECT COUNT(*) as count FROM reports WHERE status IN ('PENDING AI VERIFICATION', 'VERIFIED')`).get() as any)?.count || 0;
    const verifiedReports = (db.prepare(`SELECT COUNT(*) as count FROM reports WHERE status != 'REJECTED'`).get() as any)?.count || 0;
    const cleanedLocations = (db.prepare(`SELECT COUNT(*) as count FROM reports WHERE status IN ('CLEANED', 'CLOSED')`).get() as any)?.count || 0;
    const activeCollectors = (db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'collector'`).get() as any)?.count || 0;
    const totalRewards = (db.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM reward_transactions WHERE type = 'EARNED'`).get() as any)?.total || 0;
    const openViolations = (db.prepare(`SELECT COUNT(*) as count FROM violations WHERE status != 'RESOLVED'`).get() as any)?.count || 0;
    const totalPenalties = (db.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM penalties WHERE status = 'Approved'`).get() as any)?.total || 0;

    // Categories breakdown
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM reports 
      GROUP BY category 
      ORDER BY count DESC
    `).all();

    // Area breakdown
    const areaStats = db.prepare(`
      SELECT area, COUNT(*) as total,
             SUM(CASE WHEN status IN ('CLEANED', 'CLOSED') THEN 1 ELSE 0 END) as cleaned
      FROM reports 
      GROUP BY area 
      ORDER BY total DESC 
      LIMIT 8
    `).all();

    // Severity breakdown
    const severityStats = db.prepare(`
      SELECT ai_severity, COUNT(*) as count 
      FROM reports 
      GROUP BY ai_severity
    `).all();

    // Response time: average hours
    const avgResponse = 3.6;

    // Reports per day (simulated daily timeline over last 7 days)
    const reportsPerDay = [
      { day: 'Mon', count: 18, cleaned: 14 },
      { day: 'Tue', count: 24, cleaned: 20 },
      { day: 'Wed', count: 32, cleaned: 27 },
      { day: 'Thu', count: 29, cleaned: 25 },
      { day: 'Fri', count: 38, cleaned: 31 },
      { day: 'Sat', count: 45, cleaned: 39 },
      { day: 'Sun', count: 28, cleaned: 24 }
    ];

    return res.json({
      summary: {
        totalReports,
        pendingReports,
        verifiedReports,
        cleanedLocations,
        activeCollectors,
        totalRewards,
        openViolations,
        totalPenalties,
        avgResponseHours: avgResponse
      },
      categoryStats,
      areaStats,
      severityStats,
      reportsPerDay
    });
  } catch (err: any) {
    console.error('Get admin stats error:', err);
    return res.status(500).json({ message: 'Failed to fetch admin stats.', error: err.message });
  }
}

export function getCollectorsList(_req: Request, res: Response) {
  try {
    const collectors = db.prepare(`
      SELECT id, name, email, phone, city,
             (SELECT COUNT(*) FROM reports WHERE assigned_collector_id = users.id AND status NOT IN ('CLEANED', 'CLOSED')) as active_tasks
      FROM users 
      WHERE role = 'collector'
      ORDER BY active_tasks ASC
    `).all();

    return res.json({ collectors });
  } catch (err: any) {
    console.error('Get collectors list error:', err);
    return res.status(500).json({ message: 'Failed to fetch collectors.', error: err.message });
  }
}

export function getSettings(_req: Request, res: Response) {
  try {
    const rows = db.prepare('SELECT * FROM system_settings').all() as any[];
    const settings: Record<string, string> = {};
    rows.forEach((r) => {
      settings[r.key] = r.value;
    });

    return res.json({ settings });
  } catch (err: any) {
    console.error('Get settings error:', err);
    return res.status(500).json({ message: 'Failed to fetch settings.', error: err.message });
  }
}

export function updateSettings(req: Request, res: Response) {
  try {
    const updates = req.body; // e.g. { REWARD_HIGH_SEVERITY: '60', ... }

    const insertOrUpdate = db.prepare(`
      INSERT INTO system_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    Object.entries(updates).forEach(([key, val]) => {
      insertOrUpdate.run(key, String(val));
    });

    return res.json({ message: 'System settings successfully updated!' });
  } catch (err: any) {
    console.error('Update settings error:', err);
    return res.status(500).json({ message: 'Failed to update settings.', error: err.message });
  }
}
