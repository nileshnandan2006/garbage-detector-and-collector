import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../config/database.js';

export function getViolations(_req: Request, res: Response) {
  try {
    const violations = db.prepare(`
      SELECT v.*, r.address, r.category as garbage_category, r.ai_severity
      FROM violations v
      LEFT JOIN reports r ON v.report_id = r.id
      ORDER BY v.created_at DESC
    `).all();

    return res.json({ violations });
  } catch (err: any) {
    console.error('Get violations error:', err);
    return res.status(500).json({ message: 'Failed to fetch violations.', error: err.message });
  }
}

export function createViolation(req: Request, res: Response) {
  try {
    const {
      report_id,
      area,
      responsible_entity,
      entity_type = 'Commercial',
      violation_type = 'Illegal Dumping',
      description,
      evidence_url
    } = req.body;

    if (!area || !responsible_entity || !description) {
      return res.status(400).json({ message: 'Area, responsible entity, and description are required.' });
    }

    const id = `viol-${crypto.randomUUID().slice(0, 8)}`;
    const nowIso = new Date().toISOString();

    db.prepare(`
      INSERT INTO violations (id, report_id, area, responsible_entity, entity_type, violation_type, description, evidence_url, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENALTY_RECOMMENDED', ?)
    `).run(id, report_id || null, area, responsible_entity, entity_type, violation_type, description, evidence_url || '', nowIso);

    // Count how many past violations this entity has
    const pastCount = db.prepare('SELECT COUNT(*) as cnt FROM violations WHERE responsible_entity = ?').get(responsible_entity) as any;
    const count = pastCount?.cnt || 1;

    // Automatic penalty tier recommendation (subject to admin approval)
    let tier = 'Warning';
    let amount = 0;
    if (count === 1) {
      tier = 'Warning';
      amount = 0;
    } else if (count <= 3) {
      tier = 'Low Penalty';
      amount = 2000;
    } else if (count <= 6) {
      tier = 'Medium Penalty';
      amount = 5000;
    } else {
      tier = 'High Penalty';
      amount = 15000;
    }

    const penaltyId = `pen-${crypto.randomUUID().slice(0, 8)}`;
    const dueAt = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

    db.prepare(`
      INSERT INTO penalties (
        id, violation_id, area, responsible_entity, verified_violations_count, warnings_count,
        amount, severity_tier, status, approved_by, issued_at, due_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Under Review', NULL, ?, ?)
    `).run(
      penaltyId,
      id,
      area,
      responsible_entity,
      count,
      Math.min(count, 2),
      amount,
      tier,
      nowIso,
      dueAt
    );

    return res.status(201).json({
      message: 'Violation recorded and penalty recommendation created for administrative review.',
      violationId: id,
      penaltyId
    });
  } catch (err: any) {
    console.error('Create violation error:', err);
    return res.status(500).json({ message: 'Failed to record violation.', error: err.message });
  }
}

export function getPenalties(_req: Request, res: Response) {
  try {
    const penalties = db.prepare(`
      SELECT p.*, v.description as violation_description, v.violation_type, v.entity_type, v.evidence_url
      FROM penalties p
      JOIN violations v ON p.violation_id = v.id
      ORDER BY p.issued_at DESC
    `).all();

    return res.json({ penalties });
  } catch (err: any) {
    console.error('Get penalties error:', err);
    return res.status(500).json({ message: 'Failed to fetch penalties.', error: err.message });
  }
}

export function updatePenaltyStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, amount } = req.body; // status: 'Approved' | 'Paid' | 'Disputed'
    const admin = req.user!;

    const penalty = db.prepare('SELECT * FROM penalties WHERE id = ?').get(id) as any;
    if (!penalty) {
      return res.status(404).json({ message: 'Penalty record not found' });
    }

    const newAmount = amount !== undefined ? parseFloat(amount) : penalty.amount;

    db.prepare(`
      UPDATE penalties 
      SET status = ?, amount = ?, approved_by = ?
      WHERE id = ?
    `).run(status, newAmount, admin.name, id);

    if (status === 'Approved') {
      db.prepare(`UPDATE violations SET status = 'PENALTY_APPROVED' WHERE id = ?`).run(penalty.violation_id);
    }

    const updated = db.prepare('SELECT * FROM penalties WHERE id = ?').get(id);
    return res.json({ message: `Penalty status successfully updated to ${status}.`, penalty: updated });
  } catch (err: any) {
    console.error('Update penalty error:', err);
    return res.status(500).json({ message: 'Failed to update penalty.', error: err.message });
  }
}
