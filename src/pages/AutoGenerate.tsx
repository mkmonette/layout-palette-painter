import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Clock, Save, Calendar, RefreshCw, Settings, Eye, Moon, Sun, ZoomIn, ZoomOut, RotateCcw, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { TemplateType, ColorPalette, Template } from '@/types/template';
import { GeneratedPalette } from '@/types/generator';
import { generatePaletteBatch, getAdminSettings } from '@/utils/autoGenerator';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import LivePreview from '@/components/LivePreview';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import ColorMoodSelector from '@/components/ColorMoodSelector';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { generateColorScheme, generateColorSchemeWithLocks } from '@/utils/colorGenerator';
import { generateColorPalettePDF } from '@/utils/pdfGenerator';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useDownloadLimits } from '@/hooks/useDownloadLimits';
import ProUpsellModal from '@/components/ProUpsellModal';
import AdminPresetsModal from '@/components/AdminPresetsModal';
import MoreOptionsDropdown from '@/components/MoreOptionsDropdown';
import BackgroundCustomizer, { type BackgroundSettings } from '@/components/BackgroundCustomizer';

// Template definitions (reusing from TemplateSelector)
const allTemplates: Template[] = [
  { id: 'modern-hero', name: 'Modern Hero', description: 'Clean hero section with centered content', isPro: false },
  { id: 'minimal-header', name: 'Minimal Header', description: 'Simple header with navigation', isPro: false },
  { id: 'bold-landing', name: 'Bold Landing', description: 'Eye-catching landing page design', isPro: false },
  { id: 'creative-portfolio', name: 'Creative Portfolio', description: 'Artistic portfolio layout', isPro: false },
  { id: 'gradient-hero', name: 'Gradient Hero', description: 'Modern gradient background with floating elements', isPro: false },
  { id: 'split-screen', name: 'Split Screen', description: 'Dynamic split layout with image showcase', isPro: false },
  { id: 'magazine-style', name: 'Magazine Style', description: 'Editorial design with typography focus', isPro: false },
  { id: 'startup-landing', name: 'Startup Landing', description: 'Tech startup focused design', isPro: false },
  { id: 'tech-startup', name: 'Tech Startup', description: 'Modern tech company with glassmorphism', isPro: false },
  { id: 'creative-agency', name: 'Creative Agency', description: 'Bold creative studio design', isPro: false },
  { id: 'saas-product', name: 'SaaS Product', description: 'Clean SaaS landing with features', isPro: false },
  { id: 'ecommerce-landing', name: 'E-commerce Landing', description: 'Product-focused e-commerce design', isPro: false }
];

const AutoGenerate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPro } = useFeatureAccess();
  const { canDownload, getRemainingDownloads, incrementDownload } = useDownloadLimits();
  const { savePalette, canSaveMore, getSavedCount, loadSavedPalettes, MAX_PALETTES } = useSavedPalettes();

  // Global settings from Dashboard
  const [globalSettings, setGlobalSettings] = useState(() => {
    const stored = localStorage.getItem('autogenerate-global-settings');
    return stored ? JSON.parse(stored) : {
      template: 'modern-hero',
      scheme: 'random',
      isDarkMode: false,
      count: 10,
      palette: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
        textLight: '#6B7280'
      }
    };
  });

  // Local state for controls
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(globalSettings.template);
  const [isDarkMode, setIsDarkMode] = useState(globalSettings.isDarkMode);
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>(globalSettings.scheme);
  const [colorPalette, setColorPalette] = useState<ColorPalette>(globalSettings.palette);
  const [autogenerateCount, setAutogenerateCount] = useState(globalSettings.count);
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);
  const [adminSettings] = useState(getAdminSettings());
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; feature: string }>({ isOpen: false, feature: '' });
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    enabled: false,
    mode: 'svg',
    style: 'wavy-layers',
    waveHeight: 50,
    blobSize: 50,
    meshIntensity: 50,
    patternScale: 50,
    opacity: 0.3,
    gradientFillType: 'gradient',
    gradientStartColor: 'section-bg-1',
    gradientEndColor: 'accent',
    gradientDirection: 'horizontal',
  });

  // Removed auto-generation on mount to allow users to adjust settings first

  useEffect(() => {
    const updateCount = () => {
      setSavedPalettesCount(getSavedCount());
    };
    
    updateCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSavedPalettes();
      updateCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getSavedCount, loadSavedPalettes]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Update global settings with current state
    const currentSettings = {
      template: selectedTemplate,
      scheme: selectedScheme,
      isDarkMode,
      count: autogenerateCount,
      palette: colorPalette
    };
    
    localStorage.setItem('autogenerate-global-settings', JSON.stringify(currentSettings));
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const newPalettes = generatePaletteBatch(autogenerateCount).map(palette => ({
        ...palette,
        templateId: selectedTemplate,
        templateName: allTemplates.find(t => t.id === selectedTemplate)?.name || selectedTemplate
      }));
      
      setGeneratedPalettes(newPalettes);
      setSelectedPaletteIndex(0);
      setIsGenerating(false);
      
      toast({
        title: "Palettes Generated!",
        description: `Generated ${autogenerateCount} color palettes for ${allTemplates.find(t => t.id === selectedTemplate)?.name}`,
      });
    }, 1500);
  };

  const handleSavePalette = (palette: GeneratedPalette) => {
    const colorPalette: ColorPalette = {
      brand: palette.colors[0],
      accent: palette.colors[2],
      "button-primary": palette.colors[0],
      "button-text": palette.colors[3],
      "button-secondary": palette.colors[3],
      "button-secondary-text": palette.colors[1],
      "text-primary": palette.colors[4],
      "text-secondary": '#6B7280',
      "section-bg-1": palette.colors[3],
      "section-bg-2": '#F9FAFB',
      "section-bg-3": '#F3F4F6',
      border: '#E5E7EB',
      highlight: palette.colors[1],
      "input-bg": palette.colors[3],
      "input-text": palette.colors[4]
    };

    const success = savePalette(colorPalette, palette.templateId as TemplateType, `AutoGen ${palette.templateName}`);
    
    if (success) {
      toast({
        title: "Palette Saved!",
        description: "Added to your saved palettes library",
      });
    } else {
      toast({
        title: "Save Failed",
        description: `You've reached the maximum number of saved palettes (${MAX_PALETTES})`,
        variant: "destructive"
      });
    }
  };

  const handleGenerateColors = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, isDarkMode, colorPalette, lockedColors);
      setColorPalette(newPalette);
      setIsGenerating(false);
    }, 800);
  };

  const handleColorChange = (colorKey: keyof ColorPalette, color: string) => {
    setColorPalette(prev => ({
      ...prev,
      [colorKey]: color
    }));
  };

  const handleModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    const newPalette = generateColorSchemeWithLocks(selectedScheme, checked, colorPalette, lockedColors);
    setColorPalette(newPalette);
  };

  const handleSchemeChange = (scheme: ColorSchemeType) => {
    setSelectedScheme(scheme);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleMoodSelect = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  const handleSavedPaletteSelect = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  const handleToggleLock = (colorKey: keyof ColorPalette) => {
    setLockedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(colorKey)) {
        newSet.delete(colorKey);
      } else {
        newSet.add(colorKey);
      }
      return newSet;
    });
  };

  const handleDownloadPDF = async () => {
    if (!canDownload()) {
      setUpsellModal({ isOpen: true, feature: 'PDF downloads' });
      return;
    }

    if (!incrementDownload()) {
      toast({
        title: "Download Limit Reached",
        description: "You've reached your daily download limit. Upgrade to Pro for unlimited downloads.",
        variant: "destructive",
      });
      return;
    }

    const currentPalette = selectedPaletteIndex !== null ? convertToColorPalette(generatedPalettes[selectedPaletteIndex]) : colorPalette;
    const templateName = allTemplates.find(t => t.id === selectedTemplate)?.name || selectedTemplate;
    
    try {
      // Find the preview element for the selected palette or use the current template
      let previewElement: HTMLElement;
      
      if (selectedPaletteIndex !== null) {
        // Find the specific palette card preview
        const paletteCards = document.querySelectorAll('[data-palette-preview]');
        previewElement = paletteCards[selectedPaletteIndex] as HTMLElement;
      } else {
        // Fallback to any preview element
        previewElement = document.querySelector('[data-preview-element]') as HTMLElement;
      }
      
      if (!previewElement) {
        toast({
          title: "Error",
          description: "Could not find template preview to capture.",
          variant: "destructive",
        });
        return;
      }
      
      await generateColorPalettePDF({
        colorPalette: currentPalette,
        templateName,
        previewElement,
        isDarkMode,
        isPro,
      });
      
      const remaining = getRemainingDownloads();
      toast({
        title: "PDF Downloaded",
        description: isPro ? "Professional color palette PDF has been downloaded." : 
          `PDF downloaded. ${remaining === Infinity ? 'Unlimited' : remaining} downloads remaining today.`,
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => setActiveModal(null);

  const getDaysRemaining = (timestamp: string) => {
    const createdDate = new Date(timestamp);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + adminSettings.retentionDays);
    
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const convertToColorPalette = (palette: GeneratedPalette): ColorPalette => ({
    brand: palette.colors[0],
    accent: palette.colors[2],
    "button-primary": palette.colors[0],
    "button-text": palette.colors[3],
    "button-secondary": palette.colors[3],
    "button-secondary-text": palette.colors[1],
    "text-primary": palette.colors[4],
    "text-secondary": '#6B7280',
    "section-bg-1": palette.colors[3],
    "section-bg-2": '#F9FAFB',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: palette.colors[1],
    "input-bg": palette.colors[3],
    "input-text": palette.colors[4]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AutoGenerate Colors
                </h1>
                <p className="text-sm text-gray-600">
                  Generate multiple color palettes for your selected template
                </p>
              </div>
            </div>
            
            <div className="w-[140px]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {generatedPalettes.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-6">Generated Palettes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {generatedPalettes.map((palette, index) => (
                <Card
                  key={palette.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPaletteIndex === index
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaletteIndex(index)}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-white relative">
                    <div 
                      className="absolute inset-0 scale-[0.25] origin-top-left" 
                      style={{ width: '400%', height: '400%' }}
                      data-palette-preview
                    >
                      <LivePreview
                        template={palette.templateId as TemplateType}
                        colorPalette={convertToColorPalette(palette)}
                        backgroundSettings={backgroundSettings}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Palette #{index + 1}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getDaysRemaining(palette.timestamp)}d left
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {palette.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 h-4 rounded"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>{palette.templateName}</span>
                      <span>{new Date(palette.timestamp).toLocaleDateString()}</span>
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSavePalette(palette);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={!canSaveMore()}
                    >
                      <Save className="h-3 w-3 mr-2" />
                      Save to Library
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Ready to Generate Palettes</h2>
            <p className="text-gray-500 mb-6">
              Adjust your settings below and click "Autogenerate Colors" to create {autogenerateCount} color palettes for {allTemplates.find(t => t.id === selectedTemplate)?.name}
            </p>
            <div className="text-sm text-gray-400">
              Use the controls at the bottom to customize your generation settings
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Toolbar - Optimized to match Dashboard */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="p-3 max-w-7xl mx-auto">
          {/* Desktop Layout: Always visible controls in specified order */}
          <div className="hidden md:flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Template */}
              <Button
                onClick={() => setActiveModal('template')}
                variant="outline"
                className="flex items-center gap-2 h-9"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">Template</span>
              </Button>

              {/* Color Theme Dropdown */}
              <Button
                onClick={() => setActiveModal('scheme')}
                variant="outline"
                className="flex items-center gap-2 h-9"
              >
                <Palette className="h-4 w-4" />
                <span className="text-sm">Scheme</span>
              </Button>

              {/* Light/Dark Mode Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white h-9">
                <Sun className="h-3 w-3 text-yellow-500" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleModeToggle}
                />
                <Moon className="h-3 w-3 text-gray-600" />
              </div>

              {/* Generate Colors */}
              <Button
                onClick={handleGenerateColors}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 h-9"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Palette className="h-4 w-4" />
                )}
                <span className="text-sm">Generate</span>
              </Button>

              {/* Autogenerate Colors */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="default"
                className="flex items-center gap-2 h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">{isGenerating ? 'Generating...' : 'Autogenerate'}</span>
              </Button>

              {/* Sets Count */}
              <Dialog open={activeModal === 'autogenerate-count'} onOpenChange={() => setActiveModal(activeModal === 'autogenerate-count' ? null : 'autogenerate-count')}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-9 px-3"
                  >
                    <span className="text-sm">Sets</span>
                    <span className="font-bold text-primary">{autogenerateCount}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-80 p-6">
                  <DialogHeader>
                    <DialogTitle className="text-center">Set Generation Count</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAutogenerateCount(Math.max(1, autogenerateCount - 1))}
                      disabled={autogenerateCount <= 1}
                      className="h-10 w-10 p-0"
                    >
                      -
                    </Button>
                    <div className="flex items-center justify-center min-w-[60px]">
                      <span className="text-2xl font-bold text-primary">{autogenerateCount}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAutogenerateCount(Math.min(50, autogenerateCount + 1))}
                      disabled={autogenerateCount >= 50}
                      className="h-10 w-10 p-0"
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Range: 1-50 sets
                  </div>
                </DialogContent>
              </Dialog>

              {/* More Options Dropdown */}
              <MoreOptionsDropdown
                onImageGeneratorClick={() => setActiveModal('image-generator')}
                onColorsClick={() => setActiveModal('colors')}
                onSetsClick={() => setActiveModal('saved')}
                onBackgroundClick={() => setActiveModal('background')}
                onAdminPresetsClick={() => setActiveModal('admin-presets')}
              />

              {/* Download PDF */}
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2 h-9"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">PDF</span>
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Generating...' : 'Autogenerate'}</span>
            </Button>
            
            <Button
              onClick={() => setActiveModal('template')}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => setActiveModal('scheme')}
              variant="outline"
              size="sm"
            >
              <Palette className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 px-2 py-1 border rounded bg-white">
              <Sun className="h-3 w-3" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleModeToggle}
              />
              <Moon className="h-3 w-3" />
            </div>
            
            <Button
              onClick={() => setActiveModal('colors')}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <Dialog open={activeModal === 'template'} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Choose Template
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={(newTemplate) => {
                  setSelectedTemplate(newTemplate);
                  closeModal();
                }}
                colorPalette={colorPalette}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Color Scheme Modal */}
      <Dialog open={activeModal === 'scheme'} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <ColorSchemeSelector
                selectedScheme={selectedScheme}
                onSchemeChange={handleSchemeChange}
                onGenerateScheme={handleGenerateColors}
                isGenerating={isGenerating}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Color Mood Modal */}
      <ColorMoodSelector
        isOpen={activeModal === 'mood'}
        onClose={closeModal}
        onMoodSelect={handleMoodSelect}
        currentPalette={colorPalette}
      />

      {/* Customize Colors Modal */}
      <Dialog open={activeModal === 'colors'} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Customize Colors
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              <ColorControls
                colorPalette={colorPalette}
                onColorChange={handleColorChange}
                lockedColors={lockedColors}
                onToggleLock={handleToggleLock}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Saved Palettes Modal */}
      <SavedPalettesModal
        isOpen={activeModal === 'saved'}
        onClose={closeModal}
        currentPalette={colorPalette}
        currentTemplate={selectedTemplate}
        onPaletteSelect={handleSavedPaletteSelect}
        onTemplateChange={setSelectedTemplate}
      />

      {/* Background Customizer Modal */}
      <Dialog open={activeModal === 'background'} onOpenChange={closeModal}>
        <DialogContent className="max-w-sm max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Background Settings
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              <BackgroundCustomizer
                settings={backgroundSettings}
                onSettingsChange={setBackgroundSettings}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Admin Presets Modal */}
      <AdminPresetsModal
        isOpen={activeModal === 'admin-presets'}
        onClose={closeModal}
        onPresetSelect={(palette) => {
          setColorPalette(palette);
          closeModal();
        }}
      />

      {/* Pro Upsell Modal */}
      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, feature: '' })}
        templateName={upsellModal.feature}
      />
    </div>
  );
};

export default AutoGenerate;