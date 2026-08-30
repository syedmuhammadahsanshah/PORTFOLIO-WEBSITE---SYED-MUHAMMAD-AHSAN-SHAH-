import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, MapPin, Building, Award } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const TestimonialsCarousel: React.FC = () => {
  const { data } = usePortfolio();
  const { testimonials } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto advance smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials-section" className="py-20 bg-[#0D1424] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#2F6FED]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#D9A94E] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>CLIENT PERSPECTIVES</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            What Clients Say
          </h2>
          <p className="mt-3 text-sm text-[#8B97AC]">
            Direct feedback from plant directors, operations leads, and enterprise IT managers.
          </p>
        </div>

        {/* Carousel Container Card */}
        <div className="relative rounded-3xl bg-[#121B2E] border border-[#1E2C48] p-8 sm:p-12 shadow-2xl">
          
          {/* Subtle gold quote mark */}
          <div className="absolute top-6 left-6 text-[#D9A94E]/20">
            <Quote className="w-12 h-12" />
          </div>

          <div className="relative z-10 min-h-[220px] flex flex-col justify-between">
            {/* Quote body */}
            <div className="pt-4">
              <p className="text-base sm:text-lg md:text-xl text-[#F2F5F9] font-normal leading-relaxed italic">
                “{current.quote}”
              </p>
            </div>

            {/* Author details */}
            <div className="mt-8 pt-6 border-t border-[#1E2C48] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] flex items-center justify-center text-[#3B82F6] font-bold font-mono">
                  {current.role.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#F2F5F9]">
                    {current.role}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B97AC]">
                    <span>{current.industry}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#D9A94E]">
                      <MapPin className="w-3 h-3" />
                      {current.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  id="testimonial-prev-btn"
                  onClick={prevSlide}
                  aria-label="Previous Testimonial"
                  className="p-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-[#C4CCDA] hover:text-[#F2F5F9] hover:border-[#3B82F6] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="testimonial-next-btn"
                  onClick={nextSlide}
                  aria-label="Next Testimonial"
                  className="p-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-[#C4CCDA] hover:text-[#F2F5F9] hover:border-[#3B82F6] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-[#3B82F6]'
                    : 'w-2 bg-[#1E2C48] hover:bg-[#8B97AC]'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
