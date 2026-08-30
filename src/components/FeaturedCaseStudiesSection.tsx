import React from 'react';
import { Building2, MapPin, ArrowRight, CheckCircle, ArrowUpRight } from 'lucide-react';
import { portfolioData, CaseStudy } from '../data/portfolioData';

interface FeaturedCaseStudiesSectionProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
  onViewAllCaseStudies: () => void;
}

export const FeaturedCaseStudiesSection: React.FC<FeaturedCaseStudiesSectionProps> = ({
  onSelectCaseStudy,
  onViewAllCaseStudies,
}) => {
  const featuredStudies = portfolioData.caseStudies.filter((s) => s.featured);

  return (
    <section id="featured-case-studies" className="py-20 bg-[#0D1424] border-t border-[#1E2C48] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
              <span>PROVEN TRACK RECORD</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
              Selected Case Studies
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed max-w-2xl">
              A look at the plants, programs, and problems behind the numbers.
            </p>
          </div>

          <button
            id="featured-view-all-btn"
            onClick={onViewAllCaseStudies}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121B2E] hover:bg-[#1E2C48] border border-[#1E2C48] text-xs sm:text-sm font-semibold text-[#F2F5F9] transition-all group shadow-sm whitespace-nowrap"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredStudies.map((study) => (
            <div
              key={study.id}
              id={`case-card-${study.id}`}
              onClick={() => onSelectCaseStudy(study)}
              className="p-6 sm:p-7 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/60 transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
            >
              <div>
                {/* Meta Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#0D1424] border border-[#1E2C48] text-[#3B82F6] font-semibold">
                    {study.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#8B97AC]">
                    <MapPin className="w-3.5 h-3.5 text-[#D9A94E]" />
                    <span>{study.location}</span>
                  </div>
                </div>

                {/* Company Name */}
                <h3 className="font-heading font-bold text-xl text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors flex items-center gap-2">
                  <span>{study.company}</span>
                </h3>

                {/* Modules Tags */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {study.modules.map((mod) => (
                    <span
                      key={mod}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2F6FED]/15 text-[#3B82F6] border border-[#2F6FED]/30"
                    >
                      {mod}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#8B97AC] bg-[#0D1424] border border-[#1E2C48]">
                    {study.engagementType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#8B97AC] mt-3 leading-relaxed">
                  {study.challenge}
                </p>

                {/* Outcome Box */}
                <div className="mt-5 p-3.5 rounded-xl bg-[#0D1424] border border-[#1E2C48]/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D9A94E] uppercase tracking-wider font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D9A94E]" />
                    <span>Key Outcome</span>
                  </div>
                  <p className="text-xs text-[#C4CCDA] leading-relaxed">
                    {study.outcome}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t border-[#1E2C48]/50 flex items-center justify-between text-xs font-semibold text-[#3B82F6] group-hover:text-[#F2F5F9]">
                <span>Read Full Engagement Profile</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
