import { ColorPalette } from './colorGenerator';
import chroma from 'chroma-js';

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
 * Suggest an accessible text color for a given background using chroma-js
 */
export const getAccessibleTextColor = (backgroundColor: string): string => {
  try {
    const backgroundLuminance = chroma(backgroundColor).luminance();
    // Use 0.6 threshold for better contrast (matching the colorRoleMapper)
    return backgroundLuminance > 0.6 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.warn('Error calculating luminance for color:', backgroundColor);
    return '#000000';
  }
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
 * Get an accessible version of a text color against a background using chroma-js
 */
export const getAccessibleVersion = (
  textColor: string, 
  backgroundColor: string
): string => {
  try {
    const contrast = chroma.contrast(textColor, backgroundColor);
    
    // If contrast is already good, return original color
    if (contrast >= 4.5) {
      return textColor;
    }
    
    // If contrast is poor, return high-contrast color
    return getAccessibleTextColor(backgroundColor);
  } catch (error) {
    console.warn('Error calculating contrast:', error);
    return getAccessibleTextColor(backgroundColor);
  }
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
      try {
        const ratio = chroma.contrast(palette[text], palette[background]);
        const isValid = ratio >= 4.5;
        
        issues.push({
          textRole: text,
          backgroundRole: background,
          ratio: Math.round(ratio * 100) / 100,
          isValid,
          suggestedColor: isValid ? undefined : getAccessibleVersion(palette[text], palette[background])
        });
      } catch (error) {
        console.warn('Error validating contrast for', text, 'on', background, error);
        issues.push({
          textRole: text,
          backgroundRole: background,
          ratio: 0,
          isValid: false,
          suggestedColor: getAccessibleTextColor(palette[background])
        });
      }
    }
  });

  return issues;
};