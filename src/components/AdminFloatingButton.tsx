import React, { useState } from 'react';
import { Lock, Sparkles, CheckCircle2, ChevronRight, Cloud } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminFloatingButton: React.FC = () => {
  const { openAdminModal, isAdminAuthenticated, syncStatus } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id="floating-admin-controls"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 font-sans select-none print:hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Quick Status Tooltip / Label on Hover */}
      {isHovered && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1424]/95 border border-[#1E2C48] shadow-2xl backdrop-blur-md text-xs text-[#F2F5F9] animate-fadeIn">
          <div className="flex items-center gap-1.5 font-semibold text-[#D9A94E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultant Admin</span>
          </div>
          <span className="text-[#8B97AC]">|</span>
          <span className="text-[11px] text-[#C4CCDA]">
            {isAdminAuthenticated ? 'Logged In • Live Cloud Sync' : 'Click to Authenticate & Edit Live'}
          </span>
        </div>
      )}

      {/* Main Visible Admin Trigger Button */}
      <button
        id="floating-admin-trigger-btn"
        onClick={openAdminModal}
        aria-label="Open Admin Management Panel"
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
          isAdminAuthenticated
            ? 'bg-gradient-to-r from-[#121B2E] to-[#1E2C48] border-2 border-emerald-500/50 text-[#F2F5F9] shadow-emerald-950/40'
            : 'bg-gradient-to-r from-[#121B2E] to-[#0D1424] border-2 border-[#D9A94E]/60 hover:border-[#D9A94E] text-[#F2F5F9] shadow-black/80'
        }`}
      >
        {/* Glowing badge indicator */}
        <div className="relative flex items-center justify-center">
          {isAdminAuthenticated ? (
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-[#D9A94E]/15 border border-[#D9A94E]/40 flex items-center justify-center text-[#D9A94E]">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold font-heading tracking-wide text-[#F2F5F9] group-hover:text-[#D9A94E] transition-colors">
              Admin Panel
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8B97AC] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-[10px] font-mono text-[#8B97AC] flex items-center gap-1">
            {isAdminAuthenticated ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>Live Cloud</span>
              </>
            ) : (
              'Edit Live'
            )}
          </span>
        </div>
      </button>
    </div>
  );
};
