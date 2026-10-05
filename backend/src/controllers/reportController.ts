import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../config/database.js';
import { checkFraud, computeFileHash } from '../services/antiFraudService.js';
import { sendNotification } from '../services/notificationService.js';

export function createReport(req: Request, res: Response) {
  try {
    const user = req.user!;
    const file = req.file;

    const {
      category = 'Plastic Waste',
      description = '',
      latitude,
      longitude,
      address,
      area,
      city = 'Pune',
      ai_confidence,
      ai_severity = 'High',
      ai_detected = '1',
      ai_labels = '[]'
    } = req.body;

    if (!latitude || !longitude || !address || !area) {
      return res.status(400).json({ message: 'Latitude, longitude, address, and area are required.' });
    }

    const imageUrl = file ? `/uploads/${file.filename}` : req.body.image_url;
    if (!imageUrl) {
      return res.status(400).json({ message: 'An image of the garbage site is required.' });
    }

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    // Compute image hash for anti-fraud check
    const imageHash = file ? computeFileHash(file.path) : '';
    const fraudCheck = checkFraud(user.id, imageHash, latNum, lonNum);

    // Determine default reward points based on severity
    let basePoints = 25;
    if (ai_severity === 'Low') basePoints = 10;
    else if (ai_severity === 'Medium') basePoints = 25;
    else if (ai_severity === 'High') basePoints = 50;
    else if (ai_severity === 'Critical') basePoints = 100;

    const reportId = `rep-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    const initialStatus = fraudCheck.isSuspicious ? 'PENDING AI VERIFICATION' : 'VERIFIED';

    db.prepare(`
      INSERT INTO reports (
        id, user_id, user_name, category, description, image_url, latitude, longitude,
        address, area, city, status, ai_detected, ai_confidence, ai_category, ai_severity,
        ai_labels, ai_clean_confidence, assigned_collector_id, assigned_collector_name,
        reward_points, reward_status, admin_notes, fraud_flag, fraud_reason, image_hash,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, 0.05, NULL, NULL,
        ?, 'PENDING', ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      reportId,
      user.id,
      user.name,
      category,
      description,
      imageUrl,
      latNum,
      lonNum,
      address,
      area,
      city,
      initialStatus,
      ai_detected === '1' || ai_detected === 'true' ? 1 : 0,
      parseFloat(ai_confidence) || 0.94,
      category,
      ai_severity,
      typeof ai_labels === 'string' ? ai_labels : JSON.stringify(ai_labels),
      basePoints,
      fraudCheck.isSuspicious ? 'Marked for manual review by anti-fraud shield.' : null,
      fraudCheck.isSuspicious ? 1 : 0,
      fraudCheck.reason || null,
      imageHash,
      nowIso,
      nowIso
    );

    // Update area stats or insert if new
    const existingArea = db.prepare('SELECT id, total_reports FROM area_statistics WHERE area_name = ?').get(area) as any;
    if (existingArea) {
      db.prepare('UPDATE area_statistics SET total_reports = total_reports + 1 WHERE id = ?').run(existingArea.id);
    } else {
      db.prepare(`
        INSERT INTO area_statistics (id, area_name, cleanliness_score, total_reports, cleaned_count, avg_resolution_hours, trend)
        VALUES (?, ?, 60, 1, 0, 4.0, 'stable')
      `).run(`area-${Date.now().toString().slice(-5)}`, area);
    }

    // Notify user
    sendNotification(
      user.id,
      'Garbage Report Submitted Successfully',
      `Your report for ${category} at ${area} is recorded. Status: ${initialStatus}.`,
      'REPORT_STATUS',
      reportId
    );

    const createdReport = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);

    return res.status(201).json({
      message: 'Report submitted successfully!',
      report: createdReport,
      antiFraud: fraudCheck
    });
  } catch (err: any) {
    console.error('Create report error:', err);
    return res.status(500).json({ message: 'Failed to create report.', error: err.message });
  }
}

export function getAllReports(req: Request, res: Response) {
  try {
    const { status, area, category, user_id, assigned_collector_id, search } = req.query;

    let query = 'SELECT * FROM reports WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (area) {
      query += ' AND area LIKE ?';
      params.push(`%${area}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }
    if (assigned_collector_id) {
      query += ' AND assigned_collector_id = ?';
      params.push(assigned_collector_id);
    }
    if (search) {
      query += ' AND (address LIKE ? OR area LIKE ? OR description LIKE ? OR user_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const reports = db.prepare(query).all(...params);

    return res.json({ reports });
  } catch (err: any) {
    console.error('Get reports error:', err);
    return res.status(500).json({ message: 'Failed to fetch reports.', error: err.message });
  }
}

export function getReportById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const evidence = db.prepare('SELECT * FROM cleaning_evidence WHERE report_id = ?').get(id);

    return res.json({
      report: {
        ...report,
        evidence: evidence || null
      }
    });
  } catch (err: any) {
    console.error('Get report by id error:', err);
    return res.status(500).json({ message: 'Failed to fetch report details.', error: err.message });
  }
}

export function verifyReport(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const { action, notes, rejection_reason } = req.body; // action: 'VERIFY' | 'REJECT'
    const nowIso = new Date().toISOString();

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (action === 'VERIFY') {
      db.prepare(`
        UPDATE reports 
        SET status = 'VERIFIED', admin_notes = ?, fraud_flag = 0, updated_at = ? 
        WHERE id = ?
      `).run(notes || 'Verified by Municipal Authority.', nowIso, id);

      sendNotification(
        report.user_id,
        'Report Verified by Municipal Authority',
        `Your garbage report #${report.id.slice(0, 8)} in ${report.area} has been approved for collection dispatch!`,
        'REPORT_STATUS',
        report.id
      );
    } else {
      db.prepare(`
        UPDATE reports 
        SET status = 'REJECTED', rejection_reason = ?, admin_notes = ?, updated_at = ? 
        WHERE id = ?
      `).run(rejection_reason || 'Does not match municipal criteria.', notes || null, nowIso, id);

      sendNotification(
        report.user_id,
        'Report Update',
        `Your report #${report.id.slice(0, 8)} was marked as rejected: ${rejection_reason || 'Incomplete details'}.`,
        'REPORT_STATUS',
        report.id
      );
    }

    const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    return res.json({ message: `Report successfully ${action === 'VERIFY' ? 'verified' : 'rejected'}.`, report: updated });
  } catch (err: any) {
    console.error('Verify report error:', err);
    return res.status(500).json({ message: 'Failed to verify report.', error: err.message });
  }
}

export function assignCollector(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const collector_id = String(req.body.collector_id);

    const collector = db.prepare('SELECT id, name FROM users WHERE id = ? AND role = "collector"').get(collector_id) as any;
    if (!collector) {
      return res.status(404).json({ message: 'Collector not found' });
    }

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const nowIso = new Date().toISOString();

    db.prepare(`
      UPDATE reports 
      SET status = 'ASSIGNED', assigned_collector_id = ?, assigned_collector_name = ?, updated_at = ? 
      WHERE id = ?
    `).run(collector.id, collector.name, nowIso, id);

    // Notify collector
    sendNotification(
      collector.id,
      'New Task Assigned',
      `You have been assigned to clean ${report.category} at ${report.address}, ${report.area}.`,
      'TASK_ASSIGNED',
      report.id
    );

    // Notify citizen
    sendNotification(
      report.user_id,
      'Collector Dispatched',
      `Staff member ${collector.name} has been assigned to your report in ${report.area}.`,
      'REPORT_STATUS',
      report.id
    );

    const updated = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    return res.json({ message: 'Collector assigned successfully.', report: updated });
  } catch (err: any) {
    console.error('Assign collector error:', err);
    return res.status(500).json({ message: 'Failed to assign collector.', error: err.message });
  }
}
