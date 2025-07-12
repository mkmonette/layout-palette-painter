import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';
import { getContrastTextForHSL } from './contrastUtils';
import { getReadableTextColor } from './colorUtils';
import chroma from 'chroma-js';

/**
 * Maps a ColorPalette to extended ColorRoles with dual role system:
 * - Material-style on* roles (source of truth for text colors)
 * - Legacy roles (derived from on* roles for compatibility)
 */
export const mapPaletteToRoles = (palette: ColorPalette): ColorRoles => {
  // Start with the base palette
  const roleMap = { ...palette } as ColorRoles;
  
  // Step 1: Generate Material-style on* roles using getReadableTextColor
  // These are the source of truth for text/foreground colors
  
  // Brand and accent colors
  roleMap.onBrand = getReadableTextColor(roleMap.brand);
  roleMap.onAccent = getReadableTextColor(roleMap.accent);
  roleMap.onHighlight = getReadableTextColor(roleMap.highlight);
  
  // Button backgrounds
  roleMap.onPrimary = getReadableTextColor(roleMap['button-primary']);
  roleMap.onSecondary = getReadableTextColor(roleMap['button-secondary']);
  
  // Section backgrounds
  roleMap.onBg1 = getReadableTextColor(roleMap['section-bg-1']);
  roleMap.onBg2 = getReadableTextColor(roleMap['section-bg-2']);
  roleMap.onBg3 = roleMap['section-bg-3'] ? getReadableTextColor(roleMap['section-bg-3']) : roleMap.onBg2;
  
  // Input background
  roleMap.onInput = getReadableTextColor(roleMap['input-bg']);
  
  // Step 2: Map legacy text roles to the new on* roles (for compatibility)
  // Legacy roles are now derived from on* roles, ensuring consistency
  
  // Button text roles
  roleMap['button-text'] = roleMap.onPrimary;
  roleMap['button-secondary-text'] = roleMap.onSecondary;
  
  // General text roles
  roleMap['text-primary'] = roleMap.onBg1;
  roleMap['text-secondary'] = roleMap.onBg2;
  
  // Input text role
  roleMap['input-text'] = roleMap.onInput;
  
  return roleMap;
};


/**
 * Hook for using color roles in components with legacy aliases
 * Now uses the dual role system from mapPaletteToRoles
 */
export const useColorRoles = (palette: ColorPalette) => {
  const roles = mapPaletteToRoles(palette);
  
  // Use the on* roles as source of truth for text colors
  const enhancedRoles = {
    ...roles,
    // Ensure legacy text roles are properly mapped
    "text-primary": roles.onBg1,
    "text-secondary": roles.onBg2,
    "button-text": roles.onPrimary,
    "button-secondary-text": roles.onSecondary,
    "input-text": roles.onInput,
  };
  
  // Add legacy aliases for templates that haven't been migrated yet
  return {
    ...enhancedRoles,
    // Core legacy aliases using on* roles
    primary: palette.brand,
    secondary: palette.highlight, 
    background: palette["section-bg-1"],
    text: roles.onBg1,
    textLight: roles.onBg1 + '80', // Add transparency
    
    // Pro template aliases using on* roles for consistency
    backgroundPrimary: palette["section-bg-1"],
    backgroundSecondary: palette["section-bg-2"], 
    backgroundAccent: palette["section-bg-3"],
    textPrimary: roles.onBg1,
    textSecondary: roles.onBg1 + '90', // Less transparency for better readability
    textInverse: roles.onPrimary,
    textMuted: roles.onBg1 + '75', // Less transparency for better readability
    textOnBackground: roles.onBg1,
    textOnSurface: roles.onBg2,
    brandPrimary: palette.brand,
    brandAccent: palette.accent,
    buttonPrimary: palette["button-primary"],
    buttonText: roles.onPrimary,
    buttonSecondary: palette["button-secondary"],
    buttonSecondaryText: roles.onSecondary,
    borderMuted: palette.border,
    borderPrimary: palette.border,
    borderSecondary: palette.border,
    borderAccent: palette.accent,
    surfaceCard: palette["section-bg-2"],
    surfaceInput: palette["input-bg"],
    navBackground: palette["section-bg-1"],
    navText: roles.onBg1,
    navTextActive: palette.brand,
    // Heading colors using on* roles
    headingPrimary: roles.onBg1,
    headingSecondary: roles.onBg2,
    headingTertiary: roles.onBg3,
    // Label colors using on* roles
    labelPrimary: roles.onBg1,
    labelSecondary: roles.onBg1 + '90',
    // Paragraph colors using on* roles
    paragraphPrimary: roles.onBg1,
    paragraphSecondary: roles.onBg1 + '85',
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