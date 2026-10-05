import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { NotificationDropdown } from './NotificationDropdown.js';
import {
  Sparkles,
  Camera,
  MapPin,
  Trophy,
  Award,
  Globe2,
  LayoutDashboard,
  Truck,
  ShieldCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  Coins,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, navigate }) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Quick 1-Click Role Switcher */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Smart India Hackathon Prototype • Active Ward: Pune Municipal
          </span>
        </div>

        {/* Quick Demo Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden md:inline">1-Click Role Switch:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => switchDemoUser('citizen')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                user?.role === 'citizen'
                  ? 'bg-emerald-600 text-white font-semibold ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Login as Citizen Rahul Sharma"
            >
              🧑 Citizen
            </button>
            <button
              onClick={() => switchDemoUser('collector')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                user?.role === 'collector'
                  ? 'bg-amber-600 text-white font-semibold ring-1 ring-amber-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Login as Collector Suresh Kumar"
            >
              👷 Collector
            </button>
            <button
              onClick={() => switchDemoUser('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                user?.role === 'admin'
                  ? 'bg-indigo-600 text-white font-semibold ring-1 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Login as Admin Rajesh Deshmukh"
            >
              🏛️ Municipal Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 border border-emerald-500/30 bg-emerald-50">
            <img src="/logo.png" alt="CleanSight Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Clean<span className="text-emerald-600">Sight</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded uppercase tracking-wider">
                AI Civic
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Report Waste • Earn Rewards • Clean City
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'home' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('report')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentPage === 'report'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            Report Waste
          </button>
          <button
            onClick={() => handleNav('hotspots')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              currentPage === 'hotspots' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            Hotspots
          </button>
          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              currentPage === 'leaderboard' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Leaderboard
          </button>
          <button
            onClick={() => handleNav('rewards')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              currentPage === 'rewards' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            Rewards
          </button>
          <button
            onClick={() => handleNav('impact')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              currentPage === 'impact' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe2 className="w-4 h-4 text-teal-600" />
            Impact
          </button>

          {/* Role specific dashboard link */}
          {user?.role === 'citizen' && (
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'dashboard' ? 'text-emerald-700 bg-emerald-100/70' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Impact
            </button>
          )}

          {user?.role === 'collector' && (
            <button
              onClick={() => handleNav('collector')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'collector' ? 'text-amber-800 bg-amber-100/70' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              Collector Tasks
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'admin' ? 'text-indigo-800 bg-indigo-100/70' : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Authority
            </button>
          )}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Points Pill (For citizens & collectors) */}
              <div
                onClick={() => handleNav('rewards')}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Your CleanSight Points Balance"
              >
                <Coins className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span className="font-bold text-sm">{user.points}</span>
                <span className="text-[11px] text-emerald-600 uppercase font-semibold">pts</span>
              </div>

              {/* Notification Bell */}
              <NotificationDropdown />

              {/* Profile Avatar / Menu */}
              <div
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition-colors"
                title="View Profile"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium capitalize">{user.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="hidden md:flex p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {user && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-emerald-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-emerald-700 capitalize font-medium">{user.role} • {user.points} pts</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-xs text-rose-600 font-semibold px-2 py-1 bg-white rounded border border-rose-200"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('report')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Report Waste
          </button>
          <button
            onClick={() => handleNav('hotspots')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hotspots Map
          </button>
          <button
            onClick={() => handleNav('leaderboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Leaderboard
          </button>
          <button
            onClick={() => handleNav('rewards')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Rewards Store
          </button>
          <button
            onClick={() => handleNav('impact')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            City Cleanliness Impact
          </button>

          {user?.role === 'citizen' && (
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50"
            >
              Citizen Dashboard
            </button>
          )}
          {user?.role === 'collector' && (
            <button
              onClick={() => handleNav('collector')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
            >
              Collector Dashboard
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-indigo-800 bg-indigo-50"
            >
              Admin Dashboard
            </button>
          )}

          {!user && (
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleNav('login')}
                className="flex-1 py-2 text-center text-sm font-semibold border border-slate-200 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('register')}
                className="flex-1 py-2 text-center text-sm font-semibold bg-emerald-600 text-white rounded-xl"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
