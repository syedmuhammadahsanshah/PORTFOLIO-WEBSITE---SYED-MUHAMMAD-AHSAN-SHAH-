/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { CoreExpertiseSection } from './components/CoreExpertiseSection';
import { FeaturedCaseStudiesSection } from './components/FeaturedCaseStudiesSection';
import { IndustriesMarquee } from './components/IndustriesMarquee';
import { AboutSection } from './components/AboutSection';
import { ServicesPageSection } from './components/ServicesPageSection';
import { CaseStudiesCatalog } from './components/CaseStudiesCatalog';
import { CertificationsSection } from './components/CertificationsSection';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { ContactSection } from './components/ContactSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CaseStudy } from './data/portfolioData';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('pp');

  // Handle smooth scroll navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`${sectionId}-section`) || document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // Header height compensation
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectExpertise = (expertiseId: string) => {
    setSelectedServiceId(expertiseId);
    handleNavigate('expertise');
  };

  // Scroll spy to update active section in header
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home', 'about', 'expertise', 'casestudies', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        let el = document.getElementById(`${sectionId}-section`);
        if (!el) {
          if (sectionId === 'casestudies') el = document.getElementById('case-studies-catalog-section');
          if (sectionId === 'expertise') el = document.getElementById('services-page-section');
        }
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F2F5F9] relative selection:bg-[#3B82F6]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main id="main-content" className="relative">
        {/* Home & Hero Section */}
        <div id="home-section">
          <Hero onNavigate={handleNavigate} />
        </div>

        {/* Key Statistics Strip */}
        <StatsSection />

        {/* Core Value & 4 Disciplines */}
        <CoreExpertiseSection
          onSelectExpertise={handleSelectExpertise}
          onViewAllExpertise={() => handleNavigate('expertise')}
        />

        {/* Selected Featured Case Studies */}
        <FeaturedCaseStudiesSection
          onSelectCaseStudy={(study) => setSelectedCaseStudy(study)}
          onViewAllCaseStudies={() => handleNavigate('casestudies')}
        />

        {/* Industries & Clients Marquee */}
        <IndustriesMarquee />

        {/* About Consultant, Narrative, Career Timeline & Skills */}
        <div id="about-section">
          <AboutSection onNavigate={handleNavigate} />
        </div>

        {/* In-depth Services & Functional Capabilities */}
        <div id="expertise-section">
          <ServicesPageSection
            onNavigate={handleNavigate}
            selectedServiceId={selectedServiceId}
          />
        </div>

        {/* Comprehensive Case Studies Catalog */}
        <div id="casestudies-section">
          <CaseStudiesCatalog
            onSelectCaseStudy={(study) => setSelectedCaseStudy(study)}
          />
        </div>

        {/* Official Certifications & Credentials */}
        <div id="certifications-section">
          <CertificationsSection />
        </div>

        {/* Client Testimonials */}
        <TestimonialsCarousel />

        {/* Contact Section & Form */}
        <div id="contact-section">
          <ContactSection />
        </div>

        {/* Final Conversion CTA */}
        <FinalCTA onNavigate={handleNavigate} />
      </main>

      {/* Enterprise Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onContactClick={() => handleNavigate('contact')}
      />
    </div>
  );
}
