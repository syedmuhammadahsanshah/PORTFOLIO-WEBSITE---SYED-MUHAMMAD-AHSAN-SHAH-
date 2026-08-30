import React, { useState } from 'react';
import { Building2, MapPin, CheckCircle, ArrowRight, Filter, Search, ArrowUpRight, Layers } from 'lucide-react';
import { CaseStudy } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

interface CaseStudiesCatalogProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

export const CaseStudiesCatalog: React.FC<CaseStudiesCatalogProps> = ({
  onSelectCaseStudy,
}) => {
  const { data } = usePortfolio();
  const { caseStudies } = data;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Engagements' },
    { id: 'full-cycle', label: 'Full-Cycle Implementations' },
    { id: 'operational-support', label: 'Operational Support Engagements' },
    { id: 'it-systems', label: 'IT Systems & Support' },
  ];

  const modulesList = ['all', 'PP', 'QM', 'PM', 'IT', 'M365'];

  const filteredStudies = caseStudies.filter((study) => {
    // Category match
    const categoryMatch = activeCategory === 'all' || study.category === activeCategory;

    // Module match
    const moduleMatch =
      activeModuleFilter === 'all' ||
      study.modules.some((m) => m.toLowerCase() === activeModuleFilter.toLowerCase());

    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      study.company.toLowerCase().includes(query) ||
      study.location.toLowerCase().includes(query) ||
      study.challenge.toLowerCase().includes(query) ||
      study.outcome.toLowerCase().includes(query) ||
      study.modules.some((m) => m.toLowerCase().includes(query));

    return categoryMatch && moduleMatch && searchMatch;
  });

  return (
    <section id="case-studies-catalog-section" className="py-20 bg-[#0A0E1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>PORTFOLIO OF WORK</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            Engagements Across Manufacturing & IT
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            Full-cycle SAP implementations, ongoing operational support, and IT systems work delivered across Pakistan and Saudi Arabia.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] mb-10 space-y-4 shadow-xl">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                    isSelected
                      ? 'bg-[#2F6FED] text-white shadow-md shadow-[#2F6FED]/20'
                      : 'bg-[#121B2E] text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#18243C] border border-[#1E2C48]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Module Pill Filter & Search Bar Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#1E2C48]">
            {/* Module Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-[#8B97AC] uppercase mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filter Module:</span>
              </span>
              {modulesList.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setActiveModuleFilter(mod)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeModuleFilter === mod
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/50 font-bold'
                      : 'bg-[#121B2E] text-[#8B97AC] hover:text-[#F2F5F9] border border-[#1E2C48]/60'
                  }`}
                >
                  {mod.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#8B97AC] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company or scope..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        {filteredStudies.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#0D1424] border border-[#1E2C48]">
            <p className="text-sm text-[#8B97AC]">No engagements match your selected filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveModuleFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-[#3B82F6] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                id={`catalog-card-${study.id}`}
                onClick={() => onSelectCaseStudy(study)}
                className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/60 transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
              >
                <div>
                  {/* Category & Location */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#0D1424] border border-[#1E2C48] text-[#3B82F6] font-semibold">
                      {study.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#8B97AC]">
                      <MapPin className="w-3 h-3 text-[#D9A94E]" />
                      {study.location}
                    </span>
                  </div>

                  {/* Company */}
                  <h3 className="font-heading font-bold text-lg text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors">
                    {study.company}
                  </h3>

                  <div className="text-xs text-[#8B97AC] font-medium mt-0.5">
                    {study.engagementType}
                  </div>

                  {/* Modules */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {study.modules.map((mod) => (
                      <span
                        key={mod}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2F6FED]/15 text-[#3B82F6] border border-[#2F6FED]/30"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>

                  {/* Challenge */}
                  <p className="text-xs text-[#8B97AC] mt-3 line-clamp-3 leading-relaxed">
                    {study.challenge}
                  </p>

                  {/* Outcome Box */}
                  <div className="mt-4 p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48]/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#D9A94E] uppercase tracking-wider font-mono">
                      <CheckCircle className="w-3 h-3 text-[#D9A94E]" />
                      <span>Outcome</span>
                    </div>
                    <p className="text-xs text-[#C4CCDA] line-clamp-2 leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-[#1E2C48]/50 flex items-center justify-between text-xs font-semibold text-[#3B82F6] group-hover:text-[#F2F5F9]">
                  <span>Explore Project Architecture</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
