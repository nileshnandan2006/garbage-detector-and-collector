import React from 'react';
import { ReportStatus } from '../types/index.js';
import { Check, Clock, AlertTriangle, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

interface ReportTimelineProps {
  status: ReportStatus;
  rewardPoints?: number;
  rewardStatus?: string;
  collectorName?: string;
  rejectionReason?: string;
}

interface Step {
  id: number;
  key: string;
  title: string;
  description: string;
}

const TIMELINE_STEPS: Step[] = [
  { id: 1, key: 'SUBMITTED', title: 'Report Submitted', description: 'Citizen photo & location recorded' },
  { id: 2, key: 'AI_VERIFIED', title: 'AI Verified', description: 'Vision model confirms waste' },
  { id: 3, key: 'ADMIN_VERIFIED', title: 'Admin Verified', description: 'Municipal officer approval' },
  { id: 4, key: 'ASSIGNED', title: 'Collector Assigned', description: 'Cleaning crew dispatched' },
  { id: 5, key: 'CLEANING_STARTED', title: 'Cleaning Started', description: 'Crew actively on site' },
  { id: 6, key: 'GARBAGE_REMOVED', title: 'Garbage Removed', description: 'After-cleaning evidence taken' },
  { id: 7, key: 'FINAL_VERIFICATION', title: 'Final Verification', description: 'Clean site inspection passed' },
  { id: 8, key: 'REWARD_CREDITED', title: 'Reward Credited', description: 'Reward points added to balance' }
];

function getActiveStepIndex(status: ReportStatus, rewardStatus?: string): number {
  if (status === 'REJECTED') return -1;
  if (status === 'PENDING AI VERIFICATION') return 1;
  if (status === 'VERIFIED') return 3;
  if (status === 'ASSIGNED') return 4;
  if (status === 'COLLECTOR ON THE WAY') return 4;
  if (status === 'CLEANING IN PROGRESS') return 5;
  if (status === 'CLEANED') {
    return rewardStatus === 'CREDITED' ? 8 : 7;
  }
  if (status === 'CLOSED') return 8;
  return 2;
}

export const ReportTimeline: React.FC<ReportTimelineProps> = ({
  status,
  rewardPoints = 50,
  collectorName,
  rejectionReason
}) => {
  if (status === 'REJECTED') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
        <div className="flex items-center gap-2 font-bold mb-1 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600" /> Report Rejected by Municipal Authority
        </div>
        <p className="text-xs text-rose-700">
          Reason: {rejectionReason || 'Uploaded photo does not meet municipal waste criteria or duplicate incident.'}
        </p>
      </div>
    );
  }

  const activeIndex = getActiveStepIndex(status, rewardPoints ? 'CREDITED' : 'PENDING');

  return (
    <div className="py-2">
      <div className="relative">
        <div className="space-y-4">
          {TIMELINE_STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeIndex;
            const isCurrent = stepNum === activeIndex;
            const isPending = stepNum > activeIndex;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Connecting Line */}
                {idx !== TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Circle Icon Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{stepNum}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-emerald-700'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full animate-bounce">
                        Current Stage
                      </span>
                    )}
                    {isCompleted && step.id === 8 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" /> +{rewardPoints} pts
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isCurrent ? 'text-emerald-800 font-medium' : isCompleted ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {step.id === 4 && collectorName ? `Assigned to ${collectorName}` : step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
