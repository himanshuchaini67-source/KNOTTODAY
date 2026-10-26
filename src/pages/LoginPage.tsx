import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Heart,
  User,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Database,
  Download,
  RotateCcw,
  Activity,
  Server,
  Layers,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { Modal } from '@/components/Modal';
import { ToastContainer } from '@/components/ToastContainer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { db, type UserRecord, type AuditLogRecord } from '@/db';

const REMEMBERED_EMAIL_KEY = 'wedding_remembered_email';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithCredentials, registerNewCouple, resetPassword, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  // Target path to redirect after successful login
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  // Tabs: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingCity, setWeddingCity] = useState('');

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Database Explorer Modal State
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbUsers, setDbUsers] = useState<UserRecord[]>([]);
  const [dbAuditLogs, setDbAuditLogs] = useState<AuditLogRecord[]>([]);
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalAuditLogs: 0,
    storageEngine: 'IndexedDB + LocalStore (Hybrid)',
  });

  // Refresh DB state
  const refreshDbData = () => {
    setDbUsers(db.getAllUsers());
    setDbAuditLogs(db.getAuditLogs(15));
    setDbStats(db.getStats());
  };

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  // Load remembered email and initial DB stats on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setSignInEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {
      console.error(e);
    }
    refreshDbData();
  }, []);

  // Format friendly name of protected destination if redirected
  const getDestinationName = (path: string): string => {
    if (path.includes('/bill')) return 'Wedding Bill & Invoices';
    if (path.includes('/guests')) return 'Guest List Management';
    if (path.includes('/tasks')) return 'Wedding Tasks Checklist';
    if (path.includes('/journey')) return 'Wedding Journey Roadmap';
    if (path.includes('/notifications')) return 'Wedding Notifications';
    if (path.includes('/sangeet')) return 'Sangeet Playlist Planner';
    return 'Client Dashboard';
  };

  // Handle Sign In submission
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signInEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginWithCredentials(signInEmail, signInPassword);
      setIsLoading(false);

      if (res.success) {
        try {
          if (rememberMe) {
            localStorage.setItem(REMEMBERED_EMAIL_KEY, signInEmail.trim());
          } else {
            localStorage.removeItem(REMEMBERED_EMAIL_KEY);
          }
        } catch (err) {
          console.error(err);
        }

        const coupleGreeting = res.user
          ? `${res.user.brideName} & ${res.user.groomName}`
          : 'Welcome back';

        showToast(`Signed in successfully! Welcome, ${coupleGreeting}.`, 'success');
        refreshDbData();
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message || 'Invalid email or password.');
        refreshDbData();
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Database connection error occurred.');
    }
  };

  // Handle Sign Up (Registration) submission
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!brideName.trim() || !groomName.trim()) {
      setErrorMessage('Please enter both Bride and Groom names.');
      return;
    }

    if (!signUpEmail.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      let formattedDate = 'To Be Decided';
      if (weddingDate) {
        try {
          const d = new Date(weddingDate);
          formattedDate = d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          formattedDate = weddingDate;
        }
      }

      const res = await registerNewCouple({
        brideName,
        groomName,
        email: signUpEmail,
        password: signUpPassword,
        weddingDate: formattedDate,
        location: weddingCity.trim() || 'Venue Pending',
      });

      setIsLoading(false);

      if (res.success) {
        showToast(
          `Welcome to Knot Today, ${brideName} & ${groomName}! Your wedding account was saved in the database.`,
          'success'
        );
        refreshDbData();
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Database error creating account.');
    }
  };

  // Quick fill demo user
  const setDemoAccount = (email: string) => {
    setActiveTab('signin');
    setSignInEmail(email);
    setSignInPassword('password123');
    setErrorMessage('');
  };

  // Handle Forgot Password submission
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotEmail) {
      setForgotError('Please enter your account email.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }

    const res = await resetPassword(forgotEmail, newPassword);
    if (res.success) {
      showToast(res.message || 'Password reset successfully in database!', 'success');
      setSignInEmail(forgotEmail);
      setSignInPassword(newPassword);
      setIsForgotModalOpen(false);
      setForgotEmail('');
      setNewPassword('');
      refreshDbData();
    } else {
      setForgotError(res.message || 'Failed to reset password.');
    }
  };

  // Download DB JSON dump
  const handleDownloadDb = () => {
    const dump = db.exportDump();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knot_today_db_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database dump downloaded successfully!');
  };

  // Reset DB
  const handleResetDb = () => {
    if (window.confirm('Reset database to initial seeds? Custom registered couples will be reset.')) {
      db.resetToDefaults();
      refreshDbData();
      showToast('Database reset to initial demo seeds.', 'info');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-gradient-to-br from-ivory via-champagne-50/40 to-burgundy-50/30 px-4 py-8 md:py-12 selection:bg-champagne-300 selection:text-burgundy-950">
      {/* ─── Top Bar with Return & Security Badges ─── */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-burgundy-100/80 bg-white/80 px-4 py-2 text-xs font-semibold text-burgundy-950 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow"
        >
          <ArrowLeft className="h-4 w-4 text-burgundy-700" />
          <span>Back to Knot Today</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/60">
          <ShieldCheck className="h-4 w-4 text-burgundy-600" />
          256-Bit Encrypted Client Portal
        </span>
      </div>

      {/* ─── Main Auth Card ─── */}
      <div className="mx-auto my-auto w-full max-w-md">
        {/* Redirect Notice Banner if arriving from a Protected Page */}
        {from !== '/' && (
          <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 shadow-xs">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-700" />
            <div>
              <span className="font-bold">Authentication Required:</span> Sign in to access your{' '}
              <strong>{getDestinationName(from)}</strong>.
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-burgundy-100 bg-white p-7 md:p-9 shadow-2xl ring-1 ring-burgundy-950/5">
          {/* Prominent Logo & Heading */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Link to="/" className="mb-4 inline-block transition-transform hover:scale-105">
              <BrandLogo size="lg" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-burgundy-950">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Couple Account'}
            </h1>
            <p className="mt-1.5 text-xs text-charcoal/65 max-w-xs">
              {activeTab === 'signin'
                ? 'Sign in to access your bespoke wedding planning dashboard'
                : 'Register your wedding in the database to manage bookings, guest lists, and budgets'}
            </p>
          </div>

          {/* ─── Tab Switcher (Sign In vs Create Account) ─── */}
          <div className="mb-6 flex rounded-xl border border-burgundy-100 bg-burgundy-50/60 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-burgundy-950 shadow-xs'
                  : 'text-charcoal/60 hover:text-burgundy-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-burgundy-950 shadow-xs'
                  : 'text-charcoal/60 hover:text-burgundy-900'
              }`}
            >
              Create Couple Account
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ══════════ 1. SIGN IN FORM ══════════ */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@wedding.com"
                    className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-charcoal/80">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(signInEmail);
                      setForgotError('');
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-burgundy-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-10 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                    title={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-burgundy-200 text-burgundy-700 focus:ring-burgundy-400"
                  />
                  <span>Remember my email</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <span>Authenticating via Database...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ══════════ 2. CREATE COUPLE ACCOUNT (SIGN UP) ══════════ */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Bride's Name *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-500" />
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Aishwarya"
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Groom's Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-champagne-700" />
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Rohan"
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="couple@wedding.com"
                    className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-7 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                    >
                      {showSignUpPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Wedding Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                    Wedding City / Venue
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      type="text"
                      value={weddingCity}
                      onChange={(e) => setWeddingCity(e.target.value)}
                      placeholder="e.g. Udaipur, Jaipur"
                      className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg mt-3 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Create Our Wedding Portal</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ─── Demo Accounts Quick Switcher Box ─── */}
          <div className="mt-7 rounded-2xl border border-burgundy-100 bg-burgundy-50/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-burgundy-900">⚡ Instant Demo Accounts in DB:</p>
              <span className="text-[10px] text-charcoal/50">One-click auto-fill</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setDemoAccount('aishwarya@wedding.com')}
                className="w-full rounded-xl border border-burgundy-100 bg-white p-2.5 text-left text-xs transition-colors hover:bg-burgundy-50 hover:border-burgundy-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-burgundy-900">Aishwarya &amp; Rohan</span>
                  <span className="rounded bg-burgundy-100 px-1.5 py-0.5 text-[10px] font-semibold text-burgundy-800">
                    Active Wedding
                  </span>
                </div>
                <p className="text-charcoal/60 text-[11px] mt-0.5">
                  Email: <code className="font-mono text-burgundy-700">aishwarya@wedding.com</code> &bull; Password: <code className="font-mono text-burgundy-700">password123</code>
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('newuser@wedding.com')}
                className="w-full rounded-xl border border-burgundy-100 bg-white p-2.5 text-left text-xs transition-colors hover:bg-burgundy-50 hover:border-burgundy-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-burgundy-900">Vikram &amp; Priya</span>
                  <span className="rounded bg-champagne-100 px-1.5 py-0.5 text-[10px] font-semibold text-champagne-900">
                    Fresh Slate
                  </span>
                </div>
                <p className="text-charcoal/60 text-[11px] mt-0.5">
                  Email: <code className="font-mono text-burgundy-700">newuser@wedding.com</code> &bull; Password: <code className="font-mono text-burgundy-700">password123</code>
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* ─── LIVE DATABASE STATUS PILL ─── */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-burgundy-100/70 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-burgundy-950">Database:</span>
            <span className="text-charcoal/70">KnotTodayAuthDB</span>
            <span className="hidden sm:inline text-charcoal/40">&bull;</span>
            <span className="hidden sm:inline text-xs font-medium text-emerald-700">
              {dbStats.totalUsers} Registered Couples
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              refreshDbData();
              setIsDbModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-burgundy-100 bg-white px-2.5 py-1 text-xs font-bold text-burgundy-800 shadow-2xs hover:bg-burgundy-50 transition-colors"
          >
            <Database className="h-3.5 w-3.5 text-burgundy-700" />
            <span>DB Records</span>
          </button>
        </div>
      </div>

      {/* ─── Forgot Password Modal ─── */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-xs text-charcoal/70">
            Enter your registered wedding email and choose a new password. The database will update your credentials immediately.
          </p>

          {forgotError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {forgotError}
            </div>
          )}

          <div>
            <label className="label-field">Registered Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@wedding.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label-field">New Password *</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Update in Database
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── DATABASE EXPLORER MODAL ─── */}
      <Modal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        title="Knot Today Auth & Accounts Database"
      >
        <div className="space-y-5">
          {/* Engine Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-burgundy-950 p-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-champagne-300" />
                <h4 className="text-sm font-bold text-white">KnotTodayAuthDB</h4>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  ONLINE
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70">
                Engine: <span className="font-mono text-champagne-200">IndexedDB + LocalStore (Hybrid)</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadDb}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                title="Download JSON Dump"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={handleResetDb}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
                title="Reset Database"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-burgundy-100 bg-burgundy-50/40 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Total Users</p>
              <p className="text-lg font-bold text-burgundy-950">{dbStats.totalUsers}</p>
            </div>
            <div className="rounded-xl border border-burgundy-100 bg-burgundy-50/40 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Sessions</p>
              <p className="text-lg font-bold text-burgundy-950">{dbStats.totalSessions}</p>
            </div>
            <div className="rounded-xl border border-burgundy-100 bg-burgundy-50/40 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Audit Logs</p>
              <p className="text-lg font-bold text-burgundy-950">{dbStats.totalAuditLogs}</p>
            </div>
          </div>

          {/* Table: Registered Users */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-burgundy-900 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>Table: users ({dbUsers.length} records)</span>
              </h5>
            </div>
            <div className="max-h-44 overflow-y-auto rounded-xl border border-burgundy-100 text-xs">
              <table className="w-full text-left">
                <thead className="bg-burgundy-50/60 text-[10px] uppercase font-bold text-charcoal/60 sticky top-0">
                  <tr>
                    <th className="p-2">Couple Names</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Wedding Date</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-burgundy-50">
                  {dbUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-burgundy-50/30">
                      <td className="p-2 font-semibold text-burgundy-950">
                        {u.brideName} &amp; {u.groomName}
                      </td>
                      <td className="p-2 font-mono text-charcoal/70 text-[11px]">{u.email}</td>
                      <td className="p-2 text-charcoal/70">{u.weddingDate}</td>
                      <td className="p-2">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Audit Logs Stream */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-burgundy-900 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Live Audit Log Stream</span>
              </h5>
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-burgundy-100 bg-stone-50 p-2.5 font-mono text-[11px] space-y-1.5">
              {dbAuditLogs.map((log) => {
                const color =
                  log.event === 'LOGIN_SUCCESS'
                    ? 'text-emerald-700 font-bold'
                    : log.event === 'LOGIN_FAILED'
                    ? 'text-rose-600 font-bold'
                    : log.event === 'REGISTER'
                    ? 'text-blue-700 font-bold'
                    : 'text-amber-700 font-bold';
                return (
                  <div key={log.id} className="flex items-start gap-2 border-b border-stone-200/50 pb-1 last:border-0">
                    <span className="text-stone-400 text-[10px] flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`rounded px-1 text-[10px] ${color}`}>[{log.event}]</span>
                    <span className="text-stone-700 truncate">{log.details}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="button"
              onClick={() => setIsDbModalOpen(false)}
              className="btn-primary py-2 px-5 text-xs"
            >
              Close Database Inspector
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-charcoal/50">
        &copy; {new Date().getFullYear()} Knot Today &bull; Bespoke Luxury Wedding Planning
      </div>

      <ToastContainer />
    </div>
  );
}
