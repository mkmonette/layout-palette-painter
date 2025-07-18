export interface ColorPalette {
  brand: string;
  accent: string;
  "button-primary": string;
  "button-text": string;
  "button-secondary": string;
  "button-secondary-text": string;
  "text-primary": string;
  "text-secondary": string;
  "section-bg-1": string;
  "section-bg-2": string;
  "section-bg-3": string;
  border: string;
  highlight: string;
  "input-bg": string;
  "input-text": string;
}

export type ColorSchemeType = 
  | 'monochromatic' 
  | 'analogous' 
  | 'complementary' 
  | 'triadic' 
  | 'tetradic'
  | 'random';

export type ColorMode = 'light' | 'light-midtone' | 'midtone' | 'midtone-dark' | 'dark';

// Define lightness ranges per mode
const lightnessRanges = {
  light: [85, 100],
  'light-midtone': [70, 84],
  midtone: [45, 65],
  'midtone-dark': [30, 44],
  dark: [10, 25],
} as const;

// Light mode color palettes
const lightColorPalettes: ColorPalette[] = [
  // Modern Blue
  {
    brand: '#3B82F6',
    accent: '#F59E0B',
    "button-primary": '#3B82F6',
    "button-text": '#FFFFFF',
    "button-secondary": '#F3F4F6',
    "button-secondary-text": '#3B82F6',
    "text-primary": '#1F2937',
    "text-secondary": '#6B7280',
    "section-bg-1": '#FFFFFF',
    "section-bg-2": '#F9FAFB',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: '#10B981',
    "input-bg": '#FFFFFF',
    "input-text": '#1F2937'
  },
  // Purple Gradient
  {
    brand: '#8B5CF6',
    accent: '#F97316',
    "button-primary": '#8B5CF6',
    "button-text": '#FFFFFF',
    "button-secondary": '#F3F4F6',
    "button-secondary-text": '#8B5CF6',
    "text-primary": '#374151',
    "text-secondary": '#9CA3AF',
    "section-bg-1": '#FEFEFE',
    "section-bg-2": '#FAF5FF',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: '#EC4899',
    "input-bg": '#FFFFFF',
    "input-text": '#374151'
  },
  // Green Nature
  {
    brand: '#059669',
    accent: '#FBBF24',
    "button-primary": '#059669',
    "button-text": '#FFFFFF',
    "button-secondary": '#F3F4F6',
    "button-secondary-text": '#059669',
    "text-primary": '#111827',
    "text-secondary": '#6B7280',
    "section-bg-1": '#F9FAFB',
    "section-bg-2": '#ECFDF5',
    "section-bg-3": '#F3F4F6',
    border: '#D1D5DB',
    highlight: '#0D9488',
    "input-bg": '#FFFFFF',
    "input-text": '#111827'
  }
];

// Dark mode color palettes
const darkColorPalettes: ColorPalette[] = [
  // Dark Blue
  {
    brand: '#60A5FA',
    accent: '#FBBF24',
    "button-primary": '#60A5FA',
    "button-text": '#111827',
    "button-secondary": '#374151',
    "button-secondary-text": '#60A5FA',
    "text-primary": '#F9FAFB',
    "text-secondary": '#D1D5DB',
    "section-bg-1": '#111827',
    "section-bg-2": '#1F2937',
    "section-bg-3": '#374151',
    border: '#4B5563',
    highlight: '#34D399',
    "input-bg": '#1F2937',
    "input-text": '#F9FAFB'
  },
  // Dark Purple
  {
    brand: '#A78BFA',
    accent: '#FB923C',
    "button-primary": '#A78BFA',
    "button-text": '#0F0F23',
    "button-secondary": '#374151',
    "button-secondary-text": '#A78BFA',
    "text-primary": '#F8FAFC',
    "text-secondary": '#CBD5E1',
    "section-bg-1": '#0F0F23',
    "section-bg-2": '#1E1B3A',
    "section-bg-3": '#2D2A4A',
    border: '#4B5563',
    highlight: '#F472B6',
    "input-bg": '#1E1B3A',
    "input-text": '#F8FAFC'
  },
  // Dark Green
  {
    brand: '#6EE7B7',
    accent: '#FCD34D',
    "button-primary": '#6EE7B7',
    "button-text": '#064E3B',
    "button-secondary": '#374151',
    "button-secondary-text": '#6EE7B7',
    "text-primary": '#ECFDF5',
    "text-secondary": '#A7F3D0',
    "section-bg-1": '#064E3B',
    "section-bg-2": '#0D7377',
    "section-bg-3": '#134E4A',
    border: '#4B5563',
    highlight: '#5EEAD4',
    "input-bg": '#0D7377',
    "input-text": '#ECFDF5'
  }
];

// Helper function to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Enhanced HSL color generation with mode support
const generateHSLColor = (mode: ColorMode, baseHue?: number, saturationRange: [number, number] = [60, 100]): string => {
  const [minLightness, maxLightness] = lightnessRanges[mode];
  const h = baseHue ?? Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) + saturationRange[0];
  const l = Math.floor(Math.random() * (maxLightness - minLightness)) + minLightness;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Helper function to convert HSL string to hex
const hslStringToHex = (hslString: string): string => {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#000000';
  const [, h, s, l] = match.map(Number);
  return hslToHex(h, s, l);
};

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
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

const generateMonochromaticScheme = (baseHue: number, mode: ColorMode): ColorPalette => {
  // Add more variation in saturation and lightness
  const baseSaturation = 60 + Math.floor(Math.random() * 30); // 60-90%
  const saturationVariation = 10 + Math.floor(Math.random() * 15); // 10-25%
  const [minL, maxL] = lightnessRanges[mode];
  
  if (mode === 'dark' || mode === 'midtone-dark') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(baseHue, baseSaturation, baseLightness),
      accent: hslToHex(baseHue, baseSaturation + saturationVariation, Math.min(maxL, baseLightness + 10)),
      "button-primary": hslToHex(baseHue, baseSaturation, baseLightness),
      "button-text": hslToHex(baseHue, 25, Math.max(5, minL - 15)),
      "button-secondary": hslToHex(baseHue, 30, Math.min(maxL, baseLightness + 15)),
      "button-secondary-text": hslToHex(baseHue, baseSaturation, baseLightness),
      "text-primary": hslToHex(0, 0, Math.min(95, maxL + 25)),
      "text-secondary": hslToHex(baseHue, 20, Math.min(85, maxL + 15)),
      "section-bg-1": hslToHex(baseHue, 25, Math.max(5, minL - 5)),
      "section-bg-2": hslToHex(baseHue, 30, Math.max(8, minL)),
      "section-bg-3": hslToHex(baseHue, 35, Math.max(12, minL + 5)),
      border: hslToHex(baseHue, 20, Math.min(maxL, baseLightness + 10)),
      highlight: hslToHex(baseHue, baseSaturation + 10, Math.min(maxL, baseLightness + 15)),
      "input-bg": hslToHex(baseHue, 25, Math.max(8, minL)),
      "input-text": hslToHex(baseHue, 10, Math.min(95, maxL + 25))
    };
  } else if (mode === 'midtone' || mode === 'light-midtone') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(baseHue, baseSaturation, baseLightness),
      accent: hslToHex(baseHue, baseSaturation + saturationVariation, Math.min(maxL, baseLightness + 10)),
      "button-primary": hslToHex(baseHue, baseSaturation, baseLightness),
      "button-text": hslToHex(baseHue, 10, Math.max(15, minL - 30)),
      "button-secondary": hslToHex(baseHue, 25, Math.min(maxL, baseLightness + 15)),
      "button-secondary-text": hslToHex(baseHue, baseSaturation, Math.max(minL - 10, baseLightness - 10)),
      "text-primary": hslToHex(baseHue, 20, Math.max(15, minL - 25)),
      "text-secondary": hslToHex(baseHue, 15, Math.max(25, minL - 15)),
      "section-bg-1": hslToHex(baseHue, 20, Math.min(maxL, baseLightness + 20)),
      "section-bg-2": hslToHex(baseHue, 25, Math.min(maxL, baseLightness + 15)),
      "section-bg-3": hslToHex(baseHue, 30, Math.min(maxL, baseLightness + 10)),
      border: hslToHex(baseHue, 20, Math.max(minL + 5, baseLightness - 10)),
      highlight: hslToHex(baseHue, baseSaturation - 10, Math.min(maxL, baseLightness + 15)),
      "input-bg": hslToHex(baseHue, 15, Math.min(maxL, baseLightness + 15)),
      "input-text": hslToHex(baseHue, 25, Math.max(15, minL - 25))
    };
  } else {
    // Light mode
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL - 30)) + 15; // Keep away from pure white
    return {
      brand: hslToHex(baseHue, baseSaturation, Math.max(30, baseLightness - 30)),
      accent: hslToHex(baseHue, baseSaturation + saturationVariation, Math.max(35, baseLightness - 25)),
      "button-primary": hslToHex(baseHue, baseSaturation, Math.max(30, baseLightness - 30)),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(baseHue, 15, Math.min(maxL, baseLightness + 5)),
      "button-secondary-text": hslToHex(baseHue, baseSaturation, Math.max(30, baseLightness - 30)),
      "text-primary": hslToHex(baseHue, 30, 15),
      "text-secondary": hslToHex(baseHue, 20, 45),
      "section-bg-1": hslToHex(baseHue, 15, Math.min(maxL, baseLightness)),
      "section-bg-2": hslToHex(baseHue, 20, Math.min(maxL, baseLightness - 2)),
      "section-bg-3": hslToHex(baseHue, 25, Math.min(maxL, baseLightness - 4)),
      border: hslToHex(baseHue, 15, Math.max(minL + 5, baseLightness - 15)),
      highlight: hslToHex(baseHue, baseSaturation - 10, Math.max(35, baseLightness - 20)),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(baseHue, 30, 15)
    };
  }
};

const generateAnalogousScheme = (baseHue: number, mode: ColorMode): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 30) % 360;
  const hue3 = (baseHue + 60) % 360;
  const [minL, maxL] = lightnessRanges[mode];
  
  if (mode === 'dark' || mode === 'midtone-dark') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 70, baseLightness),
      accent: hslToHex(hue3, 80, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue1, 70, baseLightness),
      "button-text": hslToHex(hue1, 25, Math.max(5, minL - 10)),
      "button-secondary": hslToHex(hue1, 30, Math.min(maxL, baseLightness + 10)),
      "button-secondary-text": hslToHex(hue1, 70, baseLightness),
      "text-primary": hslToHex(0, 0, Math.min(95, maxL + 25)),
      "text-secondary": hslToHex(hue1, 20, Math.min(85, maxL + 15)),
      "section-bg-1": hslToHex(hue1, 25, Math.max(5, minL - 5)),
      "section-bg-2": hslToHex(hue2, 25, Math.max(8, minL)),
      "section-bg-3": hslToHex(hue3, 25, Math.max(12, minL + 5)),
      border: hslToHex(hue1, 20, Math.min(maxL, baseLightness + 5)),
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 10)),
      "input-bg": hslToHex(hue1, 25, Math.max(8, minL)),
      "input-text": hslToHex(0, 0, Math.min(95, maxL + 25))
    };
  } else if (mode === 'midtone' || mode === 'light-midtone') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 75, baseLightness),
      accent: hslToHex(hue3, 80, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue1, 75, baseLightness),
      "button-text": hslToHex(hue1, 15, Math.max(15, minL - 25)),
      "button-secondary": hslToHex(hue1, 25, Math.min(maxL, baseLightness + 15)),
      "button-secondary-text": hslToHex(hue1, 75, Math.max(minL - 5, baseLightness - 5)),
      "text-primary": hslToHex(hue1, 35, Math.max(15, minL - 20)),
      "text-secondary": hslToHex(hue1, 25, Math.max(25, minL - 10)),
      "section-bg-1": hslToHex(hue1, 20, Math.min(maxL, baseLightness + 20)),
      "section-bg-2": hslToHex(hue2, 25, Math.min(maxL, baseLightness + 15)),
      "section-bg-3": hslToHex(hue3, 25, Math.min(maxL, baseLightness + 10)),
      border: hslToHex(hue1, 20, Math.max(minL + 5, baseLightness - 10)),
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 5)),
      "input-bg": hslToHex(hue1, 15, Math.min(maxL, baseLightness + 15)),
      "input-text": hslToHex(hue1, 35, Math.max(15, minL - 20))
    };
  } else {
    // Light mode
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL - 20)) + 10;
    return {
      brand: hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      accent: hslToHex(hue3, 80, Math.max(35, baseLightness - 30)),
      "button-primary": hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue1, 15, Math.min(maxL, baseLightness + 5)),
      "button-secondary-text": hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, Math.min(maxL, baseLightness - 2)),
      "section-bg-3": hslToHex(hue3, 20, Math.min(maxL, baseLightness - 5)),
      border: hslToHex(hue1, 15, Math.max(minL + 5, baseLightness - 15)),
      highlight: hslToHex(hue2, 70, Math.max(35, baseLightness - 30)),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

const generateComplementaryScheme = (baseHue: number, mode: ColorMode): ColorPalette => {
  const complementaryHue = (baseHue + 180) % 360;
  const [minL, maxL] = lightnessRanges[mode];
  
  if (mode === 'dark' || mode === 'midtone-dark') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(baseHue, 75, baseLightness),
      accent: hslToHex(complementaryHue, 85, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(baseHue, 75, baseLightness),
      "button-text": hslToHex(baseHue, 30, Math.max(5, minL - 10)),
      "button-secondary": hslToHex(baseHue, 30, Math.min(maxL, baseLightness + 10)),
      "button-secondary-text": hslToHex(baseHue, 75, baseLightness),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(baseHue, 25, Math.min(85, maxL + 15)),
      "section-bg-1": hslToHex(baseHue, 30, Math.max(5, minL - 5)),
      "section-bg-2": hslToHex(complementaryHue, 25, Math.max(8, minL)),
      "section-bg-3": hslToHex(baseHue, 35, Math.max(12, minL + 5)),
      border: hslToHex(baseHue, 20, Math.min(maxL, baseLightness + 5)),
      highlight: hslToHex(complementaryHue, 70, Math.min(maxL, baseLightness + 10)),
      "input-bg": hslToHex(baseHue, 30, Math.max(8, minL)),
      "input-text": '#F9FAFB'
    };
  } else if (mode === 'midtone' || mode === 'light-midtone') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(baseHue, 80, baseLightness),
      accent: hslToHex(complementaryHue, 85, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(baseHue, 80, baseLightness),
      "button-text": hslToHex(baseHue, 15, Math.max(15, minL - 25)),
      "button-secondary": hslToHex(baseHue, 25, Math.min(maxL, baseLightness + 15)),
      "button-secondary-text": hslToHex(baseHue, 80, Math.max(minL - 5, baseLightness - 5)),
      "text-primary": hslToHex(baseHue, 40, Math.max(15, minL - 20)),
      "text-secondary": hslToHex(baseHue, 30, Math.max(25, minL - 10)),
      "section-bg-1": hslToHex(baseHue, 20, Math.min(maxL, baseLightness + 20)),
      "section-bg-2": hslToHex(complementaryHue, 25, Math.min(maxL, baseLightness + 15)),
      "section-bg-3": hslToHex(baseHue, 25, Math.min(maxL, baseLightness + 10)),
      border: hslToHex(baseHue, 20, Math.max(minL + 5, baseLightness - 10)),
      highlight: hslToHex(complementaryHue, 70, Math.min(maxL, baseLightness + 5)),
      "input-bg": hslToHex(baseHue, 15, Math.min(maxL, baseLightness + 15)),
      "input-text": hslToHex(baseHue, 40, Math.max(15, minL - 20))
    };
  } else {
    // Light mode
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL - 20)) + 10;
    return {
      brand: hslToHex(baseHue, 80, Math.max(30, baseLightness - 35)),
      accent: hslToHex(complementaryHue, 85, Math.max(35, baseLightness - 30)),
      "button-primary": hslToHex(baseHue, 80, Math.max(30, baseLightness - 35)),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(baseHue, 15, Math.min(maxL, baseLightness + 5)),
      "button-secondary-text": hslToHex(baseHue, 80, Math.max(30, baseLightness - 35)),
      "text-primary": hslToHex(baseHue, 50, 15),
      "text-secondary": hslToHex(baseHue, 35, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(complementaryHue, 20, Math.min(maxL, baseLightness - 2)),
      "section-bg-3": hslToHex(baseHue, 20, Math.min(maxL, baseLightness - 5)),
      border: hslToHex(baseHue, 15, Math.max(minL + 5, baseLightness - 15)),
      highlight: hslToHex(complementaryHue, 75, Math.max(35, baseLightness - 30)),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(baseHue, 50, 15)
    };
  }
};

const generateTriadicScheme = (baseHue: number, mode: ColorMode): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 120) % 360;
  const hue3 = (baseHue + 240) % 360;
  const [minL, maxL] = lightnessRanges[mode];
  
  if (mode === 'dark' || mode === 'midtone-dark') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 70, baseLightness),
      accent: hslToHex(hue3, 75, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue1, 70, baseLightness),
      "button-text": hslToHex(hue1, 25, Math.max(5, minL - 10)),
      "button-secondary": hslToHex(hue1, 30, Math.min(maxL, baseLightness + 10)),
      "button-secondary-text": hslToHex(hue1, 70, baseLightness),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(hue1, 20, Math.min(85, maxL + 15)),
      "section-bg-1": hslToHex(hue1, 25, Math.max(5, minL - 5)),
      "section-bg-2": hslToHex(hue2, 25, Math.max(8, minL)),
      "section-bg-3": hslToHex(hue3, 25, Math.max(12, minL + 5)),
      border: hslToHex(hue1, 20, Math.min(maxL, baseLightness + 5)),
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 10)),
      "input-bg": hslToHex(hue1, 25, Math.max(8, minL)),
      "input-text": '#F9FAFB'
    };
  } else if (mode === 'midtone' || mode === 'light-midtone') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 75, baseLightness),
      accent: hslToHex(hue3, 80, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue1, 75, baseLightness),
      "button-text": hslToHex(hue1, 15, Math.max(15, minL - 25)),
      "button-secondary": hslToHex(hue1, 25, Math.min(maxL, baseLightness + 15)),
      "button-secondary-text": hslToHex(hue1, 75, Math.max(minL - 5, baseLightness - 5)),
      "text-primary": hslToHex(hue1, 35, Math.max(15, minL - 20)),
      "text-secondary": hslToHex(hue1, 25, Math.max(25, minL - 10)),
      "section-bg-1": hslToHex(hue1, 20, Math.min(maxL, baseLightness + 20)),
      "section-bg-2": hslToHex(hue2, 25, Math.min(maxL, baseLightness + 15)),
      "section-bg-3": hslToHex(hue3, 25, Math.min(maxL, baseLightness + 10)),
      border: hslToHex(hue1, 20, Math.max(minL + 5, baseLightness - 10)),
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 5)),
      "input-bg": hslToHex(hue1, 15, Math.min(maxL, baseLightness + 15)),
      "input-text": hslToHex(hue1, 35, Math.max(15, minL - 20))
    };
  } else {
    // Light mode
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL - 20)) + 10;
    return {
      brand: hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      accent: hslToHex(hue3, 80, Math.max(35, baseLightness - 30)),
      "button-primary": hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue1, 15, Math.min(maxL, baseLightness + 5)),
      "button-secondary-text": hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, Math.min(maxL, baseLightness - 2)),
      "section-bg-3": hslToHex(hue3, 20, Math.min(maxL, baseLightness - 5)),
      border: hslToHex(hue1, 15, Math.max(minL + 5, baseLightness - 15)),
      highlight: hslToHex(hue2, 70, Math.max(35, baseLightness - 30)),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

const generateTetradicScheme = (baseHue: number, mode: ColorMode): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 90) % 360;
  const hue3 = (baseHue + 180) % 360;
  const hue4 = (baseHue + 270) % 360; // Add the 4th hue for proper tetradic
  const [minL, maxL] = lightnessRanges[mode];
  
  if (mode === 'dark' || mode === 'midtone-dark') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 70, baseLightness),
      accent: hslToHex(hue3, 75, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue2, 70, baseLightness), // Use hue2 for more variation
      "button-text": hslToHex(hue1, 25, Math.max(5, minL - 10)),
      "button-secondary": hslToHex(hue4, 30, Math.min(maxL, baseLightness + 10)), // Use hue4
      "button-secondary-text": hslToHex(hue1, 70, baseLightness),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(hue1, 20, Math.min(85, maxL + 15)),
      "section-bg-1": hslToHex(hue1, 25, Math.max(5, minL - 5)),
      "section-bg-2": hslToHex(hue2, 25, Math.max(8, minL)),
      "section-bg-3": hslToHex(hue3, 25, Math.max(12, minL + 5)),
      border: hslToHex(hue4, 20, Math.min(maxL, baseLightness + 5)), // Use hue4
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 10)),
      "input-bg": hslToHex(hue1, 25, Math.max(8, minL)),
      "input-text": '#F9FAFB'
    };
  } else if (mode === 'midtone' || mode === 'light-midtone') {
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL));
    return {
      brand: hslToHex(hue1, 75, baseLightness),
      accent: hslToHex(hue3, 80, Math.min(maxL, baseLightness + 5)),
      "button-primary": hslToHex(hue2, 75, baseLightness), // Use hue2
      "button-text": hslToHex(hue1, 15, Math.max(15, minL - 25)),
      "button-secondary": hslToHex(hue4, 25, Math.min(maxL, baseLightness + 15)), // Use hue4
      "button-secondary-text": hslToHex(hue1, 75, Math.max(minL - 5, baseLightness - 5)),
      "text-primary": hslToHex(hue1, 35, Math.max(15, minL - 20)),
      "text-secondary": hslToHex(hue1, 25, Math.max(25, minL - 10)),
      "section-bg-1": hslToHex(hue1, 20, Math.min(maxL, baseLightness + 20)),
      "section-bg-2": hslToHex(hue2, 25, Math.min(maxL, baseLightness + 15)),
      "section-bg-3": hslToHex(hue3, 25, Math.min(maxL, baseLightness + 10)),
      border: hslToHex(hue4, 20, Math.max(minL + 5, baseLightness - 10)), // Use hue4
      highlight: hslToHex(hue2, 65, Math.min(maxL, baseLightness + 5)),
      "input-bg": hslToHex(hue1, 15, Math.min(maxL, baseLightness + 15)),
      "input-text": hslToHex(hue1, 35, Math.max(15, minL - 20))
    };
  } else {
    // Light mode
    const baseLightness = minL + Math.floor(Math.random() * (maxL - minL - 20)) + 10;
    return {
      brand: hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      accent: hslToHex(hue3, 80, Math.max(35, baseLightness - 30)),
      "button-primary": hslToHex(hue2, 75, Math.max(30, baseLightness - 35)), // Use hue2
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue4, 15, Math.min(maxL, baseLightness + 5)), // Use hue4
      "button-secondary-text": hslToHex(hue1, 75, Math.max(30, baseLightness - 35)),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, Math.min(maxL, baseLightness - 2)),
      "section-bg-3": hslToHex(hue3, 20, Math.min(maxL, baseLightness - 5)),
      border: hslToHex(hue4, 15, Math.max(minL + 5, baseLightness - 15)), // Use hue4
      highlight: hslToHex(hue2, 70, Math.max(35, baseLightness - 30)),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

// Function to adjust palette colors based on theme mode
const adjustPaletteForThemeMode = (basePalette: ColorPalette, mode: ColorMode): ColorPalette => {
  if (mode === 'light' || mode === 'dark') {
    // No adjustment needed for light and dark modes - they already use appropriate palettes
    return basePalette;
  }
  
  // For intermediate modes, adjust lightness values
  const [minL, maxL] = lightnessRanges[mode];
  const result = { ...basePalette };
  
  // Adjust background colors to fit the theme mode range
  Object.keys(result).forEach(key => {
    const colorKey = key as keyof ColorPalette;
    const hsl = hexToHsl(result[colorKey]);
    
    // Only adjust non-text colors and non-fixed colors
    if (!key.includes('text') && !key.includes('button-text') && result[colorKey] !== '#FFFFFF' && result[colorKey] !== '#000000') {
      // Map current lightness to the new range
      let newLightness: number;
      
      if (key.includes('section-bg') || key.includes('input-bg')) {
        // Background colors should be in the upper part of the range
        newLightness = Math.max(minL + 15, Math.min(maxL, hsl.l));
      } else if (key.includes('border')) {
        // Border colors should be in the middle of the range
        newLightness = minL + (maxL - minL) * 0.3;
      } else {
        // Brand and accent colors
        newLightness = minL + (maxL - minL) * 0.5;
      }
      
      result[colorKey] = hslToHex(hsl.h, hsl.s, Math.round(newLightness));
    }
  });
  
  return result;
};

export const generateColorPalette = (mode: ColorMode = 'light'): ColorPalette => {
  // For backward compatibility, handle boolean parameter
  if (typeof mode === 'boolean') {
    mode = mode ? 'dark' : 'light';
  }
  
  // Map all theme modes to appropriate palette sets
  const isDarkish = mode === 'dark' || mode === 'midtone-dark';
  const palettes = isDarkish ? darkColorPalettes : lightColorPalettes;
  const randomIndex = Math.floor(Math.random() * palettes.length);
  
  // Adjust the palette based on the specific theme mode
  const basePalette = palettes[randomIndex];
  return adjustPaletteForThemeMode(basePalette, mode);
};

export const generateColorScheme = (scheme: ColorSchemeType, mode: ColorMode = 'light'): ColorPalette => {
  // For backward compatibility, handle boolean parameter
  if (typeof mode === 'boolean') {
    mode = mode ? 'dark' : 'light';
  }
  
  if (scheme === 'random') {
    // Enhanced random generation with more variety
    const randomChoice = Math.random();
    if (randomChoice < 0.3) {
      // 30% chance: Use predefined palettes
      return generateColorPalette(mode);
    } else {
      // 70% chance: Generate dynamic schemes
      const schemes: ColorSchemeType[] = ['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic'];
      const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
      return generateColorScheme(randomScheme, mode);
    }
  }

  // Add more variation to base hue generation
  const baseHue = Math.floor(Math.random() * 360);
  
  switch (scheme) {
    case 'monochromatic':
      return generateMonochromaticScheme(baseHue, mode);
    case 'analogous':
      return generateAnalogousScheme(baseHue, mode);
    case 'complementary':
      return generateComplementaryScheme(baseHue, mode);
    case 'triadic':
      return generateTriadicScheme(baseHue, mode);
    case 'tetradic':
      return generateTetradicScheme(baseHue, mode);
    default:
      return generateColorPalette(mode);
  }
};

export const generateColorSchemeWithLocks = (
  scheme: ColorSchemeType, 
  mode: ColorMode | boolean = 'light', 
  currentPalette: ColorPalette,
  lockedColors: Set<keyof ColorPalette>,
  accessibilityMode: boolean = false,
  preserveMoodId?: string | null
): ColorPalette => {
  // For backward compatibility, handle boolean parameter
  if (typeof mode === 'boolean') {
    mode = mode ? 'dark' : 'light';
  }
  if (accessibilityMode) {
    return generateAccessibleColorScheme(scheme, mode, currentPalette, lockedColors, preserveMoodId);
  }
  
  // If preserving a mood, generate variations based on current palette
  if (preserveMoodId) {
    return generateMoodVariation(currentPalette, lockedColors, mode);
  }
  
  const newPalette = generateColorScheme(scheme, mode);
  
  // Preserve locked colors
  const result = { ...newPalette };
  console.log('Before locking - new palette:', newPalette);
  console.log('Locked colors to preserve:', Array.from(lockedColors));
  
  for (const colorKey of lockedColors) {
    console.log(`Preserving locked color ${colorKey}: ${currentPalette[colorKey]} -> ${result[colorKey]}`);
    result[colorKey] = currentPalette[colorKey];
  }
  
  console.log('After locking - final palette:', result);
  return result;
};

/**
 * Generate variations while preserving mood characteristics
 */
const generateMoodVariation = (
  currentPalette: ColorPalette,
  lockedColors: Set<keyof ColorPalette>,
  mode: ColorMode = 'light'
): ColorPalette => {
  const result = { ...currentPalette };
  
  // For unlocked colors, generate subtle variations that maintain the mood
  const keys = Object.keys(currentPalette) as (keyof ColorPalette)[];
  
  keys.forEach(key => {
    if (!lockedColors.has(key) && key !== 'section-bg-1' && key !== 'text-primary' && key !== 'text-secondary') {
      const originalHsl = hexToHsl(currentPalette[key]);
      
      // Create subtle variations: small hue shifts and saturation/lightness adjustments
      const hueShift = (Math.random() - 0.5) * 30; // ±15 degree shift
      const saturationShift = (Math.random() - 0.5) * 20; // ±10% shift
      const lightnessShift = (Math.random() - 0.5) * 20; // ±10% shift
      
      const newHue = (originalHsl.h + hueShift + 360) % 360;
      const newSaturation = Math.max(0, Math.min(100, originalHsl.s + saturationShift));
      const newLightness = Math.max(10, Math.min(90, originalHsl.l + lightnessShift));
      
      result[key] = hslToHex(newHue, newSaturation, newLightness);
    }
  });
  
  return result;
};

/**
 * Generate accessibility-compliant color schemes
 */
export const generateAccessibleColorScheme = (
  scheme: ColorSchemeType,
  mode: ColorMode = 'light',
  currentPalette: ColorPalette,
  lockedColors: Set<keyof ColorPalette>,
  preserveMoodId?: string | null
): ColorPalette => {
  const maxAttempts = 50;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // If preserving mood, generate variations; otherwise use scheme
    const newPalette = preserveMoodId 
      ? generateMoodVariation(currentPalette, new Set(), mode)
      : generateColorScheme(scheme, mode);
    
    // Preserve locked colors
    const result = { ...newPalette };
    for (const colorKey of lockedColors) {
      result[colorKey] = currentPalette[colorKey];
    }
    
    // Check accessibility using inline contrast checking
    if (checkPaletteAccessibility(result)) {
      return result;
    }
    
    attempts++;
  }
  
  // If no accessible palette found, return current palette
  throw new Error('No accessible palette found with current settings');
};

/**
 * Inline accessibility checker to avoid circular imports
 */
const checkPaletteAccessibility = (palette: ColorPalette): boolean => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Check key contrast ratios with new color roles
  const textOnSection1 = getContrastRatio(palette["text-primary"], palette["section-bg-1"]);
  const textSecondaryOnSection1 = getContrastRatio(palette["text-secondary"], palette["section-bg-1"]);
  const buttonTextOnButton = getContrastRatio(palette["button-text"], palette["button-primary"]);

  // WCAG AA compliance: 4.5:1 minimum ratio
  return textOnSection1 >= 4.5 && textSecondaryOnSection1 >= 4.5 && buttonTextOnButton >= 4.5;
};

// Export helper functions for backward compatibility
export { hexToHsl, hslToHex };
