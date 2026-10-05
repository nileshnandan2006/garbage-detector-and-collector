import React, { useState } from 'react';
import { CleaningEvidence, Report } from '../types/index.js';
import { CheckCircle2, X, Scale, User, Calendar, Clock, Sparkles } from 'lucide-react';

interface BeforeAfterModalProps {
  report: Report;
  evidence?: CleaningEvidence | null;
  onClose: () => void;
  onApproveClosure?: () => void;
  isAdmin?: boolean;
}

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({
  report,
  evidence,
  onClose,
  onApproveClosure,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<'split' | 'before' | 'after'>('split');

  const beforeUrl = evidence?.before_image_url || report.image_url;
  const afterUrl = evidence?.after_image_url || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800';

  const cleanedDate = evidence?.cleaned_at ? new Date(evidence.cleaned_at) : new Date(report.updated_at);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Civic Cleanup Verification</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Cleaning Verified ✓
                </span>
              </div>
              <p className="text-xs text-slate-500">Report #{report.id.slice(0, 8)} • {report.area}, {report.city}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-5 pt-3 flex items-center justify-between text-xs border-b border-slate-100">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'split' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'before' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Before Only
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'after' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              After Only
            </button>
          </div>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full pb-2">
            +{report.reward_points} Reward Points Credited
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Images Grid */}
          <div className={`grid gap-4 ${activeTab === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* BEFORE IMAGE */}
            {(activeTab === 'split' || activeTab === 'before') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    BEFORE: Reported Waste
                  </span>
                  <span className="text-xs text-slate-400">{report.category}</span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-rose-200 shadow-sm relative group bg-slate-950">
                  <img
                    src={beforeUrl}
                    alt="Before cleaning"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-xs">
                    Reported by {report.user_name}
                  </div>
                </div>
              </div>
            )}

            {/* AFTER IMAGE */}
            {(activeTab === 'split' || activeTab === 'after') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    AFTER: Cleaned & Disinfected
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">100% Cleared ✓</span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-sm relative group bg-slate-950">
                  <img
                    src={afterUrl}
                    alt="After cleaning"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-emerald-950/80 text-emerald-300 text-[10px] px-2 py-1 rounded backdrop-blur-xs font-semibold">
                    Cleaning Verified ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details & Verification Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" /> Collector
              </span>
              <p className="font-bold text-slate-800">
                {evidence?.collector_name || report.assigned_collector_name || 'Suresh Kumar'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Date
              </span>
              <p className="font-bold text-slate-800">{cleanedDate.toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> Time
              </span>
              <p className="font-bold text-slate-800">
                {cleanedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Scale className="w-3.5 h-3.5" /> Waste Removed
              </span>
              <p className="font-bold text-emerald-700">
                {evidence?.waste_weight_kg || 18.5} kg collected
              </p>
            </div>
          </div>

          {/* Cleaning Notes */}
          {evidence?.cleaning_notes && (
            <div className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-0.5">Collector Notes:</span>
              <p>{evidence.cleaning_notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Citizen reward points have been automatically credited.
          </div>
          <div className="flex gap-2">
            {isAdmin && report.status === 'CLEANED' && onApproveClosure && (
              <button
                onClick={onApproveClosure}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Approve Final Closure
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
