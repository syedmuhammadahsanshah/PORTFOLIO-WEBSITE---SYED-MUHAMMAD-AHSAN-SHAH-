import React, { useState } from 'react';
import {
  Eye,
  Users,
  ThumbsUp,
  Repeat2,
  Share2,
  TrendingUp,
  Activity,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AnalyticsTab: React.FC = () => {
  const {
    engagementStats,
    inquiries,
    updateEngagementBaseline,
  } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    views: engagementStats.views,
    uniqueVisitors: engagementStats.uniqueVisitors,
    likes: engagementStats.likes,
    shares: engagementStats.shares,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testViewAdded, setTestViewAdded] = useState(false);

  // Synchronize formData when engagementStats update externally
  React.useEffect(() => {
    if (!isEditing) {
      setFormData({
        views: engagementStats.views,
        uniqueVisitors: engagementStats.uniqueVisitors,
        likes: engagementStats.likes,
        shares: engagementStats.shares,
      });
    }
  }, [engagementStats, isEditing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateEngagementBaseline({
      views: Number(formData.views),
      uniqueVisitors: Number(formData.uniqueVisitors),
      likes: Number(formData.likes),
      shares: Number(formData.shares),
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSimulateTestView = async () => {
    setTestViewAdded(true);
    await updateEngagementBaseline({
      views: engagementStats.views + 1,
    });
    setTimeout(() => setTestViewAdded(false), 2000);
  };

  const conversionRate = engagementStats.views > 0
    ? ((inquiries.length / engagementStats.views) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#121B2E] via-[#0D1424] to-[#0A0E1A] border border-[#1E2C48]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Real-Time Visitor & Engagement Tracking</span>
          </div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#F2F5F9]">
            Portfolio Traffic & Engagement Analytics
          </h3>
          <p className="text-xs text-[#8B97AC] mt-1 max-w-xl">
            Live counts are stored permanently in Cloud Firestore (<span className="text-[#3B82F6] font-mono">/analytics/main</span>) and increment automatically whenever someone reviews your portfolio or clicks like/share.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateTestView}
            disabled={testViewAdded}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121B2E] hover:bg-[#1A263F] border border-[#1E2C48] text-xs font-semibold text-[#C4CCDA] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Simulate +1 view count in Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testViewAdded ? 'animate-spin text-emerald-400' : 'text-[#8B97AC]'}`} />
            <span>{testViewAdded ? 'View Added!' : 'Test +1 View'}</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Adjust Baseline'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Analytics metrics updated and synchronized to Cloud Firestore successfully.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Views / Reviews */}
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] relative overflow-hidden group hover:border-[#3B82F6]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8B97AC]">
            <span className="font-semibold uppercase font-mono tracking-wider">Total Views / Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-[#2F6FED]/10 text-[#3B82F6] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {engagementStats.views.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#8B97AC] leading-tight">
            Visible on the portfolio page and stored in Firestore database.
          </p>
        </div>

        {/* Metric 2: Estimated Unique Visitors */}
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8B97AC]">
            <span className="font-semibold uppercase font-mono tracking-wider">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {engagementStats.uniqueVisitors.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#8B97AC]">visitors</span>
          </div>
          <p className="mt-1 text-[11px] text-[#8B97AC] leading-tight">
            Unique client and recruiter sessions identified across devices.
          </p>
        </div>

        {/* Metric 3: Likes & Endorsements */}
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] relative overflow-hidden group hover:border-[#D9A94E]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8B97AC]">
            <span className="font-semibold uppercase font-mono tracking-wider">LinkedIn Likes</span>
            <div className="w-8 h-8 rounded-lg bg-[#D9A94E]/10 text-[#D9A94E] flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {engagementStats.likes.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#8B97AC]">endorsements</span>
          </div>
          <p className="mt-1 text-[11px] text-[#8B97AC] leading-tight">
            From the Like button on the portfolio LinkedIn engagement bar.
          </p>
        </div>

        {/* Metric 4: Reposts & Shares */}
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8B97AC]">
            <span className="font-semibold uppercase font-mono tracking-wider">Reposts & Shares</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Repeat2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {engagementStats.shares.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#8B97AC]">shares</span>
          </div>
          <p className="mt-1 text-[11px] text-[#8B97AC] leading-tight">
            Shared via LinkedIn feed, WhatsApp, X/Twitter, or copied links.
          </p>
        </div>

      </div>

      {/* Conversion & Funnel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B97AC]">
            <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
            <span>Consultation Lead Conversion</span>
          </div>
          <div className="text-2xl font-heading font-bold text-[#F2F5F9]">
            {conversionRate}%
          </div>
          <p className="text-[11px] text-[#8B97AC]">
            {inquiries.length} client inquiries generated from {engagementStats.views} portfolio reviews.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B97AC]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cloud Database Status</span>
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active & Synced</span>
          </div>
          <p className="text-[11px] text-[#8B97AC]">
            Collection: <code className="text-[#3B82F6] font-mono">analytics/main</code>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#1E2C48] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B97AC]">
            <Share2 className="w-4 h-4 text-[#D9A94E]" />
            <span>LinkedIn Post Integration</span>
          </div>
          <div className="text-sm font-semibold text-[#F2F5F9]">
            Interactive Bar Live
          </div>
          <p className="text-[11px] text-[#8B97AC]">
            Like, Comment, Repost, and Send buttons rendered beneath executive bio.
          </p>
        </div>
      </div>

      {/* Adjust Baseline Form (shown when admin clicks "Adjust Baseline") */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl bg-[#0D1424] border border-[#3B82F6]/50 shadow-xl space-y-5 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#3B82F6]" />
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#F2F5F9]">
              Calibrate Analytics Counters (Baseline Configuration)
            </h4>
          </div>
          <p className="text-xs text-[#8B97AC]">
            You can set a professional baseline starting value for your portfolio views and endorsements (for example, reflecting cumulative impressions across LinkedIn and previous domains). All new visits will increment from these values.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#8B97AC] uppercase font-semibold">
                Total Views / Reviews
              </label>
              <input
                type="number"
                min="0"
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-sm text-white font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#8B97AC] uppercase font-semibold">
                Unique Visitors
              </label>
              <input
                type="number"
                min="0"
                value={formData.uniqueVisitors}
                onChange={(e) => setFormData({ ...formData, uniqueVisitors: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-sm text-white font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#8B97AC] uppercase font-semibold">
                Total Likes
              </label>
              <input
                type="number"
                min="0"
                value={formData.likes}
                onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-sm text-white font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#8B97AC] uppercase font-semibold">
                Total Reposts / Shares
              </label>
              <input
                type="number"
                min="0"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] text-sm text-white font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-[#121B2E] text-xs font-semibold text-[#8B97AC] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Save Baseline to Cloud</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
