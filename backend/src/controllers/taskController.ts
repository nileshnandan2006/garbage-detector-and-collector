import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../config/database.js';
import { sendNotification } from '../services/notificationService.js';

export function getCollectorTasks(req: Request, res: Response) {
  try {
    const collector = req.user!;
    const { status } = req.query;

    let query = `
      SELECT r.*, 
             e.after_image_url, e.cleaning_notes, e.waste_weight_kg, e.cleaned_at, e.verified_by_admin
      FROM reports r
      LEFT JOIN cleaning_evidence e ON r.id = e.report_id
      WHERE (r.assigned_collector_id = ? OR r.status = 'VERIFIED')
    `;
    const params: any[] = [collector.id];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY CASE r.status WHEN "CLEANING IN PROGRESS" THEN 1 WHEN "COLLECTOR ON THE WAY" THEN 2 WHEN "ASSIGNED" THEN 3 ELSE 4 END, r.created_at DESC';

    const tasks = db.prepare(query).all(...params);

    return res.json({ tasks });
  } catch (err: any) {
    console.error('Get tasks error:', err);
    return res.status(500).json({ message: 'Failed to fetch collector tasks.', error: err.message });
  }
}

export function updateTaskStatus(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const { status } = req.body; // 'COLLECTOR ON THE WAY' | 'CLEANING IN PROGRESS'
    const collector = req.user!;
    const nowIso = new Date().toISOString();

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!report) {
      return res.status(404).json({ message: 'Task/report not found' });
    }

    // If collector takes an unassigned verified report
    const collectorId = report.assigned_collector_id || collector.id;
    const collectorName = report.assigned_collector_name || collector.name;

    db.prepare(`
      UPDATE reports 
      SET status = ?, assigned_collector_id = ?, assigned_collector_name = ?, updated_at = ?
      WHERE id = ?
    `).run(status, collectorId, collectorName, nowIso, id);

    let notifTitle = 'Collector On The Way';
    let notifMsg = `Collector ${collectorName} is traveling to your reported site at ${report.area}.`;
    if (status === 'CLEANING IN PROGRESS') {
      notifTitle = 'Cleaning Started!';
      notifMsg = `Collector ${collectorName} has arrived and commenced waste collection at ${report.area}.`;
    }

    sendNotification(report.user_id, notifTitle, notifMsg, 'REPORT_STATUS', report.id);

    const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    return res.json({ message: `Task status updated to ${status}.`, report: updated });
  } catch (err: any) {
    console.error('Update task status error:', err);
    return res.status(500).json({ message: 'Failed to update task status.', error: err.message });
  }
}

export function completeTask(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const file = req.file;
    const collector = req.user!;
    const { notes = '', waste_weight_kg = 15.0 } = req.body;

    const afterImageUrl = file ? `/uploads/${file.filename}` : req.body.after_image_url;
    if (!afterImageUrl) {
      return res.status(400).json({ message: 'An "After Cleaning" photo is mandatory to complete collection.' });
    }

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const nowIso = new Date().toISOString();
    const evidenceId = `evd-${crypto.randomUUID().slice(0, 8)}`;

    // Insert cleaning evidence
    db.prepare(`
      INSERT OR REPLACE INTO cleaning_evidence (
        id, report_id, collector_id, collector_name, before_image_url, after_image_url,
        cleaning_notes, waste_weight_kg, cleaned_at, verified_by_admin, admin_verified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      evidenceId,
      id,
      collector.id,
      collector.name,
      report.image_url,
      afterImageUrl,
      notes || 'Cleaned, segregated, and disinfected by field team.',
      parseFloat(waste_weight_kg) || 15.0,
      nowIso,
      nowIso
    );

    // Calculate total points: base points + 20 bonus for verified Before/After evidence!
    const totalPoints = (report.reward_points || 25) + 20;

    // Update report to CLEANED
    db.prepare(`
      UPDATE reports 
      SET status = 'CLEANED', reward_points = ?, reward_status = 'CREDITED', updated_at = ?
      WHERE id = ?
    `).run(totalPoints, nowIso, id);

    // Credit citizen points
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(totalPoints, report.user_id);

    // Insert reward transaction
    db.prepare(`
      INSERT INTO reward_transactions (id, user_id, report_id, amount, type, reason, badge_unlocked, created_at)
      VALUES (?, ?, ?, ?, 'EARNED', ?, NULL, ?)
    `).run(
      `tx-${crypto.randomUUID().slice(0, 8)}`,
      report.user_id,
      report.id,
      totalPoints,
      `Report Cleaned & Verified (+20 Before/After Bonus)`,
      nowIso
    );

    // Update area stats (increment cleaned count, cleanliness score)
    db.prepare(`
      UPDATE area_statistics 
      SET cleaned_count = cleaned_count + 1,
          cleanliness_score = MIN(100, cleanliness_score + 3)
      WHERE area_name = ?
    `).run(report.area);

    // Check rank upgrade for citizen
    const updatedUser = db.prepare('SELECT points FROM users WHERE id = ?').get(report.user_id) as any;
    let newRank = 'Green Starter';
    if (updatedUser.points >= 1500) newRank = 'Clean City Champion';
    else if (updatedUser.points >= 1000) newRank = 'Eco Warrior';
    else if (updatedUser.points >= 500) newRank = 'Waste Watcher';

    db.prepare('UPDATE users SET rank = ? WHERE id = ?').run(newRank, report.user_id);

    // Notify citizen
    sendNotification(
      report.user_id,
      'Garbage Removed & Rewards Credited!',
      `Success! The garbage at ${report.area} has been cleaned by ${collector.name}. +${totalPoints} points have been added to your balance!`,
      'REWARD',
      report.id
    );

    return res.json({
      message: 'Task successfully completed! Before/After evidence verified and citizen rewarded.',
      reportId: id,
      rewardPointsAwarded: totalPoints
    });
  } catch (err: any) {
    console.error('Complete task error:', err);
    return res.status(500).json({ message: 'Failed to complete task.', error: err.message });
  }
}
