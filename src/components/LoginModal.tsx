import { useState } from 'react';
import { X, Lock, Mail, Sparkles, CheckCircle2, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CUSTOMER_1, CUSTOMER_2 } from '@/data/userProfiles';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginAs, loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    loginWithCredentials(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-burgundy-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-charcoal/40 hover:bg-burgundy-50 hover:text-charcoal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-700 text-white shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-burgundy-950">Client Portal Login</h2>
          <p className="mt-1 text-xs text-charcoal/60">
            Select a dummy user profile or enter credentials
          </p>
        </div>

        {/* Quick Demo Credentials Selection */}
        <div className="mb-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-burgundy-700">
            ⚡ Quick Demo Accounts
          </p>

          {/* Customer 1 */}
          <button
            onClick={() => {
              loginAs(CUSTOMER_1);
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-champagne-300 bg-gradient-to-r from-champagne-50 to-rose-50 p-3.5 text-left transition-all hover:border-champagne-500 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy-700 text-xs font-bold text-white shadow">
                {CUSTOMER_1.coupleInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-burgundy-900">
                  {CUSTOMER_1.brideName} & {CUSTOMER_1.groomName} (Customer 1)
                </p>
                <p className="text-xs text-charcoal/60">
                  <span className="font-semibold text-emerald-600">Existing Booking</span> • {CUSTOMER_1.email}
                </p>
              </div>
            </div>
            <UserCheck className="h-5 w-5 text-burgundy-700" />
          </button>

          {/* Customer 2 - Blank Slate */}
          <button
            onClick={() => {
              loginAs(CUSTOMER_2);
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-burgundy-200 bg-burgundy-50/60 p-3.5 text-left transition-all hover:border-burgundy-400 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow">
                {CUSTOMER_2.coupleInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-burgundy-900">
                  {CUSTOMER_2.brideName} & {CUSTOMER_2.groomName} (Customer 2)
                </p>
                <p className="text-xs text-charcoal/60">
                  <span className="font-semibold text-burgundy-600">Brand New User</span> • Blank Slate
                </p>
              </div>
            </div>
            <UserPlus className="h-5 w-5 text-burgundy-700" />
          </button>
        </div>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-burgundy-100" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-charcoal/40">
            or login with credentials
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-charcoal/70">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aishwarya@wedding.com or newuser@wedding.com"
                className="w-full rounded-xl border border-burgundy-100 py-2.5 pl-9 pr-3 text-sm focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-charcoal/70">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-burgundy-100 py-2.5 pl-9 pr-3 text-sm focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
              />
            </div>
            <p className="mt-1 text-[11px] text-charcoal/40">
              Default password: <code className="font-mono text-burgundy-700">password123</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-burgundy-700 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-burgundy-800"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
