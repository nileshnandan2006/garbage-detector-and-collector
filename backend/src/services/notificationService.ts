import crypto from 'node:crypto';
import { db } from '../config/database.js';

export function sendNotification(
  userId: string,
  title: string,
  message: string,
  type: 'REPORT_STATUS' | 'REWARD' | 'TASK_ASSIGNED' | 'PENALTY' | 'SYSTEM',
  reportId?: string
) {
  try {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read, report_id, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(id, userId, title, message, type, reportId || null, createdAt);

    return id;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}
