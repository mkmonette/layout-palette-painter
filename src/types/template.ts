
export type TemplateType = 
  | 'modern-hero' 
  | 'minimal-header' 
  | 'bold-landing' 
  | 'creative-portfolio'
  | 'gradient-hero'
  | 'split-screen'
  | 'magazine-style'
  | 'startup-landing';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}
