import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { Sparkles, User, Mail, Lock, Phone, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  navigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Pune');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register(name, email, password, role, phone, city);
      showToast('Firebase account created! +50 welcome bonus points credited.', 'success');
      navigate('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      showToast(err.message || 'Registration error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google! +50 welcome bonus credited.', 'success');
      navigate('dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google signup failed.');
      showToast('Google signup failed.', 'error');
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
        <h1 className="text-2xl font-bold text-slate-900">Join CleanSight</h1>
        <p className="text-xs text-slate-500">Sign up with Firebase to report waste, earn rewards, and keep your city clean.</p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>🔥</span>
          <span>Firebase Authentication Active</span>
        </div>
      </div>

      {/* Google 1-Click Signup Button */}
      <button
        type="button"
        onClick={handleGoogleRegister}
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
        <span>Sign up with Google (Firebase)</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-slate-50 px-3 text-[11px] text-slate-400 uppercase font-semibold">Or with Email</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl leading-relaxed">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@gmail.com"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="citizen">Citizen Custodian</option>
              <option value="collector">Cleaning Staff / Collector</option>
              <option value="admin">Municipal Authority</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">City Ward</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune"
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98000 00000"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>New citizen accounts receive +50 welcome bonus points!</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Registering via Firebase...' : 'Create Account'}
        </button>

        <div className="pt-2 text-center text-slate-500">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};
