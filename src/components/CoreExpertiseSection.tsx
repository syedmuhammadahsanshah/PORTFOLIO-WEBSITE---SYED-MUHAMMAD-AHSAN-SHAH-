import React from 'react';
import { Factory, CheckCircle2, Wrench, ShieldCheck, ArrowRight, ArrowUpRight, Cpu, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExpertiseItem } from '../data/portfolioData';

interface CoreExpertiseSectionProps {
  onSelectExpertise?: (expertiseId: string) => void;
  onViewAllExpertise: () => void;
}

export const CoreExpertiseSection: React.FC<CoreExpertiseSectionProps> = ({
  onSelectExpertise,
  onViewAllExpertise,
}) => {
  const { data } = usePortfolio();
  const { expertise } = data;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory':
        return <Factory className="w-6 h-6 text-[#3B82F6]" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-[#D9A94E]" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-[#3B82F6]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#D9A94E]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#3B82F6]" />;
      default:
        return <Layers className="w-6 h-6 text-[#3B82F6]" />;
    }
  };

  return (
    <section id="expertise-section" className="py-20 bg-[#0A0E1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
              <span>CORE DISCIPLINES</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
              Where I Add the Most Value
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
              Four disciplines, one connected objective: reliable, efficient, well-governed manufacturing operations.
            </p>
          </div>

          <button
            id="view-all-services-btn"
            onClick={onViewAllExpertise}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#3B82F6] hover:text-[#F2F5F9] transition-colors py-2 group whitespace-nowrap"
          >
            <span>Explore Comprehensive Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertise.map((item, idx) => (
            <div
              key={item.id}
              id={`expertise-card-${item.id}`}
              onClick={() => onSelectExpertise?.(item.id)}
              className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/60 transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
            >
              <div>
                {/* Header with Icon & Code Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48] group-hover:border-[#3B82F6]/40 transition-colors">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0D1424] border border-[#1E2C48] text-[11px] font-mono font-semibold text-[#8B97AC] group-hover:text-[#D9A94E] transition-colors">
                    {item.code}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-lg text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors">
                  {item.title}
                </h3>

                {/* Short Description */}
                <p className="mt-3 text-xs sm:text-sm text-[#C4CCDA] leading-relaxed">
                  {item.shortDesc}
                </p>

                {/* Key Capabilities Pills */}
                <div className="mt-5 space-y-1.5 border-t border-[#1E2C48]/60 pt-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B97AC]">Key Focus:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.keyCapabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#0D1424] border border-[#1E2C48]/80 text-[#8B97AC]"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Discover Action */}
              <div className="mt-6 pt-3 border-t border-[#1E2C48]/40 flex items-center justify-between text-xs font-semibold text-[#3B82F6] group-hover:text-[#F2F5F9]">
                <span>View Details</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
