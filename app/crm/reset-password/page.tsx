'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { crmSupabase } from '../lib/supabase-crm';

type LinkState = 'checking' | 'valid' | 'invalid';

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABEL = ['Very weak', 'Weak', 'Fair', 'Strong', 'Excellent'];
const STRENGTH_COLOR = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

export default function ResetPasswordPage() {
  const router = useRouter();
  const [linkState, setLinkState] = useState<LinkState>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let resolved = false;

    const { data: subscription } = crmSupabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        resolved = true;
        setLinkState('valid');
      }
    });

    // If a recovery session was already established before this listener attached.
    crmSupabase.auth.getSession().then(({ data }) => {
      if (!resolved && data.session) {
        resolved = true;
        setLinkState('valid');
      }
    });

    const timeout = setTimeout(() => {
      if (!resolved) setLinkState('invalid');
    }, 4000);

    return () => {
      clearTimeout(timeout);
      subscription.subscription.unsubscribe();
    };
  }, []);

  const score = strength(password);
  const passwordsMatch = password.length > 0 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await crmSupabase.auth.updateUser({ password });
      if (updateError) throw new Error(updateError.message);
      setSuccess(true);
      setTimeout(() => router.push('/crm/login'), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="overflow-hidden rounded-2xl bg-[#090a0d] px-4 pb-4 pt-2 text-center shadow-[0_18px_44px_-28px_rgba(0,0,0,.9)]">
          <div className="crm-brand-crop mx-auto" aria-hidden="true">
            <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
          </div>
          <span className="mt-[-2px] inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
            <i className="h-px w-5 bg-red-600" /> Management CRM <i className="h-px w-5 bg-red-600" />
          </span>
        </div>

        {linkState === 'checking' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 size={22} className="animate-spin text-red-600" />
            <p className="text-xs font-semibold text-gray-500">Validating your reset link…</p>
          </div>
        )}

        {linkState === 'invalid' && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <XCircle size={26} className="text-red-600" />
            </div>
            <h1 className="text-base font-bold text-gray-900">Link expired or invalid</h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              This password reset link is no longer valid. Request a new one to continue.
            </p>
            <Link href="/crm/forgot-password" className="mt-2 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700">
              Request new link
            </Link>
          </div>
        )}

        {linkState === 'valid' && !success && (
          <>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Choose a new password</h1>
              <p className="mt-1 text-xs text-gray-500">Make it something you haven&apos;t used before.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-semibold leading-relaxed" role="alert">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="new-password" className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? STRENGTH_COLOR[score] : 'bg-gray-150 bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-[10px] font-semibold text-gray-400">{STRENGTH_LABEL[score]}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="confirm-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
                  />
                </div>
                {confirm.length > 0 && !passwordsMatch && (
                  <p className="mt-1.5 text-[10px] font-semibold text-red-500">Passwords don&apos;t match yet.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        {success && (
          <div className="flex flex-col items-center text-center gap-3 py-4" role="status" aria-live="polite">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={26} className="text-green-600" />
            </div>
            <h1 className="text-base font-bold text-gray-900">Password updated</h1>
            <p className="text-xs text-gray-500">Redirecting you to login…</p>
          </div>
        )}
      </div>
    </div>
  );
}
