import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Eye,
  Share2,
  Check,
  Copy,
  ExternalLink,
  X,
  Users,
  Sparkles,
  Linkedin,
  Twitter,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface LinkedInEngagementBarProps {
  onNavigate?: (sectionId: string) => void;
  variant?: 'card' | 'inline' | 'floating';
}

export const LinkedInEngagementBar: React.FC<LinkedInEngagementBarProps> = ({
  onNavigate,
  variant = 'card',
}) => {
  const {
    data,
    engagementStats,
    hasUserLiked,
    toggleLike,
    incrementShareCount,
  } = usePortfolio();

  const { consultant } = data;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const getPortfolioUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href.split('#')[0];
    }
    return 'https://ais-pre-ylrub3kx5ujcy6p7cv2ugs-379623041152.asia-southeast1.run.app';
  };

  const handleLikeClick = async () => {
    setIsLikeAnimating(true);
    await toggleLike();
    setTimeout(() => setIsLikeAnimating(false), 500);
  };

  const handleCommentClick = () => {
    if (onNavigate) {
      onNavigate('contact');
    } else {
      const contactEl = document.getElementById('contact-section') || document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Focus the message input if possible
    setTimeout(() => {
      const input = document.getElementById('contact-form-message') as HTMLTextAreaElement | null;
      if (input) {
        input.focus();
      }
    }, 400);
  };

  const showToast = (message: string) => {
    setCopiedToast(message);
    setTimeout(() => setCopiedToast(null), 3500);
  };

  const handleCopyLink = async () => {
    const url = getPortfolioUrl();
    try {
      await navigator.clipboard.writeText(url);
      showToast('Portfolio link copied to clipboard!');
      await incrementShareCount();
    } catch {
      showToast('Portfolio URL: ' + url);
    }
  };

  const handleShareToLinkedIn = () => {
    const url = encodeURIComponent(getPortfolioUrl());
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    incrementShareCount();
    setIsShareModalOpen(false);
    showToast('LinkedIn share window opened');
  };

  const handleShareToTwitter = () => {
    const url = encodeURIComponent(getPortfolioUrl());
    const text = encodeURIComponent(
      `Check out the executive portfolio of ${consultant.name} - ${consultant.title}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    incrementShareCount();
    setIsShareModalOpen(false);
    showToast('X/Twitter share window opened');
  };

  const handleShareToWhatsApp = () => {
    const url = encodeURIComponent(getPortfolioUrl());
    const text = encodeURIComponent(
      `Take a look at ${consultant.name}'s SAP Executive Consulting Portfolio: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
    incrementShareCount();
    setIsShareModalOpen(false);
    showToast('WhatsApp share opened');
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`Executive SAP Portfolio: ${consultant.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI recommend reviewing the professional portfolio of ${consultant.name} (${consultant.title}):\n${getPortfolioUrl()}\n\nBest regards.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    incrementShareCount();
    setIsShareModalOpen(false);
  };

  return (
    <>
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0D1424] border border-emerald-500/50 shadow-2xl text-xs font-semibold text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{copiedToast}</span>
          </div>
        </div>
      )}

      {/* Engagement Card Container */}
      <div
        id="linkedin-engagement-bar"
        className="w-full rounded-2xl bg-[#0D1424] border border-[#1E2C48] shadow-xl overflow-hidden transition-all duration-300 hover:border-[#2F6FED]/40"
      >
        {/* Top Header: Live Reactions, Views & Share Metrics */}
        <div className="px-4 sm:px-6 pt-3.5 pb-2.5 flex items-center justify-between gap-3 text-xs text-[#8B97AC]">
          {/* Left: Like reaction counter badge */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1 items-center">
              <span className="w-5 h-5 rounded-full bg-[#2F6FED] flex items-center justify-center text-white text-[10px] ring-2 ring-[#0D1424]">
                👍
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] ring-2 ring-[#0D1424]">
                👏
              </span>
            </div>
            <span className="font-medium text-[#C4CCDA] text-[11px] sm:text-xs">
              <strong className="text-white font-semibold">{engagementStats.likes.toLocaleString()}</strong> endorsements
            </span>
          </div>

          {/* Right: Live Page View & Repost Counter */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            {/* Live View Count Counter requested by user */}
            <div
              id="portfolio-live-view-count"
              title={`${engagementStats.uniqueVisitors.toLocaleString()} estimated unique visitors`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121B2E] border border-[#1E2C48] text-[#3B82F6] font-mono font-medium"
            >
              <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="font-bold text-[#F2F5F9]">{engagementStats.views.toLocaleString()}</span>
              <span className="hidden sm:inline text-[#8B97AC] text-[10px]">reviews/views</span>
            </div>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-[#8B97AC] hover:text-[#F2F5F9] transition-colors"
            >
              <span>{engagementStats.shares} reposts</span>
            </button>
          </div>
        </div>

        {/* Clean Hairline Divider (Matching LinkedIn screenshot) */}
        <div className="border-t border-[#1E2C48]/80 mx-3 sm:mx-4" />

        {/* The 3 Action Buttons: Like | Comment | Repost */}
        <div className="px-2 sm:px-4 py-1.5 grid grid-cols-3 gap-1">
          
          {/* 1. LIKE BUTTON */}
          <button
            id="linkedin-like-btn"
            onClick={handleLikeClick}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              hasUserLiked
                ? 'text-[#3B82F6] bg-[#3B82F6]/10 font-bold'
                : 'text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#121B2E]'
            }`}
            title={hasUserLiked ? 'Click to unlike' : 'Endorse / Like this portfolio'}
          >
            <ThumbsUp
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 ${
                hasUserLiked ? 'fill-current scale-110' : ''
              } ${isLikeAnimating ? 'scale-125 -rotate-12' : ''}`}
            />
            <span className="tracking-wide">Like</span>
          </button>

          {/* 2. COMMENT BUTTON */}
          <button
            id="linkedin-comment-btn"
            onClick={handleCommentClick}
            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#121B2E] transition-all duration-200 cursor-pointer"
            title="Leave a project consultation comment or inquiry"
          >
            <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="tracking-wide">Comment</span>
          </button>

          {/* 3. REPOST BUTTON */}
          <button
            id="linkedin-repost-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#121B2E] transition-all duration-200 cursor-pointer"
            title="Repost or share to professional networks"
          >
            <Repeat2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="tracking-wide">Repost</span>
          </button>

        </div>
      </div>

      {/* Share / Repost Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1424] border border-[#1E2C48] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2F6FED]/10 border border-[#2F6FED]/20 flex items-center justify-center text-[#3B82F6]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#F2F5F9]">
                    Repost & Share Portfolio
                  </h3>
                  <p className="text-[11px] text-[#8B97AC]">
                    Share {consultant.name}'s executive credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg text-[#8B97AC] hover:text-white hover:bg-[#121B2E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Share Targets */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleShareToLinkedIn}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#0A66C2] text-xs font-semibold text-[#F2F5F9] hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div>LinkedIn Feed</div>
                  <div className="text-[10px] text-[#8B97AC] group-hover:text-[#0A66C2]">Share as post</div>
                </div>
              </button>

              <button
                onClick={handleShareToWhatsApp}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] hover:border-emerald-500 text-xs font-semibold text-[#F2F5F9] hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div>WhatsApp</div>
                  <div className="text-[10px] text-[#8B97AC] group-hover:text-emerald-400">Direct message</div>
                </div>
              </button>

              <button
                onClick={handleShareToTwitter}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#1DA1F2] text-xs font-semibold text-[#F2F5F9] hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1DA1F2]/15 text-[#1DA1F2] flex items-center justify-center shrink-0">
                  <Twitter className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div>X / Twitter</div>
                  <div className="text-[10px] text-[#8B97AC] group-hover:text-[#1DA1F2]">Post to feed</div>
                </div>
              </button>

              <button
                onClick={handleShareViaEmail}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#D9A94E] text-xs font-semibold text-[#F2F5F9] hover:text-white transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D9A94E]/15 text-[#D9A94E] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <div>Email Colleague</div>
                  <div className="text-[10px] text-[#8B97AC] group-hover:text-[#D9A94E]">Send via mail</div>
                </div>
              </button>
            </div>

            {/* Direct Copy Link Input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-mono text-[#8B97AC] uppercase font-semibold">
                Portfolio Direct Link
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0A0E1A] border border-[#1E2C48]">
                <input
                  type="text"
                  readOnly
                  value={getPortfolioUrl()}
                  className="bg-transparent text-xs text-[#C4CCDA] font-mono flex-1 outline-none px-1"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 text-right">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#121B2E] hover:bg-[#1A263F] text-xs font-semibold text-[#C4CCDA] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
