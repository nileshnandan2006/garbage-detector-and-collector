import { Router } from 'express';
import { register, login, firebaseLogin, getCurrentUser, getDemoCredentials } from '../controllers/authController.js';
import { detectGarbageEndpoint } from '../controllers/aiController.js';
import { createReport, getAllReports, getReportById, verifyReport, assignCollector } from '../controllers/reportController.js';
import { getCollectorTasks, updateTaskStatus, completeTask } from '../controllers/taskController.js';
import { getRewardsCatalog, getRewardHistory, redeemReward, getLeaderboard } from '../controllers/rewardController.js';
import { getHotspots, getCleanlinessScores } from '../controllers/hotspotController.js';
import { getViolations, createViolation, getPenalties, updatePenaltyStatus } from '../controllers/penaltyController.js';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { getAdminStatistics, getCollectorsList, getSettings, updateSettings } from '../controllers/adminController.js';
import { getImpactMetrics } from '../controllers/impactController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/firebase-login', firebaseLogin);
router.get('/auth/me', authenticate, getCurrentUser);
router.get('/auth/demo-users', getDemoCredentials);

// --- AI Detection Route ---
router.post('/detect-garbage', upload.single('image'), detectGarbageEndpoint);

// --- Reports Routes ---
router.post('/reports', authenticate, upload.single('image'), createReport);
router.get('/reports', getAllReports);
router.get('/reports/:id', getReportById);
router.post('/reports/:id/verify', authenticate, requireRole('admin'), verifyReport);
router.post('/reports/:id/assign', authenticate, requireRole('admin'), assignCollector);

// --- Collector Tasks Routes ---
router.get('/tasks', authenticate, requireRole('collector', 'admin'), getCollectorTasks);
router.patch('/tasks/:id/status', authenticate, requireRole('collector', 'admin'), updateTaskStatus);
router.post('/tasks/:id/complete', authenticate, requireRole('collector', 'admin'), upload.single('after_image'), completeTask);

// --- Rewards & Leaderboard Routes ---
router.get('/rewards', getRewardsCatalog);
router.get('/rewards/history', authenticate, getRewardHistory);
router.post('/rewards/redeem', authenticate, redeemReward);
router.get('/leaderboard', getLeaderboard);

// --- Hotspots & Cleanliness Scores ---
router.get('/hotspots', getHotspots);
router.get('/cleanliness-scores', getCleanlinessScores);

// --- Violations & Penalties ---
router.get('/violations', getViolations);
router.post('/violations', authenticate, requireRole('admin'), createViolation);
router.get('/penalties', getPenalties);
router.patch('/penalties/:id', authenticate, requireRole('admin'), updatePenaltyStatus);

// --- Notifications ---
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markAsRead);
router.post('/notifications/mark-all-read', authenticate, markAllAsRead);

// --- Admin Endpoints ---
router.get('/admin/statistics', authenticate, requireRole('admin'), getAdminStatistics);
router.get('/admin/collectors', authenticate, requireRole('admin'), getCollectorsList);
router.get('/admin/settings', authenticate, requireRole('admin'), getSettings);
router.post('/admin/settings', authenticate, requireRole('admin'), updateSettings);

// --- Impact ---
router.get('/impact', getImpactMetrics);

export default router;
