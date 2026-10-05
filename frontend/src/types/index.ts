export type UserRole = 'citizen' | 'collector' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  city?: string;
  points: number;
  rank: string;
  created_at?: string;
  stats?: {
    totalReports: number;
    verifiedReports: number;
    cleanedReports: number;
  };
}

export type ReportStatus =
  | 'PENDING AI VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'COLLECTOR ON THE WAY'
  | 'CLEANING IN PROGRESS'
  | 'CLEANED'
  | 'CLOSED';

export type GarbageCategory =
  | 'Plastic Waste'
  | 'Food Waste'
  | 'Construction Waste'
  | 'E-Waste'
  | 'Household Waste'
  | 'Medical Waste'
  | 'Mixed Waste'
  | 'Other';

export interface CleaningEvidence {
  id: string;
  report_id: string;
  collector_id: string;
  collector_name: string;
  before_image_url: string;
  after_image_url: string;
  cleaning_notes?: string;
  waste_weight_kg?: number;
  cleaned_at: string;
  verified_by_admin: number;
  admin_verified_at?: string;
}

export interface Report {
  id: string;
  user_id: string;
  user_name: string;
  category: GarbageCategory;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  status: ReportStatus;
  ai_detected: number;
  ai_confidence: number;
  ai_category: string;
  ai_severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ai_labels: string;
  ai_clean_confidence: number;
  assigned_collector_id?: string;
  assigned_collector_name?: string;
  reward_points: number;
  reward_status: 'PENDING' | 'APPROVED' | 'CREDITED';
  admin_notes?: string;
  rejection_reason?: string;
  fraud_flag: number;
  fraud_reason?: string;
  created_at: string;
  updated_at: string;
  evidence?: CleaningEvidence | null;
}

export interface Hotspot {
  id: string;
  area_name: string;
  city: string;
  latitude: number;
  longitude: number;
  total_reports: number;
  unresolved_reports: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  cleanliness_score: number;
  last_reported_at?: string;
}

export interface AreaStatistic {
  id: string;
  area_name: string;
  cleanliness_score: number;
  total_reports: number;
  cleaned_count: number;
  avg_resolution_hours: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  type: 'badge' | 'coupon' | 'recognition' | 'certificate';
  icon: string;
  partner_name?: string;
  code?: string;
  is_active: number;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  report_id?: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS';
  reason: string;
  badge_unlocked?: string;
  created_at: string;
}

export interface Violation {
  id: string;
  report_id?: string;
  area: string;
  responsible_entity: string;
  entity_type: string;
  violation_type: string;
  description: string;
  evidence_url: string;
  status: 'UNDER_REVIEW' | 'WARNING_ISSUED' | 'PENALTY_RECOMMENDED' | 'PENALTY_APPROVED' | 'RESOLVED';
  created_at: string;
  address?: string;
  garbage_category?: string;
  ai_severity?: string;
}

export interface Penalty {
  id: string;
  violation_id: string;
  area: string;
  responsible_entity: string;
  verified_violations_count: number;
  warnings_count: number;
  amount: number;
  severity_tier: 'Warning' | 'Low Penalty' | 'Medium Penalty' | 'High Penalty';
  status: 'Under Review' | 'Approved' | 'Paid' | 'Disputed';
  approved_by?: string;
  issued_at: string;
  due_at?: string;
  violation_description?: string;
  violation_type?: string;
  entity_type?: string;
  evidence_url?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'REPORT_STATUS' | 'REWARD' | 'TASK_ASSIGNED' | 'PENALTY' | 'SYSTEM';
  is_read: number;
  report_id?: string;
  created_at: string;
}

export interface AiDetectionResponse {
  success: boolean;
  detected: boolean;
  confidence: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  labels: string[];
  estimatedWeightKg: number;
  hotspotLikelihood: 'Low' | 'Medium' | 'High';
  summary: string;
  recommendation: string;
  imageUrl?: string;
}
