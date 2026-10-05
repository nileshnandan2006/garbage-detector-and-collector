import { Request, Response } from 'express';
import { db } from '../config/database.js';

export function getNotifications(req: Request, res: Response) {
  try {
    const user = req.user!;
    const notifications = db
      .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30')
      .all(user.id);

    const unreadCount = (
      db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(user.id) as any
    )?.count || 0;

    return res.json({ notifications, unreadCount });
  } catch (err: any) {
    console.error('Get notifications error:', err);
    return res.status(500).json({ message: 'Failed to fetch notifications.', error: err.message });
  }
}

export function markAsRead(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const user = req.user!;

    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, user.id);

    return res.json({ message: 'Notification marked as read.' });
  } catch (err: any) {
    console.error('Mark notification error:', err);
    return res.status(500).json({ message: 'Failed to update notification.', error: err.message });
  }
}

export function markAllAsRead(req: Request, res: Response) {
  try {
    const user = req.user!;

    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(user.id);

    return res.json({ message: 'All notifications marked as read.' });
  } catch (err: any) {
    console.error('Mark all notifications error:', err);
    return res.status(500).json({ message: 'Failed to update notifications.', error: err.message });
  }
}
