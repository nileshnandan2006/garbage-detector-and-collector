import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Hotspot, AreaStatistic } from '../types/index.js';
import { MapPicker } from '../components/MapPicker.js';
import { Flame, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, MapPin, ArrowRight } from 'lucide-react';

interface HotspotsPageProps {
  navigate: (page: string) => void;
}

export const HotspotsPage: React.FC<HotspotsPageProps> = ({ navigate }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [areaScores, setAreaScores] = useState<AreaStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [hotRes, scoreRes] = await Promise.all([
          api.getHotspots(),
          api.getCleanlinessScores()
        ]);
        setHotspots(hotRes.hotspots || []);
        setAreaScores(scoreRes.areas || []);
      } catch (err) {
        console.error('Failed to load hotspots:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600" />
          <span>Municipal Heatmap Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Garbage Hotspots & Cleanliness Scores
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl">
          Identifying areas with repeat garbage accumulation to prioritize municipal sanitation patrols and enforce corporate waste accountability.
        </p>
      </div>

      {/* Interactive Map */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            Live Hotspot Detection Map
          </h3>
          <span className="text-xs text-slate-400 font-medium">Click pins for severity & report frequency</span>
        </div>
        <MapPicker mode="viewer" hotspots={hotspots} height="380px" />
      </div>

      {/* Hotspots Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Priority Garbage Hotspot Zones</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspots.map((hotspot, idx) => (
            <div
              key={hotspot.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> HOTSPOT #{idx + 1}
                </span>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  Cleanliness: {hotspot.cleanliness_score}/100
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">{hotspot.area_name}</h3>
                <p className="text-xs text-slate-500">{hotspot.city} Municipal Ward</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Reports</span>
                  <span className="text-lg font-bold text-slate-800">{hotspot.total_reports}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Unresolved</span>
                  <span className="text-lg font-bold text-rose-600">{hotspot.unresolved_reports}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Severity: <b className="text-slate-800">{hotspot.severity}</b>
                </span>
                <button
                  onClick={() => navigate('report')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  Report Waste Here <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Cleanliness Index Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Area Cleanliness Index (0–100)</h2>
          <p className="text-xs text-slate-500">Continuous scoring based on rapid resolutions and community participation</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3">Ward / Area</th>
                <th className="p-3">Cleanliness Score</th>
                <th className="p-3">Total Reports</th>
                <th className="p-3">Cleaned Sites</th>
                <th className="p-3">Avg Resolution</th>
                <th className="p-3">Weekly Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {areaScores.map((area) => (
                <tr key={area.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{area.area_name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            area.cleanliness_score >= 75
                              ? 'bg-emerald-500'
                              : area.cleanliness_score >= 55
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${area.cleanliness_score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 font-mono">{area.cleanliness_score}/100</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{area.total_reports}</td>
                  <td className="p-3 font-bold text-emerald-700">{area.cleaned_count}</td>
                  <td className="p-3 font-mono">{area.avg_resolution_hours} hrs</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold capitalize ${
                        area.trend === 'improving'
                          ? 'text-emerald-600'
                          : area.trend === 'declining'
                          ? 'text-rose-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {area.trend === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
                      {area.trend === 'declining' && <TrendingDown className="w-3.5 h-3.5" />}
                      {area.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
