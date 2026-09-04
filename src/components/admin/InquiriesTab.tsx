import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Reply,
  Copy,
  Check,
  Download,
  Search,
  Filter,
  Send,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { InquiryItem, EmailSettings } from '../../data/portfolioData';
import { sendTestEmailPing, EmailDispatchResult } from '../../utils/emailService';

export const InquiriesTab: React.FC = () => {
  const {
    data,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    updateEmailSettings,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(null);

  // Email Configuration state
  const [showConfig, setShowConfig] = useState(false);
  const [emailConfig, setEmailConfig] = useState<EmailSettings>(
    data.emailSettings || {
      provider: 'formsubmit',
      recipientEmail: data.consultant.email,
    }
  );
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  // Test email ping state
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [pingResult, setPingResult] = useState<EmailDispatchResult | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStatus =
        selectedStatus === 'all' || inq.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        inq.module.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => i.status === 'new').length;
    const replied = inquiries.filter((i) => i.status === 'replied').length;
    const archived = inquiries.filter((i) => i.status === 'archived').length;
    return { total, unread, replied, archived };
  }, [inquiries]);

  const handleSaveEmailConfig = async () => {
    setIsSavingConfig(true);
    await updateEmailSettings(emailConfig);
    setIsSavingConfig(false);
    setConfigNotice('Email delivery settings saved successfully.');
    setTimeout(() => setConfigNotice(null), 3000);
  };

  const handleTriggerTestPing = async () => {
    setIsSendingPing(true);
    setPingResult(null);
    try {
      const recipient = emailConfig.recipientEmail || data.consultant.email;
      const result = await sendTestEmailPing(recipient, emailConfig);
      setPingResult(result);
    } catch (err) {
      setPingResult({
        success: false,
        message: err instanceof Error ? err.message : String(err),
        provider: emailConfig.provider || 'formsubmit',
      });
    } finally {
      setIsSendingPing(false);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;

    const headers = [
      'ID',
      'Date & Time',
      'Status',
      'Name',
      'Email',
      'Company',
      'SAP Module',
      'Message',
      'Email Delivery Status',
    ];

    const rows = inquiries.map((i) => [
      `"${i.id}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`,
      `"${i.status}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.module || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${i.emailDeliveryStatus || 'logged'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `sap_portfolio_inquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2C48]">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5F9] flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-[#3B82F6]" />
            Client Inquiries & Lead Management
          </h2>
          <p className="text-xs text-[#8B97AC] mt-1">
            Real-time messages submitted by prospective clients from your portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs font-semibold text-[#C4CCDA] hover:text-[#F2F5F9] hover:bg-[#1A263F] transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#D9A94E]" />
            <span>Email Delivery Settings</span>
            {showConfig ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={inquiries.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs font-semibold text-[#3B82F6] hover:bg-[#1A263F] transition-colors disabled:opacity-40"
            title="Download CSV report of inquiries"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1E2C48]">
          <div className="text-[11px] font-mono text-[#8B97AC] uppercase">Total Leads</div>
          <div className="text-2xl font-bold text-[#F2F5F9] mt-1">{stats.total}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-amber-500/30">
          <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1">
            <span>New / Unread</span>
            {stats.unread > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats.unread}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-emerald-500/30">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Replied</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.replied}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1E2C48]">
          <div className="text-[11px] font-mono text-[#8B97AC] uppercase">Archived</div>
          <div className="text-2xl font-bold text-[#C4CCDA] mt-1">{stats.archived}</div>
        </div>
      </div>

      {/* Email Delivery Pipeline Configuration Panel */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#2F6FED]/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F2F5F9]">
              <Mail className="w-4 h-4 text-[#2F6FED]" />
              Automated Email Delivery Pipeline
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live Active
            </span>
          </div>

          <p className="text-xs text-[#C4CCDA] leading-relaxed">
            Configure where and how incoming client inquiries are delivered. By default, inquiries are dispatched in the background via <strong>FormSubmit</strong> directly to your email address, and saved simultaneously to your Firestore database.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#C4CCDA] mb-1">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={emailConfig.recipientEmail || data.consultant.email}
                onChange={(e) =>
                  setEmailConfig({ ...emailConfig, recipientEmail: e.target.value })
                }
                placeholder={data.consultant.email}
                className="w-full px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
              />
              <span className="text-[10px] text-[#8B97AC] mt-1 block">
                All client submissions will be sent to this email inbox.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C4CCDA] mb-1">
                Delivery Service
              </label>
              <select
                value={emailConfig.provider || 'formsubmit'}
                onChange={(e) =>
                  setEmailConfig({
                    ...emailConfig,
                    provider: e.target.value as EmailSettings['provider'],
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="formsubmit">FormSubmit (Zero-Config / Free Direct Delivery)</option>
                <option value="web3forms">Web3Forms (With Access Key)</option>
                <option value="custom_webhook">Custom Webhook (Zapier / Make / Slack)</option>
              </select>
              <span className="text-[10px] text-[#8B97AC] mt-1 block">
                Default: FormSubmit requires no signup or paid keys.
              </span>
            </div>
          </div>

          {emailConfig.provider === 'web3forms' && (
            <div>
              <label className="block text-xs font-medium text-[#C4CCDA] mb-1">
                Web3Forms Access Key
              </label>
              <input
                type="text"
                value={emailConfig.web3FormsAccessKey || ''}
                onChange={(e) =>
                  setEmailConfig({ ...emailConfig, web3FormsAccessKey: e.target.value })
                }
                placeholder="e.g. 12345678-abcd-efgh-ijkl-1234567890ab"
                className="w-full px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          )}

          {emailConfig.provider === 'custom_webhook' && (
            <div>
              <label className="block text-xs font-medium text-[#C4CCDA] mb-1">
                Webhook Endpoint URL
              </label>
              <input
                type="url"
                value={emailConfig.webhookUrl || ''}
                onChange={(e) =>
                  setEmailConfig({ ...emailConfig, webhookUrl: e.target.value })
                }
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          )}

          {/* FormSubmit Info Box */}
          <div className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#C4CCDA] space-y-1.5">
            <div className="font-semibold text-[#D9A94E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              How FormSubmit Direct Delivery Works:
            </div>
            <p className="text-[11px] text-[#8B97AC] leading-relaxed">
              When a client submits an inquiry, FormSubmit sends an email directly to your inbox. On the very first test or client message, FormSubmit sends a 1-click confirmation link (<span className="text-[#3B82F6]">"Activate Form"</span>) to your email address. Once clicked, all future client submissions arrive directly in your inbox automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEmailConfig}
                disabled={isSavingConfig}
                className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                {isSavingConfig ? 'Saving Settings...' : 'Save Email Settings'}
              </button>

              <button
                onClick={handleTriggerTestPing}
                disabled={isSendingPing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs font-semibold text-[#D9A94E] hover:bg-[#1A263F] transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingPing ? 'Sending Test Email...' : 'Send Test Email Ping'}</span>
              </button>
            </div>

            {configNotice && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {configNotice}
              </span>
            )}
          </div>

          {/* Test Ping Response Box */}
          {pingResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed mt-2 ${
                pingResult.success
                  ? pingResult.needsActivation
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                {pingResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {pingResult.success
                    ? pingResult.needsActivation
                      ? 'Activation Link Sent to Recipient'
                      : 'Test Email Dispatched Successfully'
                    : 'Test Email Dispatch Failed'}
                </span>
              </div>
              <p className="text-[11px] opacity-90">{pingResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8B97AC] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#0D1424] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9]'
              }`}
            >
              {st === 'all' ? 'All Leads' : st}
              {st === 'new' && stats.unread > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {stats.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0D1424] border border-[#1E2C48] text-center space-y-3">
            <Inbox className="w-10 h-10 text-[#8B97AC] mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-[#F2F5F9]">No inquiries found</h3>
            <p className="text-xs text-[#8B97AC] max-w-sm mx-auto">
              {searchQuery || selectedStatus !== 'all'
                ? 'No inquiries match your current search criteria or filter.'
                : 'When prospective clients submit inquiries through the contact form on your portfolio website, they will appear here in real-time.'}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isExpanded = expandedInquiryId === inq.id;
            const replySubject = encodeURIComponent(`Re: SAP Consultation Inquiry - ${inq.module}`);
            const replyMailto = `mailto:${inq.email}?subject=${replySubject}`;

            return (
              <div
                key={inq.id}
                className={`p-4 rounded-2xl bg-[#0D1424] border transition-all ${
                  inq.status === 'new'
                    ? 'border-amber-500/40 bg-[#0D1424]/90'
                    : 'border-[#1E2C48] hover:border-[#2F6FED]/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#F2F5F9]">
                        {inq.name}
                      </span>

                      {inq.company && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[11px] text-[#C4CCDA]">
                          <Building2 className="w-3 h-3 text-[#8B97AC]" />
                          {inq.company}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[11px] text-[#3B82F6] font-mono font-medium">
                        {inq.module}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider ${
                          inq.status === 'new'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : inq.status === 'replied'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : inq.status === 'read'
                            ? 'bg-[#121B2E] text-[#8B97AC] border border-[#1E2C48]'
                            : 'bg-[#121B2E] text-[#8B97AC]'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    {/* Email and Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8B97AC]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span className="text-[#C4CCDA] font-medium">{inq.email}</span>
                        <button
                          onClick={() => handleCopy(inq.id, inq.email)}
                          className="text-[#8B97AC] hover:text-[#F2F5F9]"
                          title="Copy Email"
                        >
                          {copiedId === inq.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8B97AC]" />
                        <span>{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Database Confirmed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start">
                    <a
                      href={replyMailto}
                      onClick={() => updateInquiryStatus(inq.id, 'replied')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2F6FED]/20 border border-[#2F6FED]/40 text-[#3B82F6] hover:bg-[#2F6FED] hover:text-white text-xs font-semibold transition-colors"
                      title="Compose email reply to client"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </a>

                    <select
                      value={inq.status}
                      onChange={(e) =>
                        updateInquiryStatus(
                          inq.id,
                          e.target.value as InquiryItem['status']
                        )
                      }
                      className="px-2 py-1.5 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete inquiry from ${inq.name}?`
                          )
                        ) {
                          deleteInquiry(inq.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-[#8B97AC] hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="mt-3 pt-3 border-t border-[#1E2C48]/60">
                  <div className="text-xs text-[#F2F5F9] whitespace-pre-wrap leading-relaxed">
                    {isExpanded
                      ? inq.message
                      : inq.message.length > 180
                      ? `${inq.message.slice(0, 180)}...`
                      : inq.message}
                  </div>

                  {inq.message.length > 180 && (
                    <button
                      onClick={() =>
                        setExpandedInquiryId(isExpanded ? null : inq.id)
                      }
                      className="text-[11px] text-[#3B82F6] hover:underline mt-1 inline-block"
                    >
                      {isExpanded ? 'Show less' : 'Read full message'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
