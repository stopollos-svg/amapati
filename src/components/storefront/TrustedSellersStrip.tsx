import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Building2 } from 'lucide-react';

const BRANDS = [
  { name: 'Apex Telecomm', region: 'Shenzhen, CN', products: '5G & Rugged Mobiles', rating: '4.9★', verifiedYears: 9 },
  { name: 'CyberCore GmbH', region: 'Munich, DE', products: 'Industrial Edge AI', rating: '5.0★', verifiedYears: 12 },
  { name: 'Nippon Precision', region: 'Nagoya, JP', products: 'Cobots & Servos', rating: '4.9★', verifiedYears: 17 },
  { name: 'SunPower Energy', region: 'Dongguan, CN', products: 'LiFePO4 ESS Batteries', rating: '4.9★', verifiedYears: 11 },
  { name: 'SingaTech Micro', region: 'Singapore, SG', products: 'LoRaWAN IoT Nodes', rating: '4.8★', verifiedYears: 7 },
];

export const TrustedSellersStrip: React.FC = () => {
  return (
    <div className="py-6 border-y border-slate-200 dark:border-slate-800 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <span>Verified Tech Manufacturers & Gold Suppliers</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every vendor undergoes strict business registration, ISO inspection, and on-site factory verification.
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> 100% Trade Assurance Backed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {BRANDS.map((brand, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:border-orange-400 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                  {brand.verifiedYears} Yrs Gold
                </span>
                <span className="text-[10px] font-extrabold text-amber-500">{brand.rating}</span>
              </div>
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-1 truncate">
                {brand.name}
              </h5>
              <div className="text-[10px] text-slate-400 truncate">{brand.region}</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate">
              {brand.products}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
