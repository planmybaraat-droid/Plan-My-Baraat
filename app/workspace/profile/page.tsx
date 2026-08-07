'use client';

import { useEffect, useState } from 'react';
import { Camera, Loader2, Save, Check, Lock } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { crmSupabase } from '../../crm/lib/supabase-crm';
import { ROLE_LABELS } from '../../crm/lib/useCrmProfile';

export default function WorkspaceProfilePage() {
  const { open } = useSidebar();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [crmId, setCrmId] = useState('');
  const [role, setRole] = useState('staff');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await crmSupabase.auth.getUser();
      if (!user) return;
      setUserId(user.id); setEmail(user.email || '');
      const [{ data: profile }, { data: staff }] = await Promise.all([
        crmSupabase.from('crm_users').select('full_name, role, phone, avatar_url').eq('id', user.id).maybeSingle(),
        crmSupabase.from('crm_staff').select('crm_id').eq('user_id', user.id).maybeSingle(),
      ]);
      if (profile) { setFullName(profile.full_name || ''); setRole(profile.role); setPhone(profile.phone || ''); setAvatar(profile.avatar_url || ''); }
      if (staff) setCrmId(staff.crm_id || '');
      setLoading(false);
    })();
  }, []);

  const uploadAvatar = async (file: File) => {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await crmSupabase.storage.from('profile-photos').upload(path, file, { upsert: true });
    if (uploadError) { setError(uploadError.message); return; }
    const { data } = crmSupabase.storage.from('profile-photos').getPublicUrl(path);
    setAvatar(data.publicUrl);
    await crmSupabase.from('crm_users').update({ avatar_url: data.publicUrl }).eq('id', userId);
  };

  const saveProfile = async () => {
    setSaving(true); setError('');
    try {
      await crmSupabase.from('crm_users').update({ full_name: fullName, phone }).eq('id', userId);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save profile.'); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    setPwSaving(true); setError('');
    try {
      const { error: updateError } = await crmSupabase.auth.updateUser({ password: newPassword });
      if (updateError) throw new Error(updateError.message);
      setPwSaved(true); setNewPassword(''); setTimeout(() => setPwSaved(false), 2500);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update password.'); }
    finally { setPwSaving(false); }
  };

  if (loading) return <><CrmHeader title="Profile" onMenuClick={open} notificationsHref="/workspace/notifications" /><div className="p-6 text-sm text-gray-400">Loading…</div></>;

  return (
    <>
      <CrmHeader title="Profile" subtitle="Your personal details and login" onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-red-50 text-xl font-black text-red-600">
                {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : (fullName[0] || 'U')}
              </div>
              <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-950 text-white">
                <Camera size={12} />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
              </label>
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">{fullName || 'Your name'}</p>
              <p className="text-xs text-gray-400">{ROLE_LABELS[role] || role} · {crmId || '—'}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Full name</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" /></div>
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Phone number</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" /></div>
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</label><input value={email} readOnly className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500" /></div>
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">CRM ID</label><input value={crmId} readOnly className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500" /></div>
          </div>
          <button onClick={saveProfile} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />} {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400"><Lock size={13} /> Change password</p>
          <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min. 8 characters)" className="mt-3 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" />
          <button onClick={changePassword} disabled={pwSaving} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            {pwSaving ? <Loader2 size={14} className="animate-spin" /> : pwSaved ? <Check size={14} /> : <Lock size={14} />} {pwSaved ? 'Password updated' : 'Update password'}
          </button>
        </div>
      </div>
    </>
  );
}
