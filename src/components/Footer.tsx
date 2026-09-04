import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { FormattedText } from './FormattedText';
import { SocialIcon, getSocialHref, getSocialTarget, getSocialRel, getPlatformName } from './SocialIcon';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { data, engagementStats } = usePortfolio();
  const { consultant, timeline } = data;

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

            <div id="hero-summary-paragraph" className="text-xs sm:text-sm text-[#8B97AC] leading-relaxed max-w-sm">
              <FormattedText
                text={consultant.tagline || consultant.heroSummary}
                careerStartDate={consultant.careerStartDate}
                timeline={timeline}
              />
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

          {/* Direct Contact (Col 9-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-xs text-[#F2F5F9] uppercase tracking-wider font-mono">
              Direct Contact
            </h4>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {(data.socialLinks && data.socialLinks.length > 0
                ? data.socialLinks
                : [
                    { id: '1', name: 'LinkedIn', icon: 'linkedin', url: consultant.linkedin },
                    { id: '2', name: 'Email', icon: 'email', url: consultant.email },
                    { id: '3', name: 'Phone', icon: 'phone', url: consultant.phone },
                    { id: '4', name: 'WhatsApp', icon: 'whatsapp', url: consultant.phone },
                  ]
              ).map((item) => {
                const href = getSocialHref(item.icon, item.url);
                const target = getSocialTarget(item.icon, item.url);
                const rel = getSocialRel(item.icon, item.url);
                return (
                  <a
                    key={item.id}
                    href={href}
                    target={target}
                    rel={rel}
                    aria-label={item.name || getPlatformName(item.icon)}
                    title={item.name || getPlatformName(item.icon)}
                    className="w-11 h-11 rounded-xl bg-[#121B2E] hover:bg-[#18243C] border border-[#1E2C48] hover:border-[#3B82F6] text-[#C4CCDA] hover:text-[#F2F5F9] flex items-center justify-center transition-all duration-200 shadow-sm group cursor-pointer"
                  >
                    <SocialIcon icon={item.icon} className="w-4 h-4 text-inherit group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p>© {new Date().getFullYear()} {consultant.name || 'Syed M. Ahsan Shah'}. All rights reserved.</p>
          </div>

          {/* Live Portfolio Reviews & Views Counter */}
          <div className="flex items-center gap-3 text-[11px] text-[#8B97AC]">
            <div
              id="footer-portfolio-views"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121B2E] border border-[#1E2C48] text-[#C4CCDA]"
              title={`${engagementStats.uniqueVisitors.toLocaleString()} unique visitor sessions`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="font-mono font-bold text-white">
                {engagementStats.views.toLocaleString()}
              </span>
              <span>Portfolio Reviews & Impressions</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
