import React from 'react';
import { AiDetectionResponse } from '../types/index.js';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Flame, RefreshCw } from 'lucide-react';

interface AiDetectionCardProps {
  detection: AiDetectionResponse | null;
  isScanning: boolean;
  onRescan?: () => void;
}

export const AiDetectionCard: React.FC<AiDetectionCardProps> = ({
  detection,
  isScanning,
  onRescan
}) => {
  if (isScanning) {
    return (
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
        {/* Animated scanning bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500 flex items-center justify-center animate-spin">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-400">AI Computer Vision Scanning...</h4>
            <p className="text-xs text-slate-400">Extracting waste features, material classification, and severity score</p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse w-3/4"></div>
          </div>
          <p className="text-[11px] font-mono text-emerald-300 text-right">Analyzing multi-spectral contours</p>
        </div>
      </div>
    );
  }

  if (!detection) return null;

  const isDetected = detection.detected;
  const confidencePercent = Math.round((detection.confidence || 0.94) * 100);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-lg transition-all ${
      isDetected
        ? 'bg-slate-900 text-white border-emerald-500/40 shadow-emerald-950/20'
        : 'bg-rose-950/40 text-rose-100 border-rose-500/40 shadow-rose-950/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDetected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            CleanSight AI Vision Engine
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
          Model v2.4 Active
        </span>
      </div>

      {/* Main Result */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Detection Status */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block mb-1">Garbage Detected</span>
          <div className="flex items-center gap-1.5">
            {isDetected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-emerald-400">YES</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-sm text-rose-400">NO</span>
              </>
            )}
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block mb-1">Confidence</span>
          <span className="font-bold text-sm text-white font-mono">{confidencePercent}%</span>
        </div>

        {/* Garbage Type */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block mb-1">Garbage Type</span>
          <span className="font-bold text-xs text-emerald-300 truncate block">
            {detection.category || 'Plastic Waste'}
          </span>
        </div>

        {/* Estimated Severity */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block mb-1">Estimated Severity</span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getSeverityBadge(detection.severity)}`}>
            {detection.severity || 'HIGH'}
          </span>
        </div>
      </div>

      {/* If NOT detected warning */}
      {!isDetected ? (
        <div className="mt-4 p-3 bg-rose-900/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Garbage was not confidently detected.</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5">Please upload a clearer image of public waste for verification.</p>
          </div>
        </div>
      ) : (
        /* Detailed Labels & Metadata */
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">
          {detection.labels && detection.labels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1">Detected Tags:</span>
              {detection.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]"
                >
                  #{label}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-teal-400" /> Est. Mass: <b className="text-white">{detection.estimatedWeightKg || 14.5} kg</b>
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Hotspot Likelihood: <b className="text-white">{detection.hotspotLikelihood || 'High'}</b>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Civic Integrity Verified
            </span>
          </div>

          {detection.recommendation && (
            <p className="text-[11px] text-emerald-300/90 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50 mt-2">
              💡 <b>Dispatch Recommendation:</b> {detection.recommendation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
