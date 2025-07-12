import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';
import { getContrastTextForHSL } from './contrastUtils';
import { getReadableTextColor } from './colorUtils';
import chroma from 'chroma-js';

/**
 * Maps a ColorPalette to extended ColorRoles with automatic contrast fixing
 */
export const mapPaletteToRoles = (palette: ColorPalette): ColorRoles => {
  // Start with the base palette
  const roleMap = { ...palette } as ColorRoles;
  
  // Generate Material-style on* roles using getReadableTextColor
  roleMap.onBrand = getReadableTextColor(roleMap.brand);
  roleMap.onAccent = getReadableTextColor(roleMap.accent);
  roleMap.onHighlight = getReadableTextColor(roleMap.highlight);
  
  roleMap.onPrimary = getReadableTextColor(roleMap['button-primary']);
  roleMap.onSecondary = getReadableTextColor(roleMap['button-secondary']);
  
  roleMap.onBg1 = getReadableTextColor(roleMap['section-bg-1']);
  roleMap.onBg2 = getReadableTextColor(roleMap['section-bg-2']);
  roleMap.onBg3 = roleMap['section-bg-3'] ? getReadableTextColor(roleMap['section-bg-3']) : getReadableTextColor(roleMap['section-bg-2']);
  
  roleMap.onInput = getReadableTextColor(roleMap['input-bg']);
  
  // Update legacy roles to use the new on* roles for consistency
  roleMap['button-text'] = roleMap.onPrimary;
  roleMap['button-secondary-text'] = roleMap.onSecondary;
  roleMap['text-primary'] = roleMap.onBg1;
  roleMap['text-secondary'] = roleMap.onBg2;
  roleMap['input-text'] = roleMap.onInput;
  
  return roleMap;
};


/**
 * Hook for using color roles in components with legacy aliases and automatic contrast
 */
export const useColorRoles = (palette: ColorPalette) => {
  const roles = mapPaletteToRoles(palette);
  
  // Calculate high-contrast text colors for each section background
  const getContrastTextChroma = (bgColor: string): string => {
    return getReadableTextColor(bgColor);
  };
  
  const sectionBg1TextColor = getContrastTextChroma(palette["section-bg-1"]);
  const sectionBg2TextColor = getContrastTextChroma(palette["section-bg-2"]);
  const sectionBg3TextColor = palette["section-bg-3"] ? getContrastTextChroma(palette["section-bg-3"]) : sectionBg2TextColor;
  const buttonPrimaryTextColor = getContrastTextChroma(palette["button-primary"]);
  const cardBackgroundTextColor = getContrastTextChroma(palette["section-bg-2"]);
  
  // The roles already have contrast-fixed colors from mapPaletteToRoles
  const enhancedRoles = {
    ...roles,
    // Additional overrides for legacy compatibility
    "text-primary": roles["text-primary"] || sectionBg1TextColor,
    "text-secondary": roles["text-secondary"] || sectionBg1TextColor,
    "text-onBackground": roles["text-onBackground"] || sectionBg1TextColor,
    "text-onSurface": roles["text-onSurface"] || cardBackgroundTextColor,
    "button-text": roles["button-text"] || buttonPrimaryTextColor,
    "input-text": roles["input-text"] || getReadableTextColor(palette["input-bg"]),
  };
  
  // Add legacy aliases for templates that haven't been migrated yet
  return {
    ...enhancedRoles,
    // Core legacy aliases with contrast-safe text
    primary: palette.brand,
    secondary: palette.highlight, 
    background: palette["section-bg-1"],
    text: sectionBg1TextColor,
    textLight: sectionBg1TextColor + '80', // Add transparency
    
    // Pro template aliases with high-contrast text colors
    backgroundPrimary: palette["section-bg-1"],
    backgroundSecondary: palette["section-bg-2"], 
    backgroundAccent: palette["section-bg-3"],
    textPrimary: sectionBg1TextColor,
    textSecondary: sectionBg1TextColor + '90', // Less transparency for better readability
    textInverse: buttonPrimaryTextColor,
    textMuted: sectionBg1TextColor + '75', // Less transparency for better readability
    textOnBackground: sectionBg1TextColor,
    textOnSurface: cardBackgroundTextColor,
    brandPrimary: palette.brand,
    brandAccent: palette.accent,
    buttonPrimary: palette["button-primary"],
    buttonText: buttonPrimaryTextColor,
    buttonSecondary: palette["button-secondary"],
    buttonSecondaryText: getReadableTextColor(palette["button-secondary"]),
    borderMuted: palette.border,
    borderPrimary: palette.border,
    borderSecondary: palette.border,
    borderAccent: palette.accent,
    surfaceCard: palette["section-bg-2"],
    surfaceInput: palette["input-bg"],
    navBackground: palette["section-bg-1"],
    navText: sectionBg1TextColor,
    navTextActive: palette.brand,
    // Heading colors - ensure high contrast
    headingPrimary: sectionBg1TextColor,
    headingSecondary: sectionBg2TextColor,
    headingTertiary: sectionBg3TextColor,
    // Label colors - ensure high contrast
    labelPrimary: sectionBg1TextColor,
    labelSecondary: sectionBg1TextColor + '90',
    // Paragraph colors - ensure high contrast
    paragraphPrimary: sectionBg1TextColor,
    paragraphSecondary: sectionBg1TextColor + '85',
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