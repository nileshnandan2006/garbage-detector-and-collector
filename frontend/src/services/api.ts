const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('cleansight_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('cleansight_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('cleansight_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // If not FormData, default content-type is application/json
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network request failed.' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  firebaseLogin: (data: any) => request<any>('/auth/firebase-login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),
  getDemoUsers: () => request<any>('/auth/demo-users'),

  // AI Detection
  detectGarbage: (formData: FormData) =>
    request<any>('/detect-garbage', { method: 'POST', body: formData }),

  // Reports
  createReport: (formData: FormData) =>
    request<any>('/reports', { method: 'POST', body: formData }),
  getReports: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params || {});
    return request<any>(`/reports?${searchParams.toString()}`);
  },
  getReportById: (id: string) => request<any>(`/reports/${id}`),
  verifyReport: (id: string, data: { action: 'VERIFY' | 'REJECT'; notes?: string; rejection_reason?: string }) =>
    request<any>(`/reports/${id}/verify`, { method: 'POST', body: JSON.stringify(data) }),
  assignCollector: (id: string, collectorId: string) =>
    request<any>(`/reports/${id}/assign`, { method: 'POST', body: JSON.stringify({ collector_id: collectorId }) }),

  // Tasks (Collector)
  getTasks: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params || {});
    return request<any>(`/tasks?${searchParams.toString()}`);
  },
  updateTaskStatus: (id: string, status: string) =>
    request<any>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  completeTask: (id: string, formData: FormData) =>
    request<any>(`/tasks/${id}/complete`, { method: 'POST', body: formData }),

  // Rewards
  getRewards: () => request<any>('/rewards'),
  getRewardHistory: () => request<any>('/rewards/history'),
  redeemReward: (rewardId: string) =>
    request<any>('/rewards/redeem', { method: 'POST', body: JSON.stringify({ reward_id: rewardId }) }),
  getLeaderboard: (filter = 'all-time') => request<any>(`/leaderboard?filter=${filter}`),

  // Hotspots & Cleanliness
  getHotspots: () => request<any>('/hotspots'),
  getCleanlinessScores: () => request<any>('/cleanliness-scores'),

  // Violations & Penalties
  getViolations: () => request<any>('/violations'),
  createViolation: (data: any) => request<any>('/violations', { method: 'POST', body: JSON.stringify(data) }),
  getPenalties: () => request<any>('/penalties'),
  updatePenaltyStatus: (id: string, status: string, amount?: number) =>
    request<any>(`/penalties/${id}`, { method: 'PATCH', body: JSON.stringify({ status, amount }) }),

  // Notifications
  getNotifications: () => request<any>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request<any>('/notifications/mark-all-read', { method: 'POST' }),

  // Admin
  getAdminStats: () => request<any>('/admin/statistics'),
  getCollectorsList: () => request<any>('/admin/collectors'),
  getSettings: () => request<any>('/admin/settings'),
  updateSettings: (data: any) => request<any>('/admin/settings', { method: 'POST', body: JSON.stringify(data) }),

  // Impact
  getImpact: () => request<any>('/impact')
};
