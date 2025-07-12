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

const generateMonochromaticScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  // Add more variation in saturation and lightness
  const baseSaturation = 60 + Math.floor(Math.random() * 30); // 60-90%
  const saturationVariation = 10 + Math.floor(Math.random() * 15); // 10-25%
  
  if (isDarkMode) {
    const baseLightness = 55 + Math.floor(Math.random() * 15); // 55-70%
    return {
      brand: hslToHex(baseHue, baseSaturation, baseLightness),
      accent: hslToHex(baseHue, baseSaturation + saturationVariation, baseLightness + 10),
      "button-primary": hslToHex(baseHue, baseSaturation, baseLightness),
      "button-text": hslToHex(baseHue, 25, 8),
      "button-secondary": hslToHex(baseHue, 30, 20),
      "button-secondary-text": hslToHex(baseHue, baseSaturation, baseLightness),
      "text-primary": hslToHex(0, 0, 95),
      "text-secondary": hslToHex(baseHue, 20, 75),
      "section-bg-1": hslToHex(baseHue, 25, 8),
      "section-bg-2": hslToHex(baseHue, 30, 12),
      "section-bg-3": hslToHex(baseHue, 35, 16),
      border: hslToHex(baseHue, 20, 25),
      highlight: hslToHex(baseHue, baseSaturation + 10, 65),
      "input-bg": hslToHex(baseHue, 25, 12),
      "input-text": hslToHex(baseHue, 10, 95)
    };
  } else {
    const baseLightness = 45 + Math.floor(Math.random() * 15); // 45-60%
    return {
      brand: hslToHex(baseHue, baseSaturation, baseLightness),
      accent: hslToHex(baseHue, baseSaturation + saturationVariation, baseLightness + 10),
      "button-primary": hslToHex(baseHue, baseSaturation, baseLightness),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(baseHue, 15, 95),
      "button-secondary-text": hslToHex(baseHue, baseSaturation, baseLightness),
      "text-primary": hslToHex(baseHue, 30, 15),
      "text-secondary": hslToHex(baseHue, 20, 45),
      "section-bg-1": hslToHex(baseHue, 15, 98),
      "section-bg-2": hslToHex(baseHue, 20, 96),
      "section-bg-3": hslToHex(baseHue, 25, 94),
      border: hslToHex(baseHue, 15, 85),
      highlight: hslToHex(baseHue, baseSaturation - 10, baseLightness + 10),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(baseHue, 30, 15)
    };
  }
};

const generateAnalogousScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 30) % 360;
  const hue3 = (baseHue + 60) % 360;
  
  if (isDarkMode) {
    return {
      brand: hslToHex(hue1, 70, 60),
      accent: hslToHex(hue3, 80, 65),
      "button-primary": hslToHex(hue1, 70, 60),
      "button-text": hslToHex(hue1, 25, 8),
      "button-secondary": hslToHex(hue1, 30, 20),
      "button-secondary-text": hslToHex(hue1, 70, 60),
      "text-primary": hslToHex(0, 0, 95),
      "text-secondary": hslToHex(hue1, 20, 75),
      "section-bg-1": hslToHex(hue1, 25, 8),
      "section-bg-2": hslToHex(hue2, 25, 12),
      "section-bg-3": hslToHex(hue3, 25, 16),
      border: hslToHex(hue1, 20, 25),
      highlight: hslToHex(hue2, 65, 55),
      "input-bg": hslToHex(hue1, 25, 12),
      "input-text": hslToHex(0, 0, 95)
    };
  } else {
    return {
      brand: hslToHex(hue1, 75, 50),
      accent: hslToHex(hue3, 80, 55),
      "button-primary": hslToHex(hue1, 75, 50),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue1, 15, 95),
      "button-secondary-text": hslToHex(hue1, 75, 50),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, 97),
      "section-bg-3": hslToHex(hue3, 20, 94),
      border: hslToHex(hue1, 15, 85),
      highlight: hslToHex(hue2, 70, 45),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

const generateComplementaryScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const complementaryHue = (baseHue + 180) % 360;
  
  if (isDarkMode) {
    return {
      brand: hslToHex(baseHue, 75, 60),
      accent: hslToHex(complementaryHue, 85, 65),
      "button-primary": hslToHex(baseHue, 75, 60),
      "button-text": hslToHex(baseHue, 30, 8),
      "button-secondary": hslToHex(baseHue, 30, 20),
      "button-secondary-text": hslToHex(baseHue, 75, 60),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(baseHue, 25, 75),
      "section-bg-1": hslToHex(baseHue, 30, 8),
      "section-bg-2": hslToHex(complementaryHue, 25, 12),
      "section-bg-3": hslToHex(baseHue, 35, 16),
      border: hslToHex(baseHue, 20, 25),
      highlight: hslToHex(complementaryHue, 70, 55),
      "input-bg": hslToHex(baseHue, 30, 12),
      "input-text": '#F9FAFB'
    };
  } else {
    return {
      brand: hslToHex(baseHue, 80, 50),
      accent: hslToHex(complementaryHue, 85, 55),
      "button-primary": hslToHex(baseHue, 80, 50),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(baseHue, 15, 95),
      "button-secondary-text": hslToHex(baseHue, 80, 50),
      "text-primary": hslToHex(baseHue, 50, 15),
      "text-secondary": hslToHex(baseHue, 35, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(complementaryHue, 20, 97),
      "section-bg-3": hslToHex(baseHue, 20, 94),
      border: hslToHex(baseHue, 15, 85),
      highlight: hslToHex(complementaryHue, 75, 45),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(baseHue, 50, 15)
    };
  }
};

const generateTriadicScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 120) % 360;
  const hue3 = (baseHue + 240) % 360;
  
  if (isDarkMode) {
    return {
      brand: hslToHex(hue1, 70, 60),
      accent: hslToHex(hue3, 75, 65),
      "button-primary": hslToHex(hue1, 70, 60),
      "button-text": hslToHex(hue1, 25, 8),
      "button-secondary": hslToHex(hue1, 30, 20),
      "button-secondary-text": hslToHex(hue1, 70, 60),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(hue1, 20, 75),
      "section-bg-1": hslToHex(hue1, 25, 8),
      "section-bg-2": hslToHex(hue2, 25, 12),
      "section-bg-3": hslToHex(hue3, 25, 16),
      border: hslToHex(hue1, 20, 25),
      highlight: hslToHex(hue2, 65, 55),
      "input-bg": hslToHex(hue1, 25, 12),
      "input-text": '#F9FAFB'
    };
  } else {
    return {
      brand: hslToHex(hue1, 75, 50),
      accent: hslToHex(hue3, 80, 55),
      "button-primary": hslToHex(hue1, 75, 50),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue1, 15, 95),
      "button-secondary-text": hslToHex(hue1, 75, 50),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, 97),
      "section-bg-3": hslToHex(hue3, 20, 94),
      border: hslToHex(hue1, 15, 85),
      highlight: hslToHex(hue2, 70, 45),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

const generateTetradicScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 90) % 360;
  const hue3 = (baseHue + 180) % 360;
  
  if (isDarkMode) {
    return {
      brand: hslToHex(hue1, 70, 60),
      accent: hslToHex(hue3, 75, 65),
      "button-primary": hslToHex(hue1, 70, 60),
      "button-text": hslToHex(hue1, 25, 8),
      "button-secondary": hslToHex(hue1, 30, 20),
      "button-secondary-text": hslToHex(hue1, 70, 60),
      "text-primary": '#F9FAFB',
      "text-secondary": hslToHex(hue1, 20, 75),
      "section-bg-1": hslToHex(hue1, 25, 8),
      "section-bg-2": hslToHex(hue2, 25, 12),
      "section-bg-3": hslToHex(hue3, 25, 16),
      border: hslToHex(hue1, 20, 25),
      highlight: hslToHex(hue2, 65, 55),
      "input-bg": hslToHex(hue1, 25, 12),
      "input-text": '#F9FAFB'
    };
  } else {
    return {
      brand: hslToHex(hue1, 75, 50),
      accent: hslToHex(hue3, 80, 55),
      "button-primary": hslToHex(hue1, 75, 50),
      "button-text": '#FFFFFF',
      "button-secondary": hslToHex(hue1, 15, 95),
      "button-secondary-text": hslToHex(hue1, 75, 50),
      "text-primary": hslToHex(hue1, 40, 15),
      "text-secondary": hslToHex(hue1, 30, 45),
      "section-bg-1": '#FFFFFF',
      "section-bg-2": hslToHex(hue2, 20, 97),
      "section-bg-3": hslToHex(hue3, 20, 94),
      border: hslToHex(hue1, 15, 85),
      highlight: hslToHex(hue2, 70, 45),
      "input-bg": '#FFFFFF',
      "input-text": hslToHex(hue1, 40, 15)
    };
  }
};

export const generateColorPalette = (isDarkMode: boolean = false): ColorPalette => {
  const palettes = isDarkMode ? darkColorPalettes : lightColorPalettes;
  const randomIndex = Math.floor(Math.random() * palettes.length);
  return palettes[randomIndex];
};

export const generateColorScheme = (scheme: ColorSchemeType, isDarkMode: boolean = false): ColorPalette => {
  if (scheme === 'random') {
    // Enhanced random generation with more variety
    const randomChoice = Math.random();
    if (randomChoice < 0.3) {
      // 30% chance: Use predefined palettes
      return generateColorPalette(isDarkMode);
    } else {
      // 70% chance: Generate dynamic schemes
      const schemes: ColorSchemeType[] = ['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic'];
      const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
      return generateColorScheme(randomScheme, isDarkMode);
    }
  }

  // Add more variation to base hue generation
  const baseHue = Math.floor(Math.random() * 360);
  
  switch (scheme) {
    case 'monochromatic':
      return generateMonochromaticScheme(baseHue, isDarkMode);
    case 'analogous':
      return generateAnalogousScheme(baseHue, isDarkMode);
    case 'complementary':
      return generateComplementaryScheme(baseHue, isDarkMode);
    case 'triadic':
      return generateTriadicScheme(baseHue, isDarkMode);
    case 'tetradic':
      return generateTetradicScheme(baseHue, isDarkMode);
    default:
      return generateColorPalette(isDarkMode);
  }
};

export const generateColorSchemeWithLocks = (
  scheme: ColorSchemeType, 
  isDarkMode: boolean = false, 
  currentPalette: ColorPalette,
  lockedColors: Set<keyof ColorPalette>,
  accessibilityMode: boolean = false,
  preserveMoodId?: string | null
): ColorPalette => {
  if (accessibilityMode) {
    return generateAccessibleColorScheme(scheme, isDarkMode, currentPalette, lockedColors, preserveMoodId);
  }
  
  // If preserving a mood, generate variations based on current palette
  if (preserveMoodId) {
    return generateMoodVariation(currentPalette, lockedColors, isDarkMode);
  }
  
  const newPalette = generateColorScheme(scheme, isDarkMode);
  
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
  isDarkMode: boolean = false
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
  isDarkMode: boolean = false,
  currentPalette: ColorPalette,
  lockedColors: Set<keyof ColorPalette>,
  preserveMoodId?: string | null
): ColorPalette => {
  const maxAttempts = 50;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // If preserving mood, generate variations; otherwise use scheme
    const newPalette = preserveMoodId 
      ? generateMoodVariation(currentPalette, new Set(), isDarkMode)
      : generateColorScheme(scheme, isDarkMode);
    
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
