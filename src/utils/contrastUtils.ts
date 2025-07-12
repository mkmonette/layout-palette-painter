/**
 * Utility functions for color contrast and accessibility
 */

/**
 * Calculate relative luminance of a color according to WCAG guidelines
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  const sRGB = [r, g, b].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors according to WCAG guidelines
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const L1 = getLuminance(hex1);
  const L2 = getLuminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
function meetsWCAGAA(bgHex: string, textHex: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(bgHex, textHex);
  const minRatio = isLargeText ? 3.0 : 4.5;
  return ratio >= minRatio;
}

/**
 * Get WCAG AA compliant text color for a given background
 */
export function getContrastText(bgColorHex: string, isLargeText = false): string {
  const cleanBg = bgColorHex.replace('#', '').padStart(6, '0');
  const bgHex = `#${cleanBg}`;
  
  const bgLuminance = getLuminance(bgHex);
  const minRatio = isLargeText ? 3.0 : 4.5;
  
  // For light backgrounds (luminance > 0.5), prefer strong dark colors
  if (bgLuminance > 0.5) {
    // Try progressively darker colors for better readability on light backgrounds
    const darkColors = ['#1a1a1a', '#2d2d2d', '#404040', '#000000'];
    for (const darkColor of darkColors) {
      if (meetsWCAGAA(bgHex, darkColor, isLargeText)) {
        return darkColor;
      }
    }
  } else {
    // For dark backgrounds, try white first, then lighter colors
    const lightColors = ['#ffffff', '#f5f5f5', '#e5e5e5', '#d4d4d4'];
    for (const lightColor of lightColors) {
      if (meetsWCAGAA(bgHex, lightColor, isLargeText)) {
        return lightColor;
      }
    }
  }
  
  // Fallback: calculate exact luminance needed
  let targetLuminance: number;
  if (bgLuminance > 0.5) {
    // Background is light, we need dark text
    targetLuminance = (bgLuminance + 0.05) / minRatio - 0.05;
    // Ensure we get a dark enough color for light backgrounds
    targetLuminance = Math.min(targetLuminance, 0.15);
  } else {
    // Background is dark, we need light text
    targetLuminance = (bgLuminance + 0.05) * minRatio - 0.05;
    // Ensure we get a light enough color for dark backgrounds
    targetLuminance = Math.max(targetLuminance, 0.85);
  }
  
  // Clamp luminance and convert back to hex
  targetLuminance = Math.max(0, Math.min(1, targetLuminance));
  
  // Convert luminance to RGB (simplified grayscale approach)
  const gamma = targetLuminance <= 0.03928 
    ? targetLuminance * 12.92 
    : Math.pow((targetLuminance + 0.055) / 1.055, 1 / 2.4);
  
  const value = Math.round(gamma * 255);
  const hex = value.toString(16).padStart(2, '0');
  
  return `#${hex}${hex}${hex}`;
}

/**
 * Converts HSL color string to hex format for contrast calculation
 */
export function hslToHex(hsl: string): string {
  // Handle different HSL formats: "220 13% 18%" or "hsl(220, 13%, 18%)" or just hex
  if (hsl.startsWith('#')) return hsl;
  
  let match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) {
    // Try hsl() format
    match = hsl.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  }
  if (!match) {
    console.warn('Could not parse HSL color:', hsl);
    return '#000000';
  }
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Gets contrast text color for HSL color values
 */
export function getContrastTextForHSL(hslColor: string): string {
  const hexColor = hslToHex(hslColor);
  return getContrastText(hexColor);
}