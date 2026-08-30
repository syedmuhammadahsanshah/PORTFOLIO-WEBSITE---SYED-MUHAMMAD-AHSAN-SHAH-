import React, { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, Send, Check, Copy, Shield, AlertCircle, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { consultant } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    moduleNeeded: 'PP — Production Planning',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const modules = [
    'PP — Production Planning',
    'QM — Quality Management',
    'PM — Plant Maintenance',
    'Full PP / QM / PM Program',
    'IT Systems & M365 Administration',
    'Other / Not Sure Yet',
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Prepare mailto link payload
    const subject = encodeURIComponent(`SAP Consulting Inquiry - ${formData.moduleNeeded} (${formData.company || formData.name})`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\nModule(s) Needed: ${formData.moduleNeeded}\n\nProject Scope & Message:\n${formData.message}\n`
    );
    const mailtoUrl = `mailto:${consultant.email}?subject=${subject}&body=${body}`;

    // Simulate clean handling and open client mailto
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.location.href = mailtoUrl;
    }, 600);
  };

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${consultant.name}
N:Shah;Syed Muhammad Ahsan;;;
TITLE:${consultant.title}
EMAIL;TYPE=INTERNET,WORK:${consultant.email}
TEL;TYPE=CELL,VOICE:${consultant.phone}
ADR;TYPE=WORK:;;;Karachi;;;Pakistan
URL:${consultant.linkedin}
NOTE:Senior SAP PP/QM/PM Functional Consultant & IT Systems Lead
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Syed_Muhammad_Ahsan_Shah_SAP_Consultant.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Whether it's an SAP consulting engagement, a full-time role, or project-based support — I'd like to hear about it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details & Availability */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Status & Availability Card */}
            <div className="p-6 rounded-3xl bg-[#121B2E] border border-[#1E2C48] shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-heading font-bold text-sm text-[#F2F5F9]">
                  {consultant.availability}
                </span>
              </div>
              <p className="text-xs text-[#8B97AC] leading-relaxed">
                Available for SAP PP/QM/PM program design, blueprinting workshops, implementation cutover, and enterprise IT leadership engagements.
              </p>

              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0D1424] hover:bg-[#18243C] border border-[#1E2C48] text-xs font-semibold text-[#C4CCDA] hover:text-[#F2F5F9] transition-all"
              >
                <Download className="w-4 h-4 text-[#3B82F6]" />
                <span>Save Consultant Contact Card (.vcf)</span>
              </button>
            </div>

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

              {/* Location */}
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#121B2E] text-[#D9A94E]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#8B97AC]">Location Base</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#F2F5F9]">
                    {consultant.location} (Pakistan & Saudi Arabia Engagements)
                  </div>
                </div>
              </div>
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
                <div className="p-6 rounded-2xl bg-[#0D1424] border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#F2F5F9]">
                    Inquiry Prepared Successfully
                  </h4>
                  <p className="text-xs text-[#C4CCDA] leading-relaxed max-w-md mx-auto">
                    Your email client has been launched with your inquiry details. If your client didn't open automatically, you can send an email directly to <strong className="text-[#3B82F6]">{consultant.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        moduleNeeded: 'PP — Production Planning',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs font-semibold text-[#C4CCDA] hover:text-white"
                  >
                    Send Another Message
                  </button>
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
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#2F6FED]/25 hover:shadow-[#3B82F6]/35 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processing Inquiry...</span>
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
