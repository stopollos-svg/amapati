import React, { useState } from 'react';
import { useApp, MAX_ACTIVE_EDITORS } from '../../context/AppContext';
import { UserProfile, EditorInvite } from '../../types';
import {
  UserPlus,
  Shield,
  Crown,
  Edit3,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Trash2,
  Ban,
  UserCheck,
  ExternalLink,
  Users
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const {
    users,
    currentUser,
    activeEditorsCount,
    invites,
    editorRequests,
    inviteEditor,
    reviewEditorRequest,
    updateEditorStatus,
    revokeEditor,
    switchUserRole,
  } = useApp();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string; invite?: EditorInvite } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const editors = users.filter((u) => u.role === 'editor');
  const customers = users.filter((u) => u.role === 'customer');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const res = inviteEditor(inviteEmail.trim());
    setInviteResult(res);
    if (res.success) {
      setInviteEmail('');
    }
  };

  const copyInviteLink = (token: string) => {
    const fullLink = `${window.location.origin}/#invite=${token}`;
    navigator.clipboard?.writeText(fullLink);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const isAtCapacity = activeEditorsCount >= MAX_ACTIVE_EDITORS;

  return (
    <div className="space-y-6">
      {/* 20 Active Editors Governance Strip */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Editor Role Governance (20 Active Limit)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            As Superuser (<strong>{currentUser.email}</strong>), you maintain exclusive authority over editor invitations. Per marketplace policy and PostgreSQL RLS trigger rules, the platform strictly blocks invitations once 20 active editors are registered.
          </p>
        </div>

        {/* Meter */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 w-full md:w-64">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-500">Active Editor Capacity:</span>
            <span className={isAtCapacity ? 'text-rose-600' : 'text-orange-600 dark:text-orange-400'}>
              {activeEditorsCount} / {MAX_ACTIVE_EDITORS} Max
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAtCapacity ? 'bg-rose-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(activeEditorsCount / MAX_ACTIVE_EDITORS) * 100}%` }}
            />
          </div>
          {isAtCapacity && (
            <div className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Limit reached! New invites blocked.
            </div>
          )}
        </div>
      </div>

      {/* Editor Invitation Generator Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <UserPlus className="w-4 h-4 text-orange-500" />
          <span>Invite New Marketplace Editor</span>
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          Generates a single-use token expiring in 48 hours. When the editor opens the link and sets a password, they automatically receive the Editor role.
        </p>

        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="email"
            required
            disabled={isAtCapacity}
            placeholder="Enter editor's work email (e.g. editor@company.com)..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAtCapacity}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            Send Invite
          </button>
        </form>

        {inviteResult && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2 ${
              inviteResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {inviteResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />}
            <div className="flex-1">
              <div>{inviteResult.message}</div>
              {inviteResult.invite && (
                <div className="mt-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-emerald-300/40 dark:border-emerald-700/40 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] truncate">{inviteResult.invite.token}</span>
                  <button
                    onClick={() => copyInviteLink(inviteResult.invite!.token)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-orange-500 text-white font-bold text-[10px] shrink-0"
                  >
                    {copiedToken === inviteResult.invite.token ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken === inviteResult.invite.token ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pending Editor Access Requests Queue */}
      {editorRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Public "Request Editor Access" Queue ({editorRequests.filter((r) => r.status === 'pending').length} pending)</span>
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Applicants who filled out the storefront application form. Approving automatically generates a 48-hour single-use invite link.
          </p>

          <div className="space-y-2.5">
            {editorRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{req.fullName}</span>
                    <span className="text-slate-400">({req.email})</span>
                    <span className="text-slate-500 font-medium">• {req.companyName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : req.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 italic">
                    "{req.reason}"
                  </p>
                </div>

                {req.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => reviewEditorRequest(req.id, true)}
                      disabled={isAtCapacity}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Send Link</span>
                    </button>
                    <button
                      onClick={() => reviewEditorRequest(req.id, false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editors Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-orange-500" />
            <span>Marketplace Editors Directory ({editors.length})</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Editor Details</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {editors.map((ed) => (
                <tr key={ed.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{ed.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{ed.email}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold capitalize text-sky-600 dark:text-sky-400">
                      {ed.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ed.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : ed.status === 'suspended'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {ed.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {ed.lastLogin ? new Date(ed.lastLogin).toLocaleString() : 'Never'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ed.status === 'active' ? (
                        <button
                          onClick={() => updateEditorStatus(ed.id, 'suspended')}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-600 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Suspend</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateEditorStatus(ed.id, 'active')}
                          disabled={isAtCapacity}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Activate</span>
                        </button>
                      )}

                      <button
                        onClick={() => revokeEditor(ed.id)}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 text-rose-600 text-[11px] font-bold"
                        title="Demote to Customer"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Accounts Directory */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-500" />
            <span>Registered Customers & Enterprise Buyers ({customers.length})</span>
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Customer Name & Email</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 px-4">
                    <span className="font-bold">{c.name}</span>
                    <span className="text-slate-400 block text-[11px]">{c.email}</span>
                  </td>
                  <td className="py-2.5 px-3">{c.companyName || 'Individual Procurement'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.phone || '+1 (555) 000-0000'}</td>
                  <td className="py-2.5 px-3 capitalize text-emerald-600 font-semibold">{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
