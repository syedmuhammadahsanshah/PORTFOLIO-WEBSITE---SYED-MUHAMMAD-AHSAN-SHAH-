import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Lock } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const { data, openAdminModal, isAdminAuthenticated } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'casestudies', label: 'Case Studies' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0E1A]/90 backdrop-blur-md border-b border-[#1E2C48] py-3 shadow-xl shadow-black/30'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#121B2E] border border-[#1E2C48] group-hover:border-[#3B82F6]/60 flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2F6FED]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-heading font-bold text-sm tracking-wider text-[#F2F5F9] group-hover:text-[#3B82F6] transition-colors">
                {data.consultant.brandInitials}
              </span>
              <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#D9A94E]/60 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-sm sm:text-base text-[#F2F5F9] tracking-tight group-hover:text-[#3B82F6] transition-colors">
                {data.consultant.brandText}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 bg-[#121B2E]/60 border border-[#1E2C48]/80 rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                    isActive
                      ? 'text-[#F2F5F9] bg-[#1E2C48] shadow-sm font-semibold'
                      : 'text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#121B2E]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="navbar-admin-btn"
              onClick={openAdminModal}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-all text-xs flex items-center gap-2 ${
                isAdminAuthenticated
                  ? 'bg-[#121B2E] border-emerald-500/60 text-emerald-400 shadow-sm'
                  : 'bg-[#121B2E] border-[#D9A94E]/40 hover:border-[#D9A94E] text-[#D9A94E] hover:text-[#F2F5F9]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#D9A94E]" />
              <span>Admin</span>
              {isAdminAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              id="header-cta-talk"
              onClick={() => handleLinkClick('contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-md shadow-[#2F6FED]/20 hover:shadow-[#3B82F6]/30 hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3B82F6]"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="p-2 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#F2F5F9] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="lg:hidden mt-3 pt-3 pb-4 px-2 border-t border-[#1E2C48] bg-[#0D1424] rounded-2xl border border-[#1E2C48] shadow-2xl space-y-1 animate-fadeIn"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E2C48] text-[#F2F5F9] font-semibold border border-[#3B82F6]/30'
                      : 'text-[#C4CCDA] hover:bg-[#121B2E] hover:text-[#F2F5F9]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                </button>
              );
            })}

            <div className="pt-3 px-2">
              <button
                id="mobile-cta-talk"
                onClick={() => handleLinkClick('contact')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold shadow-lg"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 pt-2 text-[11px] text-[#8B97AC] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A94E]" />
              <span>Available for Remote & On-Site Engagements</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
