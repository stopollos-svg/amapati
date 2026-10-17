import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search, Filter, History, User } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((entry) => {
    if (filterAction !== 'all' && !entry.action.includes(filterAction)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        entry.actorEmail.toLowerCase().includes(q) ||
        entry.details.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-orange-500" />
            <span>Superuser Security Audit Log</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological ledger tracking all administrative state changes, invitations, and catalog mutations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none text-xs"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Actor / Role</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.actorEmail}</span>
                    <span className="block text-[10px] capitalize text-orange-600 dark:text-orange-400 font-sans">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
