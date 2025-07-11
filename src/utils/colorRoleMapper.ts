import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';
import { getContrastTextForHSL } from './contrastUtils';

/**
 * Maps a ColorPalette to extended ColorRoles for modern website templates
 */
export const mapPaletteToRoles = (palette: ColorPalette): ColorRoles => {
  // Since the new ColorPalette already contains the role keys, we can return it directly
  return palette;
};

/**
 * Utility functions for color manipulation
 */
function lightenColor(color: string, amount: number): string {
  // Simple lightening by mixing with white
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function darkenColor(color: string, amount: number): string {
  // Simple darkening by reducing RGB values
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function addOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Hook for using color roles in components with legacy aliases and automatic contrast
 */
export const useColorRoles = (palette: ColorPalette) => {
  const roles = mapPaletteToRoles(palette);
  
  // Calculate contrast-safe text colors for each section
  const sectionBg1TextColor = getContrastTextForHSL(palette["section-bg-1"]);
  const sectionBg2TextColor = getContrastTextForHSL(palette["section-bg-2"]);
  const sectionBg3TextColor = palette["section-bg-3"] ? getContrastTextForHSL(palette["section-bg-3"]) : sectionBg2TextColor;
  
  // Add legacy aliases for templates that haven't been migrated yet
  return {
    ...roles,
    // Core legacy aliases with contrast-safe text
    primary: palette.brand,
    secondary: palette.highlight, 
    background: palette["section-bg-1"],
    text: sectionBg1TextColor,
    textLight: sectionBg1TextColor + '80', // Add transparency
    
    // Pro template aliases with contrast-safe text
    backgroundPrimary: palette["section-bg-1"],
    backgroundSecondary: palette["section-bg-2"], 
    backgroundAccent: palette["section-bg-3"],
    textPrimary: sectionBg1TextColor,
    textSecondary: sectionBg1TextColor + '80', // Add transparency for secondary text
    textInverse: getContrastTextForHSL(palette["button-primary"]),
    textMuted: sectionBg1TextColor + '60', // More transparency for muted text
    brandPrimary: palette.brand,
    brandAccent: palette.accent,
    buttonPrimary: palette["button-primary"],
    buttonText: palette["button-text"],
    buttonSecondary: palette["button-secondary"],
    borderMuted: palette.border,
    borderPrimary: palette.border,
    borderSecondary: palette.border,
    borderAccent: palette.accent,
    surfaceCard: palette["section-bg-2"],
    surfaceInput: palette["input-bg"],
    navBackground: palette["section-bg-1"],
    navText: palette["text-primary"],
    navTextActive: palette.brand,
    dataPoint1: palette.brand,
    dataPoint2: palette.accent, 
    dataPoint3: palette.highlight,
    dataPoint4: palette["button-secondary"],
    brandSecondary: palette.highlight,
    stateSuccess: '#10B981',
    stateWarning: '#F59E0B',
    stateError: '#EF4444',
    stateInfo: palette.accent
  };
};