// Extended color role definitions for modern website templates
export interface ColorRoles {
  brand: string;                    // Website name or logo text
  accent: string;                   // Highlighted text, links, or icons
  "button-primary": string;         // Main CTA button background color
  "button-text": string;           // Text color for primary buttons (high contrast)
  "button-secondary": string;      // Background for secondary/outline buttons
  "button-secondary-text": string; // Text color for secondary buttons
  "text-primary": string;          // Main body or content text
  "text-secondary": string;        // Muted text, subtext, captions
  "section-bg-1": string;          // Background for hero or top sections
  "section-bg-2": string;          // Background for mid-page sections
  "section-bg-3": string;          // Background for footer or bottom CTA sections
  border: string;                   // Borders, outlines, dividers
  highlight: string;                // Badges, tags, decorative indicators
  "input-bg": string;              // Background color for form input fields
  "input-text": string;            // Text color inside input fields
  
  // Material-style on* roles for text/foreground colors
  onBrand?: string;                 // Text color for brand backgrounds
  onAccent?: string;                // Text color for accent backgrounds
  onHighlight?: string;             // Text color for highlight backgrounds
  onPrimary?: string;               // Text color for primary button backgrounds
  onSecondary?: string;             // Text color for secondary button backgrounds
  onBg1?: string;                   // Text color for section-bg-1
  onBg2?: string;                   // Text color for section-bg-2
  onBg3?: string;                   // Text color for section-bg-3
  onInput?: string;                 // Text color for input backgrounds
}

export type ColorRole = keyof ColorRoles;