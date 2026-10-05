import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Phone,
  Coins,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProfilePageProps {
  navigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <p className="text-slate-600 text-sm">Please login to view your profile.</p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Login Now
        </button>
      </div>
    );
  }

  const BADGES = [
    {
      title: 'Green Starter',
      icon: '🌱',
      description: 'Awarded upon joining CleanSight and submitting your first garbage report.',
      unlocked: (user.points || 0) >= 50
    },
    {
      title: 'Waste Watcher',
      icon: '♻️',
      description: 'Reached 500+ verified reward points across multiple wards.',
      unlocked: (user.points || 0) >= 500
    },
    {
      title: 'Eco Warrior',
      icon: '🌍',
      description: 'Reached 1,000+ points and resolved high severity waste sites.',
      unlocked: (user.points || 0) >= 1000
    },
    {
      title: 'Clean City Champion',
      icon: '🏆',
      description: 'Top-tier civic honor for over 1,500 points and active community advocacy.',
      unlocked: (user.points || 0) >= 1500
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
            alt={user.name}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-emerald-500 shadow-md"
          />
          <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200 uppercase tracking-wider">
                {user.role} • {user.rank}
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-400 block">Civic Balance</span>
              <span className="text-2xl font-mono font-black text-emerald-700">{user.points} pts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{user.city || 'Pune Municipal Corporation'}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Verified Custodian since 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Civic Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Total Reports</span>
          <div className="text-2xl font-mono font-black text-slate-900">{user.stats?.totalReports || 18}</div>
          <span className="text-[10px] text-slate-500">Submitted to date</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Verified Reports</span>
          <div className="text-2xl font-mono font-black text-emerald-600">{user.stats?.verifiedReports || 15}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Cleaned Locations</span>
          <div className="text-2xl font-mono font-black text-teal-600">{user.stats?.cleanedReports || 15}</div>
          <span className="text-[10px] text-teal-600 font-semibold">Public areas cleared</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Current Rank</span>
          <div className="text-base font-bold text-amber-700 truncate">{user.rank}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Top 3 in city</span>
        </div>
      </div>

      {/* 3. Badges Collection (Requirement #15) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Your Civic Achievement Badges</h2>
          <p className="text-xs text-slate-500">Milestone awards unlocked by participating in public cleanup actions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl p-3 bg-white rounded-2xl border border-slate-200 shrink-0 shadow-xs">
                {b.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                  {b.unlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Unlocked ✓
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
