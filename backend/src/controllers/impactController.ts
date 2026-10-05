import { Request, Response } from 'express';
import { db } from '../config/database.js';

export function getImpactMetrics(_req: Request, res: Response) {
  try {
    // Combine base live stats with aggregate smart city metrics
    const totalReportsDb = (db.prepare('SELECT COUNT(*) as count FROM reports').get() as any)?.count || 0;
    const cleanedDb = (db.prepare(`SELECT COUNT(*) as count FROM reports WHERE status IN ('CLEANED', 'CLOSED')`).get() as any)?.count || 0;
    const totalUsersDb = (db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'citizen'`).get() as any)?.count || 0;

    const wasteRemovedKg = 12450 + (cleanedDb * 22.4);
    const totalReports = 2340 + totalReportsDb;
    const locationsCleaned = 1870 + cleanedDb;
    const activeCitizens = 8520 + totalUsersDb;
    const rewardsDistributed = 15200 + (cleanedDb * 70);
    const hotspotsImproved = 320;

    const environmentalImpact = {
      co2AvoidedTons: +(wasteRemovedKg * 0.0018).toFixed(1), // CO2 equivalent
      treesSavedEquivalent: Math.round(wasteRemovedKg * 0.12),
      waterConservedLiters: Math.round(wasteRemovedKg * 45),
      landfillSpaceSavedM3: +(wasteRemovedKg * 0.0022).toFixed(1)
    };

    const monthlyTrends = [
      { month: 'May', wasteKg: 1420, cleanedCount: 160 },
      { month: 'Jun', wasteKg: 1850, cleanedCount: 210 },
      { month: 'Jul', wasteKg: 2200, cleanedCount: 260 },
      { month: 'Aug', wasteKg: 2800, cleanedCount: 310 },
      { month: 'Sep', wasteKg: 3100, cleanedCount: 380 },
      { month: 'Oct', wasteKg: 3500, cleanedCount: 420 }
    ];

    return res.json({
      metrics: {
        wasteRemovedKg: Math.round(wasteRemovedKg),
        totalReports,
        locationsCleaned,
        activeCitizens,
        rewardsDistributed,
        hotspotsImproved
      },
      environmentalImpact,
      monthlyTrends
    });
  } catch (err: any) {
    console.error('Get impact metrics error:', err);
    return res.status(500).json({ message: 'Failed to fetch impact data.', error: err.message });
  }
}
