import React from 'react';
import { ArrowRight, Mail, ArrowUpRight } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (sectionId: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate }) => {
  return (
    <section id="final-cta-section" className="py-20 bg-[#0D1424] border-t border-[#1E2C48] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2F6FED]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#121B2E] border border-[#1E2C48] shadow-2xl relative">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0D1424] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-5">
            <span>READY TO ENGAGE</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight max-w-2xl mx-auto leading-tight">
            Planning an SAP Rollout or Optimization?
          </h2>

          {/* Supporting text */}
          <p className="mt-4 text-sm sm:text-base text-[#C4CCDA] max-w-2xl mx-auto leading-relaxed">
            Let's discuss your production planning, quality, or plant maintenance goals, and explore how a tailored SAP engagement can deliver measurable improvements for your team.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              id="final-cta-contact-btn"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xl shadow-[#2F6FED]/25 hover:shadow-[#3B82F6]/35"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </button>

            <button
              id="final-cta-work-btn"
              onClick={() => onNavigate('casestudies')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D1424] hover:bg-[#18243C] border border-[#1E2C48] hover:border-[#3B82F6]/50 text-[#F2F5F9] text-xs sm:text-sm font-semibold tracking-wide transition-all"
            >
              <span>See the Work</span>
              <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
