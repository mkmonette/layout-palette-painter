import chroma from 'chroma-js';

/**
 * Ensures text color has sufficient contrast against background
 * @param bgColor - Background color (hex, rgb, hsl, etc.)
 * @param textColor - Original text color (defaults to black)
 * @param minContrast - Minimum contrast ratio (defaults to 4.5 for WCAG AA)
 * @returns Readable text color with sufficient contrast
 */
export function getReadableTextColor(
  bgColor: string, 
  textColor: string = '#000000', 
  minContrast: number = 4.5
): string {
  try {
    const contrast = chroma.contrast(bgColor, textColor);
    
    // If contrast is sufficient, return original text color
    if (contrast >= minContrast) {
      return textColor;
    }
    
    // If contrast is insufficient, return high-contrast color
    return chroma(bgColor).luminance() > 0.6 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.warn('Invalid color input:', bgColor, textColor, error);
    // Fallback to black for safety
    return '#000000';
  }
}

/**
 * Utility functions for color manipulation
 */
export function lightenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function addOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}