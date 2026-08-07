'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, CheckCircle2, ListChecks, CalendarClock } from 'lucide-react';
import AuthShell from '../../crm/components/AuthShell';
import { crmSupabase, isCrmSupabaseConfigured } from '../../crm/lib/supabase-crm';

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Supabase Auth', desc: 'Your login is encrypted end to end' },
  { icon: ListChecks, label: 'Your work, in one place', desc: 'Tasks, leads, quotations & agreements' },
  { icon: CalendarClock, label: 'Attendance made simple', desc: 'Punch in/out with a selfie, from anywhere' },
];

function WorkspaceLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/workspace';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const friendlyError = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes('invalid login credentials')) return "That CRM ID/email or password doesn't match our records.";
    if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a moment and try again.';
    if (m.includes('fetch') || m.includes('network')) return "Can't reach the server. Check your connection and try again.";
    return 'Something went wrong while signing in. Please try again.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const trimmedId = identifier.trim();
    const trimmedPassword = password.trim();
    if (!trimmedId || !trimmedPassword) { setError('Please enter your CRM ID/email and password.'); return; }

    setLoading(true);
    setError(null);

    if (!isCrmSupabaseConfigured) {
      setError('Staff authentication is not configured. Ask an administrator to configure the Supabase environment variables.');
      setLoading(false);
      return;
    }

    try {
      // Try resolving as a CRM ID first (case-insensitive) — if that doesn't
      // match anything, fall back to treating what they typed as the email
      // itself, so both a CRM ID and a real email always work here.
      let email = trimmedId;
      const { data: resolved } = await crmSupabase.rpc('resolve_crm_login', { crm_id_input: trimmedId });
      if (resolved) email = resolved as string;

      const { data, error: authError } = await crmSupabase.auth.signInWithPassword({ email, password: trimmedPassword });
      if (authError) throw new Error(authError.message);

      if (data?.session) {
        localStorage.setItem('workspace_session', 'true');
        sessionStorage.setItem('workspace_active_session', '1');
        setSuccess(true);
        setTimeout(() => router.push(redirectTo), 400);
      }
    } catch (err) {
      setError(err instanceof Error ? friendlyError(err.message) : 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Staff Workspace"
      heading={<>Welcome back — let&apos;s<br />get to work.</>}
      description="Your tasks, attendance, leads, quotations and agreements — everything you need for the day, in one place."
      trustPoints={TRUST_POINTS}
    >
      <div className="hidden lg:block">
        <h2 className="text-xl font-bold text-gray-900">Staff sign in</h2>
        <p className="mt-1 text-xs text-gray-500">Use the CRM ID and password your admin gave you.</p>
      </div>

      {!isCrmSupabaseConfigured && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs text-red-900 font-medium" role="alert">
          <div className="flex items-center gap-2 font-bold text-red-950">
            <AlertCircle size={15} className="text-red-600 shrink-0" />
            <span>Workspace connection unavailable</span>
          </div>
          <p className="text-[11px] text-red-800 leading-relaxed">
            Authentication and database access are not configured on this deployment. Contact the system administrator; local or demo sign-in is disabled for security.
          </p>
        </div>
      )}

      {success ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center" role="status" aria-live="polite">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><CheckCircle2 size={26} className="text-green-600" /></div>
          <p className="text-sm font-bold text-gray-800">Signed in successfully</p>
          <p className="text-xs text-gray-500">Taking you to your workspace…</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-semibold leading-relaxed" role="alert">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label htmlFor="ws-id" className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">CRM ID or Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input id="ws-id" value={identifier} onChange={(e) => setIdentifier(e.target.value)} type="text" autoComplete="username" placeholder="PMB-002 or you@planmybaraat.com" required
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ws-password" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <Link href="/crm/forgot-password" className="text-[10px] font-bold text-red-600 hover:text-red-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input id="ws-password" value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" required
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
              {loading && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

export default function WorkspaceLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <WorkspaceLoginForm />
    </Suspense>
  );
}
