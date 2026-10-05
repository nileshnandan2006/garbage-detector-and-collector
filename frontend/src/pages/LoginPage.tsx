import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, X } from 'lucide-react';

interface LoginPageProps {
  navigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, loginWithGoogle, resetPassword, switchDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      showToast('Logged in successfully via Firebase!', 'success');
      navigate('home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google successfully!', 'success');
      navigate('home');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMsg(err.message || 'Google sign-in was cancelled or encountered an error.');
      showToast('Google sign-in failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    try {
      await resetPassword(resetEmail);
      setResetDone(true);
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send password reset email.', 'error');
    }
  };

  const handleQuickDemo = async (role: 'citizen' | 'collector' | 'admin') => {
    setIsSubmitting(true);
    try {
      await switchDemoUser(role);
      showToast(`Logged in as demo ${role}!`, 'success');
      if (role === 'collector') navigate('collector');
      else if (role === 'admin') navigate('admin');
      else navigate('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Demo login failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/30">
          <img src="/logo.png" alt="CleanSight Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome to CleanSight</h1>
        <p className="text-xs text-slate-500">Sign in to report waste, coordinate collections, or manage municipal audits.</p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>🔥</span>
          <span>Firebase Authentication Active</span>
        </div>
      </div>

      {/* Google 1-Click Authentication Button (Firebase) */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-xs font-bold text-xs text-slate-700 flex items-center justify-center gap-3 transition-all hover:border-emerald-500"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-slate-50 px-3 text-[11px] text-slate-400 uppercase font-semibold">Or Email Login</span>
      </div>

      {/* Standard Email Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl leading-relaxed">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setShowForgotModal(true);
                setResetDone(false);
              }}
              className="text-emerald-700 hover:underline text-[11px] font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Authenticating with Firebase...' : 'Sign In with Email'}
        </button>

        <div className="pt-2 text-center text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Create Citizen Account
          </button>
        </div>
      </form>

      {/* 1-Click Quick Demo Login Box */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            ⚡ Quick 1-Click Demo Evaluation Roles
          </span>
          <span className="text-[10px] text-slate-400 font-mono">No typing required</span>
        </div>

        <div className="space-y-2">
          {/* Citizen Demo */}
          <button
            type="button"
            onClick={() => handleQuickDemo('citizen')}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                🧑
              </span>
              <div>
                <span className="font-bold text-white group-hover:text-emerald-300 block">Citizen (Rahul Sharma)</span>
                <span className="text-[10px] text-slate-400">1850 pts • 42 reports submitted</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </button>

          {/* Collector Demo */}
          <button
            type="button"
            onClick={() => handleQuickDemo('collector')}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-amber-950/80 border border-slate-700 hover:border-amber-500/50 flex items-center justify-between text-left transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                👷
              </span>
              <div>
                <span className="font-bold text-white group-hover:text-amber-300 block">Collector (Suresh Kumar)</span>
                <span className="text-[10px] text-slate-400">Field staff • Assigned cleanups</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
          </button>

          {/* Admin Demo */}
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-950/80 border border-slate-700 hover:border-indigo-500/50 flex items-center justify-between text-left transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                🏛️
              </span>
              <div>
                <span className="font-bold text-white group-hover:text-indigo-300 block">Municipal Admin (Rajesh Deshmukh)</span>
                <span className="text-[10px] text-slate-400">Municipal Commissioner • Full Authority</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Forgot Password Modal (Firebase) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetDone ? (
              <div className="text-center space-y-3 py-2 text-xs">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="font-bold text-slate-800">Check Your Email</p>
                <p className="text-slate-500">
                  Firebase has dispatched a secure password reset link to <b>{resetEmail}</b>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <p className="text-slate-500">
                  Enter your email address and Firebase will send you a password reset link.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. citizen@gmail.com"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
