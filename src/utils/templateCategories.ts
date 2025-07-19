import { Template, TemplateCategory } from '@/types/template';

// Hero-Header Templates: Focused on header/hero sections
export const heroHeaderTemplates: Template[] = [
  {
    id: 'modern-hero',
    name: 'Modern Hero',
    description: 'Clean hero section with centered content',
    isPro: false,
    category: 'hero-header'
  },
  {
    id: 'minimal-header',
    name: 'Minimal Header',
    description: 'Simple header with navigation',
    isPro: false,
    category: 'hero-header'
  },
  {
    id: 'gradient-hero',
    name: 'Gradient Hero',
    description: 'Modern gradient background with floating elements',
    isPro: false,
    category: 'hero-header'
  },
  {
    id: 'advanced-hero',
    name: 'Advanced Hero',
    description: 'Sophisticated header design with premium typography and visual elements',
    isPro: true,
    category: 'hero-header'
  }
];

// Full Template: Complete page layouts
export const fullTemplates: Template[] = [
  {
    id: 'bold-landing',
    name: 'Bold Landing',
    description: 'Eye-catching landing page design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Artistic portfolio layout',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    description: 'Dynamic split layout with image showcase',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'magazine-style',
    name: 'Magazine Style',
    description: 'Editorial design with typography focus',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'startup-landing',
    name: 'Startup Landing',
    description: 'Tech startup focused design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    description: 'Modern tech company with glassmorphism',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'Bold creative studio design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'Clean SaaS landing with features',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-landing',
    name: 'E-commerce Landing',
    description: 'Product-focused e-commerce design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-product-showcase',
    name: 'Product Showcase',
    description: 'Feature products with detailed views',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-minimal-store',
    name: 'Minimal Store',
    description: 'Clean, minimal e-commerce design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-fashion-boutique',
    name: 'Fashion Boutique',
    description: 'Elegant fashion store template',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-tech-store',
    name: 'Tech Store',
    description: 'Electronics and gadgets store',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'ecommerce-marketplace',
    name: 'Marketplace',
    description: 'Multi-vendor marketplace design',
    isPro: false,
    category: 'full-template'
  },
  {
    id: 'pro-cosmetics',
    name: 'Pro Cosmetics',
    description: 'Premium beauty and cosmetics template with elegant product showcase',
    isPro: true,
    category: 'full-template'
  },
  {
    id: 'modern-executive',
    name: 'Modern Executive',
    description: 'Professional business template with strategic design and authority',
    isPro: true,
    category: 'full-template'
  },
  {
    id: 'creative-showcase',
    name: 'Creative Showcase',
    description: 'Dynamic creative template with artistic layouts and bold visuals',
    isPro: true,
    category: 'full-template'
  },
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'Cutting-edge technology template with futuristic design elements',
    isPro: true,
    category: 'full-template'
  },
  {
    id: 'luxury-brand',
    name: 'Luxury Brand',
    description: 'Premium luxury template with sophisticated elegance and refinement',
    isPro: true,
    category: 'full-template'
  },
  {
    id: 'startup-vision',
    name: 'Startup Vision',
    description: 'Dynamic startup template with growth-focused design and innovation',
    isPro: true,
    category: 'full-template'
  }
];

// Combined arrays for easy access
export const freeTemplates = [...heroHeaderTemplates, ...fullTemplates].filter(t => !t.isPro);
export const proTemplates = [...heroHeaderTemplates, ...fullTemplates].filter(t => t.isPro);
export const allTemplates = [...heroHeaderTemplates, ...fullTemplates];

// Helper functions
export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  return allTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return allTemplates.find(template => template.id === id);
};

export const getTemplatesByType = (isPro: boolean): Template[] => {
  return allTemplates.filter(template => template.isPro === isPro);
};