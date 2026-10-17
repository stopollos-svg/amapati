import React, { useState } from 'react';
import { useApp, MAX_ACTIVE_EDITORS } from '../../context/AppContext';
import { X, Lock, Mail, User, Building, Key, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    switchUserRole,
    requestEditorAccess,
    acceptInvite,
    invites,
    activeEditorsCount,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'request_editor' | 'accept_invite'>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reason, setReason] = useState('');
  const [inviteToken, setInviteToken] = useState(invites[0]?.token || '');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'stopollos@gmail.com') {
      switchUserRole('superuser', email);
    } else {
      switchUserRole('customer', email);
    }
    setStatusMessage({ type: 'success', text: `Signed in successfully as ${email}` });
    setTimeout(() => {
      setStatusMessage(null);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  const handleRequestEditor = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestEditorAccess({
      email,
      fullName,
      companyName,
      reason,
    });
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setStatusMessage(null);
        setIsAuthModalOpen(false);
      }, 2000);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleAcceptInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const res = acceptInvite(inviteToken.trim(), fullName.trim());
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setStatusMessage(null);
        setIsAuthModalOpen(false);
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {mode === 'signin' && 'Sign in to Amapati'}
              {mode === 'request_editor' && 'Request Editor Access'}
              {mode === 'accept_invite' && 'Accept Editor Invite'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setStatusMessage(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-1 my-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
          <button
            onClick={() => {
              setMode('signin');
              setStatusMessage(null);
            }}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'signin' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('request_editor');
              setStatusMessage(null);
            }}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'request_editor' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Request Access
          </button>
          <button
            onClick={() => {
              setMode('accept_invite');
              setStatusMessage(null);
            }}
            className={`py-1.5 rounded-lg transition-colors ${
              mode === 'accept_invite' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Redeem Invite
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-3 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="stopollos@gmail.com or buyer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 text-[11px] text-slate-500 leading-snug">
              Tip: Signing in with <strong className="text-orange-600 dark:text-orange-400">stopollos@gmail.com</strong> activates Superuser privileges automatically.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all"
            >
              Sign In
            </button>
          </form>
        )}

        {/* 2. REQUEST EDITOR ACCESS FORM */}
        {mode === 'request_editor' && (
          <form onSubmit={handleRequestEditor} className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Active Editor Capacity:</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {activeEditorsCount} / {MAX_ACTIVE_EDITORS} Slots Filled
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. David Osei"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                placeholder="david.tech@hardwareguild.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Sourcing Org</label>
              <input
                type="text"
                placeholder="Hardware Guild Reviews"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Editor Role *</label>
              <textarea
                required
                rows={2}
                placeholder="Why do you need catalog curator / banner editing rights on Amapati?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all"
            >
              Submit Application to Superuser
            </button>
          </form>
        )}

        {/* 3. ACCEPT INVITE LINK FORM */}
        {mode === 'accept_invite' && (
          <form onSubmit={handleAcceptInvite} className="space-y-3 text-xs">
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Open your 48-hour single-use invite link token, choose your password, and immediately receive Editor permissions.
            </p>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Invite Token *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="amp_inv_88ab3091c0e2..."
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Hannah Supply"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Set Account Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Activate Editor Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
