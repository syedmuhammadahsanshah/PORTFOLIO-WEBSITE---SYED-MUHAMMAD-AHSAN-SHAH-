import React from 'react';
import { Mail, Phone, Linkedin, MapPin, ArrowUp, ShieldCheck, Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { data, openAdminModal } = usePortfolio();
  const { consultant } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#0A0E1A] border-t border-[#1E2C48] text-[#8B97AC] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E2C48]">
          
          {/* Brand & Description (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#121B2E] border border-[#1E2C48] flex items-center justify-center font-heading font-bold text-sm text-[#F2F5F9] relative overflow-hidden">
                <span>{consultant.brandInitials}</span>
                <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#D9A94E]" />
              </div>
              <span className="font-heading font-bold text-base text-[#F2F5F9]">
                {consultant.brandText}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8B97AC] leading-relaxed max-w-sm">
              Senior SAP PP / QM / PM Functional Consultant & IT Systems Lead, helping manufacturing operations run on streamlined, SAP-driven processes.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-xs text-[#D9A94E] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SAP S/4HANA & ECC Functional Specialist</span>
            </div>
          </div>

          {/* Quick Links (Col 6-8) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs text-[#F2F5F9] uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Consultant' },
                { id: 'expertise', label: 'Core Expertise' },
                { id: 'casestudies', label: 'Case Studies' },
                { id: 'certifications', label: 'Certifications' },
                { id: 'contact', label: 'Contact & Inquiry' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-[#F2F5F9] transition-colors hover:translate-x-1 duration-150 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Col 9-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-xs text-[#F2F5F9] uppercase tracking-wider font-mono">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`mailto:${consultant.email}`}
                className="flex items-center gap-2.5 hover:text-[#3B82F6] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{consultant.email}</span>
              </a>

              <a
                href={`tel:${consultant.phone}`}
                className="flex items-center gap-2.5 hover:text-[#D9A94E] transition-colors font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#D9A94E]" />
                <span>{consultant.phone}</span>
              </a>

              <a
                href={consultant.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#3B82F6] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>linkedin.com/in/smahsan52</span>
              </a>

              <div className="flex items-center gap-2.5 text-[#8B97AC]">
                <MapPin className="w-3.5 h-3.5 text-[#D9A94E]" />
                <span>{consultant.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <p>© 2026 Syed M. Ahsan Shah. All rights reserved.</p>
            <span className="text-[#1E2C48]">•</span>
            <button
              onClick={openAdminModal}
              className="text-[#8B97AC] hover:text-[#D9A94E] flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3 text-[#D9A94E]" />
              <span>Consultant Portal</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] hover:border-[#3B82F6] transition-colors flex items-center gap-1.5"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
