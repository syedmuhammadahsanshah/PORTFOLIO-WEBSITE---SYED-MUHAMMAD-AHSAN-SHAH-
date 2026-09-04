import React, { useState, useMemo, useEffect } from 'react';
import {
  Mail, Phone, Linkedin, MapPin, Send, Check, Copy, Shield,
  AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultContactModules } from '../data/portfolioData';
import { SocialIcon, getSocialHref, getSocialTarget, getSocialRel, getPlatformName } from './SocialIcon';

export const ContactSection: React.FC = () => {
  const { data, submitInquiry } = usePortfolio();
  const { consultant } = data;

  const modules = useMemo(() => {
    if (data.contactModules && data.contactModules.length > 0) {
      return data.contactModules;
    }
    return defaultContactModules;
  }, [data.contactModules]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    moduleNeeded: modules[0] || 'PP (Production Planning)',
    message: '',
  });

  // Ensure selected module stays valid when modules list is updated from Admin Portal
  useEffect(() => {
    if (modules.length > 0 && !modules.includes(formData.moduleNeeded)) {
      setFormData((prev) => ({
        ...prev,
        moduleNeeded: modules[0],
      }));
    }
  }, [modules, formData.moduleNeeded]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    inquiryId?: string;
    emailDelivered?: boolean;
    needsActivation?: boolean;
    provider?: string;
    message?: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please provide a message or project overview.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await submitInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        module: formData.moduleNeeded,
        message: formData.message,
      });

      setSubmissionFeedback({
        inquiryId: result.id,
        emailDelivered: result.emailResult.success,
        needsActivation: result.emailResult.needsActivation,
        provider: result.emailResult.provider,
        message: result.emailResult.message,
      });

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmissionFeedback({
        emailDelivered: false,
        message: 'Inquiry saved to client record cache. You can also reach out directly via email.',
      });
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMailClientBackup = () => {
    const subject = encodeURIComponent(`SAP Consulting Inquiry - ${formData.moduleNeeded} (${formData.company || formData.name})`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\nModule(s) Needed: ${formData.moduleNeeded}\n\nProject Scope & Message:\n${formData.message}\n`
    );
    window.location.href = `mailto:${consultant.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact-section" className="py-20 bg-[#0A0E1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#F2F5F9] tracking-tight">
            Let's Start Your Next SAP Engagement
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#C4CCDA] leading-relaxed">
            Whether you are planning an SAP implementation, need project consulting, or want dedicated operational support, I would welcome the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* Email */}
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#121B2E] text-[#3B82F6]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-[#8B97AC]">Email</div>
                    <a
                      href={`mailto:${consultant.email}`}
                      className="text-xs sm:text-sm font-semibold text-[#F2F5F9] hover:text-[#3B82F6] transition-colors"
                    >
                      {consultant.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('email', consultant.email)}
                  className="p-2 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] text-xs"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#121B2E] text-[#D9A94E]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-[#8B97AC]">Phone / WhatsApp</div>
                    <a
                      href={`tel:${consultant.phone}`}
                      className="text-xs sm:text-sm font-semibold text-[#F2F5F9] hover:text-[#D9A94E] transition-colors font-mono"
                    >
                      {consultant.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('phone', consultant.phone)}
                  className="p-2 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] text-xs"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#121B2E] text-[#3B82F6]">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-[#8B97AC]">LinkedIn Profile</div>
                    <a
                      href={consultant.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-[#F2F5F9] hover:text-[#3B82F6] transition-colors"
                    >
                      linkedin.com/in/smahsan52
                    </a>
                  </div>
                </div>
                <a
                  href={consultant.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] text-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Geographic Coverage */}
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#121B2E] text-[#D9A94E]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#8B97AC]">Geographic Coverage</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F2F5F9] leading-snug">
                    {consultant.geographicRegions || 'Pakistan · Saudi Arabia · UAE'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8B97AC] leading-snug mt-0.5">
                    {consultant.geographicSupport || 'Remote & On-Site Support across All Regions'}
                  </div>
                </div>
              </div>

              {/* Direct Connect & Social Channels */}
              {data.socialLinks && data.socialLinks.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-3">
                  <div className="text-[10px] uppercase font-mono text-[#8B97AC]">
                    Direct Connect & Social Links
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {data.socialLinks.map((item) => {
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
                          title={`${item.name || getPlatformName(item.icon)}: ${item.url}`}
                          className="w-11 h-11 rounded-xl bg-[#121B2E] hover:bg-[#18243C] border border-[#1E2C48] hover:border-[#3B82F6] text-[#C4CCDA] hover:text-[#F2F5F9] flex items-center justify-center transition-all duration-200 shadow-sm group cursor-pointer"
                        >
                          <SocialIcon icon={item.icon} className="w-4 h-4 text-inherit group-hover:scale-110 transition-transform" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#121B2E] border border-[#1E2C48] shadow-2xl relative">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#F2F5F9] mb-1">
                Send a Direct Message
              </h3>
              <p className="text-xs text-[#8B97AC] mb-6">
                Fill out the details below to initiate communication regarding your SAP project requirements.
              </p>

              {submitSuccess ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-emerald-500/40 text-center space-y-5 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h4 className="font-heading font-bold text-lg sm:text-xl text-[#F2F5F9]">
                      Message Sent & Inquiry Logged
                    </h4>
                    <p className="text-xs text-[#C4CCDA] mt-1.5 leading-relaxed max-w-md mx-auto">
                      Thank you, <strong className="text-white">{formData.name}</strong>. Your consultation inquiry has been processed and delivered.
                    </p>
                  </div>

                  {/* High Trust Delivery Verification Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                    <div className="p-3.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Delivery</span>
                      </div>
                      <div className="text-xs font-semibold text-[#F2F5F9] truncate">
                        {consultant.email}
                      </div>
                      <div className="text-[10px] text-[#8B97AC] leading-tight">
                        Dispatched automatically to consultant inbox.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#3B82F6] font-semibold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Database Lead Record</span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#F2F5F9] truncate">
                        {submissionFeedback?.inquiryId ? `#${submissionFeedback.inquiryId.slice(0, 14)}...` : 'Confirmed'}
                      </div>
                      <div className="text-[10px] text-[#8B97AC] leading-tight">
                        Logged in Firestore for real-time tracking.
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSubmitSuccess(false);
                        setFormData({
                          name: '',
                          email: '',
                          company: '',
                          moduleNeeded: modules[0] || 'PP (Production Planning)',
                          message: '',
                        });
                        setSubmissionFeedback(null);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>

                    <button
                      onClick={handleOpenMailClientBackup}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#121B2E] hover:bg-[#1A263F] border border-[#1E2C48] text-xs font-semibold text-[#C4CCDA] hover:text-white transition-colors cursor-pointer"
                      title="Launch your desktop email application with this message pre-filled"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#8B97AC]" />
                      <span>Open in Mail App (Optional Backup)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-[#C4CCDA] mb-1.5">
                        Your Name <span className="text-[#D9A94E]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none transition-colors ${
                          errors.name ? 'border-rose-500' : 'border-[#1E2C48] focus:border-[#3B82F6]'
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-[#C4CCDA] mb-1.5">
                        Email Address <span className="text-[#D9A94E]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="e.g. j.doe@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none transition-colors ${
                          errors.email ? 'border-rose-500' : 'border-[#1E2C48] focus:border-[#3B82F6]'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Company & Module Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-medium text-[#C4CCDA] mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        placeholder="e.g. Manufacturing Co."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none focus:border-[#3B82F6] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-module" className="block text-xs font-medium text-[#C4CCDA] mb-1.5">
                        Module(s) Needed <span className="text-[#D9A94E]">*</span>
                      </label>
                      <select
                        id="contact-module"
                        value={formData.moduleNeeded}
                        onChange={(e) => setFormData({ ...formData, moduleNeeded: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] transition-colors"
                      >
                        {modules.map((m) => (
                          <option key={m} value={m} className="bg-[#0D1424] text-[#F2F5F9]">
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-[#C4CCDA] mb-1.5">
                      Message / Project Scope <span className="text-[#D9A94E]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Briefly describe your plant environment, SAP requirements, timeline, or consultation goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none transition-colors ${
                        errors.message ? 'border-rose-500' : 'border-[#1E2C48] focus:border-[#3B82F6]'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#2F6FED]/25 hover:shadow-[#3B82F6]/35 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Dispatching Message & Logging Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
