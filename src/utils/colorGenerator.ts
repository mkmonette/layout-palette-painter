export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
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
  const baseSaturation = 70 + Math.random() * 20; // 70-90%
  
  if (isDarkMode) {
    return {
      primary: hslToHex(baseHue, baseSaturation, 60),
      secondary: hslToHex(baseHue, baseSaturation - 10, 50),
      accent: hslToHex(baseHue, baseSaturation + 15, 70),
      background: hslToHex(baseHue, 20, 8),
      text: hslToHex(baseHue, 10, 95),
      textLight: hslToHex(baseHue, 15, 75)
    };
  } else {
    return {
      primary: hslToHex(baseHue, baseSaturation, 50),
      secondary: hslToHex(baseHue, baseSaturation - 15, 40),
      accent: hslToHex(baseHue, baseSaturation + 10, 60),
      background: hslToHex(baseHue, 15, 98),
      text: hslToHex(baseHue, 30, 15),
      textLight: hslToHex(baseHue, 20, 45)
    };
  }
};

const generateAnalogousScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 30) % 360;
  const hue3 = (baseHue + 60) % 360;
  
  if (isDarkMode) {
    return {
      primary: hslToHex(hue1, 70, 60),
      secondary: hslToHex(hue2, 65, 55),
      accent: hslToHex(hue3, 80, 65),
      background: hslToHex(hue1, 25, 8),
      text: hslToHex(0, 0, 95),
      textLight: hslToHex(hue1, 20, 75)
    };
  } else {
    return {
      primary: hslToHex(hue1, 75, 50),
      secondary: hslToHex(hue2, 70, 45),
      accent: hslToHex(hue3, 80, 55),
      background: '#FFFFFF',
      text: hslToHex(hue1, 40, 15),
      textLight: hslToHex(hue1, 30, 45)
    };
  }
};

const generateComplementaryScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const complementaryHue = (baseHue + 180) % 360;
  
  if (isDarkMode) {
    return {
      primary: hslToHex(baseHue, 75, 60),
      secondary: hslToHex(complementaryHue, 70, 55),
      accent: hslToHex(complementaryHue, 85, 65),
      background: hslToHex(baseHue, 30, 8),
      text: '#F9FAFB',
      textLight: hslToHex(baseHue, 25, 75)
    };
  } else {
    return {
      primary: hslToHex(baseHue, 80, 50),
      secondary: hslToHex(complementaryHue, 75, 45),
      accent: hslToHex(complementaryHue, 85, 55),
      background: '#FFFFFF',
      text: hslToHex(baseHue, 50, 15),
      textLight: hslToHex(baseHue, 35, 45)
    };
  }
};

const generateTriadicScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 120) % 360;
  const hue3 = (baseHue + 240) % 360;
  
  if (isDarkMode) {
    return {
      primary: hslToHex(hue1, 70, 60),
      secondary: hslToHex(hue2, 65, 55),
      accent: hslToHex(hue3, 75, 65),
      background: hslToHex(hue1, 25, 8),
      text: '#F9FAFB',
      textLight: hslToHex(hue1, 20, 75)
    };
  } else {
    return {
      primary: hslToHex(hue1, 75, 50),
      secondary: hslToHex(hue2, 70, 45),
      accent: hslToHex(hue3, 80, 55),
      background: '#FFFFFF',
      text: hslToHex(hue1, 40, 15),
      textLight: hslToHex(hue1, 30, 45)
    };
  }
};

const generateTetradicScheme = (baseHue: number, isDarkMode: boolean): ColorPalette => {
  const hue1 = baseHue;
  const hue2 = (baseHue + 90) % 360;
  const hue3 = (baseHue + 180) % 360;
  
  if (isDarkMode) {
    return {
      primary: hslToHex(hue1, 70, 60),
      secondary: hslToHex(hue2, 65, 55),
      accent: hslToHex(hue3, 75, 65),
      background: hslToHex(hue1, 25, 8),
      text: '#F9FAFB',
      textLight: hslToHex(hue1, 20, 75)
    };
  } else {
    return {
      primary: hslToHex(hue1, 75, 50),
      secondary: hslToHex(hue2, 70, 45),
      accent: hslToHex(hue3, 80, 55),
      background: '#FFFFFF',
      text: hslToHex(hue1, 40, 15),
      textLight: hslToHex(hue1, 30, 45)
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
    return generateColorPalette(isDarkMode);
  }

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
    if (!lockedColors.has(key) && key !== 'background' && key !== 'text' && key !== 'textLight') {
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

  // Check key contrast ratios
  const textOnBackground = getContrastRatio(palette.text, palette.background);
  const textLightOnBackground = getContrastRatio(palette.textLight, palette.background);
  const textOnPrimary = getContrastRatio(palette.text, palette.primary);

  // WCAG AA compliance: 4.5:1 minimum ratio
  return textOnBackground >= 4.5 && textLightOnBackground >= 4.5 && textOnPrimary >= 4.5;
};

// Export helper functions for backward compatibility
export { hexToHsl, hslToHex };
