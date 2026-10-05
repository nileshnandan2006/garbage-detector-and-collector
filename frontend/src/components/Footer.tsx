import React from 'react';
import { Sparkles, Heart, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  navigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-emerald-500/40">
                <img src="/logo.png" alt="CleanSight Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Clean<span className="text-emerald-500">Sight</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Smart civic cleanliness platform connecting proactive citizens, AI computer vision, municipal collectors, and local authorities.
            </p>
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg inline-block">
              "Report Waste. Earn Rewards. Keep Your City Clean."
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Citizens</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('report')} className="hover:text-emerald-400 transition-colors">
                  Report Waste
                </button>
              </li>
              <li>
                <button onClick={() => navigate('rewards')} className="hover:text-emerald-400 transition-colors">
                  Rewards Store
                </button>
              </li>
              <li>
                <button onClick={() => navigate('leaderboard')} className="hover:text-emerald-400 transition-colors">
                  Clean City Heroes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Track My Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Municipal links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Authority</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('hotspots')} className="hover:text-emerald-400 transition-colors">
                  Garbage Hotspots
                </button>
              </li>
              <li>
                <button onClick={() => navigate('collector')} className="hover:text-emerald-400 transition-colors">
                  Collector Dispatch
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin')} className="hover:text-emerald-400 transition-colors">
                  Municipal Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigate('impact')} className="hover:text-emerald-400 transition-colors">
                  City Impact Metrics
                </button>
              </li>
            </ul>
          </div>

          {/* Municipal Helpline */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Civic Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>1800-CLEAN-PUNE (Toll-Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>swachh@cleansight.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart City Operations Center</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CleanSight Civic Tech. Built for Smart India Cleanliness Initiatives.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Anti-Fraud Shield
            </button>
            <button
              onClick={() => navigate('terms')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
            >
              Municipal Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
