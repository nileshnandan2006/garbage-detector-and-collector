import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. User
export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'citizen' | 'collector' | 'admin';
  avatar?: string;
  phone?: string;
  city: string;
  points: number;
  rank: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'collector', 'admin'], default: 'citizen' },
  avatar: { type: String },
  phone: { type: String },
  city: { type: String, default: 'Pune' },
  points: { type: Number, default: 0 },
  rank: { type: String, default: 'Eco Cadet' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Report
export interface IReport extends Document {
  id: string;
  userId: string;
  userName: string;
  category: string;
  description?: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  status: string;
  aiDetected: boolean;
  aiConfidence: number;
  aiCategory?: string;
  aiSeverity: string;
  aiLabels: string[];
  aiCleanConfidence: number;
  assignedCollectorId?: string;
  assignedCollectorName?: string;
  rewardPoints: number;
  rewardStatus: string;
  adminNotes?: string;
  rejectionReason?: string;
  fraudFlag: boolean;
  fraudReason?: string;
  imageHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true, index: true },
  city: { type: String, default: 'Pune' },
  status: {
    type: String,
    enum: [
      'PENDING AI VERIFICATION',
      'VERIFIED',
      'REJECTED',
      'ASSIGNED',
      'COLLECTOR ON THE WAY',
      'CLEANING IN PROGRESS',
      'CLEANED',
      'CLOSED'
    ],
    default: 'VERIFIED',
    index: true
  },
  aiDetected: { type: Boolean, default: true },
  aiConfidence: { type: Number, default: 0.94 },
  aiCategory: { type: String },
  aiSeverity: { type: String, default: 'High' },
  aiLabels: [{ type: String }],
  aiCleanConfidence: { type: Number, default: 0.05 },
  assignedCollectorId: { type: String },
  assignedCollectorName: { type: String },
  rewardPoints: { type: Number, default: 50 },
  rewardStatus: { type: String, default: 'PENDING' },
  adminNotes: { type: String },
  rejectionReason: { type: String },
  fraudFlag: { type: Boolean, default: false },
  fraudReason: { type: String },
  imageHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 3. Cleaning Evidence
export interface ICleaningEvidence extends Document {
  id: string;
  reportId: string;
  collectorId: string;
  collectorName: string;
  beforeImageUrl?: string;
  afterImageUrl: string;
  cleaningNotes?: string;
  wasteWeightKg: number;
  cleanedAt: Date;
  verifiedByAdmin: boolean;
  adminVerificationNotes?: string;
}

const CleaningEvidenceSchema = new Schema<ICleaningEvidence>({
  id: { type: String, required: true, unique: true, index: true },
  reportId: { type: String, required: true, index: true },
  collectorId: { type: String, required: true },
  collectorName: { type: String, required: true },
  beforeImageUrl: { type: String },
  afterImageUrl: { type: String, required: true },
  cleaningNotes: { type: String },
  wasteWeightKg: { type: Number, default: 15.0 },
  cleanedAt: { type: Date, default: Date.now },
  verifiedByAdmin: { type: Boolean, default: false },
  adminVerificationNotes: { type: String }
});

// 4. Hotspot
export interface IHotspot extends Document {
  id: string;
  areaName: string;
  city: string;
  latitude: number;
  longitude: number;
  totalReports: number;
  unresolvedReports: number;
  severity: string;
  cleanlinessScore: number;
  updatedAt: Date;
}

const HotspotSchema = new Schema<IHotspot>({
  id: { type: String, required: true, unique: true },
  areaName: { type: String, required: true, unique: true },
  city: { type: String, default: 'Pune' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  totalReports: { type: Number, default: 0 },
  unresolvedReports: { type: Number, default: 0 },
  severity: { type: String, default: 'Medium' },
  cleanlinessScore: { type: Number, default: 70 },
  updatedAt: { type: Date, default: Date.now }
});

// 5. Violation & Penalty
export interface IPenalty extends Document {
  id: string;
  violationId: string;
  area: string;
  responsibleEntity: string;
  verifiedViolationsCount: number;
  warningsCount: number;
  amount: number;
  severityTier: string;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

const PenaltySchema = new Schema<IPenalty>({
  id: { type: String, required: true, unique: true },
  violationId: { type: String, required: true },
  area: { type: String, required: true },
  responsibleEntity: { type: String, required: true },
  verifiedViolationsCount: { type: Number, default: 1 },
  warningsCount: { type: Number, default: 0 },
  amount: { type: Number, default: 5000 },
  severityTier: { type: String, default: 'First Warning' },
  status: { type: String, default: 'Pending Review' },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// 6. Reward & Redemption
export interface IReward extends Document {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: string;
  icon: string;
  partnerName?: string;
  code?: string;
}

const RewardSchema = new Schema<IReward>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pointsCost: { type: Number, required: true },
  type: { type: String, required: true },
  icon: { type: String, required: true },
  partnerName: { type: String },
  code: { type: String }
});

// 7. Notification
export interface INotification extends Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  reportId?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  isRead: { type: Boolean, default: false },
  reportId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Export Mongoose Models
export const MongoUser: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const MongoReport: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
export const MongoCleaningEvidence: Model<ICleaningEvidence> = mongoose.models.CleaningEvidence || mongoose.model<ICleaningEvidence>('CleaningEvidence', CleaningEvidenceSchema);
export const MongoHotspot: Model<IHotspot> = mongoose.models.Hotspot || mongoose.model<IHotspot>('Hotspot', HotspotSchema);
export const MongoPenalty: Model<IPenalty> = mongoose.models.Penalty || mongoose.model<IPenalty>('Penalty', PenaltySchema);
export const MongoReward: Model<IReward> = mongoose.models.Reward || mongoose.model<IReward>('Reward', RewardSchema);
export const MongoNotification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
