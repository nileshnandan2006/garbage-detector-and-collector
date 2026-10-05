import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Globe2,
  Leaf,
  Scale,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  Flame,
  TrendingUp,
  Droplets,
  Trees,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ImpactPageProps {
  navigate: (page: string) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ navigate }) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      setIsLoading(true);
      try {
        const res = await api.getImpact();
        setData(res);
      } catch (err) {
        console.error('Failed to load impact metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadImpact();
  }, []);

  const metrics = data?.metrics || {
    wasteRemovedKg: 12450,
    totalReports: 2340,
    locationsCleaned: 1870,
    activeCitizens: 8520,
    rewardsDistributed: 15200,
    hotspotsImproved: 320
  };

  const env = data?.environmentalImpact || {
    co2AvoidedTons: 22.4,
    treesSavedEquivalent: 1494,
    waterConservedLiters: 560250,
    landfillSpaceSavedM3: 27.4
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Impact Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-World Ecological & Civic Transformation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          CleanSight Smart City Cleanliness Impact
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Through verified citizen reports and rapid sanitation dispatch, CleanSight turns digital complaints into measurable real-world environmental action.
        </p>
      </div>

      {/* 2. Key Six Metrics Banner (Requirement #28) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            ♻️
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {metrics.wasteRemovedKg.toLocaleString()} kg
          </div>
          <span className="text-xs font-bold text-slate-800 block">Waste Removed</span>
          <p className="text-[10px] text-slate-400">Total estimated refuse</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
            📍
          </div>
          <div className="text-2xl font-black text-teal-700 font-mono">
            {metrics.totalReports.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-slate-800 block">Reports Submitted</span>
          <p className="text-[10px] text-slate-400">Civic incidents logged</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            ✅
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {metrics.locationsCleaned.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-slate-800 block">Locations Cleaned</span>
          <p className="text-[10px] text-slate-400">Before/After confirmed</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            👥
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {metrics.activeCitizens.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-slate-800 block">Active Citizens</span>
          <p className="text-[10px] text-slate-400">Community guardians</p>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
            🏆
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono">
            {metrics.rewardsDistributed.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-slate-800 block">Rewards Distributed</span>
          <p className="text-[10px] text-slate-400">Points credited to citizens</p>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-2 hover:shadow-md transition-all">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
            🌱
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">
            {metrics.hotspotsImproved.toLocaleString()}
          </div>
          <span className="text-xs font-bold text-slate-800 block">Hotspots Improved</span>
          <p className="text-[10px] text-slate-400">Cleanliness restored</p>
        </div>
      </div>

      {/* 3. Ecological Dividends Showcase */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Ecological Dividends
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
              Measurable Environmental Benefits
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Cleaned waste diverted to composting, formal plastic recycling, and hazardous sorting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/20 text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{env.co2AvoidedTons} tons</div>
            <h4 className="font-bold text-sm text-emerald-300">CO₂ Equivalent Avoided</h4>
            <p className="text-xs text-slate-400">Prevented from open burning and uncontrolled decay</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="p-3 w-fit rounded-xl bg-teal-500/20 text-teal-400">
              <Trees className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{env.treesSavedEquivalent}</div>
            <h4 className="font-bold text-sm text-teal-300">Tree Seedling Equivalents</h4>
            <p className="text-xs text-slate-400">Equivalent carbon offset impact achieved</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="p-3 w-fit rounded-xl bg-sky-500/20 text-sky-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{(env.waterConservedLiters / 1000).toFixed(0)}k L</div>
            <h4 className="font-bold text-sm text-sky-300">Groundwater Conserved</h4>
            <p className="text-xs text-slate-400">Saved from chemical & leachate contamination</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="p-3 w-fit rounded-xl bg-amber-500/20 text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{env.landfillSpaceSavedM3} m³</div>
            <h4 className="font-bold text-sm text-amber-300">Landfill Volume Saved</h4>
            <p className="text-xs text-slate-400">Diverted into circular economy & composting</p>
          </div>
        </div>
      </div>

      {/* 4. Month-on-Month Growth Trend */}
      {data?.monthlyTrends && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Monthly Garbage Clearance Velocity</h3>
              <p className="text-xs text-slate-500">Continuous rise in citizen participation and rapid sanitation clearing</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              +145% Growth in 6 Months
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
            {data.monthlyTrends.map((m: any) => (
              <div key={m.month} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{m.month}</span>
                <div className="text-xl font-black text-emerald-700 font-mono">{m.wasteKg} kg</div>
                <span className="text-[11px] text-slate-600 block">{m.cleanedCount} cleaned</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Call to Join CTA */}
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Be Part of the Next 10,000 kg Removed</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Every report you submit helps clean a public park, street, or riverfront.
        </p>
        <button
          onClick={() => navigate('report')}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition-all shadow-md"
        >
          Report Garbage in Your Ward Now
        </button>
      </div>
    </div>
  );
};
