// src/utils/themeManager.ts
// Theme management system: presets, custom palette derivation, and instant live DOM application

export interface ThemePalette {
  id: string;
  name: string;
  swatches: [string, string, string]; // [Background, Primary Accent, Secondary Accent]
  bgPrimary: string;
  bgSecondary: string;
  cardSurface: string;
  cardHover: string;
  borderColor: string;
  borderHighlight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string; // strong blue / base primary
  accentPrimaryBright: string; // bright blue / hover
  accentSecondary: string; // gold / secondary
}

export interface CustomThemeConfig {
  bgPrimary: string;
  accentPrimary: string;
  accentSecondary: string;
}

export interface PortfolioThemeData {
  activeThemeId: string;
  customTheme?: CustomThemeConfig;
}

// Convert hex to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 10, g: 14, b: 26 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert rgb to hex
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Adjust lightness of hex
function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  return rgbToHex(r * factor, g * factor, b * factor);
}

// Mix two hex colors
function mixColors(hex1: string, hex2: string, weight: number = 0.5): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex(
    c1.r * (1 - w) + c2.r * w,
    c1.g * (1 - w) + c2.g * w,
    c1.b * (1 - w) + c2.b * w
  );
}

// Format rgba string
export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Derive a coherent palette from 3 base colors
export function deriveCustomPalette(
  bg: string,
  primary: string,
  secondary: string
): ThemePalette {
  const safeBg = bg.startsWith('#') ? bg : `#${bg}`;
  const safePrimary = primary.startsWith('#') ? primary : `#${primary}`;
  const safeSecondary = secondary.startsWith('#') ? secondary : `#${secondary}`;

  // Card surface is slightly elevated from bg
  const bgSecondary = mixColors(safeBg, '#FFFFFF', 0.035);
  const cardSurface = mixColors(safeBg, '#FFFFFF', 0.07);
  const cardHover = mixColors(safeBg, '#FFFFFF', 0.11);

  // Border color derived from background with slight primary hint
  const borderBase = mixColors(safeBg, '#FFFFFF', 0.16);
  const borderTinted = mixColors(borderBase, safePrimary, 0.15);
  const borderColor = hexToRgba(borderTinted, 0.65);
  const borderHighlight = hexToRgba(safePrimary, 0.45);

  // Bright primary variant for hover
  const accentPrimaryBright = mixColors(safePrimary, '#FFFFFF', 0.18);

  return {
    id: 'custom',
    name: 'Custom',
    swatches: [safeBg, safePrimary, safeSecondary],
    bgPrimary: safeBg,
    bgSecondary,
    cardSurface,
    cardHover,
    borderColor,
    borderHighlight,
    textPrimary: '#F2F5F9',
    textSecondary: '#C4CCDA',
    textMuted: '#8B97AC',
    accentPrimary: safePrimary,
    accentPrimaryBright,
    accentSecondary: safeSecondary,
  };
}

// The 8 Built-in Presets exactly matching the user's screenshot
export const PRESET_THEMES: ThemePalette[] = [
  {
    id: 'navy-gold',
    name: 'Navy & Gold',
    swatches: ['#0A0E1A', '#2F6FED', '#D9A94E'],
    bgPrimary: '#0A0E1A',
    bgSecondary: '#0D1424',
    cardSurface: '#121B2E',
    cardHover: '#18243C',
    borderColor: 'rgba(30, 44, 72, 0.6)',
    borderHighlight: 'rgba(59, 130, 246, 0.4)',
    textPrimary: '#F2F5F9',
    textSecondary: '#C4CCDA',
    textMuted: '#8B97AC',
    accentPrimary: '#2F6FED',
    accentPrimaryBright: '#3B82F6',
    accentSecondary: '#D9A94E',
  },
  {
    id: 'charcoal-blue',
    name: 'Charcoal & Electric Blue',
    swatches: ['#121214', '#0070F3', '#94A3B8'],
    bgPrimary: '#121214',
    bgSecondary: '#18181C',
    cardSurface: '#1F2026',
    cardHover: '#282932',
    borderColor: 'rgba(55, 65, 81, 0.6)',
    borderHighlight: 'rgba(0, 112, 243, 0.45)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    accentPrimary: '#0070F3',
    accentPrimaryBright: '#38BDF8',
    accentSecondary: '#94A3B8',
  },
  {
    id: 'slate-teal',
    name: 'Slate & Teal',
    swatches: ['#0F172A', '#14B8A6', '#F59E0B'],
    bgPrimary: '#0F172A',
    bgSecondary: '#131E35',
    cardSurface: '#1A2744',
    cardHover: '#223356',
    borderColor: 'rgba(30, 58, 88, 0.65)',
    borderHighlight: 'rgba(20, 184, 166, 0.45)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    accentPrimary: '#0D9488',
    accentPrimaryBright: '#14B8A6',
    accentSecondary: '#F59E0B',
  },
  {
    id: 'midnight-graphite',
    name: 'Midnight Graphite',
    swatches: ['#141416', '#6366F1', '#D4AF37'],
    bgPrimary: '#141416',
    bgSecondary: '#1B1B1F',
    cardSurface: '#24242A',
    cardHover: '#2E2E36',
    borderColor: 'rgba(63, 63, 70, 0.6)',
    borderHighlight: 'rgba(99, 102, 241, 0.45)',
    textPrimary: '#F4F4F5',
    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',
    accentPrimary: '#6366F1',
    accentPrimaryBright: '#818CF8',
    accentSecondary: '#D4AF37',
  },
  {
    id: 'emerald-ivory',
    name: 'Emerald & Ivory',
    swatches: ['#061A14', '#10B981', '#FDE68A'],
    bgPrimary: '#061A14',
    bgSecondary: '#0B241C',
    cardSurface: '#103026',
    cardHover: '#163E32',
    borderColor: 'rgba(20, 70, 55, 0.65)',
    borderHighlight: 'rgba(16, 185, 129, 0.45)',
    textPrimary: '#F0FDF4',
    textSecondary: '#BBF7D0',
    textMuted: '#86EFAC',
    accentPrimary: '#059669',
    accentPrimaryBright: '#10B981',
    accentSecondary: '#FDE68A',
  },
  {
    id: 'crimson-steel',
    name: 'Crimson & Steel',
    swatches: ['#1A0B0E', '#94A3B8', '#F43F5E'],
    bgPrimary: '#1A0B0E',
    bgSecondary: '#241014',
    cardSurface: '#2F161C',
    cardHover: '#3D1C24',
    borderColor: 'rgba(75, 35, 45, 0.65)',
    borderHighlight: 'rgba(244, 63, 94, 0.45)',
    textPrimary: '#FFF1F2',
    textSecondary: '#FECDD3',
    textMuted: '#94A3B8',
    accentPrimary: '#94A3B8',
    accentPrimaryBright: '#CBD5E1',
    accentSecondary: '#F43F5E',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple & Silver',
    swatches: ['#130B1E', '#A855F7', '#E9D5FF'],
    bgPrimary: '#130B1E',
    bgSecondary: '#1C102C',
    cardSurface: '#26163B',
    cardHover: '#311C4C',
    borderColor: 'rgba(65, 38, 98, 0.65)',
    borderHighlight: 'rgba(168, 85, 247, 0.45)',
    textPrimary: '#FAF5FF',
    textSecondary: '#E9D5FF',
    textMuted: '#C084FC',
    accentPrimary: '#9333EA',
    accentPrimaryBright: '#A855F7',
    accentSecondary: '#E9D5FF',
  },
  {
    id: 'copper-graphite',
    name: 'Copper & Graphite',
    swatches: ['#171513', '#84A98C', '#E07A5F'],
    bgPrimary: '#171513',
    bgSecondary: '#211E1B',
    cardSurface: '#2C2723',
    cardHover: '#38322D',
    borderColor: 'rgba(70, 60, 50, 0.65)',
    borderHighlight: 'rgba(224, 122, 95, 0.45)',
    textPrimary: '#FDFBF7',
    textSecondary: '#E6DFD5',
    textMuted: '#B3A89B',
    accentPrimary: '#6E8B7A',
    accentPrimaryBright: '#84A98C',
    accentSecondary: '#E07A5F',
  },
];

// Resolves theme data into a full ThemePalette
export function resolveThemePalette(
  themeData?: PortfolioThemeData
): ThemePalette {
  const activeId = themeData?.activeThemeId || 'navy-gold';

  if (activeId === 'custom') {
    const customConfig = themeData?.customTheme || {
      bgPrimary: '#0A0E1A',
      accentPrimary: '#2F6FED',
      accentSecondary: '#D9A94E',
    };
    return deriveCustomPalette(
      customConfig.bgPrimary,
      customConfig.accentPrimary,
      customConfig.accentSecondary
    );
  }

  const found = PRESET_THEMES.find((t) => t.id === activeId);
  return found || PRESET_THEMES[0];
}

// Generate runtime CSS overrides to inject into the head
export function generateThemeCSS(palette: ThemePalette): string {
  return `
/* Portfolio Dynamic Color Theme Overrides: ${palette.name} */
:root {
  --bg-primary: ${palette.bgPrimary};
  --bg-secondary: ${palette.bgSecondary};
  --card-surface: ${palette.cardSurface};
  --card-hover: ${palette.cardHover};
  --border-color: ${palette.borderColor};
  --border-highlight: ${palette.borderHighlight};
  --accent-blue: ${palette.accentPrimaryBright};
  --strong-blue: ${palette.accentPrimary};
  --accent-gold: ${palette.accentSecondary};
}

/* Background overrides */
body,
.bg-\\[\\#0A0E1A\\],
.bg-\\[\\#0a0e1a\\] {
  background-color: ${palette.bgPrimary} !important;
}

.bg-\\[\\#0D1424\\],
.bg-\\[\\#0d1424\\] {
  background-color: ${palette.bgSecondary} !important;
}

.bg-\\[\\#121B2E\\],
.bg-\\[\\#121b2e\\] {
  background-color: ${palette.cardSurface} !important;
}

.bg-\\[\\#18243C\\],
.bg-\\[\\#18243c\\],
.hover\\:bg-\\[\\#18243C\\]:hover,
.hover\\:bg-\\[\\#18243c\\]:hover {
  background-color: ${palette.cardHover} !important;
}

/* Border overrides */
.border-\\[\\#1E2C48\\],
.border-\\[\\#1e2c48\\],
.hover\\:border-\\[\\#1E2C48\\]:hover {
  border-color: ${palette.borderColor} !important;
}
.border-\\[\\#1E2C48\\]\\/80 {
  border-color: ${hexToRgba(palette.borderColor, 0.8)} !important;
}
.border-\\[\\#1E2C48\\]\\/60 {
  border-color: ${hexToRgba(palette.borderColor, 0.6)} !important;
}
.border-\\[\\#1E2C48\\]\\/50 {
  border-color: ${hexToRgba(palette.borderColor, 0.5)} !important;
}
.border-\\[\\#1E2C48\\]\\/40 {
  border-color: ${hexToRgba(palette.borderColor, 0.4)} !important;
}

/* Primary Accent */
.bg-\\[\\#2F6FED\\],
.bg-\\[\\#2f6fed\\],
.hover\\:bg-\\[\\#2F6FED\\]:hover,
.hover\\:bg-\\[\\#2f6fed\\]:hover {
  background-color: ${palette.accentPrimary} !important;
}

.bg-\\[\\#3B82F6\\],
.bg-\\[\\#3b82f6\\],
.hover\\:bg-\\[\\#3B82F6\\]:hover,
.hover\\:bg-\\[\\#3b82f6\\]:hover {
  background-color: ${palette.accentPrimaryBright} !important;
}

.text-\\[\\#3B82F6\\],
.text-\\[\\#3b82f6\\],
.hover\\:text-\\[\\#3B82F6\\]:hover,
.hover\\:text-\\[\\#3b82f6\\]:hover {
  color: ${palette.accentPrimaryBright} !important;
}

.border-\\[\\#3B82F6\\],
.border-\\[\\#3b82f6\\],
.hover\\:border-\\[\\#3B82F6\\]:hover,
.hover\\:border-\\[\\#3b82f6\\]:hover {
  border-color: ${palette.accentPrimaryBright} !important;
}

.border-\\[\\#2F6FED\\],
.border-\\[\\#2f6fed\\] {
  border-color: ${palette.accentPrimary} !important;
}

/* Primary Accent Opacities */
.bg-\\[\\#2F6FED\\]\\/20, .bg-\\[\\#2f6fed\\]\\/20 {
  background-color: ${hexToRgba(palette.accentPrimary, 0.2)} !important;
}
.bg-\\[\\#2F6FED\\]\\/15, .bg-\\[\\#2f6fed\\]\\/15 {
  background-color: ${hexToRgba(palette.accentPrimary, 0.15)} !important;
}
.bg-\\[\\#2F6FED\\]\\/10, .bg-\\[\\#2f6fed\\]\\/10 {
  background-color: ${hexToRgba(palette.accentPrimary, 0.1)} !important;
}
.bg-\\[\\#3B82F6\\]\\/20, .bg-\\[\\#3b82f6\\]\\/20 {
  background-color: ${hexToRgba(palette.accentPrimaryBright, 0.2)} !important;
}
.bg-\\[\\#3B82F6\\]\\/10, .bg-\\[\\#3b82f6\\]\\/10 {
  background-color: ${hexToRgba(palette.accentPrimaryBright, 0.1)} !important;
}
.border-\\[\\#3B82F6\\]\\/60, .border-\\[\\#3b82f6\\]\\/60 {
  border-color: ${hexToRgba(palette.accentPrimaryBright, 0.6)} !important;
}
.border-\\[\\#3B82F6\\]\\/50, .border-\\[\\#3b82f6\\]\\/50,
.hover\\:border-\\[\\#3B82F6\\]\\/50:hover {
  border-color: ${hexToRgba(palette.accentPrimaryBright, 0.5)} !important;
}
.border-\\[\\#3B82F6\\]\\/40, .border-\\[\\#3b82f6\\]\\/40 {
  border-color: ${hexToRgba(palette.accentPrimaryBright, 0.4)} !important;
}
.border-\\[\\#3B82F6\\]\\/30, .border-\\[\\#3b82f6\\]\\/30 {
  border-color: ${hexToRgba(palette.accentPrimaryBright, 0.3)} !important;
}
.border-\\[\\#3B82F6\\]\\/20, .border-\\[\\#3b82f6\\]\\/20 {
  border-color: ${hexToRgba(palette.accentPrimaryBright, 0.2)} !important;
}
.border-\\[\\#2F6FED\\]\\/40, .border-\\[\\#2f6fed\\]\\/40 {
  border-color: ${hexToRgba(palette.accentPrimary, 0.4)} !important;
}
.border-\\[\\#2F6FED\\]\\/30, .border-\\[\\#2f6fed\\]\\/30 {
  border-color: ${hexToRgba(palette.accentPrimary, 0.3)} !important;
}
.border-\\[\\#2F6FED\\]\\/20, .border-\\[\\#2f6fed\\]\\/20 {
  border-color: ${hexToRgba(palette.accentPrimary, 0.2)} !important;
}

/* Secondary Accent (Gold / Amber / Highlight) */
.text-\\[\\#D9A94E\\],
.text-\\[\\#d9a94e\\],
.hover\\:text-\\[\\#D9A94E\\]:hover,
.hover\\:text-\\[\\#d9a94e\\]:hover {
  color: ${palette.accentSecondary} !important;
}

.bg-\\[\\#D9A94E\\],
.bg-\\[\\#d9a94e\\],
.hover\\:bg-\\[\\#D9A94E\\]:hover,
.hover\\:bg-\\[\\#d9a94e\\]:hover {
  background-color: ${palette.accentSecondary} !important;
}

.border-\\[\\#D9A94E\\],
.border-\\[\\#d9a94e\\],
.hover\\:border-\\[\\#D9A94E\\]:hover,
.hover\\:border-\\[\\#d9a94e\\]:hover {
  border-color: ${palette.accentSecondary} !important;
}

.border-\\[\\#D9A94E\\]\\/50, .border-\\[\\#d9a94e\\]\\/50 {
  border-color: ${hexToRgba(palette.accentSecondary, 0.5)} !important;
}
.border-\\[\\#D9A94E\\]\\/40, .border-\\[\\#d9a94e\\]\\/40 {
  border-color: ${hexToRgba(palette.accentSecondary, 0.4)} !important;
}
.border-\\[\\#D9A94E\\]\\/30, .border-\\[\\#d9a94e\\]\\/30 {
  border-color: ${hexToRgba(palette.accentSecondary, 0.3)} !important;
}
.border-\\[\\#D9A94E\\]\\/20, .border-\\[\\#d9a94e\\]\\/20 {
  border-color: ${hexToRgba(palette.accentSecondary, 0.2)} !important;
}
.bg-\\[\\#D9A94E\\]\\/20, .bg-\\[\\#d9a94e\\]\\/20 {
  background-color: ${hexToRgba(palette.accentSecondary, 0.2)} !important;
}
.bg-\\[\\#D9A94E\\]\\/15, .bg-\\[\\#d9a94e\\]\\/15 {
  background-color: ${hexToRgba(palette.accentSecondary, 0.15)} !important;
}

/* Ambient Radial Overlays */
.bg-radial-ambient {
  background: radial-gradient(circle 800px at 50% -100px, ${hexToRgba(palette.accentPrimary, 0.14)}, transparent) !important;
}

.bg-radial-accent {
  background: radial-gradient(circle 600px at 80% 200px, ${hexToRgba(palette.accentSecondary, 0.08)}, transparent) !important;
}

::-webkit-scrollbar-track {
  background: ${palette.bgPrimary} !important;
}

::-webkit-scrollbar-thumb {
  background: ${palette.cardHover} !important;
}

::-webkit-scrollbar-thumb:hover {
  background: ${palette.accentPrimary} !important;
}

::selection {
  background-color: ${hexToRgba(palette.accentPrimary, 0.4)} !important;
  color: #FFFFFF !important;
}
`;
}

// Applies theme styles directly to the live browser document
export function applyThemeToDocument(palette: ThemePalette) {
  if (typeof document === 'undefined') return;

  const styleId = 'portfolio-theme-overrides';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = generateThemeCSS(palette);

  // Also set CSS variables on document root
  const root = document.documentElement;
  root.style.setProperty('--bg-primary', palette.bgPrimary);
  root.style.setProperty('--bg-secondary', palette.bgSecondary);
  root.style.setProperty('--card-surface', palette.cardSurface);
  root.style.setProperty('--card-hover', palette.cardHover);
  root.style.setProperty('--border-color', palette.borderColor);
  root.style.setProperty('--border-highlight', palette.borderHighlight);
  root.style.setProperty('--accent-blue', palette.accentPrimaryBright);
  root.style.setProperty('--strong-blue', palette.accentPrimary);
  root.style.setProperty('--accent-gold', palette.accentSecondary);
}
