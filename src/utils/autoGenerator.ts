import { TemplateType } from '@/types/template';
import { GeneratedPalette, AdminSettings, DEFAULT_ADMIN_SETTINGS } from '@/types/generator';
import { generateColorScheme } from './colorGenerator';

const TEMPLATES: { id: TemplateType; name: string }[] = [
  { id: 'modern-hero', name: 'Modern Hero' },
  { id: 'minimal-header', name: 'Minimal Header' },
  { id: 'bold-landing', name: 'Bold Landing' },
  { id: 'creative-portfolio', name: 'Creative Portfolio' },
  { id: 'gradient-hero', name: 'Gradient Hero' },
  { id: 'split-screen', name: 'Split Screen' },
  { id: 'magazine-style', name: 'Magazine Style' },
  { id: 'startup-landing', name: 'Startup Landing' },
  { id: 'tech-startup', name: 'Tech Startup' },
  { id: 'creative-agency', name: 'Creative Agency' },
  { id: 'saas-product', name: 'SaaS Product' },
  { id: 'ecommerce-landing', name: 'Ecommerce Landing' },
];

export const getRandomTemplate = (): { id: TemplateType; name: string } => {
  return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
};

export const generatePaletteBatch = (count: number): GeneratedPalette[] => {
  const palettes: GeneratedPalette[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = getRandomTemplate();
    const colorPalette = generateColorScheme('random', false);
    const colors = [
      colorPalette.brand,
      colorPalette.highlight,
      colorPalette.accent,
      colorPalette["section-bg-1"],
      colorPalette["text-primary"],
    ];
    
    palettes.push({
      id: `${Date.now()}-${i}`,
      timestamp: new Date().toISOString(),
      colors,
      templateId: template.id,
      templateName: template.name,
    });
  }
  
  return palettes;
};

export const savePaletteHistory = (palettes: GeneratedPalette[]): void => {
  try {
    const existing = getPaletteHistory();
    const updated = [...existing, ...palettes];
    localStorage.setItem('palette_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving palette history:', error);
  }
};

export const getPaletteHistory = (): GeneratedPalette[] => {
  try {
    const stored = localStorage.getItem('palette_history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading palette history:', error);
    return [];
  }
};

export const getFilteredPaletteHistory = (retentionDays: number): GeneratedPalette[] => {
  const history = getPaletteHistory();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  return history.filter(palette => new Date(palette.timestamp) >= cutoffDate);
};

export const getAdminSettings = (): AdminSettings => {
  try {
    const stored = localStorage.getItem('admin_settings');
    return stored ? { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(stored) } : DEFAULT_ADMIN_SETTINGS;
  } catch (error) {
    console.error('Error loading admin settings:', error);
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const saveAdminSettings = (settings: AdminSettings): void => {
  try {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving admin settings:', error);
  }
};

export const clearPaletteHistory = (): void => {
  try {
    localStorage.removeItem('palette_history');
  } catch (error) {
    console.error('Error clearing palette history:', error);
  }
};