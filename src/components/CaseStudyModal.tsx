import React from 'react';
import { X, MapPin, CheckCircle, Building2, Layers, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { CaseStudy } from '../data/portfolioData';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onContactClick: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  onContactClick,
}) => {
  if (!study) return null;

  return (
    <div
      id="case-study-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="case-study-modal-content"
        className="relative w-full max-w-2xl bg-[#0D1424] border border-[#1E2C48] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-[#F2F5F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-case-study-modal-btn"
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] hover:border-[#3B82F6] transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] font-semibold">
              {study.categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#8B97AC]">
              <MapPin className="w-3.5 h-3.5 text-[#D9A94E]" />
              {study.location}
            </span>
          </div>

          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F2F5F9] tracking-tight">
            {study.company}
          </h3>
          <p className="text-xs sm:text-sm text-[#3B82F6] font-medium mt-0.5">
            {study.engagementType}
          </p>
        </div>

        {/* Modules Chips */}
        <div className="flex flex-wrap gap-2 my-5 pt-4 border-t border-[#1E2C48]">
          {study.modules.map((mod) => (
            <span
              key={mod}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#2F6FED]/20 text-[#3B82F6] border border-[#2F6FED]/40"
            >
              Module: {mod}
            </span>
          ))}
        </div>

        {/* Challenge Section */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48]/80 space-y-1.5">
            <h4 className="font-mono text-xs font-bold text-[#D9A94E] uppercase tracking-wider">
              Operational Challenge & Scope
            </h4>
            <p className="text-[#C4CCDA] leading-relaxed">
              {study.challenge}
            </p>
          </div>

          {/* Solution & Implementation Details */}
          <div className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48]/80 space-y-1.5">
            <h4 className="font-mono text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
              Functional Approach & Execution
            </h4>
            <p className="text-[#C4CCDA] leading-relaxed">
              {study.solution}
            </p>
          </div>

          {/* Outcome */}
          <div className="p-4 rounded-2xl bg-[#0A0E1A] border border-[#2F6FED]/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Measurable Business Outcome</span>
            </div>
            <p className="text-[#F2F5F9] leading-relaxed">
              {study.outcome}
            </p>
          </div>

          {/* Metrics if available */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {study.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-center"
                >
                  <div className="text-[10px] text-[#8B97AC] uppercase font-mono">{m.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#D9A94E] mt-1 font-heading">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 pt-5 border-t border-[#1E2C48] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#121B2E] text-xs font-semibold text-[#8B97AC] hover:text-[#F2F5F9] transition-colors"
          >
            Close Overview
          </button>

          <button
            onClick={() => {
              onClose();
              onContactClick();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
          >
            <span>Discuss Similar Engagement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
