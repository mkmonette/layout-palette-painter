/**
 * Utility functions for color contrast and accessibility
 */

/**
 * Determines if a text color provides good contrast against a background color
 * using YIQ brightness calculation
 */
export function getContrastText(bgColorHex: string): string {
  // Remove # if present
  const hex = bgColorHex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using YIQ formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Converts HSL color string to hex format for contrast calculation
 */
export function hslToHex(hsl: string): string {
  // Extract H, S, L values from hsl string like "220 13% 18%"
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return '#000000';
  
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