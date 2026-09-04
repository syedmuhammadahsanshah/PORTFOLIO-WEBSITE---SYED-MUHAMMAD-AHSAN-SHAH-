import React, { useState } from 'react';
import { Factory, CheckCircle2, Wrench, ShieldCheck, Check, ArrowRight, Layers, FileSpreadsheet, Cpu, Settings } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExpertiseItem } from '../data/portfolioData';

interface ServicesPageSectionProps {
  onNavigate: (sectionId: string) => void;
  selectedServiceId?: string;
}

export const ServicesPageSection: React.FC<ServicesPageSectionProps> = ({
  onNavigate,
  selectedServiceId,
}) => {
  const { data } = usePortfolio();
  const { expertise } = data;
  const [activeTab, setActiveTab] = useState<string>(selectedServiceId || (expertise[0]?.id ?? 'pp'));

  const activeService = expertise.find((e) => e.id === activeTab) || expertise[0];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'pp':
        return <Factory className="w-5 h-5" />;
      case 'qm':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'pm':
        return <Wrench className="w-5 h-5" />;
      case 'it':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="services-page-section" className="py-20 bg-[#0A0E1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Hero */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>CONSULTING & TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            How I Can Help Your Operations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            Focused expertise available as standalone engagements or combined into a full SAP program.
          </p>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {expertise.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`service-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                  isSelected
                    ? 'bg-[#121B2E] border-[#3B82F6] shadow-lg shadow-[#2F6FED]/15'
                    : 'bg-[#0D1424] border-[#1E2C48] hover:bg-[#121B2E] hover:border-[#1E2C48]'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border ${
                    isSelected
                      ? 'bg-[#2F6FED] border-[#3B82F6] text-white'
                      : 'bg-[#0A0E1A] border-[#1E2C48] text-[#8B97AC]'
                  }`}
                >
                  {getServiceIcon(item.id)}
                </div>
                <div>
                  <div className="font-heading font-bold text-xs sm:text-sm text-[#F2F5F9]">
                    {item.code}
                  </div>
                  <div className="text-[11px] text-[#8B97AC] truncate max-w-[120px] sm:max-w-[150px]">
                    {item.title.split(' ')[1] || item.code}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Service Content Card */}
        <div className="rounded-3xl bg-[#121B2E] border border-[#1E2C48] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2F6FED] via-[#3B82F6] to-[#D9A94E]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Col: Overview & Engagement Models */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0D1424] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold">
                <span>{activeService.code}</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F2F5F9] tracking-tight">
                {activeService.title}
              </h3>

              <p className="text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
                {activeService.fullDesc}
              </p>

              {/* Engagement Models */}
              {activeService.engagementModels && (
                <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-3">
                  <h4 className="font-mono text-xs font-bold text-[#8B97AC] uppercase tracking-wider">
                    Applicable Engagement Models
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeService.engagementModels.map((model) => (
                      <span
                        key={model}
                        className="px-3 py-1.5 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-xs font-medium text-[#F2F5F9]"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  id={`request-service-${activeService.id}-btn`}
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#2F6FED]/20"
                >
                  <span>Inquire About {activeService.code} Engagement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Col: Scope & Deliverables Checklist */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E2C48]">
                <h4 className="font-heading font-bold text-sm text-[#F2F5F9] uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D9A94E]" />
                  <span>Key Deliverables & Configuration Scope</span>
                </h4>

                <div className="space-y-3">
                  {activeService.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48]/60 flex items-start gap-3 text-xs sm:text-sm text-[#C4CCDA]"
                    >
                      <div className="p-1 rounded bg-[#0A0E1A] text-[#3B82F6] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Integration Context */}
              <div className="p-4 rounded-xl bg-[#121B2E]/60 border border-[#1E2C48]/40 flex items-center justify-between text-xs text-[#8B97AC]">
                <span>Cross-Module Integration:</span>
                <span className="font-mono text-[#D9A94E]">PP ↔ QM ↔ PM ↔ MM ↔ CO</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
