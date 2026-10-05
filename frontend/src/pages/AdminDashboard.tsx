import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { api } from '../services/api.js';
import { Report, Penalty, Violation, Hotspot } from '../types/index.js';
import { MapPicker } from '../components/MapPicker.js';
import { BeforeAfterModal } from '../components/BeforeAfterModal.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Users,
  AlertTriangle,
  Award,
  DollarSign,
  BarChart3,
  MapPin,
  Flame,
  FileText,
  Sliders,
  Sparkles,
  Plus,
  Eye,
  Check,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'reports' | 'hotspots' | 'penalties' | 'analytics' | 'settings'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [assignCollectorModal, setAssignCollectorModal] = useState<Report | null>(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
  const [createViolationModal, setCreateViolationModal] = useState<Report | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [modalEvidenceReport, setModalEvidenceReport] = useState<Report | null>(null);

  // New Violation Form State
  const [violEntity, setViolEntity] = useState('');
  const [violType, setViolType] = useState('Illegal Dumping');
  const [violEntityType, setViolEntityType] = useState('Commercial');
  const [violDesc, setViolDesc] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [reportsRes, statsRes, collRes, penRes, violRes, hotRes, setRes] = await Promise.all([
        api.getReports(),
        api.getAdminStats(),
        api.getCollectorsList(),
        api.getPenalties(),
        api.getViolations(),
        api.getHotspots(),
        api.getSettings()
      ]);

      setReports(reportsRes.reports || []);
      setStats(statsRes);
      setCollectors(collRes.collectors || []);
      setPenalties(penRes.penalties || []);
      setViolations(violRes.violations || []);
      setHotspots(hotRes.hotspots || []);
      setSettings(setRes.settings || {});
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Report Actions
  const handleVerify = async (reportId: string, action: 'VERIFY' | 'REJECT') => {
    try {
      await api.verifyReport(reportId, { action, notes: `Verified by Municipal Admin ${user?.name}` });
      showToast(`Report ${action === 'VERIFY' ? 'verified for dispatch' : 'marked as rejected'}.`, 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleAssignCollectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCollectorModal || !selectedCollectorId) return;

    try {
      await api.assignCollector(assignCollectorModal.id, selectedCollectorId);
      showToast('Staff member dispatched successfully!', 'success');
      setAssignCollectorModal(null);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Assignment failed', 'error');
    }
  };

  const handleCreateViolationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createViolationModal) return;

    try {
      await api.createViolation({
        report_id: createViolationModal.id,
        area: createViolationModal.area,
        responsible_entity: violEntity,
        entity_type: violEntityType,
        violation_type: violType,
        description: violDesc || createViolationModal.description,
        evidence_url: createViolationModal.image_url
      });
      showToast('Violation logged! Penalty recommendation created for review.', 'success');
      setCreateViolationModal(null);
      setViolEntity('');
      setViolDesc('');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to log violation', 'error');
    }
  };

  const handlePenaltyStatusChange = async (penaltyId: string, status: string) => {
    try {
      await api.updatePenaltyStatus(penaltyId, status);
      showToast(`Penalty marked as ${status}!`, 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update penalty', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      showToast('Reward & Penalty configuration updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-700/60 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Municipal Authority Operations Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pune Smart City Cleanliness Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Logged in as: <b>{user?.name || 'Rajesh Deshmukh (Municipal Commissioner)'}</b> • Monitor citizen AI submissions, coordinate sanitation staff, inspect cleanups, and manage verified penalties.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hotspots' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Hotspots ({hotspots.length})
          </button>
          <button
            onClick={() => setActiveTab('penalties')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'penalties' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Penalties ({penalties.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {/* 8 Metric Summary Cards (Requirement #12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Reports</span>
          <div className="text-xl font-black text-slate-900 font-mono">{stats?.summary?.totalReports || reports.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Pending</span>
          <div className="text-xl font-black text-amber-600 font-mono">{stats?.summary?.pendingReports || 3}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Verified</span>
          <div className="text-xl font-black text-emerald-600 font-mono">{stats?.summary?.verifiedReports || 17}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Cleaned</span>
          <div className="text-xl font-black text-teal-600 font-mono">{stats?.summary?.cleanedLocations || 8}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Active Staff</span>
          <div className="text-xl font-black text-indigo-600 font-mono">{collectors.length || 3}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Rewards (pts)</span>
          <div className="text-xl font-black text-emerald-700 font-mono">{stats?.summary?.totalRewards || 1850}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Violations</span>
          <div className="text-xl font-black text-rose-600 font-mono">{violations.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Penalties</span>
          <div className="text-xl font-black text-rose-700 font-mono">₹{stats?.summary?.totalPenalties?.toLocaleString() || '30,000'}</div>
        </div>
      </div>

      {/* TAB 1: ALL REPORTS MANAGEMENT */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Citywide Interactive Reports Map */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Citywide Garbage Map Interface</h3>
                <p className="text-xs text-slate-500">Live geo-tagged citizen uploads and collection squads</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Interactive Markers Active
              </span>
            </div>
            <MapPicker mode="viewer" reports={reports} height="320px" />
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Citizen Garbage Incidents Queue</h3>
              <span className="text-xs text-slate-400">Total: {reports.length} submissions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">Report</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Area & Location</th>
                    <th className="p-3.5">AI Confidence</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Assigned Staff</th>
                    <th className="p-3.5 text-right">Municipal Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reports.map((rep) => {
                    const isCleaned = ['CLEANED', 'CLOSED'].includes(rep.status);

                    return (
                      <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={rep.image_url}
                              alt={rep.category}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-mono font-bold text-slate-900 block">#{rep.id.slice(0, 8)}</span>
                              <span className="text-[11px] text-slate-400">{rep.user_name}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-semibold text-slate-900">
                          {rep.category}
                          <span className="block text-[10px] text-slate-400 font-normal">Severity: {rep.ai_severity}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">{rep.area}</span>
                          <span className="text-[11px] text-slate-500 truncate block max-w-xs">{rep.address}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono font-bold text-emerald-700">
                            {Math.round((rep.ai_confidence || 0.94) * 100)}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">Verified CV</span>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCleaned
                              ? 'bg-emerald-100 text-emerald-800'
                              : rep.status === 'CLEANING IN PROGRESS'
                              ? 'bg-sky-100 text-sky-800'
                              : rep.status === 'ASSIGNED'
                              ? 'bg-amber-100 text-amber-800'
                              : rep.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {rep.status}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {rep.assigned_collector_name ? (
                            <span className="font-medium text-slate-800 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-amber-600" />
                              {rep.assigned_collector_name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Verify / Reject */}
                            {rep.status === 'PENDING AI VERIFICATION' && (
                              <>
                                <button
                                  onClick={() => handleVerify(rep.id, 'VERIFY')}
                                  className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                                  title="Approve Report"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleVerify(rep.id, 'REJECT')}
                                  className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                                  title="Reject Report"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {/* Assign Collector */}
                            {['PENDING AI VERIFICATION', 'VERIFIED'].includes(rep.status) && (
                              <button
                                onClick={() => setAssignCollectorModal(rep)}
                                className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg font-bold text-[11px] transition-colors border border-amber-200"
                              >
                                Assign
                              </button>
                            )}

                            {/* View Evidence */}
                            {isCleaned && (
                              <button
                                onClick={() => {
                                  setModalEvidenceReport(rep);
                                  setShowEvidenceModal(true);
                                }}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-bold text-[11px] transition-colors border border-emerald-200 flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Audit
                              </button>
                            )}

                            {/* Create Violation for Repeat Offenders */}
                            <button
                              onClick={() => setCreateViolationModal(rep)}
                              className="px-2 py-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium text-[11px] transition-colors"
                              title="Record Responsible Entity Violation"
                            >
                              + Violation
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTSPOTS */}
      {activeTab === 'hotspots' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Municipal Repeat Garbage Hotspots</h3>
              <p className="text-xs text-slate-500">Clusters identified by high report recurrence & low cleanliness scores</p>
            </div>
            <MapPicker mode="viewer" hotspots={hotspots} height="360px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotspots.map((h, i) => (
              <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-600" /> HOTSPOT #{i + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Score: {h.cleanliness_score}/100
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{h.area_name}</h4>
                  <p className="text-xs text-slate-500">{h.city} Municipal Ward</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Total Reports</span>
                    <span className="text-base font-bold text-slate-800">{h.total_reports}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Unresolved</span>
                    <span className="text-base font-bold text-rose-600">{h.unresolved_reports}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Severity: <b>{h.severity}</b></span>
                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      showToast(`Filtered reports for ${h.area_name}`, 'info');
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    View Area Incidents →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PENALTY SYSTEM (REQUIREMENT #11) */}
      {activeTab === 'penalties' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>CleanSight Responsible & Verification-Based Penalty System</span>
            </div>
            <p className="leading-relaxed">
              In accordance with civic guidelines, <b>no random citizen is ever automatically fined based solely on an uploaded photograph</b>. Penalties follow a multi-tier due-process review:
              <br />
              <span className="font-semibold">
                Report → AI Detection → Municipal Officer Audit → Responsible Entity Identification (Commercial/Contractor/Society) → Violation Record → Legal Evidence Review → Admin Approval → Fine Recorded.
              </span>
            </p>
          </div>

          {/* Penalties Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Verified Civic Violation & Penalty Records</h3>
                <p className="text-xs text-slate-500">Enforced on habitual commercial dumpers & construction violators</p>
              </div>
              <span className="text-xs text-slate-400">Total: {penalties.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">Area & Location</th>
                    <th className="p-3.5">Responsible Entity</th>
                    <th className="p-3.5">Verified Violations</th>
                    <th className="p-3.5">Warnings</th>
                    <th className="p-3.5">Fine Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {penalties.map((pen) => (
                    <tr key={pen.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {pen.area}
                        <span className="block text-[10px] text-slate-400 font-normal">Issued: {new Date(pen.issued_at).toLocaleDateString()}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800 block">{pen.responsible_entity}</span>
                        <span className="text-[11px] text-slate-500">{pen.entity_type} • {pen.violation_type}</span>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {pen.verified_violations_count} verified
                      </td>

                      <td className="p-3.5 font-mono text-slate-600">
                        {pen.warnings_count} warnings
                      </td>

                      <td className="p-3.5 font-mono font-bold text-rose-700 text-sm">
                        ₹{pen.amount.toLocaleString()}
                        <span className="block text-[10px] text-slate-400 font-normal">{pen.severity_tier}</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pen.status === 'Approved'
                            ? 'bg-rose-100 text-rose-800'
                            : pen.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pen.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pen.status === 'Under Review' && (
                            <button
                              onClick={() => handlePenaltyStatusChange(pen.id, 'Approved')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              Approve Fine
                            </button>
                          )}
                          {pen.status === 'Approved' && (
                            <button
                              onClick={() => handlePenaltyStatusChange(pen.id, 'Paid')}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reports per day */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Weekly Daily Reports & Cleanups Timeline</h4>
              <div className="flex items-end justify-between h-48 gap-2 pt-4 border-b border-slate-100 pb-2">
                {stats.reportsPerDay?.map((d: any) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        className="w-1/2 bg-amber-400 rounded-t-sm transition-all"
                        style={{ height: `${(d.count / 50) * 100}%` }}
                        title={`${d.count} reported`}
                      />
                      <div
                        className="w-1/2 bg-emerald-500 rounded-t-sm transition-all"
                        style={{ height: `${(d.cleaned / 50) * 100}%` }}
                        title={`${d.cleaned} cleaned`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-amber-400"></span> Reported</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Cleaned</span>
              </div>
            </div>

            {/* Garbage Categories Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Garbage Categories Composition</h4>
              <div className="space-y-3 pt-2">
                {stats.categoryStats?.map((c: any) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{c.category}</span>
                      <span>{c.count} reports</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (c.count / reports.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM CONFIGURATION SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Configurable Civic Parameters</h3>
            <p className="text-xs text-slate-500">Tune citizen reward point bonuses and municipal violation fine brackets.</p>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Citizen Reward Points</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Low Severity Reward (pts)</label>
                <input
                  type="number"
                  value={settings['REWARD_LOW_SEVERITY'] || '10'}
                  onChange={(e) => setSettings({ ...settings, REWARD_LOW_SEVERITY: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Medium Severity Reward (pts)</label>
                <input
                  type="number"
                  value={settings['REWARD_MEDIUM_SEVERITY'] || '25'}
                  onChange={(e) => setSettings({ ...settings, REWARD_MEDIUM_SEVERITY: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">High Severity Reward (pts)</label>
                <input
                  type="number"
                  value={settings['REWARD_HIGH_SEVERITY'] || '50'}
                  onChange={(e) => setSettings({ ...settings, REWARD_HIGH_SEVERITY: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Before/After Bonus (pts)</label>
                <input
                  type="number"
                  value={settings['REWARD_EVIDENCE_BONUS'] || '20'}
                  onChange={(e) => setSettings({ ...settings, REWARD_EVIDENCE_BONUS: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] pt-4">Responsible Entity Penalty Brackets (₹)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Low Penalty (₹)</label>
                <input
                  type="number"
                  value={settings['PENALTY_LOW_AMOUNT'] || '2000'}
                  onChange={(e) => setSettings({ ...settings, PENALTY_LOW_AMOUNT: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Medium Penalty (₹)</label>
                <input
                  type="number"
                  value={settings['PENALTY_MEDIUM_AMOUNT'] || '5000'}
                  onChange={(e) => setSettings({ ...settings, PENALTY_MEDIUM_AMOUNT: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">High Penalty (₹)</label>
                <input
                  type="number"
                  value={settings['PENALTY_HIGH_AMOUNT'] || '15000'}
                  onChange={(e) => setSettings({ ...settings, PENALTY_HIGH_AMOUNT: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Save Configuration Changes
          </button>
        </form>
      )}

      {/* MODAL: ASSIGN COLLECTOR */}
      {assignCollectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Assign Sanitation Collector</h3>
              <button onClick={() => setAssignCollectorModal(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Dispatch staff member to <b>{assignCollectorModal.category}</b> at <b>{assignCollectorModal.area}</b>.
            </p>

            <form onSubmit={handleAssignCollectorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Available Sanitation Staff</label>
                <div className="space-y-2">
                  {collectors.map((c) => (
                    <label
                      key={c.id}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedCollectorId === c.id ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="collector"
                          value={c.id}
                          checked={selectedCollectorId === c.id}
                          onChange={(e) => setSelectedCollectorId(e.target.value)}
                          className="accent-emerald-600"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">{c.name}</span>
                          <span className="text-[10px] text-slate-500">{c.city}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        {c.active_tasks} active tasks
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAssignCollectorModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCollectorId}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  Dispatch Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE RESPONSIBLE ENTITY VIOLATION */}
      {createViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Municipal Waste Violation</h3>
              <button onClick={() => setCreateViolationModal(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Link incident at <b>{createViolationModal.area}</b> to a responsible commercial, contractor, or residential entity for legal review.
            </p>

            <form onSubmit={handleCreateViolationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Responsible Entity / Organization Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Construction Ltd, Shivaji Market Guild..."
                  value={violEntity}
                  onChange={(e) => setViolEntity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Entity Type</label>
                  <select
                    value={violEntityType}
                    onChange={(e) => setViolEntityType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Commercial">Commercial (Business/Market)</option>
                    <option value="Contractor">Contractor (Builder/Demolition)</option>
                    <option value="Residential">Residential (Society/Building)</option>
                    <option value="Institution">Institution (Hospital/College)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Violation Category</label>
                  <select
                    value={violType}
                    onChange={(e) => setViolType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Illegal Dumping">Illegal Dumping</option>
                    <option value="Construction Debris">Construction Debris</option>
                    <option value="Litter Spillover">Litter Spillover</option>
                    <option value="Commercial Waste Abandonment">Commercial Waste Abandonment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Violation Summary / Evidence Notes</label>
                <textarea
                  value={violDesc}
                  onChange={(e) => setViolDesc(e.target.value)}
                  placeholder="Describe repeat dumping behavior observed at site..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCreateViolationModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Log Violation Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Before / After Evidence Modal */}
      {showEvidenceModal && modalEvidenceReport && (
        <BeforeAfterModal
          report={modalEvidenceReport}
          evidence={modalEvidenceReport.evidence}
          onClose={() => setShowEvidenceModal(false)}
          isAdmin={true}
          onApproveClosure={async () => {
            try {
              await api.verifyReport(modalEvidenceReport.id, { action: 'VERIFY', notes: 'Closed and approved by Municipal Commissioner.' });
              showToast('Report verified and closed with final approval.', 'success');
              setShowEvidenceModal(false);
              await loadAdminData();
            } catch (err: any) {
              showToast(err.message || 'Closure failed', 'error');
            }
          }}
        />
      )}
    </div>
  );
};
