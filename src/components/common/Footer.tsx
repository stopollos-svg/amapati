import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, CreditCard, Award, Database, ExternalLink, ArrowRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAuthModalOpen, setIsRfqModalOpen, setCurrentView, setActiveAdminTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors pt-12 pb-16">
      {/* 4 Trust Value Props (Alibaba-style) */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Trade Assurance</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                100% order protection from payment escrow to verified factory dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Flexible B2B Payments</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pay on delivery, mobile money (M-Pesa/MTN), escrow cards, and bank TT wire.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Verified Suppliers</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Curated electronics factories with ISO & CE certifications and live audit trails.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Worldwide Logistics</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Air express, sea freight consolidation, customs clearance, and real-time tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
            Sourcing Solutions
          </h5>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <button onClick={() => setIsRfqModalOpen(true)} className="hover:text-orange-400 transition-colors text-left">
                Submit an RFQ (Bulk Quote)
              </button>
            </li>
            <li>
              <a href="#featured-deals" className="hover:text-orange-400 transition-colors">
                Featured Wholesale Deals
              </a>
            </li>
            <li>
              <a href="#top-rated" className="hover:text-orange-400 transition-colors">
                Top Rated Hardware
              </a>
            </li>
            <li>
              <span className="text-slate-500">BOM Custom Assembly</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
            Marketplace Roles
          </h5>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-orange-400 transition-colors text-left flex items-center gap-1">
                Request Editor Access
                <ArrowRight className="w-3 h-3 text-orange-400" />
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setActiveAdminTab('users');
                }}
                className="hover:text-orange-400 transition-colors text-left"
              >
                Superuser & Editors Governance
              </button>
            </li>
            <li>
              <span className="text-slate-500">20 Active Editors Policy</span>
            </li>
            <li>
              <span className="text-slate-500">Role-Based Access Control</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
            Backend Architecture
          </h5>
          <ul className="space-y-2.5 text-slate-400">
            <li className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Database className="w-3.5 h-3.5" />
              Supabase PostgreSQL
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setActiveAdminTab('settings');
                }}
                className="hover:text-orange-400 transition-colors text-left underline decoration-dotted"
              >
                Inspect SQL Migrations & RLS
              </button>
            </li>
            <li>
              <span className="text-slate-400">Database-Level RLS Rules</span>
            </li>
            <li>
              <span className="text-slate-400">48-Hour Secure Invite Tokens</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
            About Amapati.com
          </h5>
          <p className="text-slate-400 leading-relaxed">
            Amapati is a modern, high-speed wholesale technology marketplace connecting global enterprise procurement teams directly with verified hardware manufacturers.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500">
            Superuser Seed: <span className="text-slate-300 font-mono">stopollos@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} Amapati.com Inc. All rights reserved. Built with React, Vite & Tailwind CSS.
        </div>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Trade</span>
          <span>Security & RLS</span>
        </div>
      </div>
    </footer>
  );
};
