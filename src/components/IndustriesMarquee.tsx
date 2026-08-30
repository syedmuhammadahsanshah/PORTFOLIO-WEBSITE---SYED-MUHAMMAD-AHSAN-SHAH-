import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Factory, Building, ShieldCheck } from 'lucide-react';

export const IndustriesMarquee: React.FC = () => {
  const { industriesMarquee } = portfolioData;

  // Duplicate for smooth seamless loop
  const marqueeItems = [...industriesMarquee, ...industriesMarquee];

  return (
    <section id="industries-marquee-section" className="py-12 bg-[#0A0E1A] border-y border-[#1E2C48] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#8B97AC] uppercase tracking-widest">
          <Factory className="w-3.5 h-3.5 text-[#D9A94E]" />
          <span>Industries & Clients Served</span>
        </div>
      </div>

      {/* Marquee track */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Gradient edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0A0E1A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0A0E1A] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs sm:text-sm font-medium text-[#C4CCDA] hover:text-[#F2F5F9] hover:border-[#3B82F6]/50 transition-colors shrink-0 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#D9A94E]" />
              <span className="tracking-wide whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
