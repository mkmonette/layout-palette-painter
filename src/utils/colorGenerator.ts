export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

// Light mode color palettes
const lightColorPalettes: ColorPalette[] = [
  // Modern Blue
  {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280'
  },
  // Purple Gradient
  {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#F97316',
    background: '#FEFEFE',
    text: '#374151',
    textLight: '#9CA3AF'
  },
  // Green Nature
  {
    primary: '#059669',
    secondary: '#0D9488',
    accent: '#FBBF24',
    background: '#F9FAFB',
    text: '#111827',
    textLight: '#6B7280'
  },
  // Warm Sunset
  {
    primary: '#DC2626',
    secondary: '#EA580C',
    accent: '#FBBF24',
    background: '#FFFBEB',
    text: '#92400E',
    textLight: '#A16207'
  },
  // Ocean Breeze
  {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#10B981',
    background: '#F0F9FF',
    text: '#0C4A6E',
    textLight: '#0369A1'
  },
  // Monochrome
  {
    primary: '#374151',
    secondary: '#6B7280',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#111827',
    textLight: '#9CA3AF'
  },
  // Vibrant Pink
  {
    primary: '#EC4899',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    background: '#FDF2F8',
    text: '#831843',
    textLight: '#BE185D'
  }
];

// Dark mode color palettes
const darkColorPalettes: ColorPalette[] = [
  // Dark Blue
  {
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    background: '#111827',
    text: '#F9FAFB',
    textLight: '#D1D5DB'
  },
  // Dark Purple
  {
    primary: '#A78BFA',
    secondary: '#F472B6',
    accent: '#FB923C',
    background: '#0F0F23',
    text: '#F8FAFC',
    textLight: '#CBD5E1'
  },
  // Dark Green
  {
    primary: '#6EE7B7',
    secondary: '#5EEAD4',
    accent: '#FCD34D',
    background: '#064E3B',
    text: '#ECFDF5',
    textLight: '#A7F3D0'
  },
  // Dark Sunset
  {
    primary: '#FCA5A5',
    secondary: '#FDBA74',
    accent: '#FDE047',
    background: '#451A03',
    text: '#FEF3C7',
    textLight: '#FED7AA'
  },
  // Dark Ocean
  {
    primary: '#7DD3FC',
    secondary: '#67E8F9',
    accent: '#6EE7B7',
    background: '#0C4A6E',
    text: '#F0F9FF',
    textLight: '#BAE6FD'
  },
  // Dark Monochrome
  {
    primary: '#E5E7EB',
    secondary: '#9CA3AF',
    accent: '#FBBF24',
    background: '#1F2937',
    text: '#F9FAFB',
    textLight: '#D1D5DB'
  },
  // Dark Pink
  {
    primary: '#F9A8D4',
    secondary: '#C084FC',
    accent: '#67E8F9',
    background: '#701A75',
    text: '#FAE8FF',
    textLight: '#E879F9'
  }
];

export const generateColorPalette = (isDarkMode: boolean = false): ColorPalette => {
  const palettes = isDarkMode ? darkColorPalettes : lightColorPalettes;
  const randomIndex = Math.floor(Math.random() * palettes.length);
  return palettes[randomIndex];
};

// Helper functions for color manipulation
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
