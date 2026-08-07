'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Loader2, AlertCircle, ArrowLeft, MailCheck } from 'lucide-react';
import { crmSupabase, isCrmSupabaseConfigured } from '../lib/supabase-crm';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    if (!isCrmSupabaseConfigured) {
      setLoading(false);
      setError('Password recovery is unavailable because CRM authentication is not configured. Contact the system administrator.');
      return;
    }

    try {
      const { error: resetError } = await crmSupabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/crm/reset-password`,
      });
      // Always show success — never reveal whether an email address has an account.
      if (resetError) console.error(resetError.message);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't send the reset email right now. Please try again in a moment.");
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

        {sent ? (
          <div className="flex flex-col items-center text-center gap-3 py-4" role="status" aria-live="polite">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <MailCheck size={26} className="text-green-600" />
            </div>
            <h1 className="text-base font-bold text-gray-900">Check your inbox</h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              If an account exists for <span className="font-semibold text-gray-700">{email.trim()}</span>, we&apos;ve sent a link to reset your password. It expires shortly, so use it soon.
            </p>
            <Link href="/crm/login" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700">
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Reset your password</h1>
              <p className="mt-1 text-xs text-gray-500">Enter your work email and we&apos;ll send you a secure reset link.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-semibold leading-relaxed" role="alert">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reset-email" className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="reset-email"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <Link href="/crm/login" className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">
              <ArrowLeft size={13} /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
