'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

export default function QuoteMakerLogin() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/quote-maker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Incorrect ID or password.');
      }
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfbf9] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PlanMyBaraat" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="text-base font-black text-gray-950">Quote Maker</h1>
            <p className="text-xs text-gray-400">Staff sign-in required</p>
          </div>
        </div>
        <label className="agreement-field"><span>ID</span>
          <input value={id} onChange={e => setId(e.target.value)} autoFocus autoComplete="off" spellCheck={false} />
        </label>
        <label className="agreement-field mt-4"><span>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" />
        </label>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy || !id || !password}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
