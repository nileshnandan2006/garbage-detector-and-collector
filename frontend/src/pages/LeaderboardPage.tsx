import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Trophy, Award, Sparkles, Medal, Shield, Star } from 'lucide-react';

interface LeaderboardPageProps {
  navigate: (page: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ navigate }) => {
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const res = await api.getLeaderboard(filter);
        setLeaders(res.leaders || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, [filter]);

  const topThree = leaders.slice(0, 3);
  const remaining = leaders.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
            Civic Honor Roll
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Top Clean City Heroes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Recognizing citizens leading our city's waste transformation and civic hygiene.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setFilter('weekly')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilter('all-time')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'all-time' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Podium: Top 3 Heroes */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* #2 Rank */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 relative order-2 md:order-1 self-end shadow-sm">
            <div className="relative inline-block mx-auto">
              <img
                src={topThree[1].avatar}
                alt={topThree[1].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 shadow-md mx-auto"
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-7 h-7 rounded-full bg-slate-400 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mt-2">{topThree[1].name}</h3>
            <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full">
              🥇 Gold Hero
            </span>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>{topThree[1].verifiedReports} reports</span>
              <span className="font-bold text-emerald-700">{topThree[1].points} pts</span>
            </div>
          </div>

          {/* #1 Rank (Center, Prominent) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl p-8 border-2 border-amber-400 text-center space-y-4 relative order-1 md:order-2 shadow-xl ring-4 ring-amber-100">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Reigning Champion</span>
            </div>

            <div className="relative inline-block mx-auto">
              <img
                src={topThree[0].avatar}
                alt={topThree[0].name}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl mx-auto"
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-white shadow-lg">
                1
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-xl">{topThree[0].name}</h3>
              <p className="text-xs text-slate-500">{topThree[0].city}</p>
            </div>

            <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              🌟 Platinum Gold
            </span>

            <div className="pt-3 border-t border-amber-200/60 flex justify-between text-xs">
              <div className="text-left">
                <span className="text-slate-400 block">Verified Incidents</span>
                <span className="font-bold text-slate-800 text-sm">{topThree[0].verifiedReports} reports</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Total Points</span>
                <span className="font-black text-emerald-700 text-lg">{topThree[0].points} pts</span>
              </div>
            </div>
          </div>

          {/* #3 Rank */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 relative order-3 self-end shadow-sm">
            <div className="relative inline-block mx-auto">
              <img
                src={topThree[2].avatar}
                alt={topThree[2].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-600/40 shadow-md mx-auto"
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mt-2">{topThree[2].name}</h3>
            <span className="inline-block text-xs font-bold text-slate-700 bg-slate-100 px-3 py-0.5 rounded-full">
              🥈 Silver Star
            </span>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>{topThree[2].verifiedReports} reports</span>
              <span className="font-bold text-emerald-700">{topThree[2].points} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table for remaining heroes */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Complete Civic Leaderboard Rankings</h3>
          <span className="text-xs text-slate-400">Filter: {filter.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Hero Citizen</th>
                <th className="p-3.5">City Ward</th>
                <th className="p-3.5">Verified Reports</th>
                <th className="p-3.5">Points</th>
                <th className="p-3.5 text-right">Badge Honor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaders.map((leader) => (
                <tr key={leader.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-slate-900">
                    <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                      leader.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : leader.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : leader.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{leader.rank}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{leader.name}</span>
                        <span className="text-[11px] text-slate-400">{leader.badgeTitle}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-medium">{leader.city}</td>

                  <td className="p-3.5 font-bold text-slate-800">
                    {leader.verifiedReports} verified
                  </td>

                  <td className="p-3.5 font-mono font-bold text-emerald-700 text-sm">
                    {leader.points} pts
                  </td>

                  <td className="p-3.5 text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {leader.badgeIcon}
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
