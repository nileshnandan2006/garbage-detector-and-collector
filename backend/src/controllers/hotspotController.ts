import { Request, Response } from 'express';
import { db } from '../config/database.js';

export function getHotspots(_req: Request, res: Response) {
  try {
    const hotspots = db.prepare('SELECT * FROM hotspots ORDER BY unresolved_reports DESC, severity DESC').all();

    // Dynamically calculate live stats from reports table for real-time accuracy
    const liveAreas = db.prepare(`
      SELECT 
        area,
        COUNT(*) as total_reports,
        SUM(CASE WHEN status NOT IN ('CLEANED', 'CLOSED', 'REJECTED') THEN 1 ELSE 0 END) as unresolved,
        AVG(latitude) as lat,
        AVG(longitude) as lon
      FROM reports
      GROUP BY area
      ORDER BY unresolved DESC
    `).all() as any[];

    return res.json({ hotspots, liveAreas });
  } catch (err: any) {
    console.error('Get hotspots error:', err);
    return res.status(500).json({ message: 'Failed to fetch hotspots.', error: err.message });
  }
}

export function getCleanlinessScores(_req: Request, res: Response) {
  try {
    const areas = db.prepare('SELECT * FROM area_statistics ORDER BY cleanliness_score DESC').all();
    return res.json({ areas });
  } catch (err: any) {
    console.error('Get cleanliness scores error:', err);
    return res.status(500).json({ message: 'Failed to fetch cleanliness scores.', error: err.message });
  }
}
