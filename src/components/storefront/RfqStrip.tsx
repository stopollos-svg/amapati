import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const RfqStrip: React.FC = () => {
  const { setIsRfqModalOpen } = useApp();

  return (
    <div className="my-8 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Custom Technology Procurement
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Can’t find your exact specification? Request a Quote (RFQ)
          </h3>
          <p className="text-xs sm:text-sm text-orange-100 mt-1.5 leading-relaxed">
            Submit your bill of materials (BOM), custom chipsets, or bulk quantities. Receive 3 verified manufacturer quotations with escrow terms within 12 hours.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-orange-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-white" /> Free Sourcing Consultation
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-white" /> Escrow Payment Protection
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-white" /> Direct Factory Audits
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setIsRfqModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Post RFQ Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
