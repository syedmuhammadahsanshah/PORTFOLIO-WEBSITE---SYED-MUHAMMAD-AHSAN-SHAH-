import React, { useState } from 'react';
import { Award, CheckCircle, ShieldCheck, ExternalLink, Copy, Check, FileCheck, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  const { certifications } = portfolioData;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="certifications-section" className="py-20 bg-[#0D1424] border-t border-[#1E2C48] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>OFFICIAL ACCREDITATION</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            Credentials Backed by Measurable Results
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            Formal certifications across SAP and IT, paired with real-world manufacturing experience and measurable outcomes.
          </p>
        </div>

        {/* Certifications Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Primary SAP Certification Featured Box */}
          <div className="lg:col-span-8">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                id={`cert-card-${cert.id}`}
                className="rounded-3xl bg-[#121B2E] border border-[#3B82F6]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
              >
                {/* Subtle tech corner brackets */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2F6FED]/10 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 text-[10px] font-mono text-[#D9A94E] px-2.5 py-1 rounded bg-[#0A0E1A] border border-[#1E2C48]">
                  SAP S/4HANA
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Badge Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2F6FED] to-[#121B2E] border-2 border-[#3B82F6] p-1 flex items-center justify-center shrink-0 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-[#0A0E1A] flex items-center justify-center text-[#D9A94E]">
                      <Award className="w-8 h-8 sm:w-10 sm:h-10 text-[#D9A94E]" />
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{cert.status}</span>
                      </span>
                      <span className="text-xs font-mono text-[#8B97AC]">
                        Issuer: <strong className="text-[#F2F5F9]">{cert.issuer}</strong>
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F2F5F9] tracking-tight leading-snug">
                      {cert.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#C4CCDA] leading-relaxed">
                      {cert.description}
                    </p>

                    {/* Verification Record Box */}
                    <div className="mt-5 p-4 rounded-xl bg-[#0D1424] border border-[#1E2C48] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#8B97AC] uppercase font-mono tracking-wider">Credential Verification</span>
                        <div className="font-mono text-[#C4CCDA] font-medium">
                          {cert.credentialIdPlaceholder}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(cert.id, `${cert.name} - Issued by ${cert.issuer}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] hover:border-[#3B82F6] transition-colors"
                        >
                          {copiedId === cert.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Details</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Educational & Continuous Learning Philosophy */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-3xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] uppercase tracking-wider font-bold">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                <span>Certification Philosophy</span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#F2F5F9]">
                Theory Validated by Shop-Floor Practice
              </h4>
              <p className="text-xs text-[#8B97AC] leading-relaxed">
                Certification demonstrates mastery of the standard SAP framework, while 12+ years across manufacturing plants in Pakistan & Saudi Arabia ensures practical applicability when custom shop-floor variations occur.
              </p>
              
              <div className="pt-2 border-t border-[#1E2C48] space-y-2 text-xs text-[#C4CCDA]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9A94E]" />
                  <span>SAP S/4HANA Cloud Private Edition</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>SAP ECC 6.0 PP / QM / PM Mastery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span>SAP Activate Implementation Methodology</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9A94E]" />
                  <span>Microsoft 365 Enterprise Administration</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
