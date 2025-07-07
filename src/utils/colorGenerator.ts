
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

// Predefined color palettes for different moods and styles
const colorPalettes: ColorPalette[] = [
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
  // Dark Mode
  {
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    background: '#111827',
    text: '#F9FAFB',
    textLight: '#D1D5DB'
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

export const generateColorPalette = (): ColorPalette => {
  const randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return colorPalettes[randomIndex];
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
