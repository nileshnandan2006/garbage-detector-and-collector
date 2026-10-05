import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { api } from '../services/api.js';
import { RewardItem, RewardTransaction } from '../types/index.js';
import {
  Coins,
  Award,
  Sparkles,
  Ticket,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gift,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';

interface RewardsPageProps {
  navigate: (page: string) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({ navigate }) => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotifications();

  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [history, setHistory] = useState<RewardTransaction[]>([]);
  const [balance, setBalance] = useState<number>(user?.points || 0);
  const [rank, setRank] = useState<string>(user?.rank || 'Green Starter');
  const [isLoading, setIsLoading] = useState(true);

  // Success Redemption Modal
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [redeemedTitle, setRedeemedTitle] = useState<string | null>(null);

  const loadRewardsData = async () => {
    setIsLoading(true);
    try {
      const [catalogRes, historyRes] = await Promise.all([
        api.getRewards(),
        api.getRewardHistory().catch(() => ({ balance: user?.points || 0, transactions: [] }))
      ]);

      setCatalog(catalogRes.rewards || []);
      setHistory(historyRes.transactions || []);
      if (historyRes.balance !== undefined) setBalance(historyRes.balance);
      if (historyRes.rank) setRank(historyRes.rank);
    } catch (err) {
      console.error('Failed to load rewards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRewardsData();
  }, [user]);

  const handleRedeem = async (reward: RewardItem) => {
    if (!user) {
      showToast('Please login to redeem rewards.', 'error');
      navigate('login');
      return;
    }

    if (balance < reward.points_cost) {
      showToast(`You need ${reward.points_cost} points to redeem this item. Keep reporting to earn!`, 'error');
      return;
    }

    try {
      const res = await api.redeemReward(reward.id);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setRedeemedCode(res.voucherCode);
      setRedeemedTitle(reward.title);
      setBalance(res.newBalance);
      await refreshUser();
      await loadRewardsData();
      showToast(`Successfully redeemed ${reward.title}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to redeem reward.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner & Balance Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Civic Rewards & Redemption Exchange</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your CleanSight Rewards</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Points earned from verified garbage detection and cleanups can be exchanged for digital badges, local green store vouchers, transit discounts, and official honors.
          </p>
        </div>

        {/* Balance Showcase */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[200px] space-y-1">
          <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block">Available Points</span>
          <div className="text-4xl font-black text-amber-300 font-mono tracking-tight">{balance}</div>
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
            {rank}
          </div>
        </div>
      </div>

      {/* 2. How to Earn Points Guide */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base">Reward Points Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="text-slate-400 block mb-0.5">Low Severity</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">+10 pts</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="text-slate-400 block mb-0.5">Medium Severity</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">+25 pts</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="text-slate-400 block mb-0.5">High Severity</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">+50 pts</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <span className="text-slate-400 block mb-0.5">Hotspot Incident</span>
            <span className="font-bold text-amber-600 text-sm font-mono">+100 pts</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center col-span-2 sm:col-span-1">
            <span className="text-emerald-800 font-bold block mb-0.5">Before/After Bonus</span>
            <span className="font-black text-emerald-700 text-sm font-mono">+20 pts</span>
          </div>
        </div>
      </div>

      {/* 3. Rewards Redemption Catalog (Requirement #7) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Redeem Rewards Catalog</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((item) => {
            const canAfford = balance >= item.points_cost;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-100">
                      {item.icon}
                    </span>
                    <span className="font-mono font-black text-emerald-700 text-base">
                      {item.points_cost} pts
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">{item.partner_name}</span>
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Gift className="w-3.5 h-3.5" />
                        Redeem Now
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Need {item.points_cost - balance} more
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Reward Transaction History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Points Transaction Ledger</h3>
            <p className="text-xs text-slate-500">Record of verified cleanup credits and redeemed coupons</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total Transactions: {history.length}</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions yet. Report public waste to start earning points!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {history.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    tx.type === 'EARNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {tx.type === 'EARNED' ? <Coins className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{tx.reason}</span>
                    <span className="text-[10px] text-slate-400">{new Date(tx.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <span className={`font-mono font-bold text-sm ${
                  tx.amount > 0 ? 'text-emerald-700' : 'text-slate-600'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REDEEM SUCCESS MODAL */}
      {redeemedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">Reward Successfully Redeemed!</h3>
              <p className="text-xs text-slate-500">You unlocked: <b>{redeemedTitle}</b></p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Your Digital Voucher Code</span>
              <div className="text-xl font-mono font-black text-emerald-700 tracking-wider select-all">
                {redeemedCode}
              </div>
              <p className="text-[10px] text-slate-400">Present this voucher code at partner stores or metro counter.</p>
            </div>

            <button
              onClick={() => {
                setRedeemedCode(null);
                setRedeemedTitle(null);
              }}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Done & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
