import React from 'react';
import { ArrowRight, Mail, Shield, CheckCircle, Award, Database, Factory } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { consultant } = portfolioData;

  return (
    <section
      id="hero-section"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#0A0E1A] bg-enterprise-grid"
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2F6FED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#D9A94E]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Sophisticated Bracket-Framed Consultant Portrait Treatment */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer decorative tech corners */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#D9A94E]" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#D9A94E]" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#D9A94E]" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#D9A94E]" />

              {/* Status Badge floating at top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                <div
                  id="hero-status-badge"
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121B2E] border border-[#1E2C48] shadow-lg text-[11px] font-semibold text-[#F2F5F9] tracking-wide"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{consultant.status}</span>
                </div>
              </div>

              {/* Main Card Frame */}
              <div className="relative rounded-2xl bg-[#0D1424] border border-[#1E2C48] p-6 shadow-2xl overflow-hidden group">
                {/* Tech background matrix lines inside portrait card */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#121B2E] via-[#0D1424] to-[#0A0E1A] opacity-90" />
                
                {/* Subtle graphic representation */}
                <div className="relative z-10 flex flex-col items-center text-center pt-4 pb-2">
                  {/* Executive Avatar / Monogram Visual Representation */}
                  <div className="relative mb-5">
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-[#1E2C48] via-[#121B2E] to-[#0A0E1A] border-2 border-[#2F6FED]/40 p-1 flex items-center justify-center relative shadow-inner">
                      <div className="w-full h-full rounded-xl bg-[#0A0E1A] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background subtle geometric rings */}
                        <div className="absolute w-28 h-28 border border-[#2F6FED]/20 rounded-full animate-pulse" />
                        <div className="absolute w-20 h-20 border border-[#D9A94E]/20 rounded-full" />
                        
                        <span className="font-heading font-extrabold text-3xl sm:text-4xl tracking-wider text-[#F2F5F9]">
                          {consultant.brandInitials}
                        </span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D9A94E] mt-1">
                          SAP Lead
                        </span>
                      </div>
                      
                      {/* Certified badge icon overlay */}
                      <div className="absolute -bottom-2 -right-2 bg-[#2F6FED] border-2 border-[#0A0E1A] w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Name & Quick Meta */}
                  <h3 className="font-heading font-bold text-lg text-[#F2F5F9] tracking-tight">
                    {consultant.name}
                  </h3>
                  <p className="text-xs text-[#8B97AC] mt-1 font-medium">
                    {consultant.location}
                  </p>

                  {/* Core Domain Chips */}
                  <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-[#1E2C48]">
                    <div className="p-2 rounded-lg bg-[#121B2E]/80 border border-[#1E2C48]/60 text-center">
                      <div className="text-[10px] text-[#8B97AC] uppercase tracking-wider font-mono">Module</div>
                      <div className="text-xs font-bold text-[#3B82F6] mt-0.5">SAP PP</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#121B2E]/80 border border-[#1E2C48]/60 text-center">
                      <div className="text-[10px] text-[#8B97AC] uppercase tracking-wider font-mono">Module</div>
                      <div className="text-xs font-bold text-[#D9A94E] mt-0.5">SAP QM</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#121B2E]/80 border border-[#1E2C48]/60 text-center">
                      <div className="text-[10px] text-[#8B97AC] uppercase tracking-wider font-mono">Module</div>
                      <div className="text-xs font-bold text-[#3B82F6] mt-0.5">SAP PM</div>
                    </div>
                  </div>

                  {/* Operational Badge */}
                  <div className="w-full mt-3 p-2.5 rounded-lg bg-[#121B2E]/40 border border-[#1E2C48]/40 flex items-center justify-between text-[11px] text-[#C4CCDA]">
                    <span className="flex items-center gap-1.5 text-left">
                      <Factory className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Manufacturing & Shop-Floor Depth</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#D9A94E]">12+ Yrs</span>
                  </div>
                </div>
              </div>

              {/* Bottom decorative bracket note */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#8B97AC] font-mono px-2">
                <span>[ SAP S/4HANA & ECC ]</span>
                <span>[ M365 ADMIN ]</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Main Heading, Eyebrow & CTAs */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-[#D9A94E]" />
              <span>{consultant.eyebrow}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-[#F2F5F9] tracking-tight leading-[1.15]">
                {consultant.name}
              </h1>
              
              {/* Professional Title */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#3B82F6] tracking-tight">
                {consultant.title}
              </h2>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-[#C4CCDA] leading-relaxed max-w-2xl font-normal">
              {consultant.heroSummary}
            </p>

            {/* Key Value Pillars Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm text-[#C4CCDA]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D9A94E] shrink-0" />
                <span>Shop Floor to S/4HANA Blueprinting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>End-to-End PP, QM & PM Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Multi-Plant Implementations (PK & KSA)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D9A94E] shrink-0" />
                <span>Enterprise IT & M365 Systems Lead</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="hero-cta-case-studies"
                onClick={() => onNavigate('casestudies')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-[#2F6FED]/25 hover:shadow-[#3B82F6]/35 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                <span>View My Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-contact"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#121B2E] hover:bg-[#18243C] text-[#F2F5F9] hover:text-white border border-[#1E2C48] hover:border-[#3B82F6]/50 text-sm font-medium tracking-wide transition-all duration-200 shadow-sm hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                <Mail className="w-4 h-4 text-[#8B97AC]" />
                <span>Get In Touch</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
