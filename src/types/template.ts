
export type TemplateType = 
  | 'modern-hero' 
  | 'minimal-header' 
  | 'bold-landing' 
  | 'creative-portfolio'
  | 'gradient-hero'
  | 'split-screen'
  | 'magazine-style'
  | 'startup-landing'
  | 'tech-startup'
  | 'creative-agency'
  | 'saas-product'
  | 'ecommerce-landing'
  | 'pro-dashboard'
  | 'pro-analytics'
  | 'pro-multimedia'
  | 'pro-interactive'
  | 'pro-enterprise'
  | 'pro-premium'
  | 'pro-organic-food'
  | 'pro-cosmetics';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  isPro: boolean;
}
