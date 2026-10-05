import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'cleansight.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys and WAL mode for reliability
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('citizen', 'collector', 'admin')),
      avatar TEXT,
      phone TEXT,
      city TEXT DEFAULT 'Pune',
      points INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'Eco Cadet',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT NOT NULL,
      area TEXT NOT NULL,
      city TEXT NOT NULL,
      status TEXT NOT NULL,
      ai_detected INTEGER DEFAULT 1,
      ai_confidence REAL DEFAULT 0.94,
      ai_category TEXT,
      ai_severity TEXT DEFAULT 'High',
      ai_labels TEXT,
      ai_clean_confidence REAL DEFAULT 0.05,
      assigned_collector_id TEXT,
      assigned_collector_name TEXT,
      reward_points INTEGER DEFAULT 0,
      reward_status TEXT DEFAULT 'PENDING',
      admin_notes TEXT,
      rejection_reason TEXT,
      fraud_flag INTEGER DEFAULT 0,
      fraud_reason TEXT,
      image_hash TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_collector_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS cleaning_evidence (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL UNIQUE,
      collector_id TEXT NOT NULL,
      collector_name TEXT NOT NULL,
      before_image_url TEXT NOT NULL,
      after_image_url TEXT NOT NULL,
      cleaning_notes TEXT,
      waste_weight_kg REAL DEFAULT 15.0,
      cleaned_at TEXT NOT NULL,
      verified_by_admin INTEGER DEFAULT 0,
      admin_verified_at TEXT,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
      FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      points_cost INTEGER NOT NULL,
      type TEXT NOT NULL,
      icon TEXT NOT NULL,
      partner_name TEXT,
      code TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reward_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      report_id TEXT,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      reason TEXT NOT NULL,
      badge_unlocked TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS hotspots (
      id TEXT PRIMARY KEY,
      area_name TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      total_reports INTEGER DEFAULT 0,
      unresolved_reports INTEGER DEFAULT 0,
      severity TEXT DEFAULT 'Medium',
      cleanliness_score INTEGER DEFAULT 65,
      last_reported_at TEXT
    );

    CREATE TABLE IF NOT EXISTS violations (
      id TEXT PRIMARY KEY,
      report_id TEXT,
      area TEXT NOT NULL,
      responsible_entity TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      violation_type TEXT NOT NULL,
      description TEXT NOT NULL,
      evidence_url TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS penalties (
      id TEXT PRIMARY KEY,
      violation_id TEXT NOT NULL,
      area TEXT NOT NULL,
      responsible_entity TEXT NOT NULL,
      verified_violations_count INTEGER DEFAULT 1,
      warnings_count INTEGER DEFAULT 1,
      amount REAL NOT NULL,
      severity_tier TEXT NOT NULL,
      status TEXT NOT NULL,
      approved_by TEXT,
      issued_at TEXT NOT NULL,
      due_at TEXT,
      FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      report_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS area_statistics (
      id TEXT PRIMARY KEY,
      area_name TEXT NOT NULL UNIQUE,
      cleanliness_score INTEGER NOT NULL,
      total_reports INTEGER DEFAULT 0,
      cleaned_count INTEGER DEFAULT 0,
      avg_resolution_hours REAL DEFAULT 4.5,
      trend TEXT DEFAULT 'improving'
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  console.log('✅ CleanSight Database initialized with full schema.');
}
