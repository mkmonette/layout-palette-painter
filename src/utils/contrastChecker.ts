import { ColorPalette } from './colorGenerator';

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate relative luminance of a color
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  
  // Convert to linear RGB
  const getLinearValue = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const rLinear = getLinearValue(r);
  const gLinear = getLinearValue(g);
  const bLinear = getLinearValue(b);

  // Calculate luminance using the formula
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Check if contrast meets WCAG standards
 */
export const meetsContrastRequirement = (
  textColor: string, 
  backgroundColor: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Suggest an accessible text color for a given background
 */
export const getAccessibleTextColor = (backgroundColor: string): string => {
  const backgroundLuminance = getLuminance(backgroundColor);
  
  // If background is light (luminance > 0.5), use dark text
  // If background is dark (luminance <= 0.5), use light text
  return backgroundLuminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Darken or lighten a hex color by a percentage
 */
export const adjustColorBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };

  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
};

/**
 * Get an accessible version of a text color against a background
 */
export const getAccessibleVersion = (
  textColor: string, 
  backgroundColor: string
): string => {
  let currentColor = textColor;
  let attempts = 0;
  const maxAttempts = 20;

  while (!meetsContrastRequirement(currentColor, backgroundColor) && attempts < maxAttempts) {
    const backgroundLuminance = getLuminance(backgroundColor);
    
    if (backgroundLuminance > 0.5) {
      // Light background, darken text
      currentColor = adjustColorBrightness(currentColor, -15);
    } else {
      // Dark background, lighten text
      currentColor = adjustColorBrightness(currentColor, 15);
    }
    
    attempts++;
  }

  // If we still don't have good contrast, use black or white
  if (!meetsContrastRequirement(currentColor, backgroundColor)) {
    currentColor = getAccessibleTextColor(backgroundColor);
  }

  return currentColor;
};

/**
 * Validate an entire color palette for contrast issues
 */
export interface ContrastIssue {
  textRole: string;
  backgroundRole: string;
  ratio: number;
  isValid: boolean;
  suggestedColor?: string;
}

export const validatePaletteContrast = (palette: ColorPalette): ContrastIssue[] => {
  const issues: ContrastIssue[] = [];
  
  // Define text-background pairs to check
  const contrastPairs = [
    { text: 'text-primary', background: 'section-bg-1' },
    { text: 'text-secondary', background: 'section-bg-1' },
    { text: 'button-text', background: 'button-primary' },
    { text: 'button-secondary-text', background: 'button-secondary' },
    { text: 'input-text', background: 'input-bg' },
  ];

  contrastPairs.forEach(({ text, background }) => {
    if (palette[text] && palette[background]) {
      const ratio = getContrastRatio(palette[text], palette[background]);
      const isValid = ratio >= 4.5;
      
      issues.push({
        textRole: text,
        backgroundRole: background,
        ratio: Math.round(ratio * 100) / 100,
        isValid,
        suggestedColor: isValid ? undefined : getAccessibleVersion(palette[text], palette[background])
      });
    }
  });

  return issues;
};