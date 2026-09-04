import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Sparkles, RefreshCw, Palette } from 'lucide-react';
import {
  PRESET_THEMES,
  PortfolioThemeData,
  CustomThemeConfig,
  deriveCustomPalette,
  resolveThemePalette,
  applyThemeToDocument,
} from '../../utils/themeManager';
import { usePortfolio } from '../../context/PortfolioContext';

interface ThemeManagerTabProps {
  draftTheme?: PortfolioThemeData;
  onThemeChange: (newTheme: PortfolioThemeData) => void;
}

export const ThemeManagerTab: React.FC<ThemeManagerTabProps> = ({
  draftTheme,
  onThemeChange,
}) => {
  const { data, updateTheme } = usePortfolio();

  const activeThemeId = draftTheme?.activeThemeId || data.theme?.activeThemeId || 'navy-gold';
  const savedCustom = draftTheme?.customTheme || data.theme?.customTheme || {
    bgPrimary: '#0A0E1A',
    accentPrimary: '#2F6FED',
    accentSecondary: '#D9A94E',
  };

  const [customBg, setCustomBg] = useState(savedCustom.bgPrimary || '#0A0E1A');
  const [customPrimary, setCustomPrimary] = useState(savedCustom.accentPrimary || '#2F6FED');
  const [customSecondary, setCustomSecondary] = useState(savedCustom.accentSecondary || '#D9A94E');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Sync state if draftTheme changes externally
  useEffect(() => {
    if (draftTheme?.customTheme) {
      setCustomBg(draftTheme.customTheme.bgPrimary);
      setCustomPrimary(draftTheme.customTheme.accentPrimary);
      setCustomSecondary(draftTheme.customTheme.accentSecondary);
    }
  }, [draftTheme?.customTheme]);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleSelectPreset = async (presetId: string) => {
    const newThemeConfig: PortfolioThemeData = {
      activeThemeId: presetId,
      customTheme: {
        bgPrimary: customBg,
        accentPrimary: customPrimary,
        accentSecondary: customSecondary,
      },
    };

    // 1. Immediately apply to live DOM for zero-latency response
    applyThemeToDocument(resolveThemePalette(newThemeConfig));

    // 2. Update draft state in Admin Modal
    onThemeChange(newThemeConfig);

    // 3. Persist immediately to Firestore & Local Storage
    try {
      await updateTheme(newThemeConfig);
      const preset = PRESET_THEMES.find((p) => p.id === presetId);
      showNotice(`✓ "${preset?.name || presetId}" theme applied live across the entire site!`);
    } catch (err) {
      console.error('Error saving theme preset:', err);
    }
  };

  const handleApplyCustomTheme = async () => {
    // Sanitize hex values
    const formatHex = (val: string, fallback: string) => {
      let clean = val.trim();
      if (!clean.startsWith('#')) clean = `#${clean}`;
      return /^#[0-9A-Fa-f]{6}$/.test(clean) ? clean : fallback;
    };

    const cleanBg = formatHex(customBg, '#0A0E1A');
    const cleanPrimary = formatHex(customPrimary, '#2F6FED');
    const cleanSecondary = formatHex(customSecondary, '#D9A94E');

    setCustomBg(cleanBg);
    setCustomPrimary(cleanPrimary);
    setCustomSecondary(cleanSecondary);

    const newThemeConfig: PortfolioThemeData = {
      activeThemeId: 'custom',
      customTheme: {
        bgPrimary: cleanBg,
        accentPrimary: cleanPrimary,
        accentSecondary: cleanSecondary,
      },
    };

    // 1. Apply to live DOM
    applyThemeToDocument(resolveThemePalette(newThemeConfig));

    // 2. Update modal draft
    onThemeChange(newThemeConfig);

    // 3. Persist live
    try {
      await updateTheme(newThemeConfig);
      showNotice('✓ Custom theme derived and applied live across the entire site!');
    } catch (err) {
      console.error('Error saving custom theme:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2C48]">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
            Color Theme
          </h3>
          <p className="text-xs text-[#8B97AC]">
            Choose a theme — it applies instantly across every page of the live site.
          </p>
        </div>

        {feedbackNotice && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}
      </div>

      {/* Grid of Preset Themes + Custom Swatch Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRESET_THEMES.map((preset) => {
          const isActive = activeThemeId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`text-left p-4 rounded-2xl transition-all relative border flex flex-col justify-between h-[100px] group ${
                isActive
                  ? 'bg-[#121B2E] border-[#D9A94E] ring-1 ring-[#D9A94E]/40 shadow-lg'
                  : 'bg-[#121B2E] border-[#1E2C48] hover:border-[#3B82F6]/50 hover:bg-[#18243C]'
              }`}
            >
              {/* Top Row: Swatches + Active indicator */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {preset.swatches.map((swatchColor, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg border border-white/10 shadow-sm shrink-0"
                      style={{ backgroundColor: swatchColor }}
                      title={`Color ${idx + 1}: ${swatchColor}`}
                    />
                  ))}
                </div>

                {isActive && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D9A94E]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              {/* Bottom Row: Theme Name */}
              <div className="mt-2">
                <span className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-[#F2F5F9] font-semibold' : 'text-[#C4CCDA] group-hover:text-[#F2F5F9]'
                }`}>
                  {preset.name}
                </span>
              </div>
            </button>
          );
        })}

        {/* 9th Swatch Card: Custom Theme Card */}
        {(() => {
          const isActive = activeThemeId === 'custom';
          return (
            <button
              type="button"
              onClick={handleApplyCustomTheme}
              className={`text-left p-4 rounded-2xl transition-all relative border flex flex-col justify-between h-[100px] group ${
                isActive
                  ? 'bg-[#121B2E] border-[#D9A94E] ring-1 ring-[#D9A94E]/40 shadow-lg'
                  : 'bg-[#121B2E] border-[#1E2C48] hover:border-[#3B82F6]/50 hover:bg-[#18243C]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-sm shrink-0"
                    style={{ backgroundColor: customBg }}
                    title={`Background: ${customBg}`}
                  />
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-sm shrink-0"
                    style={{ backgroundColor: customPrimary }}
                    title={`Primary Accent: ${customPrimary}`}
                  />
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-sm shrink-0"
                    style={{ backgroundColor: customSecondary }}
                    title={`Secondary Accent: ${customSecondary}`}
                  />
                </div>

                {isActive && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D9A94E]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              <div className="mt-2">
                <span className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-[#F2F5F9] font-semibold' : 'text-[#C4CCDA] group-hover:text-[#F2F5F9]'
                }`}>
                  Custom
                </span>
              </div>
            </button>
          );
        })()}
      </div>

      {/* SECTION: Build a Custom Theme */}
      <div className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-5">
        <div>
          <h4 className="text-sm font-bold text-[#F2F5F9]">
            Build a Custom Theme
          </h4>
          <p className="text-xs text-[#8B97AC] mt-1 leading-relaxed">
            Pick a background color plus two accent colors and the rest of the palette (borders, muted text, glows) is derived automatically so it still looks coherent. Saves as the "Custom" swatch above.
          </p>
        </div>

        {/* 3 Color Pickers Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
          {/* Picker 1: Background */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48]">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-inner group cursor-pointer">
              <div
                className="w-full h-full"
                style={{ backgroundColor: customBg }}
              />
              <input
                type="color"
                value={customBg.startsWith('#') ? customBg : `#${customBg}`}
                onChange={(e) => setCustomBg(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Click to choose background color"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-medium text-[#8B97AC] mb-1">
                Background
              </label>
              <input
                type="text"
                value={customBg}
                onChange={(e) => setCustomBg(e.target.value)}
                placeholder="#0A0E1A"
                maxLength={7}
                className="w-full px-2 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] uppercase focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Picker 2: Primary Accent */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48]">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-inner group cursor-pointer">
              <div
                className="w-full h-full"
                style={{ backgroundColor: customPrimary }}
              />
              <input
                type="color"
                value={customPrimary.startsWith('#') ? customPrimary : `#${customPrimary}`}
                onChange={(e) => setCustomPrimary(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Click to choose primary accent color"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-medium text-[#8B97AC] mb-1">
                Primary Accent
              </label>
              <input
                type="text"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                placeholder="#2F6FED"
                maxLength={7}
                className="w-full px-2 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] uppercase focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Picker 3: Secondary Accent */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48]">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-inner group cursor-pointer">
              <div
                className="w-full h-full"
                style={{ backgroundColor: customSecondary }}
              />
              <input
                type="color"
                value={customSecondary.startsWith('#') ? customSecondary : `#${customSecondary}`}
                onChange={(e) => setCustomSecondary(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Click to choose secondary accent color"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-medium text-[#8B97AC] mb-1">
                Secondary Accent
              </label>
              <input
                type="text"
                value={customSecondary}
                onChange={(e) => setCustomSecondary(e.target.value)}
                placeholder="#D9A94E"
                maxLength={7}
                className="w-full px-2 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] uppercase focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleApplyCustomTheme}
            className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Palette className="w-4 h-4" />
            <span>Apply Custom Theme</span>
          </button>
        </div>
      </div>
    </div>
  );
};
