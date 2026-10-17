import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode } from '../../types';
import { CURRENCIES } from '../../data/mockData';
import {
  Settings,
  Database,
  Save,
  Check,
  Copy,
  CreditCard,
  ShieldCheck,
  Globe,
  Mail,
  Smartphone,
  Percent
} from 'lucide-react';

const SUPABASE_SQL_SNIPPET = `-- ==============================================================================
-- Amapati.com - Database Schema & Row Level Security (RLS) Policies
-- Platform: Supabase (PostgreSQL 15+)
-- Superuser: stopollos@gmail.com
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('superuser', 'editor', 'customer');
CREATE TYPE user_status AS ENUM ('active', 'invited', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  company_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 20 ACTIVE EDITORS ENFORCEMENT TRIGGER
CREATE OR REPLACE FUNCTION check_editor_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_count INT;
BEGIN
  IF NEW.role = 'editor' AND (TG_OP = 'INSERT' OR NEW.status = 'active') THEN
    SELECT COUNT(*) INTO active_count FROM public.profiles WHERE role = 'editor' AND status = 'active';
    IF active_count >= 20 THEN
      RAISE EXCEPTION 'Cannot add or activate editor: Maximum limit of 20 active editors reached on Amapati platform.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_editor_limit
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION check_editor_limit();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Editors manage products" ON public.products FOR ALL 
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('editor', 'superuser'));

CREATE POLICY "Superuser full control" ON public.profiles FOR ALL 
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superuser');

-- 6. SEED SUPERUSER AUTOMATICALLY: stopollos@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Amapati User'),
    CASE WHEN LOWER(NEW.email) = 'stopollos@gmail.com' THEN 'superuser'::user_role ELSE 'customer'::user_role END,
    'active'::user_status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`;

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, currency, setCurrency } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'sql'>('general');
  const [siteName, setSiteName] = useState(settings.siteName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent);
  const [announcement, setAnnouncement] = useState(settings.heroAnnouncement);
  const [podEnabled, setPodEnabled] = useState(settings.enablePayOnDelivery);
  const [momoEnabled, setMomoEnabled] = useState(settings.enableMobileMoney);
  const [cardEnabled, setCardEnabled] = useState(settings.enableCardEscrow);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      contactEmail,
      supportPhone,
      taxRatePercent: taxRate,
      heroAnnouncement: announcement,
      enablePayOnDelivery: podEnabled,
      enableMobileMoney: momoEnabled,
      enableCardEscrow: cardEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copySql = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'general'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Marketplace Settings & Payments
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'sql'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Schema & RLS Policies</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'general' ? (
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3.5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">General Marketplace Profile</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Default Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Support Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Top Announcement Banner</label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Payment & VAT Options */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Payment Options & Taxes</h4>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={podEnabled}
                  onChange={(e) => setPodEnabled(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="font-bold">Enable Pay on Delivery (Trade Assurance)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={momoEnabled}
                  onChange={(e) => setMomoEnabled(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="font-bold">Enable Mobile Money (M-Pesa, MTN, Airtel)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardEnabled}
                  onChange={(e) => setCardEnabled(e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="font-bold">Enable Corporate Card Escrow</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block font-bold mb-1">Estimated Tax / VAT Percentage (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Marketplace Settings</span>
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes saved!
              </span>
            )}
          </div>
        </form>
      ) : (
        /* SUPABASE SQL TAB */
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Production Supabase PostgreSQL Migration & RLS</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved in <code className="font-mono text-orange-600">supabase/migrations/20240101000000_init_amapati.sql</code>. Execute in Supabase SQL Editor.
              </p>
            </div>
            <button
              onClick={copySql}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-[500px] border border-slate-800">
              {SUPABASE_SQL_SNIPPET}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
