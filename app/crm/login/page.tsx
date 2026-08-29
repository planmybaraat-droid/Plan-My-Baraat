'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import { isCrmSupabaseConfigured } from '../lib/supabase-crm';

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Supabase Auth', desc: 'Encrypted sessions, never stored in plain text' },
  { icon: KeyRound, label: 'Role-based access', desc: 'Every account is scoped to what it needs' },
  { icon: Sparkles, label: 'Built for the team', desc: 'One workspace for leads, vendors & agreements' },
];

function LoginForm() {
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get('redirect');
  const redirectTo = requestedRedirect?.startsWith('/crm') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/crm';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const friendlyError = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes('invalid login credentials')) return "That email or password doesn't match our records.";
    if (m.includes('email not confirmed')) return 'Please confirm your email address before signing in.';
    if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a moment and try again.';
    if (m.includes('fetch') || m.includes('network')) return "Can't reach the server. Check your connection and try again.";
    return 'Something went wrong while signing in. Please try again.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    if (!isCrmSupabaseConfigured) {
      setError('CRM authentication is not configured. Ask an administrator to configure the Supabase environment variables.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/crm/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const result = await response.json().catch(() => null) as { email?: string; error?: string } | null;

      if (!response.ok) throw new Error(result?.error || 'Unable to sign in.');

      localStorage.setItem('crm_session', 'true');
      localStorage.setItem('crm_remember', rememberMe ? 'true' : 'false');
      localStorage.setItem('crm_user', JSON.stringify({ email: result?.email || trimmedEmail, name: result?.email || trimmedEmail }));
      sessionStorage.setItem('crm_active_session', '1');

      setSuccess(true);
      window.location.assign(redirectTo);
      return;
    } catch (err: unknown) {
      setError(err instanceof Error ? friendlyError(err.message) : 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between overflow-hidden bg-[#090a0d] text-white p-12">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/venue_luxury.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(9,10,13,0.96) 10%, rgba(9,10,13,0.86) 55%, rgba(46,6,9,0.9) 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 animate-[float_6s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, rgba(227,11,29,0.55), transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="crm-brand-crop" aria-hidden="true">
            <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
          </div>
          <span className="mt-1 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/50">
            <i className="h-px w-5 bg-red-600" /> Management CRM <i className="h-px w-5 bg-red-600" />
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
            Welcome back to your<br />operations workspace.
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">
            Leads, vendors, quotations, agreements and invoices — everything your team needs to run Plan My Baraat, in one secure place.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {TRUST_POINTS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon size={15} className="text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/90">{label}</p>
                <p className="text-[11px] text-white/45">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth card */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="lg:hidden overflow-hidden rounded-2xl bg-[#090a0d] px-4 pb-4 pt-2 text-center shadow-[0_18px_44px_-28px_rgba(0,0,0,.9)]">
            <div className="crm-brand-crop mx-auto" aria-hidden="true">
              <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
            </div>
            <span className="mt-[-2px] inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
              <i className="h-px w-5 bg-red-600" /> Management CRM <i className="h-px w-5 bg-red-600" />
            </span>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-xs text-gray-500">Sign in to access your secure operations workspace.</p>
          </div>

          {!isCrmSupabaseConfigured && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs text-red-900 font-medium" role="alert">
              <div className="flex items-center gap-2 font-bold text-red-950">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>CRM connection unavailable</span>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">
                Authentication and database access are not configured on this deployment. Contact the system administrator; local or demo sign-in is disabled for security.
              </p>
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center" role="status" aria-live="polite">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 size={26} className="text-green-600" />
              </div>
              <p className="text-sm font-bold text-gray-800">Signed in successfully</p>
              <p className="text-xs text-gray-500">Taking you to your dashboard…</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-semibold leading-relaxed" role="alert">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="crm-email" className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input
                      id="crm-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      placeholder="you@planmybaraat.com"
                      required
                      aria-required="true"
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="crm-password" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="/crm/forgot-password" className="text-[10px] font-bold text-red-600 hover:text-red-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input
                      id="crm-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      className="w-full pl-9 pr-10 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500/30"
                  />
                  Keep me signed in on this device
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                  {loading ? 'Signing in…' : 'Log In'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mt-6 text-[11px] text-gray-400">© {new Date().getFullYear()} Plan My Baraat. Internal use only.</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LoginForm />
    </Suspense>
  );
}
