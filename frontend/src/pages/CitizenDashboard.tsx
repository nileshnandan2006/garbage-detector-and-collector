import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Report } from '../types/index.js';
import { ReportTimeline } from '../components/ReportTimeline.js';
import { BeforeAfterModal } from '../components/BeforeAfterModal.js';
import {
  Sparkles,
  Camera,
  Coins,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Eye,
  Filter,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface CitizenDashboardProps {
  navigate: (page: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ navigate }) => {
  const { user, refreshUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [modalReport, setModalReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      try {
        await refreshUser();
        const res = await api.getReports(user ? { user_id: user.id } : undefined);
        setReports(res.reports || []);
        if (res.reports && res.reports.length > 0) {
          setSelectedReport(res.reports[0]);
        }
      } catch (err) {
        console.error('Failed to load user reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [user?.id]);

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return !['CLEANED', 'CLOSED', 'REJECTED'].includes(r.status);
    if (statusFilter === 'CLEANED') return ['CLEANED', 'CLOSED'].includes(r.status);
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CLEANED':
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CLEANING IN PROGRESS':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'ASSIGNED':
      case 'COLLECTOR ON THE WAY':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const handleOpenEvidence = (report: Report) => {
    setModalReport(report);
    setShowEvidenceModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Welcome & Citizen Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Eco Custodian</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Rahul Sharma'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your reported waste incidents are actively monitored and dispatched to municipal sanitation squads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('report')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Report New Waste
            </button>
            <button
              onClick={() => navigate('rewards')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Redeem Rewards
            </button>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Reports Submitted</span>
            <div className="text-2xl font-black text-white font-mono">
              {user?.stats?.totalReports || reports.length || 18}
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Citywide verified</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Garbage Removed</span>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              {reports.filter((r) => ['CLEANED', 'CLOSED'].includes(r.status)).length || 15}
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">100% Cleared ✓</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">CleanSight Points</span>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {user?.points || 1850}
            </div>
            <span className="text-[10px] text-amber-300 mt-1 block">Ready to redeem</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Civic Rank</span>
            <div className="text-lg font-bold text-white truncate">
              {user?.rank || 'Clean City Champion'}
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">Top 1% in Pune</span>
          </div>
        </div>
      </div>

      {/* 2. Main Reports & Live Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Reports List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Garbage Reports</h2>

            {/* Filter Pills */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('CLEANED')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'CLEANED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Cleaned
              </button>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-40" />
              <h4 className="font-bold text-slate-800 text-base">No reports found in this category</h4>
              <p className="text-xs text-slate-500">You can report a new waste incident anytime.</p>
              <button
                onClick={() => navigate('report')}
                className="mt-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Report Garbage Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                const isCleaned = ['CLEANED', 'CLOSED'].includes(report.status);

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Image Thumbnail */}
                      <img
                        src={report.image_url}
                        alt={report.category}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                          {report.category} • {report.area}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{report.address}</p>

                        <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-emerald-600" /> +{report.reward_points} pts
                          </span>

                          {isCleaned && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEvidence(report);
                              }}
                              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Before/After
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Timeline Tracker for Selected Report */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Live Incident Tracker</h2>

            {selectedReport ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{selectedReport.id.slice(0, 8)}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {selectedReport.category}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedReport.address}, {selectedReport.area}</p>
                </div>

                {/* Report Image Preview */}
                <div className="relative rounded-2xl overflow-hidden h-40 border border-slate-100">
                  <img
                    src={selectedReport.image_url}
                    alt={selectedReport.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-950/80 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-bold">
                    AI Severity: {selectedReport.ai_severity}
                  </div>
                </div>

                {/* 8-Stage Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Incident Progress Workflow
                  </h4>
                  <ReportTimeline
                    status={selectedReport.status}
                    rewardPoints={selectedReport.reward_points}
                    rewardStatus={selectedReport.reward_status}
                    collectorName={selectedReport.assigned_collector_name}
                    rejectionReason={selectedReport.rejection_reason}
                  />
                </div>

                {['CLEANED', 'CLOSED'].includes(selectedReport.status) && (
                  <button
                    onClick={() => handleOpenEvidence(selectedReport)}
                    className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-emerald-200"
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    Inspect Before / After Cleaning Audit
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-sm border border-slate-200">
                Select a report on the left to track its live resolution progress.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Before / After Evidence Modal */}
      {showEvidenceModal && modalReport && (
        <BeforeAfterModal
          report={modalReport}
          evidence={modalReport.evidence}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}
    </div>
  );
};
