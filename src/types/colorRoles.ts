// Color role definitions for template customization
export interface ColorRoles {
  // Background roles
  backgroundPrimary: string;      // Main background
  backgroundSecondary: string;    // Secondary background (cards, panels)
  backgroundTertiary: string;     // Tertiary background (subtle sections)
  backgroundAccent: string;       // Accent background (highlights, features)
  
  // Text roles
  textPrimary: string;           // Main text
  textSecondary: string;         // Secondary text (descriptions, metadata)
  textMuted: string;             // Muted text (placeholders, disabled)
  textInverse: string;           // Text on dark backgrounds
  
  // Interactive element roles
  buttonPrimary: string;         // Primary buttons
  buttonSecondary: string;       // Secondary buttons
  buttonAccent: string;          // Accent buttons
  buttonText: string;            // Button text
  buttonHover: string;           // Button hover state
  
  // Border and outline roles
  borderPrimary: string;         // Main borders
  borderSecondary: string;       // Secondary borders
  borderAccent: string;          // Accent borders
  borderMuted: string;           // Subtle borders
  
  // Surface roles
  surfaceCard: string;           // Card surfaces
  surfaceModal: string;          // Modal surfaces
  surfacePopover: string;        // Popover surfaces
  surfaceInput: string;          // Input field surfaces
  
  // State roles
  stateSuccess: string;          // Success states
  stateWarning: string;          // Warning states
  stateError: string;            // Error states
  stateInfo: string;             // Info states
  
  // Brand roles
  brandPrimary: string;          // Primary brand color
  brandSecondary: string;        // Secondary brand color
  brandAccent: string;           // Brand accent color
  
  // Navigation roles
  navBackground: string;         // Navigation background
  navText: string;               // Navigation text
  navTextActive: string;         // Active navigation text
  navTextHover: string;          // Navigation hover text
  
  // Data visualization roles
  dataPoint1: string;            // First data series
  dataPoint2: string;            // Second data series
  dataPoint3: string;            // Third data series
  dataPoint4: string;            // Fourth data series
}

export type ColorRole = keyof ColorRoles;