import React, { useState } from 'react';
import {
  X, Lock, Key, User, BarChart2, Briefcase, FileText, Award,
  CheckCircle, Plus, Trash2, Save, RotateCcw, Download, Upload,
  Layers, LogOut, Check, AlertCircle, Eye, EyeOff, ShieldCheck,
  Edit2, Globe, Cloud, CloudCheck, RefreshCw
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CaseStudy, StatItem, SkillItem, TimelineItemData, ExpertiseItem, TestimonialItem } from '../data/portfolioData';

export const AdminPortalModal: React.FC = () => {
  const {
    data,
    syncStatus,
    isSyncing,
    isAdminAuthenticated,
    isAdminModalOpen,
    closeAdminModal,
    authenticateAdmin,
    logoutAdmin,
    updateAdminPin,
    updateConsultantProfile,
    updateStatistics,
    updateExpertiseList,
    updateCaseStudies,
    updateSkills,
    updateTimeline,
    updateTestimonials,
    updateIndustries,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
  } = usePortfolio();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'caseStudies' | 'skills' | 'timeline' | 'testimonials' | 'security' | 'backup'>('profile');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Security tab state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Backup JSON state
  const [jsonImportText, setJsonImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isAdminModalOpen) return null;

  const triggerSaveNotice = (message = 'Changes published live instantly across all devices') => {
    setSaveSuccessNotice(message);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(pinInput)) {
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid passcode. (Default initial PIN is 1234)');
    }
  };

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateAdminPin(oldPin, newPin)) {
      setPinChangeMsg({ type: 'success', text: 'Passcode successfully updated!' });
      setOldPin('');
      setNewPin('');
    } else {
      setPinChangeMsg({ type: 'error', text: 'Current passcode is incorrect, or new passcode is shorter than 4 digits.' });
    }
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Syed_Muhammad_Ahsan_Shah_Portfolio_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSaveNotice('JSON file backup saved');
  };

  const handleImportSubmit = async () => {
    const success = await importDataJSON(jsonImportText);
    if (success) {
      setImportStatus('Portfolio data successfully restored to live cloud database!');
      triggerSaveNotice('Portfolio data imported & synced live');
      setJsonImportText('');
    } else {
      setImportStatus('Failed to parse JSON. Please verify syntax.');
    }
  };

  return (
    <div
      id="admin-portal-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={closeAdminModal}
    >
      <div
        id="admin-portal-modal-content"
        className="relative w-full max-w-5xl bg-[#0D1424] border border-[#1E2C48] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#F2F5F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2C48] bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121B2E] border border-[#3B82F6]/40 flex items-center justify-center text-[#D9A94E]">
              <Lock className="w-4 h-4 text-[#D9A94E]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#F2F5F9] flex items-center gap-2">
                <span>Consultant Admin Portal</span>
                {isAdminAuthenticated && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Cloud Sync Active</span>
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-[#8B97AC]">
                Real-time updates published directly to all visitors worldwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="p-2 rounded-xl bg-[#121B2E] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
            <button
              onClick={closeAdminModal}
              className="p-2 rounded-xl bg-[#121B2E] hover:bg-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] border border-[#1E2C48] transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Save Notice / Sync Banner */}
        {saveSuccessNotice ? (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2 flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        ) : isSyncing ? (
          <div className="bg-[#3B82F6]/15 border-b border-[#3B82F6]/30 px-6 py-2 flex items-center gap-2 text-xs font-semibold text-[#3B82F6] animate-fadeIn">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Publishing changes live to database...</span>
          </div>
        ) : null}

        {/* Not Authenticated: Passcode Screen */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#121B2E] border-2 border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] mb-5 shadow-lg shadow-[#2F6FED]/10">
              <Key className="w-8 h-8 text-[#D9A94E]" />
            </div>

            <h3 className="font-heading font-bold text-xl text-[#F2F5F9] mb-2">
              Authentication Required
            </h3>
            <p className="text-xs text-[#8B97AC] mb-6 leading-relaxed">
              Enter your consultant admin passcode to update portfolio content live for all visitors worldwide.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="Enter Passcode (Default: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] focus:border-[#3B82F6] text-sm text-[#F2F5F9] text-center font-mono tracking-widest placeholder-[#8B97AC] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B97AC] hover:text-[#F2F5F9] p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#2F6FED]/25"
              >
                Access Dashboard & Edit Live
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-[#1E2C48] text-[11px] text-[#8B97AC] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A94E]" />
              <span>Live Cloud Connected (Firebase Firestore)</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs & Editor Views */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-[#0A0E1A] border-r border-[#1E2C48] p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              {[
                { id: 'profile', label: 'Consultant Profile', icon: User },
                { id: 'stats', label: 'Key Statistics', icon: BarChart2 },
                { id: 'caseStudies', label: 'Case Studies', icon: Briefcase },
                { id: 'skills', label: 'Skills Matrix', icon: Award },
                { id: 'timeline', label: 'Career Timeline', icon: FileText },
                { id: 'testimonials', label: 'Client Feedback', icon: CheckCircle },
                { id: 'security', label: 'Security & PIN', icon: Key },
                { id: 'backup', label: 'Backup & JSON', icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap text-left ${
                      isSelected
                        ? 'bg-[#121B2E] text-[#F2F5F9] font-semibold border border-[#3B82F6]/50 shadow-sm'
                        : 'text-[#8B97AC] hover:bg-[#121B2E]/50 hover:text-[#F2F5F9]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#3B82F6]' : 'text-[#8B97AC]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#0D1424]">
              
              {/* TAB 1: PROFILE & CONTACT */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Profile & Contact Information
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Update headline titles, contact channels, and executive summary.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={data.consultant.name}
                        onChange={(e) => {
                          updateConsultantProfile({ name: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Brand Initials</label>
                      <input
                        type="text"
                        value={data.consultant.brandInitials}
                        onChange={(e) => {
                          updateConsultantProfile({ brandInitials: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Professional Title</label>
                      <input
                        type="text"
                        value={data.consultant.title}
                        onChange={(e) => {
                          updateConsultantProfile({ title: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Hero Summary Text</label>
                      <textarea
                        rows={3}
                        value={data.consultant.heroSummary}
                        onChange={(e) => {
                          updateConsultantProfile({ heroSummary: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={data.consultant.email}
                        onChange={(e) => {
                          updateConsultantProfile({ email: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Phone Number / WhatsApp</label>
                      <input
                        type="text"
                        value={data.consultant.phone}
                        onChange={(e) => {
                          updateConsultantProfile({ phone: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={data.consultant.linkedin}
                        onChange={(e) => {
                          updateConsultantProfile({ linkedin: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Availability Status Badge</label>
                      <input
                        type="text"
                        value={data.consultant.status}
                        onChange={(e) => {
                          updateConsultantProfile({ status: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Guiding Philosophy / Pull Quote</label>
                      <input
                        type="text"
                        value={data.consultant.pullQuote}
                        onChange={(e) => {
                          updateConsultantProfile({ pullQuote: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KEY STATISTICS */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                      Key Metrics & Statistics Strip
                    </h3>
                    <p className="text-xs text-[#8B97AC]">
                      Modify the four prominent metrics displayed under the hero section.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.statistics.map((stat, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-[#D9A94E]">
                          <span>Metric #{idx + 1}</span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">Display Value</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...data.statistics];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              updateStatistics(newStats);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-sm font-bold text-[#3B82F6] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">Primary Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...data.statistics];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              updateStatistics(newStats);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">Sublabel (Context)</label>
                          <input
                            type="text"
                            value={stat.sublabel || ''}
                            onChange={(e) => {
                              const newStats = [...data.statistics];
                              newStats[idx] = { ...newStats[idx], sublabel: e.target.value };
                              updateStatistics(newStats);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CASE STUDIES */}
              {activeTab === 'caseStudies' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Case Studies & Client Engagements ({data.caseStudies.length})
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Add, modify, or toggle featured status for projects.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newStudy: CaseStudy = {
                          id: `engagement-${Date.now()}`,
                          title: 'New Client Implementation & Operational Engagement',
                          company: 'New Manufacturing Co.',
                          location: 'Karachi, Pakistan',
                          modules: ['PP', 'QM'],
                          category: 'full-cycle',
                          categoryLabel: 'Full-Cycle Implementation',
                          engagementType: 'SAP Functional Consultant',
                          challenge: 'Describe operational requirements, manufacturing process variations, and plant challenge.',
                          solution: 'Configured SAP PP/QM modules and streamlined shop floor workflows.',
                          outcome: 'Delivered measurable uptime, real-time batch visibility, and operational cost savings.',
                          featured: false,
                        };
                        updateCaseStudies([newStudy, ...data.caseStudies]);
                        triggerSaveNotice('Added new case study draft');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Case Study</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.caseStudies.map((study, idx) => (
                      <div
                        key={study.id}
                        className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2C48]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                            <span className="font-heading font-bold text-sm text-[#F2F5F9]">{study.company}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs text-[#C4CCDA] cursor-pointer bg-[#0D1424] px-2.5 py-1 rounded-lg border border-[#1E2C48]">
                              <input
                                type="checkbox"
                                checked={study.featured || false}
                                onChange={(e) => {
                                  const updated = [...data.caseStudies];
                                  updated[idx] = { ...updated[idx], featured: e.target.checked };
                                  updateCaseStudies(updated);
                                  triggerSaveNotice();
                                }}
                                className="rounded text-[#3B82F6]"
                              />
                              <span>Featured on Homepage</span>
                            </label>

                            <button
                              onClick={() => {
                                if (confirm(`Delete case study for ${study.company}?`)) {
                                  const filtered = data.caseStudies.filter((_, i) => i !== idx);
                                  updateCaseStudies(filtered);
                                  triggerSaveNotice('Case study removed');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                              title="Delete Case Study"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Company Name</label>
                            <input
                              type="text"
                              value={study.company}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                updated[idx] = { ...updated[idx], company: e.target.value };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Location</label>
                            <input
                              type="text"
                              value={study.location}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                updated[idx] = { ...updated[idx], location: e.target.value };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Category</label>
                            <select
                              value={study.category}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                const cat = e.target.value as any;
                                const label =
                                  cat === 'full-cycle'
                                    ? 'Full-Cycle Implementation'
                                    : cat === 'operational-support'
                                    ? 'Operational Support'
                                    : 'IT Systems & Support';
                                updated[idx] = { ...updated[idx], category: cat, categoryLabel: label };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                            >
                              <option value="full-cycle">Full-Cycle Implementation</option>
                              <option value="operational-support">Operational Support</option>
                              <option value="it-systems">IT Systems & Support</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Modules (comma separated)</label>
                            <input
                              type="text"
                              value={study.modules.join(', ')}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                updated[idx] = {
                                  ...updated[idx],
                                  modules: e.target.value.split(',').map((m) => m.trim()).filter(Boolean),
                                };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-[#8B97AC] mb-1">Challenge & Scope</label>
                            <textarea
                              rows={2}
                              value={study.challenge}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                updated[idx] = { ...updated[idx], challenge: e.target.value };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-[#8B97AC] mb-1">Business Outcome</label>
                            <textarea
                              rows={2}
                              value={study.outcome}
                              onChange={(e) => {
                                const updated = [...data.caseStudies];
                                updated[idx] = { ...updated[idx], outcome: e.target.value };
                                updateCaseStudies(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Skills Matrix & Proficiency Levels
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Adjust visual proficiency bars and add new competencies.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newSkill: SkillItem = {
                          name: 'New Competency / Module',
                          percentage: 90,
                          category: 'Core SAP',
                          details: 'SAP Configuration, process mapping & integration',
                        };
                        updateSkills([...data.skills, newSkill]);
                        triggerSaveNotice('Added new skill entry');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.skills.map((skill, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                        <div className="sm:col-span-4">
                          <label className="block font-semibold text-[#8B97AC] mb-1">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              updateSkills(updated);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-[#8B97AC] mb-1">Score ({skill.percentage}%)</label>
                          <input
                            type="number"
                            min="50"
                            max="100"
                            value={skill.percentage}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx] = { ...updated[idx], percentage: parseInt(e.target.value) || 80 };
                              updateSkills(updated);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#3B82F6] font-mono font-bold focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-5">
                          <label className="block font-semibold text-[#8B97AC] mb-1">Details & Specialization</label>
                          <input
                            type="text"
                            value={skill.details || ''}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx] = { ...updated[idx], details: e.target.value };
                              updateSkills(updated);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            onClick={() => {
                              const updated = data.skills.filter((_, i) => i !== idx);
                              updateSkills(updated);
                              triggerSaveNotice('Skill removed');
                            }}
                            className="p-2 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Career Timeline & Milestones
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Add, edit, or delete career progression entries.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem: TimelineItemData = {
                          year: `${new Date().getFullYear()} – Present`,
                          role: 'Senior SAP Consultant',
                          company: 'Enterprise Client / Consulting',
                          description: 'Leading SAP PP/QM/PM program execution and plant optimizations.',
                        };
                        updateTimeline([newItem, ...data.timeline]);
                        triggerSaveNotice('Added new timeline milestone');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Role / Milestone</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.timeline.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
                          <span className="font-mono text-[#D9A94E] font-bold">Entry #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const updated = data.timeline.filter((_, i) => i !== idx);
                              updateTimeline(updated);
                              triggerSaveNotice('Timeline entry removed');
                            }}
                            className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Year / Period</label>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...data.timeline];
                                updated[idx] = { ...updated[idx], year: e.target.value };
                                updateTimeline(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#D9A94E] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Role</label>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => {
                                const updated = [...data.timeline];
                                updated[idx] = { ...updated[idx], role: e.target.value };
                                updateTimeline(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Company</label>
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => {
                                const updated = [...data.timeline];
                                updated[idx] = { ...updated[idx], company: e.target.value };
                                updateTimeline(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#3B82F6] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-[#8B97AC] mb-1">Description & Scope</label>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...data.timeline];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              updateTimeline(updated);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Client Testimonials & Feedback
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Add, edit, or delete endorsements.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newTestimonial: TestimonialItem = {
                          id: `testimonial-${Date.now()}`,
                          quote: 'Syed brought rigorous SAP standard discipline and hands-on shop floor understanding to our plant operations.',
                          role: 'Plant General Manager',
                          industry: 'Process Manufacturing',
                          location: 'Saudi Arabia',
                        };
                        updateTestimonials([...data.testimonials, newTestimonial]);
                        triggerSaveNotice('Added new testimonial');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.testimonials.map((test, idx) => (
                      <div key={test.id} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
                          <span className="font-mono text-[#D9A94E] font-bold">Feedback #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const updated = data.testimonials.filter((_, i) => i !== idx);
                              updateTestimonials(updated);
                              triggerSaveNotice('Testimonial removed');
                            }}
                            className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Client Role</label>
                            <input
                              type="text"
                              value={test.role}
                              onChange={(e) => {
                                const updated = [...data.testimonials];
                                updated[idx] = { ...updated[idx], role: e.target.value };
                                updateTestimonials(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Industry</label>
                            <input
                              type="text"
                              value={test.industry}
                              onChange={(e) => {
                                const updated = [...data.testimonials];
                                updated[idx] = { ...updated[idx], industry: e.target.value };
                                updateTestimonials(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#3B82F6] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-[#8B97AC] mb-1">Location</label>
                            <input
                              type="text"
                              value={test.location}
                              onChange={(e) => {
                                const updated = [...data.testimonials];
                                updated[idx] = { ...updated[idx], location: e.target.value };
                                updateTestimonials(updated);
                                triggerSaveNotice();
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#D9A94E] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-[#8B97AC] mb-1">Quote Statement</label>
                          <textarea
                            rows={2}
                            value={test.quote}
                            onChange={(e) => {
                              const updated = [...data.testimonials];
                              updated[idx] = { ...updated[idx], quote: e.target.value };
                              updateTestimonials(updated);
                              triggerSaveNotice();
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SECURITY & PIN */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                      Security & Passcode Settings
                    </h3>
                    <p className="text-xs text-[#8B97AC]">
                      Change your private admin passcode to protect portal access.
                    </p>
                  </div>

                  <form onSubmit={handlePinChangeSubmit} className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Current Passcode</label>
                      <input
                        type="password"
                        placeholder="Current PIN (Initial: 1234)"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">New Passcode (min 4 characters)</label>
                      <input
                        type="password"
                        placeholder="Enter new PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    {pinChangeMsg && (
                      <p
                        className={`text-xs flex items-center gap-1.5 ${
                          pinChangeMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pinChangeMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>{pinChangeMsg.text}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Update Passcode
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 8: BACKUP & JSON */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                      Backup, Export & Factory Reset
                    </h3>
                    <p className="text-xs text-[#8B97AC]">
                      Export complete portfolio data as formatted JSON for local backup.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Export Card */}
                    <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] font-mono uppercase">
                        <Download className="w-4 h-4" />
                        <span>Export Portfolio JSON</span>
                      </div>
                      <p className="text-xs text-[#8B97AC]">
                        Download your customized portfolio configuration file to your computer.
                      </p>
                      <button
                        onClick={handleDownloadJSON}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download JSON Backup</span>
                      </button>
                    </div>

                    {/* Reset Card */}
                    <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono uppercase">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to Initial Prompt Defaults</span>
                      </div>
                      <p className="text-xs text-[#8B97AC]">
                        Restore all portfolio fields, case studies, and numbers back to default state in cloud database.
                      </p>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to reset all data back to original defaults in the cloud database?')) {
                            await resetToDefaults();
                            triggerSaveNotice('Restored to default configuration');
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0D1424] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Data</span>
                      </button>
                    </div>
                  </div>

                  {/* Import JSON Area */}
                  <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D9A94E] font-mono uppercase">
                      <Upload className="w-4 h-4" />
                      <span>Direct JSON Import & Cloud Restore</span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Paste portfolio JSON object here..."
                      value={jsonImportText}
                      onChange={(e) => setJsonImportText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none"
                    />
                    {importStatus && (
                      <p className="text-xs text-[#3B82F6]">{importStatus}</p>
                    )}
                    <button
                      onClick={handleImportSubmit}
                      disabled={!jsonImportText.trim()}
                      className="px-4 py-2 rounded-xl bg-[#1E2C48] hover:bg-[#2F6FED] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      Import & Publish Live
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
