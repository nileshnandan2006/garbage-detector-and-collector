import crypto from 'node:crypto';
import fs from 'node:fs';
import { db } from '../config/database.js';

export interface FraudCheckResult {
  isSuspicious: boolean;
  reason?: string;
  duplicateOfReportId?: string;
}

// Calculate distance between two coordinates in meters (Haversine formula)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function computeFileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

export function checkFraud(
  userId: string,
  imageHash: string,
  latitude: number,
  longitude: number
): FraudCheckResult {
  try {
    // 1. Check exact duplicate image hash
    if (imageHash) {
      const existingHash = db
        .prepare('SELECT id, user_name, created_at FROM reports WHERE image_hash = ? LIMIT 1')
        .get(imageHash) as any;

      if (existingHash) {
        return {
          isSuspicious: true,
          reason: `Exact identical image previously submitted under Report #${existingHash.id.slice(0, 8)}`,
          duplicateOfReportId: existingHash.id
        };
      }
    }

    // 2. Check proximity spam (within 25 meters submitted in past 4 hours)
    const recentReports = db
      .prepare(
        `SELECT id, latitude, longitude, created_at, status 
         FROM reports 
         WHERE status NOT IN ('REJECTED', 'CLOSED') 
         ORDER BY created_at DESC LIMIT 50`
      )
      .all() as any[];

    for (const rep of recentReports) {
      const dist = getDistanceMeters(latitude, longitude, rep.latitude, rep.longitude);
      if (dist < 25) {
        return {
          isSuspicious: true,
          reason: `Duplicate report within ${Math.round(dist)}m of existing active report #${rep.id.slice(0, 8)}. Marked for manual review.`,
          duplicateOfReportId: rep.id
        };
      }
    }

    // 3. User submission rate check (max 5 reports in 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const count = db
      .prepare('SELECT COUNT(*) as cnt FROM reports WHERE user_id = ? AND created_at > ?')
      .get(userId, tenMinutesAgo) as any;

    if (count && count.cnt >= 5) {
      return {
        isSuspicious: true,
        reason: 'Rapid submission velocity detected (>5 reports in 10 mins). Marked for manual review.'
      };
    }

    return { isSuspicious: false };
  } catch (err) {
    console.error('Anti-fraud check error:', err);
    return { isSuspicious: false };
  }
}
