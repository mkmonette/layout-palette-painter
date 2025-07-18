import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Save, Settings, Eye, Download, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateType, ColorPalette, Template } from '@/types/template';
import { GeneratedPalette } from '@/types/generator';
import { generatePaletteBatch, getAdminSettings } from '@/utils/autoGenerator';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import LivePreview from '@/components/LivePreview';
import TemplateSelector from '@/components/TemplateSelector';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import { generateColorSchemeWithLocks } from '@/utils/colorGenerator';
import { generateColorPalettePDF, generateBasicColorPalettePDF } from '@/utils/pdfGenerator';
import PDFExportModal from '@/components/PDFExportModal';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useDownloadLimits } from '@/hooks/useDownloadLimits';
import ProUpsellModal from '@/components/ProUpsellModal';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';

// Template definitions
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

interface AutoGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundSettings: BackgroundSettings;
}

const AutoGenerateModal: React.FC<AutoGenerateModalProps> = ({ isOpen, onClose, backgroundSettings }) => {
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
  const [zoomLevel, setZoomLevel] = useState(100);
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);
  const [adminSettings] = useState(getAdminSettings());
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; feature: string }>({ isOpen: false, feature: '' });

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

  const handleDownloadPDF = () => {
    if (!canDownload()) {
      setUpsellModal({ isOpen: true, feature: 'PDF downloads' });
      return;
    }
    setShowPDFExportModal(true);
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

  const getDaysRemaining = (timestamp: string) => {
    const createdDate = new Date(timestamp);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + adminSettings.retentionDays);
    
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[calc(100vh-40px)] my-5 p-0 flex flex-col">
          <DialogHeader className="px-8 py-6 border-b shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AutoGenerate Colors
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate multiple color palettes for your selected template
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating {autogenerateCount} Palettes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {autogenerateCount} Palettes
                  </>
                )}
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="settings" className="h-full flex flex-col">
              <div className="px-8 py-4 border-b shrink-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="palettes" disabled={generatedPalettes.length === 0}>
                    Generated Palettes ({generatedPalettes.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="settings" className="px-8 py-6 m-0">
                  <div className="space-y-6">
                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Template Selection</h3>
                        <TemplateSelector
                          selectedTemplate={selectedTemplate}
                          onTemplateChange={setSelectedTemplate}
                          colorPalette={colorPalette}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Generation Settings</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">
                              Number of Palettes
                            </label>
                            <Select
                              value={autogenerateCount.toString()}
                              onValueChange={(value) => setAutogenerateCount(parseInt(value))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 palettes</SelectItem>
                                <SelectItem value="10">10 palettes</SelectItem>
                                <SelectItem value="15">15 palettes</SelectItem>
                                <SelectItem value="20">20 palettes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">
                              Color Scheme
                            </label>
                            <ColorSchemeSelector
                              selectedScheme={selectedScheme}
                              onSchemeChange={setSelectedScheme}
                              onGenerateScheme={() => {}}
                              isGenerating={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </TabsContent>

                <TabsContent value="palettes" className="px-8 py-6 m-0">
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGeneratedPalettes([]);
                        setSelectedPaletteIndex(null);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Settings
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {generatedPalettes.map((palette, index) => (
                      <Card
                        key={palette.id}
                        className={`transition-all hover:shadow-lg ${
                          selectedPaletteIndex === index
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'hover:border-gray-300'
                        }`}
                      >
                        {/* Template Preview */}
                        <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100 border-b relative">
                          {/* Desktop Frame */}
                          <div className="absolute inset-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-2 bg-gray-50 border-b border-gray-200 flex items-center px-2">
                              <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                                <div className="w-1 h-1 rounded-full bg-green-400"></div>
                              </div>
                            </div>
                            <div className="h-[calc(100%-8px)] transform scale-[0.25] origin-top-left w-[400%]">
                              <LivePreview
                                template={palette.templateId as TemplateType}
                                colorPalette={convertToColorPalette(palette)}
                                showSaveButton={false}
                                backgroundSettings={backgroundSettings}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">{palette.templateName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getDaysRemaining(palette.timestamp)}d
                            </Badge>
                          </div>
                          
                          {/* Color Palette Strip */}
                          <div className="flex items-center gap-1 mb-4">
                            {palette.colors.slice(0, 5).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-6 h-6 rounded border border-gray-200 flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSavePalette(palette)}
                              className="flex-1 text-xs"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPDF()}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <PDFExportModal
        isOpen={showPDFExportModal}
        onClose={() => setShowPDFExportModal(false)}
        onBasicExport={() => {
          setShowPDFExportModal(false);
        }}
        onProfessionalExport={() => {
          setShowPDFExportModal(false);
        }}
        isPro={isPro}
        colorPalette={selectedPaletteIndex !== null ? convertToColorPalette(generatedPalettes[selectedPaletteIndex]) : colorPalette}
        templateName={allTemplates.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
      />

      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, feature: '' })}
        templateName={upsellModal.feature}
      />
    </>
  );
};

export default AutoGenerateModal;