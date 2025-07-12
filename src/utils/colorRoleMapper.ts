import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';
import { getContrastTextForHSL } from './contrastUtils';
import { getReadableTextColor } from './colorUtils';
import chroma from 'chroma-js';

/**
 * Maps a ColorPalette to extended ColorRoles with automatic contrast fixing
 */
export const mapPaletteToRoles = (palette: ColorPalette): ColorRoles => {
  // Create a copy of the palette with contrast-fixed text colors
  const fixedPalette = { ...palette };
  
  // Apply contrast fixes to all text-related roles
  const textBgPairs = [
    { textKey: 'text-primary', bgKey: 'section-bg-1' },
    { textKey: 'text-secondary', bgKey: 'section-bg-1' },
    { textKey: 'text-onBackground', bgKey: 'section-bg-1' },
    { textKey: 'text-onSurface', bgKey: 'section-bg-2' },
    { textKey: 'button-text', bgKey: 'button-primary' },
    { textKey: 'button-secondary-text', bgKey: 'button-secondary' },
    { textKey: 'input-text', bgKey: 'input-bg' },
  ];
  
  textBgPairs.forEach(({ textKey, bgKey }) => {
    if (fixedPalette[textKey] && fixedPalette[bgKey]) {
      fixedPalette[textKey] = getReadableTextColor(
        fixedPalette[bgKey], 
        fixedPalette[textKey]
      );
    }
  });
  
  return fixedPalette;
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