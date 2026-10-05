import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { db } from '../config/database.js';

export async function seedDatabase() {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (existingUsers && existingUsers.count > 0) {
    console.log('Database already populated. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding CleanSight database with rich demo data...');

  const citizenHash = await bcrypt.hash('citizen123', 10);
  const collectorHash = await bcrypt.hash('collector123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const now = new Date();
  const getPastIso = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600 * 1000).toISOString();

  // 1. Seed Users (10 users)
  const users = [
    {
      id: 'usr-cit-1',
      name: 'Rahul Sharma',
      email: 'citizen@cleansight.org',
      password: citizenHash,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone: '+91 98201 12345',
      city: 'Pune',
      points: 1850,
      rank: 'Clean City Champion',
      created_at: getPastIso(720)
    },
    {
      id: 'usr-cit-2',
      name: 'Priya Patel',
      email: 'priya@cleansight.org',
      password: citizenHash,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      phone: '+91 98202 23456',
      city: 'Pune',
      points: 1500,
      rank: 'Eco Warrior',
      created_at: getPastIso(600)
    },
    {
      id: 'usr-cit-3',
      name: 'Amit Verma',
      email: 'amit@cleansight.org',
      password: citizenHash,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      phone: '+91 98203 34567',
      city: 'Pune',
      points: 1200,
      rank: 'Waste Watcher',
      created_at: getPastIso(500)
    },
    {
      id: 'usr-cit-4',
      name: 'Sneha Kulkarni',
      email: 'sneha@cleansight.org',
      password: citizenHash,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      phone: '+91 98204 45678',
      city: 'Pune',
      points: 950,
      rank: 'Waste Watcher',
      created_at: getPastIso(400)
    },
    {
      id: 'usr-cit-5',
      name: 'Vikram Joshi',
      email: 'vikram@cleansight.org',
      password: citizenHash,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+91 98205 56789',
      city: 'Pune',
      points: 620,
      rank: 'Green Starter',
      created_at: getPastIso(300)
    },
    {
      id: 'usr-col-1',
      name: 'Suresh Kumar',
      email: 'collector@cleansight.org',
      password: collectorHash,
      role: 'collector',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+91 97111 67890',
      city: 'Pune (Central Ward)',
      points: 450,
      rank: 'Lead Collector',
      created_at: getPastIso(800)
    },
    {
      id: 'usr-col-2',
      name: 'Anita Shinde',
      email: 'anita@cleansight.org',
      password: collectorHash,
      role: 'collector',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      phone: '+91 97112 78901',
      city: 'Pune (Kothrud Ward)',
      points: 380,
      rank: 'Sanitation Officer',
      created_at: getPastIso(750)
    },
    {
      id: 'usr-col-3',
      name: 'Mahesh Patil',
      email: 'mahesh@cleansight.org',
      password: collectorHash,
      role: 'collector',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      phone: '+91 97113 89012',
      city: 'Pune (Baner-Aundh)',
      points: 290,
      rank: 'Collection Specialist',
      created_at: getPastIso(650)
    },
    {
      id: 'usr-adm-1',
      name: 'Rajesh Deshmukh (Municipal Commissioner)',
      email: 'admin@cleansight.org',
      password: adminHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      phone: '+91 99000 11111',
      city: 'Pune Municipal Corporation',
      points: 0,
      rank: 'Head Administrator',
      created_at: getPastIso(1000)
    },
    {
      id: 'usr-adm-2',
      name: 'Dr. Sunita Rao (Sanitation Director)',
      email: 'officer@cleansight.org',
      password: adminHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      phone: '+91 99000 22222',
      city: 'Pune Municipal Corporation',
      points: 0,
      rank: 'Zonal Inspector',
      created_at: getPastIso(900)
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar, phone, city, points, rank, created_at)
    VALUES (@id, @name, @email, @password, @role, @avatar, @phone, @city, @points, @rank, @created_at)
  `);

  users.forEach((u) => insertUser.run(u));

  // 2. Seed Hotspots (5 hotspots)
  const hotspots = [
    {
      id: 'hot-1',
      area_name: 'Kothrud Depo Junction',
      city: 'Pune',
      latitude: 18.5074,
      longitude: 73.8077,
      total_reports: 47,
      unresolved_reports: 12,
      severity: 'High',
      cleanliness_score: 38,
      last_reported_at: getPastIso(2)
    },
    {
      id: 'hot-2',
      area_name: 'Baner High Street Alley',
      city: 'Pune',
      latitude: 18.5596,
      longitude: 73.7799,
      total_reports: 31,
      unresolved_reports: 5,
      severity: 'Medium',
      cleanliness_score: 61,
      last_reported_at: getPastIso(5)
    },
    {
      id: 'hot-3',
      area_name: 'Shivajinagar Railway Margin',
      city: 'Pune',
      latitude: 18.5314,
      longitude: 73.8446,
      total_reports: 56,
      unresolved_reports: 18,
      severity: 'Critical',
      cleanliness_score: 32,
      last_reported_at: getPastIso(1)
    },
    {
      id: 'hot-4',
      area_name: 'Hinjawadi Phase 1 Market',
      city: 'Pune',
      latitude: 18.5912,
      longitude: 73.7389,
      total_reports: 28,
      unresolved_reports: 8,
      severity: 'Medium',
      cleanliness_score: 58,
      last_reported_at: getPastIso(7)
    },
    {
      id: 'hot-5',
      area_name: 'Deccan Gymkhana Riverfront',
      city: 'Pune',
      latitude: 18.5173,
      longitude: 73.8415,
      total_reports: 41,
      unresolved_reports: 9,
      severity: 'High',
      cleanliness_score: 45,
      last_reported_at: getPastIso(3)
    }
  ];

  const insertHotspot = db.prepare(`
    INSERT INTO hotspots (id, area_name, city, latitude, longitude, total_reports, unresolved_reports, severity, cleanliness_score, last_reported_at)
    VALUES (@id, @area_name, @city, @latitude, @longitude, @total_reports, @unresolved_reports, @severity, @cleanliness_score, @last_reported_at)
  `);
  hotspots.forEach((h) => insertHotspot.run(h));

  // 3. Area Statistics
  const areas = [
    { id: 'area-1', area_name: 'Kothrud', cleanliness_score: 82, total_reports: 54, cleaned_count: 48, avg_resolution_hours: 3.8, trend: 'improving' },
    { id: 'area-2', area_name: 'Baner', cleanliness_score: 65, total_reports: 39, cleaned_count: 32, avg_resolution_hours: 4.5, trend: 'improving' },
    { id: 'area-3', area_name: 'Shivajinagar', cleanliness_score: 48, total_reports: 72, cleaned_count: 51, avg_resolution_hours: 6.2, trend: 'declining' },
    { id: 'area-4', area_name: 'Hinjawadi', cleanliness_score: 74, total_reports: 34, cleaned_count: 29, avg_resolution_hours: 4.0, trend: 'stable' },
    { id: 'area-5', area_name: 'Viman Nagar', cleanliness_score: 88, total_reports: 25, cleaned_count: 24, avg_resolution_hours: 2.9, trend: 'improving' },
    { id: 'area-6', area_name: 'Deccan Gymkhana', cleanliness_score: 55, total_reports: 45, cleaned_count: 35, avg_resolution_hours: 5.1, trend: 'stable' },
    { id: 'area-7', area_name: 'Hadapsar', cleanliness_score: 62, total_reports: 41, cleaned_count: 33, avg_resolution_hours: 4.8, trend: 'improving' },
    { id: 'area-8', area_name: 'Katraj', cleanliness_score: 59, total_reports: 38, cleaned_count: 30, avg_resolution_hours: 5.5, trend: 'declining' }
  ];

  const insertArea = db.prepare(`
    INSERT INTO area_statistics (id, area_name, cleanliness_score, total_reports, cleaned_count, avg_resolution_hours, trend)
    VALUES (@id, @area_name, @cleanliness_score, @total_reports, @cleaned_count, @avg_resolution_hours, @trend)
  `);
  areas.forEach((a) => insertArea.run(a));

  // 4. Seed Reports (20 reports)
  const garbageImages = [
    'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800', // plastic waste
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800', // debris
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800', // landfill/bottles
    'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=800', // plastic pile
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', // street litter
    'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800'  // cardboard/boxes
  ];

  const cleanedImages = [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800', // clean street
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800', // clean city avenue
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', // clean pavement
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'  // pristine path
  ];

  const reports = [
    {
      id: 'rep-001',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Plastic Waste',
      description: 'Massive dumping of plastic bottles and polybags near Kothrud Bus Depot gate.',
      image_url: garbageImages[0],
      latitude: 18.5074,
      longitude: 73.8077,
      address: 'Near Platform 3, Kothrud Bus Depot, Paud Road',
      area: 'Kothrud',
      city: 'Pune',
      status: 'CLEANED',
      ai_detected: 1,
      ai_confidence: 0.96,
      ai_category: 'Plastic Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['plastic bottles', 'takeaway containers', 'polythene', 'litter pile']),
      ai_clean_confidence: 0.02,
      assigned_collector_id: 'usr-col-2',
      assigned_collector_name: 'Anita Shinde',
      reward_points: 70, // 50 base + 20 before/after bonus
      reward_status: 'CREDITED',
      admin_notes: 'Spot verified by Admin Rajesh. Before/After confirmed clean.',
      created_at: getPastIso(48),
      updated_at: getPastIso(12)
    },
    {
      id: 'rep-002',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Food Waste',
      description: 'Overflowing organic restaurant waste rotting on footpath near Baner High St.',
      image_url: garbageImages[4],
      latitude: 18.5596,
      longitude: 73.7799,
      address: 'Behind Silver Plaza, Baner High Street',
      area: 'Baner',
      city: 'Pune',
      status: 'CLEANED',
      ai_detected: 1,
      ai_confidence: 0.93,
      ai_category: 'Food Waste',
      ai_severity: 'Medium',
      ai_labels: JSON.stringify(['food waste', 'organic scraps', 'rotting vegetables', 'foul odor']),
      ai_clean_confidence: 0.04,
      assigned_collector_id: 'usr-col-3',
      assigned_collector_name: 'Mahesh Patil',
      reward_points: 45, // 25 base + 20 bonus
      reward_status: 'CREDITED',
      admin_notes: 'Sanitized with disinfectant spray.',
      created_at: getPastIso(36),
      updated_at: getPastIso(8)
    },
    {
      id: 'rep-003',
      user_id: 'usr-cit-2',
      user_name: 'Priya Patel',
      category: 'Construction Waste',
      description: 'Broken concrete tiles and bricks dumped by local builder on public road margin.',
      image_url: garbageImages[1],
      latitude: 18.5314,
      longitude: 73.8446,
      address: 'Lane 4, Shivajinagar Railway Margin',
      area: 'Shivajinagar',
      city: 'Pune',
      status: 'CLEANING IN PROGRESS',
      ai_detected: 1,
      ai_confidence: 0.98,
      ai_category: 'Construction Waste',
      ai_severity: 'Critical',
      ai_labels: JSON.stringify(['concrete rubble', 'cement chunks', 'demolition debris', 'tiles']),
      ai_clean_confidence: 0.01,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Hydraulic loader dispatched to clear heavy debris.',
      created_at: getPastIso(14),
      updated_at: getPastIso(2)
    },
    {
      id: 'rep-004',
      user_id: 'usr-cit-3',
      user_name: 'Amit Verma',
      category: 'E-Waste',
      description: 'Discarded computer monitors, broken wires and PCB boards left beside electric transformer.',
      image_url: garbageImages[2],
      latitude: 18.5912,
      longitude: 73.7389,
      address: 'Opposite Tech Hub 2, Phase 1, Hinjawadi',
      area: 'Hinjawadi',
      city: 'Pune',
      status: 'ASSIGNED',
      ai_detected: 1,
      ai_confidence: 0.94,
      ai_category: 'E-Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['electronic scrap', 'cables', 'circuit board', 'lead danger']),
      ai_clean_confidence: 0.03,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Hazardous e-waste team notified.',
      created_at: getPastIso(8),
      updated_at: getPastIso(4)
    },
    {
      id: 'rep-005',
      user_id: 'usr-cit-4',
      user_name: 'Sneha Kulkarni',
      category: 'Household Waste',
      description: 'Unattended bulk garbage bags overflowing outside apartment complex gate.',
      image_url: garbageImages[5],
      latitude: 18.5173,
      longitude: 73.8415,
      address: 'Riverside Walkway, Deccan Gymkhana',
      area: 'Deccan Gymkhana',
      city: 'Pune',
      status: 'VERIFIED',
      ai_detected: 1,
      ai_confidence: 0.91,
      ai_category: 'Household Waste',
      ai_severity: 'Medium',
      ai_labels: JSON.stringify(['carton boxes', 'household trash', 'plastic bags']),
      ai_clean_confidence: 0.05,
      assigned_collector_id: null,
      assigned_collector_name: null,
      reward_points: 25,
      reward_status: 'PENDING',
      admin_notes: 'Verified by system and queueing for morning collector shift.',
      created_at: getPastIso(6),
      updated_at: getPastIso(5)
    },
    {
      id: 'rep-006',
      user_id: 'usr-cit-5',
      user_name: 'Vikram Joshi',
      category: 'Plastic Waste',
      description: 'Discarded beverage cups, straws and plastic packaging along walkway.',
      image_url: garbageImages[3],
      latitude: 18.5679,
      longitude: 73.9143,
      address: 'Central Park Boundary, Viman Nagar',
      area: 'Viman Nagar',
      city: 'Pune',
      status: 'COLLECTOR ON THE WAY',
      ai_detected: 1,
      ai_confidence: 0.95,
      ai_category: 'Plastic Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['beverage cups', 'plastic straw', 'wrappers', 'scattered']),
      ai_clean_confidence: 0.02,
      assigned_collector_id: 'usr-col-3',
      assigned_collector_name: 'Mahesh Patil',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Collector dispatched with e-rickshaw.',
      created_at: getPastIso(4),
      updated_at: getPastIso(1)
    },
    {
      id: 'rep-007',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Medical Waste',
      description: 'Used syringe packaging and surgical gloves spotted behind health clinic dump.',
      image_url: garbageImages[2],
      latitude: 18.5314,
      longitude: 73.8446,
      address: 'Clinic Backlane, Shivajinagar',
      area: 'Shivajinagar',
      city: 'Pune',
      status: 'VERIFIED',
      ai_detected: 1,
      ai_confidence: 0.97,
      ai_category: 'Medical Waste',
      ai_severity: 'Critical',
      ai_labels: JSON.stringify(['biohazard gloves', 'medical packaging', 'sterile vials']),
      ai_clean_confidence: 0.01,
      assigned_collector_id: null,
      assigned_collector_name: null,
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'High urgency biohazard alert created.',
      created_at: getPastIso(3),
      updated_at: getPastIso(3)
    },
    {
      id: 'rep-008',
      user_id: 'usr-cit-2',
      user_name: 'Priya Patel',
      category: 'Mixed Waste',
      description: 'Open municipal dustbin overflow with trash spilling onto street pavement.',
      image_url: garbageImages[0],
      latitude: 18.5018,
      longitude: 73.8636,
      address: 'Swargate Flyover Base, Pune-Satara Road',
      area: 'Swargate',
      city: 'Pune',
      status: 'CLEANED',
      ai_detected: 1,
      ai_confidence: 0.92,
      ai_category: 'Mixed Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['overflowing bin', 'mixed garbage', 'littering']),
      ai_clean_confidence: 0.03,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 70,
      reward_status: 'CREDITED',
      admin_notes: 'Bin emptied and area thoroughly power-washed.',
      created_at: getPastIso(24),
      updated_at: getPastIso(6)
    },
    {
      id: 'rep-009',
      user_id: 'usr-cit-3',
      user_name: 'Amit Verma',
      category: 'Plastic Waste',
      description: 'Single-use plastic carry bags scattered across open stormwater gutter.',
      image_url: garbageImages[3],
      latitude: 18.4575,
      longitude: 73.8677,
      address: 'Katraj Lake Promenade, Katraj',
      area: 'Katraj',
      city: 'Pune',
      status: 'CLEANED',
      ai_detected: 1,
      ai_confidence: 0.95,
      ai_category: 'Plastic Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['polybags', 'drain clogging', 'plastic wraps']),
      ai_clean_confidence: 0.02,
      assigned_collector_id: 'usr-col-2',
      assigned_collector_name: 'Anita Shinde',
      reward_points: 70,
      reward_status: 'CREDITED',
      admin_notes: 'Storm drain cleared ahead of rains.',
      created_at: getPastIso(52),
      updated_at: getPastIso(16)
    },
    {
      id: 'rep-010',
      user_id: 'usr-cit-4',
      user_name: 'Sneha Kulkarni',
      category: 'Construction Waste',
      description: 'Sand piles and plaster sacks blocking pedestrian crossing.',
      image_url: garbageImages[1],
      latitude: 18.5089,
      longitude: 73.9259,
      address: 'Magarpatta South Gate, Hadapsar',
      area: 'Hadapsar',
      city: 'Pune',
      status: 'ASSIGNED',
      ai_detected: 1,
      ai_confidence: 0.94,
      ai_category: 'Construction Waste',
      ai_severity: 'Medium',
      ai_labels: JSON.stringify(['sand bags', 'construction cement', 'debris pile']),
      ai_clean_confidence: 0.04,
      assigned_collector_id: 'usr-col-3',
      assigned_collector_name: 'Mahesh Patil',
      reward_points: 25,
      reward_status: 'PENDING',
      admin_notes: 'Contractor warned. Municipal collection assigned.',
      created_at: getPastIso(9),
      updated_at: getPastIso(2)
    },
    {
      id: 'rep-011',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Food Waste',
      description: 'Rotten fruit boxes dumped outside wholesale vegetable market.',
      image_url: garbageImages[4],
      latitude: 18.5074,
      longitude: 73.8077,
      address: 'Market Yard Gate 4, Kothrud',
      area: 'Kothrud',
      city: 'Pune',
      status: 'CLEANING IN PROGRESS',
      ai_detected: 1,
      ai_confidence: 0.91,
      ai_category: 'Food Waste',
      ai_severity: 'Medium',
      ai_labels: JSON.stringify(['rotten fruit', 'wooden crates', 'organic waste']),
      ai_clean_confidence: 0.03,
      assigned_collector_id: 'usr-col-2',
      assigned_collector_name: 'Anita Shinde',
      reward_points: 25,
      reward_status: 'PENDING',
      admin_notes: 'Anita Shinde currently on site with organic composting cart.',
      created_at: getPastIso(5),
      updated_at: getPastIso(1)
    },
    {
      id: 'rep-012',
      user_id: 'usr-cit-5',
      user_name: 'Vikram Joshi',
      category: 'Plastic Waste',
      description: 'Discarded mineral water bottles and snack packets beside public garden benches.',
      image_url: garbageImages[0],
      latitude: 18.5596,
      longitude: 73.7799,
      address: 'Bio Diversity Park Trail, Baner',
      area: 'Baner',
      city: 'Pune',
      status: 'VERIFIED',
      ai_detected: 1,
      ai_confidence: 0.96,
      ai_category: 'Plastic Waste',
      ai_severity: 'Low',
      ai_labels: JSON.stringify(['water bottles', 'chips packets', 'benches litter']),
      ai_clean_confidence: 0.08,
      assigned_collector_id: null,
      assigned_collector_name: null,
      reward_points: 10,
      reward_status: 'PENDING',
      admin_notes: 'Scheduled for morning sweep.',
      created_at: getPastIso(2),
      updated_at: getPastIso(2)
    },
    {
      id: 'rep-013',
      user_id: 'usr-cit-2',
      user_name: 'Priya Patel',
      category: 'Household Waste',
      description: 'Old mattresses and broken furniture dumped on corner plot.',
      image_url: garbageImages[5],
      latitude: 18.6279,
      longitude: 73.8009,
      address: 'Sector 24, Near Spine Road, Pimpri',
      area: 'Pimpri',
      city: 'Pune',
      status: 'ASSIGNED',
      ai_detected: 1,
      ai_confidence: 0.93,
      ai_category: 'Household Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['furniture debris', 'broken mattress', 'wood scrap']),
      ai_clean_confidence: 0.02,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Heavy vehicle truck assigned.',
      created_at: getPastIso(7),
      updated_at: getPastIso(3)
    },
    {
      id: 'rep-014',
      user_id: 'usr-cit-3',
      user_name: 'Amit Verma',
      category: 'Plastic Waste',
      description: 'Scattered thermo-foam cups and party plates after weekend event.',
      image_url: garbageImages[3],
      latitude: 18.5173,
      longitude: 73.8415,
      address: 'Sambhaji Park Rear Side, Deccan Gymkhana',
      area: 'Deccan Gymkhana',
      city: 'Pune',
      status: 'CLEANED',
      ai_detected: 1,
      ai_confidence: 0.97,
      ai_category: 'Plastic Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['thermocol plates', 'plastic cups', 'event refuse']),
      ai_clean_confidence: 0.01,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 70,
      reward_status: 'CREDITED',
      admin_notes: 'Completely cleaned and segregated for recycling.',
      created_at: getPastIso(60),
      updated_at: getPastIso(20)
    },
    {
      id: 'rep-015',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Mixed Waste',
      description: 'Unsegregated neighborhood waste accumulation attracting stray animals.',
      image_url: garbageImages[2],
      latitude: 18.5089,
      longitude: 73.9259,
      address: 'Solapur Highway By-lane, Hadapsar',
      area: 'Hadapsar',
      city: 'Pune',
      status: 'CLOSED',
      ai_detected: 1,
      ai_confidence: 0.95,
      ai_category: 'Mixed Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['mixed waste', 'scattered bags', 'stray animal feeding']),
      ai_clean_confidence: 0.02,
      assigned_collector_id: 'usr-col-3',
      assigned_collector_name: 'Mahesh Patil',
      reward_points: 70,
      reward_status: 'CREDITED',
      admin_notes: 'Report resolved and closed with citizen sign-off.',
      created_at: getPastIso(90),
      updated_at: getPastIso(30)
    },
    {
      id: 'rep-016',
      user_id: 'usr-cit-4',
      user_name: 'Sneha Kulkarni',
      category: 'Plastic Waste',
      description: 'Littered plastic pouches alongside school boundary wall.',
      image_url: garbageImages[0],
      latitude: 18.5679,
      longitude: 73.9143,
      address: 'Row House 12, Symbiosis Road, Viman Nagar',
      area: 'Viman Nagar',
      city: 'Pune',
      status: 'PENDING AI VERIFICATION',
      ai_detected: 1,
      ai_confidence: 0.89,
      ai_category: 'Plastic Waste',
      ai_severity: 'Low',
      ai_labels: JSON.stringify(['plastic wrappers', 'pouch packaging']),
      ai_clean_confidence: 0.09,
      assigned_collector_id: null,
      assigned_collector_name: null,
      reward_points: 10,
      reward_status: 'PENDING',
      admin_notes: null,
      created_at: getPastIso(1),
      updated_at: getPastIso(1)
    },
    {
      id: 'rep-017',
      user_id: 'usr-cit-5',
      user_name: 'Vikram Joshi',
      category: 'Construction Waste',
      description: 'Demolition stone chunks left on sidewalk after trench digging.',
      image_url: garbageImages[1],
      latitude: 18.5314,
      longitude: 73.8446,
      address: 'Ferguson College Road Corner, Shivajinagar',
      area: 'Shivajinagar',
      city: 'Pune',
      status: 'COLLECTOR ON THE WAY',
      ai_detected: 1,
      ai_confidence: 0.94,
      ai_category: 'Construction Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['stones', 'digging rubble', 'pavement hazard']),
      ai_clean_confidence: 0.03,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Urgent clearance ordered.',
      created_at: getPastIso(4),
      updated_at: getPastIso(1)
    },
    {
      id: 'rep-018',
      user_id: 'usr-cit-2',
      user_name: 'Priya Patel',
      category: 'E-Waste',
      description: 'Broken tube lights and mercury vapor lamps cracked on street edge.',
      image_url: garbageImages[2],
      latitude: 18.5912,
      longitude: 73.7389,
      address: 'Wakad-Hinjawadi Flyover Bridge Pillar 14',
      area: 'Hinjawadi',
      city: 'Pune',
      status: 'CLEANING IN PROGRESS',
      ai_detected: 1,
      ai_confidence: 0.96,
      ai_category: 'E-Waste',
      ai_severity: 'Critical',
      ai_labels: JSON.stringify(['fluorescent tubes', 'mercury hazard', 'glass shards']),
      ai_clean_confidence: 0.01,
      assigned_collector_id: 'usr-col-2',
      assigned_collector_name: 'Anita Shinde',
      reward_points: 50,
      reward_status: 'PENDING',
      admin_notes: 'Protective gear equipped.',
      created_at: getPastIso(3),
      updated_at: getPastIso(1)
    },
    {
      id: 'rep-019',
      user_id: 'usr-cit-3',
      user_name: 'Amit Verma',
      category: 'Food Waste',
      description: 'Rotting canteen leftovers dumped outside banquet premises.',
      image_url: garbageImages[4],
      latitude: 18.5074,
      longitude: 73.8077,
      address: 'Near D-Mart Circle, Kothrud',
      area: 'Kothrud',
      city: 'Pune',
      status: 'CLOSED',
      ai_detected: 1,
      ai_confidence: 0.92,
      ai_category: 'Food Waste',
      ai_severity: 'Medium',
      ai_labels: JSON.stringify(['food waste', 'catering boxes']),
      ai_clean_confidence: 0.04,
      assigned_collector_id: 'usr-col-2',
      assigned_collector_name: 'Anita Shinde',
      reward_points: 45,
      reward_status: 'CREDITED',
      admin_notes: 'Closed after community verification.',
      created_at: getPastIso(120),
      updated_at: getPastIso(40)
    },
    {
      id: 'rep-020',
      user_id: 'usr-cit-1',
      user_name: 'Rahul Sharma',
      category: 'Plastic Waste',
      description: 'High volume plastic bottle waste near lake view amphitheater.',
      image_url: garbageImages[0],
      latitude: 18.4575,
      longitude: 73.8677,
      address: 'Lake Garden Gate 2, Katraj',
      area: 'Katraj',
      city: 'Pune',
      status: 'CLOSED',
      ai_detected: 1,
      ai_confidence: 0.98,
      ai_category: 'Plastic Waste',
      ai_severity: 'High',
      ai_labels: JSON.stringify(['plastic bottles', 'beverage refuse', 'litter zone']),
      ai_clean_confidence: 0.01,
      assigned_collector_id: 'usr-col-1',
      assigned_collector_name: 'Suresh Kumar',
      reward_points: 70,
      reward_status: 'CREDITED',
      admin_notes: 'Cleaned and 2 new recycling bins installed.',
      created_at: getPastIso(140),
      updated_at: getPastIso(50)
    }
  ];

  const insertReport = db.prepare(`
    INSERT INTO reports (
      id, user_id, user_name, category, description, image_url, latitude, longitude,
      address, area, city, status, ai_detected, ai_confidence, ai_category, ai_severity,
      ai_labels, ai_clean_confidence, assigned_collector_id, assigned_collector_name,
      reward_points, reward_status, admin_notes, created_at, updated_at
    ) VALUES (
      @id, @user_id, @user_name, @category, @description, @image_url, @latitude, @longitude,
      @address, @area, @city, @status, @ai_detected, @ai_confidence, @ai_category, @ai_severity,
      @ai_labels, @ai_clean_confidence, @assigned_collector_id, @assigned_collector_name,
      @reward_points, @reward_status, @admin_notes, @created_at, @updated_at
    )
  `);
  reports.forEach((r) => insertReport.run(r));

  // 5. Seed Cleaning Evidence for Cleaned & Closed reports
  const cleanedReports = reports.filter((r) => r.status === 'CLEANED' || r.status === 'CLOSED');
  const insertEvidence = db.prepare(`
    INSERT INTO cleaning_evidence (
      id, report_id, collector_id, collector_name, before_image_url, after_image_url,
      cleaning_notes, waste_weight_kg, cleaned_at, verified_by_admin, admin_verified_at
    ) VALUES (
      @id, @report_id, @collector_id, @collector_name, @before_image_url, @after_image_url,
      @cleaning_notes, @waste_weight_kg, @cleaned_at, @verified_by_admin, @admin_verified_at
    )
  `);

  cleanedReports.forEach((cr, index) => {
    insertEvidence.run({
      id: `evd-${cr.id}`,
      report_id: cr.id,
      collector_id: cr.assigned_collector_id || 'usr-col-1',
      collector_name: cr.assigned_collector_name || 'Suresh Kumar',
      before_image_url: cr.image_url,
      after_image_url: cleanedImages[index % cleanedImages.length],
      cleaning_notes: `Site cleared thoroughly, power-washed and disinfected. Segregated ${cr.category} for recycling.`,
      waste_weight_kg: +(15 + index * 4.5).toFixed(1),
      cleaned_at: cr.updated_at,
      verified_by_admin: 1,
      admin_verified_at: cr.updated_at
    });
  });

  // 6. Seed Rewards Catalog
  const rewardsCatalog = [
    {
      id: 'rew-1',
      title: 'Digital Cleanliness Hero Badge',
      description: 'Official digital verified badge for your profile and social media.',
      points_cost: 100,
      type: 'badge',
      icon: '🌱',
      partner_name: 'Pune Smart City',
      code: 'BADGE-HERO-100',
      is_active: 1
    },
    {
      id: 'rew-2',
      title: 'Community Champion Shield',
      description: 'Gold tier recognition badge plus public showcase on CleanSight leaderboard.',
      points_cost: 250,
      type: 'badge',
      icon: '🏆',
      partner_name: 'Municipal Swachh Council',
      code: 'BADGE-CHAMP-250',
      is_active: 1
    },
    {
      id: 'rew-3',
      title: '₹200 Green Partner Grocery Voucher',
      description: 'Redeemable at Nature Basket and Sahyadri Farms for organic produce.',
      points_cost: 500,
      type: 'coupon',
      icon: '🛒',
      partner_name: 'Sahyadri Organic Mart',
      code: 'GREEN200-SWACHH',
      is_active: 1
    },
    {
      id: 'rew-4',
      title: 'City Metro / Bus 1-Month Green Pass',
      description: 'Get 50% discount on Pune Metro / PMPML monthly eco-commute pass.',
      points_cost: 750,
      type: 'coupon',
      icon: '🚇',
      partner_name: 'Maha Metro Rail',
      code: 'METROPASS-ECO50',
      is_active: 1
    },
    {
      id: 'rew-5',
      title: 'Official Municipal Commissioner Honor Certificate',
      description: 'Framed formal civic commendation signed by Municipal Commissioner.',
      points_cost: 1000,
      type: 'recognition',
      icon: '📜',
      partner_name: 'Pune Municipal Corporation',
      code: 'PMC-HONOR-COMM',
      is_active: 1
    }
  ];

  const insertReward = db.prepare(`
    INSERT INTO rewards (id, title, description, points_cost, type, icon, partner_name, code, is_active)
    VALUES (@id, @title, @description, @points_cost, @type, @icon, @partner_name, @code, @is_active)
  `);
  rewardsCatalog.forEach((r) => insertReward.run(r));

  // 7. Seed Reward Transactions (10 transactions)
  const transactions = [
    { id: 'tx-01', user_id: 'usr-cit-1', report_id: 'rep-001', amount: 70, type: 'EARNED', reason: 'Verified Report & Before/After bonus', badge_unlocked: 'Eco Warrior', created_at: getPastIso(12) },
    { id: 'tx-02', user_id: 'usr-cit-1', report_id: 'rep-002', amount: 45, type: 'EARNED', reason: 'Verified Medium Food Waste Cleaned', badge_unlocked: null, created_at: getPastIso(8) },
    { id: 'tx-03', user_id: 'usr-cit-1', report_id: null, amount: -250, type: 'REDEEMED', reason: 'Redeemed Community Champion Shield', badge_unlocked: 'Community Champion', created_at: getPastIso(20) },
    { id: 'tx-04', user_id: 'usr-cit-2', report_id: 'rep-008', amount: 70, type: 'EARNED', reason: 'Verified Mixed Waste Cleaned', badge_unlocked: 'Waste Watcher', created_at: getPastIso(6) },
    { id: 'tx-05', user_id: 'usr-cit-3', report_id: 'rep-009', amount: 70, type: 'EARNED', reason: 'Verified Plastic Drainage Clearance', badge_unlocked: 'Waste Watcher', created_at: getPastIso(16) },
    { id: 'tx-06', user_id: 'usr-cit-3', report_id: 'rep-014', amount: 70, type: 'EARNED', reason: 'High Severity Cleanup Verification', badge_unlocked: null, created_at: getPastIso(20) },
    { id: 'tx-07', user_id: 'usr-cit-1', report_id: 'rep-015', amount: 70, type: 'EARNED', reason: 'Verified Cleanup resolution', badge_unlocked: 'Clean City Champion', created_at: getPastIso(30) },
    { id: 'tx-08', user_id: 'usr-cit-1', report_id: null, amount: -500, type: 'REDEEMED', reason: 'Redeemed ₹200 Green Partner Grocery Voucher', badge_unlocked: null, created_at: getPastIso(40) },
    { id: 'tx-09', user_id: 'usr-cit-4', report_id: null, amount: 50, type: 'EARNED', reason: 'Early Adopter Civic Onboarding Bonus', badge_unlocked: 'Green Starter', created_at: getPastIso(350) },
    { id: 'tx-10', user_id: 'usr-cit-5', report_id: null, amount: 50, type: 'EARNED', reason: 'Welcome Citizen Cleanliness Bonus', badge_unlocked: 'Green Starter', created_at: getPastIso(290) }
  ];

  const insertTx = db.prepare(`
    INSERT INTO reward_transactions (id, user_id, report_id, amount, type, reason, badge_unlocked, created_at)
    VALUES (@id, @user_id, @report_id, @amount, @type, @reason, @badge_unlocked, @created_at)
  `);
  transactions.forEach((tx) => insertTx.run(tx));

  // 8. Seed Violations (5 violations)
  const violations = [
    {
      id: 'viol-01',
      report_id: 'rep-003',
      area: 'Shivajinagar Railway Margin',
      responsible_entity: 'Apex Real Estate & Infrastructure Ltd',
      entity_type: 'Contractor',
      violation_type: 'Construction Debris',
      description: 'Repeated unauthorized dumping of concrete rubble and shattered ceramic tiles onto public pedestrian pathway.',
      evidence_url: garbageImages[1],
      status: 'PENALTY_APPROVED',
      created_at: getPastIso(72)
    },
    {
      id: 'viol-02',
      report_id: 'rep-002',
      area: 'Baner High Street',
      responsible_entity: 'Shivaji Market Vegetable Merchants Guild',
      entity_type: 'Commercial',
      violation_type: 'Litter Spillover',
      description: 'Discharge of rotting vegetables and commercial food waste without mandatory wet-waste composting on site.',
      evidence_url: garbageImages[4],
      status: 'PENALTY_RECOMMENDED',
      created_at: getPastIso(48)
    },
    {
      id: 'viol-03',
      report_id: 'rep-010',
      area: 'Hadapsar Magarpatta Road',
      responsible_entity: 'Royal Residency Cooperative Housing Society',
      entity_type: 'Residential',
      violation_type: 'Illegal Dumping',
      description: 'Unsegregated bulk domestic refuse bags repeatedly piled along exterior municipal drain boundary.',
      evidence_url: garbageImages[5],
      status: 'WARNING_ISSUED',
      created_at: getPastIso(96)
    },
    {
      id: 'viol-04',
      report_id: 'rep-004',
      area: 'Hinjawadi Phase 1',
      responsible_entity: 'ElectroFix Refurbishers Pvt Ltd',
      entity_type: 'Commercial',
      violation_type: 'Commercial Waste Abandonment',
      description: 'Abandonment of toxic PCB circuit boards and discarded cathode materials in open public lot.',
      evidence_url: garbageImages[2],
      status: 'PENALTY_APPROVED',
      created_at: getPastIso(120)
    },
    {
      id: 'viol-05',
      report_id: 'rep-007',
      area: 'Shivajinagar Clinic Zone',
      responsible_entity: 'City Healthcare Diagnostic Lab',
      entity_type: 'Institution',
      violation_type: 'Illegal Dumping',
      description: 'Improper disposal of biohazard gloves and chemical packaging without authorized medical incinerator pickup.',
      evidence_url: garbageImages[2],
      status: 'UNDER_REVIEW',
      created_at: getPastIso(12)
    }
  ];

  const insertViol = db.prepare(`
    INSERT INTO violations (id, report_id, area, responsible_entity, entity_type, violation_type, description, evidence_url, status, created_at)
    VALUES (@id, @report_id, @area, @responsible_entity, @entity_type, @violation_type, @description, @evidence_url, @status, @created_at)
  `);
  violations.forEach((v) => insertViol.run(v));

  // 9. Seed Penalties (3 verified penalties)
  const penalties = [
    {
      id: 'pen-01',
      violation_id: 'viol-01',
      area: 'Shivajinagar Railway Margin',
      responsible_entity: 'Apex Real Estate & Infrastructure Ltd',
      verified_violations_count: 8,
      warnings_count: 2,
      amount: 15000.0,
      severity_tier: 'High Penalty',
      status: 'Approved',
      approved_by: 'Rajesh Deshmukh (Municipal Commissioner)',
      issued_at: getPastIso(48),
      due_at: getPastIso(-240) // 10 days in future
    },
    {
      id: 'pen-02',
      violation_id: 'viol-02',
      area: 'Baner High Street',
      responsible_entity: 'Shivaji Market Vegetable Merchants Guild',
      verified_violations_count: 4,
      warnings_count: 2,
      amount: 5000.0,
      severity_tier: 'Medium Penalty',
      status: 'Under Review',
      approved_by: 'Dr. Sunita Rao (Sanitation Director)',
      issued_at: getPastIso(24),
      due_at: getPastIso(-360)
    },
    {
      id: 'pen-03',
      violation_id: 'viol-04',
      area: 'Hinjawadi Phase 1',
      responsible_entity: 'ElectroFix Refurbishers Pvt Ltd',
      verified_violations_count: 3,
      warnings_count: 1,
      amount: 10000.0,
      severity_tier: 'High Penalty',
      status: 'Approved',
      approved_by: 'Rajesh Deshmukh (Municipal Commissioner)',
      issued_at: getPastIso(72),
      due_at: getPastIso(-120)
    }
  ];

  const insertPen = db.prepare(`
    INSERT INTO penalties (id, violation_id, area, responsible_entity, verified_violations_count, warnings_count, amount, severity_tier, status, approved_by, issued_at, due_at)
    VALUES (@id, @violation_id, @area, @responsible_entity, @verified_violations_count, @warnings_count, @amount, @severity_tier, @status, @approved_by, @issued_at, @due_at)
  `);
  penalties.forEach((p) => insertPen.run(p));

  // 10. Seed Notifications
  const notifications = [
    {
      id: 'notif-1',
      user_id: 'usr-cit-1',
      title: 'Report #rep-001 Cleaned & Verified!',
      message: 'Collector Anita Shinde cleaned the garbage at Kothrud Bus Depot. +70 Reward Points added!',
      type: 'REWARD',
      is_read: 0,
      report_id: 'rep-001',
      created_at: getPastIso(12)
    },
    {
      id: 'notif-2',
      user_id: 'usr-cit-1',
      title: 'Report #rep-002 Cleaned!',
      message: 'Baner High Street waste resolved. +45 Reward Points credited to your account.',
      type: 'REWARD',
      is_read: 1,
      report_id: 'rep-002',
      created_at: getPastIso(8)
    },
    {
      id: 'notif-3',
      user_id: 'usr-cit-1',
      title: 'Badge Unlocked: Clean City Champion',
      message: 'Congratulations! You have climbed into the Top 3 Clean City Heroes with 1,850 points!',
      type: 'REWARD',
      is_read: 0,
      report_id: null,
      created_at: getPastIso(20)
    },
    {
      id: 'notif-4',
      user_id: 'usr-col-1',
      title: 'New Priority Task Assigned',
      message: 'Report #rep-003 (Construction Debris at Shivajinagar) assigned to you for collection.',
      type: 'TASK_ASSIGNED',
      is_read: 0,
      report_id: 'rep-003',
      created_at: getPastIso(4)
    },
    {
      id: 'notif-5',
      user_id: 'usr-adm-1',
      title: 'Hotspot Alert: Shivajinagar',
      message: '18 unresolved reports in Shivajinagar Railway Margin. Cleanliness score dropped to 32.',
      type: 'SYSTEM',
      is_read: 0,
      report_id: null,
      created_at: getPastIso(1)
    }
  ];

  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, is_read, report_id, created_at)
    VALUES (@id, @user_id, @title, @message, @type, @is_read, @report_id, @created_at)
  `);
  notifications.forEach((n) => insertNotif.run(n));

  // 11. Seed System Settings
  const settings = [
    { key: 'REWARD_LOW_SEVERITY', value: '10' },
    { key: 'REWARD_MEDIUM_SEVERITY', value: '25' },
    { key: 'REWARD_HIGH_SEVERITY', value: '50' },
    { key: 'REWARD_HOTSPOT_BONUS', value: '100' },
    { key: 'REWARD_EVIDENCE_BONUS', value: '20' },
    { key: 'PENALTY_WARNING_THRESHOLD', value: '1' },
    { key: 'PENALTY_LOW_AMOUNT', value: '2000' },
    { key: 'PENALTY_MEDIUM_AMOUNT', value: '5000' },
    { key: 'PENALTY_HIGH_AMOUNT', value: '15000' }
  ];

  const insertSetting = db.prepare(`
    INSERT OR REPLACE INTO system_settings (key, value) VALUES (@key, @value)
  `);
  settings.forEach((s) => insertSetting.run(s));

  console.log('✅ Demo database seeded successfully with 20 reports, 10 users, 5 hotspots, penalties & rewards!');
}
