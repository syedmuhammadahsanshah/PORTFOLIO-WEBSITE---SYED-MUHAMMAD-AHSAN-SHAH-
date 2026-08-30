import React from 'react';
import { Quote, CheckCircle, Briefcase, Calendar, Award, ArrowUpRight, ShieldCheck, Factory, Cpu, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { consultant, timeline, skills } = portfolioData;

  return (
    <section id="about-section" className="py-20 bg-[#0A0E1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>BACKGROUND & PERSPECTIVE</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            12+ Years Bridging Manufacturing & SAP
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            From the shop floor to the SAP project team — the path, the numbers, and the skills behind the consultant.
          </p>
        </div>

        {/* Narrative & Pull Quote Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
          
          {/* Main Narrative Text */}
          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F2F5F9] tracking-tight border-l-2 border-[#3B82F6] pl-4">
              Manufacturing operations, seen from both sides of the SAP screen.
            </h3>

            {consultant.aboutProfile.map((paragraph, idx) => (
              <p key={idx} className="text-[#C4CCDA] leading-relaxed font-normal">
                {paragraph}
              </p>
            ))}

            <div className="pt-2">
              <button
                id="about-contact-btn"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                <span>Discuss a Consulting Engagement</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pull Quote & Executive Highlights Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pull Quote */}
            <div className="p-8 rounded-3xl bg-[#121B2E] border border-[#1E2C48] relative overflow-hidden shadow-xl">
              <Quote className="w-10 h-10 text-[#D9A94E]/25 mb-4" />
              <blockquote className="font-heading font-semibold text-lg sm:text-xl text-[#F2F5F9] leading-snug tracking-tight">
                “{consultant.pullQuote}”
              </blockquote>
              <div className="mt-6 pt-4 border-t border-[#1E2C48] flex items-center justify-between text-xs text-[#8B97AC]">
                <span className="font-medium text-[#D9A94E]">Guiding Philosophy</span>
                <span>Multi-Plant S/4HANA</span>
              </div>
            </div>

            {/* Core Competencies Quick Box */}
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-3.5">
              <h4 className="font-heading font-bold text-sm text-[#F2F5F9] uppercase tracking-wider font-mono">
                Key Differentiators
              </h4>
              <div className="space-y-2.5 text-xs text-[#C4CCDA]">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 shrink-0" />
                  <span><strong>Dual Perspective:</strong> Started as shop-floor operator and lab assistant before leading SAP implementations.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9A94E] mt-1.5 shrink-0" />
                  <span><strong>Unified PP / QM / PM:</strong> Connects production, quality inspections, and equipment maintenance without silos.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 shrink-0" />
                  <span><strong>IT Governance:</strong> Oversees Microsoft 365 tenant, user access security, and end-user infrastructure.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Skills & Strengths Section */}
        <div id="skills-sub-section" className="mb-20 pt-10 border-t border-[#1E2C48]">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] text-xs font-mono font-semibold tracking-wider uppercase mb-2">
              <span>PROFICIENCY MATRIX</span>
            </div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F2F5F9]">
              Areas of Strongest Functional & Technical Expertise
            </h3>
            <p className="text-xs sm:text-sm text-[#8B97AC] mt-1">
              Visual representation reflecting depth of delivery experience, hands-on configuration, and project leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                id={`skill-card-${index}`}
                className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#8B97AC] uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#D9A94E]">
                    {skill.percentage}%
                  </span>
                </div>

                <h4 className="font-heading font-semibold text-sm sm:text-base text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors">
                  {skill.name}
                </h4>

                {/* Progress track */}
                <div className="w-full bg-[#0A0E1A] h-2 rounded-full mt-3 overflow-hidden border border-[#1E2C48]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2F6FED] to-[#3B82F6] transition-all duration-1000 ease-out"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>

                {skill.details && (
                  <p className="text-[11px] text-[#8B97AC] mt-2.5 leading-relaxed">
                    {skill.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Career Timeline Section */}
        <div id="career-timeline-section" className="pt-10 border-t border-[#1E2C48]">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-2">
              <span>CAREER PROGRESSION</span>
            </div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F2F5F9]">
              Career Timeline & Milestones
            </h3>
            <p className="text-xs sm:text-sm text-[#8B97AC] mt-1">
              A 12+ year journey from chemical plant lab operations and shop-floor SAP data entry to multi-plant S/4HANA functional consulting and IT systems leadership.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 sm:pl-10 space-y-10 before:absolute before:left-[11px] sm:before:left-[19px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#3B82F6] before:via-[#1E2C48] before:to-[#1E2C48]">
            {timeline.map((item, idx) => (
              <div
                key={`${item.year}-${item.company}`}
                id={`timeline-item-${idx}`}
                className={`relative group ${item.isCurrent ? 'opacity-100' : 'opacity-90 hover:opacity-100 transition-opacity'}`}
              >
                {/* Node indicator */}
                <div
                  className={`absolute -left-[30px] sm:-left-[41px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    item.isCurrent
                      ? 'bg-[#2F6FED] border-[#D9A94E] shadow-lg shadow-[#2F6FED]/50'
                      : 'bg-[#0A0E1A] border-[#1E2C48] group-hover:border-[#3B82F6]'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.isCurrent ? 'bg-[#F2F5F9]' : 'bg-[#8B97AC] group-hover:bg-[#3B82F6]'
                    }`}
                  />
                </div>

                {/* Timeline Content Card */}
                <div
                  className={`p-6 rounded-2xl border transition-all ${
                    item.isCurrent
                      ? 'bg-[#121B2E] border-[#3B82F6]/60 shadow-xl shadow-[#2F6FED]/10'
                      : 'bg-[#0D1424] border-[#1E2C48] hover:border-[#1E2C48]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                          item.isCurrent
                            ? 'bg-[#2F6FED] text-white'
                            : 'bg-[#121B2E] text-[#D9A94E] border border-[#1E2C48]'
                        }`}
                      >
                        {item.year}
                      </span>
                      {item.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Present Role</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-[#8B97AC] font-mono">
                      {item.company}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#F2F5F9]">
                    {item.role}
                  </h4>
                  <div className="text-xs font-medium text-[#3B82F6] mb-2">
                    {item.company}
                  </div>

                  <p className="text-xs sm:text-sm text-[#C4CCDA] leading-relaxed">
                    {item.description}
                  </p>

                  {item.keyHighlights && item.keyHighlights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#1E2C48]/60 space-y-1.5">
                      {item.keyHighlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-[#8B97AC]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#3B82F6] mt-0.5 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
