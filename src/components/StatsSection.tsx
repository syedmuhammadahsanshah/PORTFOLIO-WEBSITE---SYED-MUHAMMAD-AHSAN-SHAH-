import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Clock, Layers, Users, TrendingUp } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { statistics } = portfolioData;

  const icons = [Clock, Layers, Users, TrendingUp];

  return (
    <section id="stats-section" className="relative py-10 bg-[#0D1424] border-y border-[#1E2C48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {statistics.map((stat, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={stat.label}
                id={`stat-card-${index}`}
                className="relative p-5 sm:p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/50 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                {/* Subtle top gold accent on first card, blue on others */}
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-lg bg-[#0A0E1A] border border-[#1E2C48] text-[#3B82F6] group-hover:text-[#D9A94E] transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#8B97AC] tracking-widest">
                    Metric 0{index + 1}
                  </span>
                </div>

                <div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#C4CCDA] mt-1">
                    {stat.label}
                  </div>
                  {stat.sublabel && (
                    <div className="text-[11px] text-[#8B97AC] mt-0.5">
                      {stat.sublabel}
                    </div>
                  )}
                </div>

                {/* Subtle bottom line */}
                <div className="mt-4 pt-2 border-t border-[#1E2C48]/50 flex items-center justify-between text-[10px] text-[#8B97AC]">
                  <span>Verified Experience</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9A94E]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
