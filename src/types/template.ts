
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
  | 'ecommerce-product-showcase'
  | 'ecommerce-minimal-store'
  | 'ecommerce-fashion-boutique'
  | 'ecommerce-tech-store'
  | 'ecommerce-marketplace'
  | 'pro-cosmetics'
  | 'advanced-hero'
  | 'modern-executive'
  | 'creative-showcase'
  | 'tech-innovation'
  | 'luxury-brand'
  | 'startup-vision'
  | 'professional-hero';

export interface ColorPalette {
  brand: string;
  accent: string;
  "button-primary": string;
  "button-text": string;
  "button-secondary": string;
  "button-secondary-text": string;
  "text-primary": string;
  "text-secondary": string;
  "section-bg-1": string;
  "section-bg-2": string;
  "section-bg-3": string;
  border: string;
  highlight: string;
  "input-bg": string;
  "input-text": string;
}

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  isPro: boolean;
}
