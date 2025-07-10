import { ColorPalette } from './colorGenerator';

export interface ContrastResult {
  ratio: number;
  isAccessible: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
}

export interface AccessibilityReport {
  primaryOnBackground: ContrastResult;
  textOnBackground: ContrastResult;
  textLightOnBackground: ContrastResult;
  textOnPrimary: ContrastResult;
  textOnSecondary: ContrastResult;
  textOnAccent: ContrastResult;
  overallAccessible: boolean;
}

/**
 * Calculate relative luminance of a color
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // Convert to relative luminance
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

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
 * Evaluate contrast ratio against WCAG standards
 */
export const evaluateContrast = (ratio: number, isLargeText: boolean = false): ContrastResult => {
  const normalThreshold = 4.5;
  const largeThreshold = 3.0;
  const aaaThreshold = 7.0;
  const aaaLargeThreshold = 4.5;
  
  const threshold = isLargeText ? largeThreshold : normalThreshold;
  const aaaLevel = isLargeText ? aaaLargeThreshold : aaaThreshold;
  
  let level: 'AA' | 'AAA' | 'FAIL';
  
  if (ratio >= aaaLevel) {
    level = 'AAA';
  } else if (ratio >= threshold) {
    level = 'AA';
  } else {
    level = 'FAIL';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    isAccessible: ratio >= threshold,
    level
  };
};

/**
 * Generate accessibility report for a color palette
 */
export const generateAccessibilityReport = (palette: ColorPalette): AccessibilityReport => {
  const primaryOnBackground = evaluateContrast(getContrastRatio(palette.primary, palette.background));
  const textOnBackground = evaluateContrast(getContrastRatio(palette.text, palette.background));
  const textLightOnBackground = evaluateContrast(getContrastRatio(palette.textLight, palette.background));
  const textOnPrimary = evaluateContrast(getContrastRatio(palette.text, palette.primary));
  const textOnSecondary = evaluateContrast(getContrastRatio(palette.text, palette.secondary));
  const textOnAccent = evaluateContrast(getContrastRatio(palette.text, palette.accent));
  
  // Check if all critical pairings are accessible
  const overallAccessible = 
    textOnBackground.isAccessible &&
    textLightOnBackground.isAccessible &&
    textOnPrimary.isAccessible;
  
  return {
    primaryOnBackground,
    textOnBackground,
    textLightOnBackground,
    textOnPrimary,
    textOnSecondary,
    textOnAccent,
    overallAccessible
  };
};

/**
 * Check if a palette meets accessibility requirements
 */
export const isPaletteAccessible = (palette: ColorPalette): boolean => {
  const report = generateAccessibilityReport(palette);
  return report.overallAccessible;
};