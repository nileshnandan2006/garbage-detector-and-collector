import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Trophy,
  Users,
  Leaf,
  Scale,
  Activity,
  Flame,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api.js';
import { AreaStatistic, Hotspot } from '../types/index.js';

interface LandingPageProps {
  navigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const [areaScores, setAreaScores] = useState<AreaStatistic[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [scoresRes, hotRes, leaderRes] = await Promise.all([
          api.getCleanlinessScores(),
          api.getHotspots(),
          api.getLeaderboard('all-time')
        ]);
        setAreaScores(scoresRes.areas || []);
        setHotspots(hotRes.hotspots || []);
        setLeaders((leaderRes.leaders || []).slice(0, 3));
      } catch (err) {
        console.warn('Error loading landing data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide shadow-2xs">
                <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-full object-cover border border-emerald-400" />
                <span>Next-Gen Smart Civic Cleanliness Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn Garbage Reports Into <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Real-World Action</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Spot garbage. Upload a photo. Help clean your community. Earn rewards for verified reports with our AI computer vision verification system.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('report')}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 text-base"
                >
                  <Camera className="w-5 h-5" />
                  Report Garbage
                </button>
                <button
                  onClick={() => navigate('dashboard')}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-base"
                >
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Metrics Pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>94%+ AI Vision Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>3.6 Hr Avg Resolution Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Verified Citizen Rewards</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Card: AI Detection Simulation */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                      <span className="text-xs font-mono uppercase text-slate-400">Civic AI Cam #048</span>
                    </div>
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Confidence: 96%
                    </span>
                  </div>

                  {/* Garbage Snapshot Image */}
                  <div className="relative rounded-2xl overflow-hidden h-48 border border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800"
                      alt="Garbage detection frame"
                      className="w-full h-full object-cover"
                    />
                    {/* Visual AI Bounding Box */}
                    <div className="absolute inset-4 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                      <div className="self-start bg-emerald-500 text-slate-950 font-mono font-black text-[10px] px-1.5 py-0.5 rounded">
                        PLASTIC WASTE 96%
                      </div>
                      <div className="self-end bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-400/40">
                        SEVERITY: HIGH
                      </div>
                    </div>
                  </div>

                  {/* Detection Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Identified Spot</span>
                      <span className="font-semibold text-white truncate block">Kothrud Bus Depot</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Citizen Reward</span>
                      <span className="font-bold text-emerald-400">+70 Points Awarded</span>
                    </div>
                  </div>
                </div>

                {/* Floating Collector Dispatch Tag */}
                <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Field Collector Dispatched</p>
                    <p className="text-[10px] text-slate-500">Suresh Kumar en route (ETA 12 mins)</p>
                  </div>
                </div>

                {/* Floating Reward Badge with Logo */}
                <div className="absolute -top-6 -right-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-300 shadow-xs">
                    <img src="/logo.png" alt="CleanSight Mascot" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">CleanSight AI</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Active Detector & Removal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">How CleanSight Works</h2>
          <p className="text-slate-600 text-sm mt-2">
            Transforming everyday citizens into active custodians of clean, smart urban living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Spot & Snap</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Capture or upload a photo of garbage found in public parks, roads, or gutters using your smartphone camera.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Detection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our computer vision model categorizes waste, estimates severity, tags items, and checks coordinates to prevent duplicates.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart Collection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Municipal sanitation staff accept the task, navigate to the site, collect waste, and upload an "After Cleaning" photo.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Earn Rewards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verified reports earn points credited instantly. Redeem for digital badges, Metro passes, and organic partner discounts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI GARBAGE DETECTION SHOWCASE */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Computer Vision Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Instant AI Detection for Multi-Category Waste
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              CleanSight's intelligent detection system scans image feeds in milliseconds, classifying plastic, construction debris, food waste, and medical refuse with high confidence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-300 font-medium">
                  Automatic severity grading (Low, Medium, High, Critical)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-300 font-medium">
                  Anti-fraud shield catches duplicate images and proximity spam
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-300 font-medium">
                  Pluggable support for YOLO, Google Gemini Vision, and local CV models
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('report')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
              >
                Test AI Detection Live →
              </button>
            </div>
          </div>

          {/* Interactive Feature Spec Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">94%</span>
              <h4 className="font-bold text-sm text-white">Detection Confidence</h4>
              <p className="text-[11px] text-slate-400">Trained on diverse Indian civic street waste datasets</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-teal-400 font-mono">&lt; 850ms</span>
              <h4 className="font-bold text-sm text-white">Inference Latency</h4>
              <p className="text-[11px] text-slate-400">Near instant response on mobile connections</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-amber-400 font-mono">8 Types</span>
              <h4 className="font-bold text-sm text-white">Waste Categories</h4>
              <p className="text-[11px] text-slate-400">Plastic, Food, Construction, E-Waste & more</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-rose-400 font-mono">100%</span>
              <h4 className="font-bold text-sm text-white">Before/After Audit</h4>
              <p className="text-[11px] text-slate-400">Rigorous photographic proof required for completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AREA CLEANLINESS SCORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
              Civic Cleanliness Index
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Area Cleanliness Scores (0–100)</h2>
            <p className="text-slate-600 text-sm mt-1">
              Dynamic algorithm based on report frequency, resolution times, repeat hotspots, and verified cleanups.
            </p>
          </div>
          <button
            onClick={() => navigate('hotspots')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm flex items-center gap-1"
          >
            View Hotspots Map <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {areaScores.map((area) => {
            const isGood = area.cleanliness_score >= 75;
            const isModerate = area.cleanliness_score >= 55 && area.cleanliness_score < 75;

            return (
              <div
                key={area.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">{area.area_name}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isGood
                        ? 'bg-emerald-100 text-emerald-800'
                        : isModerate
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {area.cleanliness_score}/100
                  </span>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isGood ? 'bg-emerald-500' : isModerate ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${area.cleanliness_score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Reports: <b>{area.total_reports}</b></span>
                  <span>Cleaned: <b className="text-emerald-700">{area.cleaned_count}</b></span>
                  <span className="capitalize text-slate-400 font-medium">Trend: {area.trend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. REPORT & EARN REWARDS */}
      <section className="bg-emerald-50/60 border border-emerald-100 py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-200/60 px-3 py-1 rounded-full">
            Incentivized Civic Action
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Report Waste. Earn Real Rewards.</h2>
          <p className="text-slate-600 text-sm mt-1">
            Points are awarded after municipal or computer vision verification. Redeem for badges and green discounts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Low Severity</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">+10 pts</div>
            <p className="text-[11px] text-slate-400">Single bottles, scattered paper</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Medium Severity</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">+25 pts</div>
            <p className="text-[11px] text-slate-400">Food waste, residential pile</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">High Severity</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">+50 pts</div>
            <p className="text-[11px] text-slate-400">Major dumps, toxic e-waste</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Verified Hotspot / Bonus</span>
            <div className="text-2xl font-black text-amber-600 font-mono">+100 pts</div>
            <p className="text-[11px] text-slate-400">+20 pts Before/After proof</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('rewards')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            Explore Rewards Catalog →
          </button>
        </div>
      </section>

      {/* 6. LEADERBOARD PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
              Civic Pride
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Top Clean City Heroes</h2>
          </div>
          <button
            onClick={() => navigate('leaderboard')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm flex items-center gap-1"
          >
            Full Leaderboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={`p-6 rounded-3xl border bg-white shadow-xs relative overflow-hidden ${
                index === 0 ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    #{leader.rank}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{leader.name}</h4>
                  <p className="text-xs text-slate-500">{leader.city}</p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {leader.badgeIcon}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Verified Reports</span>
                  <span className="font-bold text-slate-800 text-sm">{leader.verifiedReports} reports</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Total Points</span>
                  <span className="font-bold text-emerald-700 text-sm">{leader.points} pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LIVE STATISTICS COUNTERS */}
      <section className="bg-slate-900 text-white py-14 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono">12,450</div>
            <p className="text-xs text-slate-400 mt-1">Kg Waste Removed</p>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-400 font-mono">2,340</div>
            <p className="text-xs text-slate-400 mt-1">Reports Submitted</p>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono">1,870</div>
            <p className="text-xs text-slate-400 mt-1">Locations Cleaned</p>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400 font-mono">8,520</div>
            <p className="text-xs text-slate-400 mt-1">Active Citizens</p>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-400 font-mono">15,200</div>
            <p className="text-xs text-slate-400 mt-1">Rewards Awarded</p>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono">320</div>
            <p className="text-xs text-slate-400 mt-1">Hotspots Improved</p>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto shadow-lg shadow-emerald-500/20 border-2 border-emerald-500/30">
          <img src="/logo.png" alt="CleanSight Mascot" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Clean Your Community?
        </h2>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Every report matters. Snap a photo of public garbage now, let our AI handle verification, and earn rewards while making your neighborhood spotless.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('report')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base"
          >
            <Camera className="w-5 h-5" />
            Report Waste Now
          </button>
          <button
            onClick={() => navigate('impact')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all text-base"
          >
            View City Impact
          </button>
        </div>
      </section>
    </div>
  );
};
