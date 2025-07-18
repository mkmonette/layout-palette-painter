import { TemplateType } from '@/types/template';
import { GeneratedPalette, AdminSettings, DEFAULT_ADMIN_SETTINGS } from '@/types/generator';
import { generateColorScheme, generateColorSchemeWithLocks, ColorMode, ColorPalette } from './colorGenerator';
import { ColorSchemeType } from '@/components/ColorSchemeSelector';

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

// Legacy function for backward compatibility
export const generatePaletteBatchLegacy = (count: number): GeneratedPalette[] => {
  const palettes: GeneratedPalette[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = getRandomTemplate();
    const colorPalette = generateColorScheme('random', 'light');
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

export const generatePaletteBatch = (
  count: number,
  selectedTemplate?: TemplateType,
  selectedScheme?: ColorSchemeType,
  colorMode?: ColorMode,
  basePalette?: ColorPalette,
  selectedMoodId?: string | null
): GeneratedPalette[] => {
  console.log('generatePaletteBatch called with:', { count, selectedTemplate, selectedScheme, colorMode, basePalette, selectedMoodId });
  
  // If legacy usage (only count provided), use legacy function
  if (!selectedTemplate) {
    console.log('Using legacy function (no template provided)');
    return generatePaletteBatchLegacy(count);
  }

  console.log('Using new function with studio settings');
  // New usage with all parameters
  const palettes: GeneratedPalette[] = [];
  
  // Provide defaults if not specified
  const template = selectedTemplate || 'modern-hero';
  const scheme = selectedScheme || 'random';
  const mode = colorMode || 'light';
  const palette = basePalette || {
    brand: '#3B82F6',
    accent: '#F59E0B',
    "button-primary": '#3B82F6',
    "button-text": '#FFFFFF',
    "button-secondary": '#FFFFFF',
    "button-secondary-text": '#10B981',
    "text-primary": '#1F2937',
    "text-secondary": '#6B7280',
    "section-bg-1": '#FFFFFF',
    "section-bg-2": '#F9FAFB',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: '#10B981',
    "input-bg": '#FFFFFF',
    "input-text": '#1F2937'
  };
  
  for (let i = 0; i < count; i++) {
    console.log(`Generating palette ${i + 1} with scheme: ${scheme}, mode: ${mode}, mood: ${selectedMoodId}`);
    
    const colorPalette = generateColorSchemeWithLocks(
      scheme, 
      mode, 
      palette, 
      new Set(), // No locked colors for auto-generation
      false, 
      selectedMoodId || undefined
    );
    
    console.log(`Generated palette ${i + 1}:`, colorPalette);
    
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
      templateId: template,
      templateName: template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
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