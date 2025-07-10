import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';

/**
 * Maps a ColorPalette to comprehensive ColorRoles for template customization
 */
export const mapPaletteToRoles = (palette: ColorPalette): ColorRoles => {
  return {
    // Background roles
    backgroundPrimary: palette.background,
    backgroundSecondary: lightenColor(palette.background, 0.02),
    backgroundTertiary: lightenColor(palette.background, 0.04),
    backgroundAccent: addOpacity(palette.accent, 0.1),
    
    // Text roles
    textPrimary: palette.text,
    textSecondary: palette.textLight,
    textMuted: addOpacity(palette.textLight, 0.6),
    textInverse: palette.background,
    
    // Interactive element roles
    buttonPrimary: palette.primary,
    buttonSecondary: palette.secondary,
    buttonAccent: palette.accent,
    buttonText: palette.background,
    buttonHover: darkenColor(palette.primary, 0.1),
    
    // Border and outline roles
    borderPrimary: addOpacity(palette.text, 0.2),
    borderSecondary: addOpacity(palette.textLight, 0.15),
    borderAccent: palette.accent,
    borderMuted: addOpacity(palette.textLight, 0.08),
    
    // Surface roles
    surfaceCard: lightenColor(palette.background, 0.02),
    surfaceModal: palette.background,
    surfacePopover: lightenColor(palette.background, 0.03),
    surfaceInput: lightenColor(palette.background, 0.01),
    
    // State roles
    stateSuccess: '#10b981',
    stateWarning: '#f59e0b',
    stateError: '#ef4444',
    stateInfo: palette.accent,
    
    // Brand roles
    brandPrimary: palette.primary,
    brandSecondary: palette.secondary,
    brandAccent: palette.accent,
    
    // Navigation roles
    navBackground: palette.primary,
    navText: addOpacity(palette.background, 0.8),
    navTextActive: palette.background,
    navTextHover: addOpacity(palette.background, 0.9),
    
    // Data visualization roles
    dataPoint1: palette.primary,
    dataPoint2: palette.secondary,
    dataPoint3: palette.accent,
    dataPoint4: lightenColor(palette.accent, 0.2),
  };
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
 * Hook for using color roles in components
 */
export const useColorRoles = (palette: ColorPalette) => {
  return mapPaletteToRoles(palette);
};