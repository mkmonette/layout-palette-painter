import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Shapes, Sun, Moon, Sunset, Save, Download, Settings, Bot, Wand2, Image as ImageIcon, Shield, Share, ZoomIn, ZoomOut, Plus, User, LogOut, Sparkles, Eye, Maximize, RotateCcw, RefreshCw, BookOpen, PanelLeftClose, PanelLeftOpen, Palette, Menu, X, CloudSun, LayoutDashboard, Layers, Lock, Unlock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const TemplateSelector = lazy(() => import('@/components/TemplateSelector'));
const TemplatesSection = lazy(() => import('@/components/TemplatesSection'));
import ColorControls from '@/components/ColorControls';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import ColorMoodSelector from '@/components/ColorMoodSelector';
import LivePreview from '@/components/LivePreview';
import FullscreenPreview from '@/components/FullscreenPreview';
import { generateColorPalette, generateColorScheme, generateColorSchemeWithLocks, ColorPalette } from '@/utils/colorGenerator';
import { TemplateType } from '@/types/template';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import SavedPalettesContent from '@/components/SavedPalettesContent';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { generateColorPalettePDF, generateBasicColorPalettePDF } from '@/utils/pdfGenerator';
import PDFExportModal from '@/components/PDFExportModal';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useDownloadLimits } from '@/hooks/useDownloadLimits';
import ProUpsellModal from '@/components/ProUpsellModal';
import PlanSelector from '@/components/PlanSelector';
import ImageUploadGenerator from '@/components/ImageUploadGenerator';
import WebsiteColorGenerator from '@/components/WebsiteColorGenerator';
import ColorThemeDropdown from '@/components/ColorThemeDropdown';
import MoreOptionsDropdown from '@/components/MoreOptionsDropdown';
import BackgroundCustomizer from '@/components/BackgroundCustomizer';
import OpenAIKeyInput from '@/components/OpenAIKeyInput';
import AIColorGenerator from '@/components/AIColorGenerator';
import AdminPresetsModal from '@/components/AdminPresetsModal';
import InlineColorMoods from '@/components/InlineColorMoods';
import { TestPlanSwitcher } from '@/components/TestPlanSwitcher';
import ColorModeSelector from '@/components/ColorModeSelector';
import { initializeOpenAI } from '@/utils/openaiService';
import { validatePaletteContrast, getAccessibleVersion } from '@/utils/contrastChecker';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';

type ColorMode = 'light' | 'light-midtone' | 'midtone' | 'midtone-dark' | 'dark';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const {
    isPro,
    canAccessProTemplates,
    canAccessTemplateDarkMode,
    canAccessColorSchemes,
    canAccessColorMood
  } = useFeatureAccess();

  const { canDownload, incrementDownload } = useDownloadLimits();

  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [isDashboardDarkMode, setIsDashboardDarkMode] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>('random');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    brand: '#3B82F6',
    accent: '#10B981',
    'button-primary': '#3B82F6',
    'button-text': '#FFFFFF',
    'button-secondary': '#F3F4F6',
    'button-secondary-text': '#1F2937',
    'text-primary': '#1F2937',
    'text-secondary': '#6B7280',
    'section-bg-1': '#FFFFFF',
    'section-bg-2': '#F9FAFB',
    'section-bg-3': '#F3F4F6',
    border: '#E5E7EB',
    highlight: '#FEF3C7',
    'input-bg': '#FFFFFF',
    'input-text': '#1F2937'
  });

  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [showProUpsellModal, setShowProUpsellModal] = useState(false);
  const [autogenerateCount, setAutogenerateCount] = useState(0);
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([]);
  const [showAutoGenerateConfirmModal, setShowAutoGenerateConfirmModal] = useState(false);
  const [showAutoGenerateResultsModal, setShowAutoGenerateResultsModal] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    enabled: true,
    mode: 'gradient',
    style: 'waves',
    opacity: 0.6,
    waveHeight: 40,
    blobSize: 200,
    meshIntensity: 0.5,
    patternScale: 1.0,
    gradientFillType: 'radial',
    gradientStartColor: 'brand',
    gradientEndColor: 'accent',
    gradientDirection: 'bottom-right'
  });

  const { savePalette } = useSavedPalettes();
  
  const handleSavedPaletteSelect = (palette: ColorPalette, template?: TemplateType) => {
    setColorPalette(palette);
    if (template) setSelectedTemplate(template);
  };

  // Initialize OpenAI on component mount if API key exists
  React.useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      try {
        initializeOpenAI(savedKey);
      } catch (error) {
        console.error('Failed to initialize OpenAI:', error);
      }
    }
  }, []);

  const handleGenerateColors = () => {
    setIsGenerating(true);
    try {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
      setColorPalette(newPalette);

      toast({
        title: "✨ Colors Generated",
        description: "New color palette generated successfully!",
      });
    } catch (error) {
      console.error('Error generating palette:', error);

      if (error instanceof Error && error.message.includes('contrast-safe')) {
        toast({
          title: "⚠️ No Contrast-Safe Palettes Found",
          description: "Generating regular palette instead. Try adjusting mood or scheme for accessible colors.",
          variant: "destructive"
        });

        // Generate regular palette as fallback
        const fallbackPalette = generateColorSchemeWithLocks(selectedScheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
        setColorPalette(fallbackPalette);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate palette. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setTimeout(() => setIsGenerating(false), 800);
    }
  };

  const handleColorModeChange = (newMode: ColorMode) => {
    setColorMode(newMode);

    // Generate new palette adapted to the color mode
    try {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, newMode, colorPalette, lockedColors, false);
      setColorPalette(newPalette);
    } catch (error) {
      console.error('Error adapting palette to new mode:', error);

      if (error instanceof Error && error.message.includes('contrast-safe')) {
        toast({
          title: "⚠️ No Contrast-Safe Palettes Found",
          description: "No contrast-safe palettes found for current settings. Try adjusting mood or scheme.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSchemeChange = (scheme: ColorSchemeType) => {
    setSelectedScheme(scheme);
    // Automatically generate colors with the new scheme
    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(scheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
        setColorPalette(newPalette);
      } catch (error) {
        console.error('Error generating color scheme:', error);
      }
    }, 100);
  };

  const handleColorChange = (colorKey: keyof ColorPalette, newColor: string) => {
    setColorPalette(prev => ({
      ...prev,
      [colorKey]: newColor
    }));
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

  const handleMoodSelect = (moodId: string) => {
    setSelectedMoodId(moodId);

    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(selectedScheme, colorMode, colorPalette, lockedColors, false, moodId);
        setColorPalette(newPalette);

        toast({
          title: "🎨 Mood Applied",
          description: "Color palette updated with selected mood!",
        });
      } catch (error) {
        console.error('Error applying mood:', error);
        toast({
          title: "Error",
          description: "Failed to apply mood. Please try again.",
          variant: "destructive"
        });
      }
    }, 100);
  };

  const handleAIPaletteGenerated = (palette: ColorPalette) => {
    setColorPalette(palette);
    toast({
      title: "🤖 AI Colors Generated",
      description: "AI has created a new color palette for you!",
    });
  };

  const handleAutoGenerate = React.useCallback(() => {
    console.log('handleAutoGenerate called', { autogenerateCount, selectedTemplate, selectedScheme, colorMode, selectedMoodId });
    try {
      if (autogenerateCount >= 10) {
        setShowAutoGenerateConfirmModal(true);
        return;
      }

      const newPalettes = Array.from({ length: 5 }, () =>
        generateColorSchemeWithLocks(
          selectedScheme,
          colorMode,
          colorPalette,
          lockedColors,
          false,
          selectedMoodId
        )
      );

      setGeneratedPalettes(newPalettes);
      setAutogenerateCount(prev => prev + 1);
      setShowAutoGenerateResultsModal(true);

      toast({
        title: "🎨 Auto-Generated!",
        description: `Generated ${newPalettes.length} palette variations.`,
      });

    } catch (error) {
      console.error('Error in auto-generate:', error);
      toast({
        title: "Generation Error",
        description: "Failed to auto-generate palettes. Please try again.",
        variant: "destructive"
      });
    }
  }, [autogenerateCount, selectedScheme, colorMode, colorPalette, lockedColors, selectedMoodId, toast]);

  const handleImageColorsGenerated = (colors: string[]) => {
    if (colors.length >= 2) {
      const newPalette = { ...colorPalette };
      newPalette.brand = colors[0];
      newPalette.accent = colors[1];

      if (colors[2]) newPalette['button-primary'] = colors[2];
      if (colors[3]) newPalette.highlight = colors[3];

      setColorPalette(newPalette);

      toast({
        title: "🖼️ Colors Extracted!",
        description: "Successfully extracted colors from your image.",
      });
    }
  };

  const handleWebsiteColorsGenerated = (colors: string[]) => {
    if (colors.length >= 2) {
      const newPalette = { ...colorPalette };
      newPalette.brand = colors[0];
      newPalette.accent = colors[1];

      if (colors[2]) newPalette['button-primary'] = colors[2];
      if (colors[3]) newPalette.highlight = colors[3];

      setColorPalette(newPalette);

      toast({
        title: "🌐 Website Colors Extracted!",
        description: "Successfully extracted colors from the website.",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!canDownload) {
      setShowProUpsellModal(true);
      return;
    }

    setShowPDFExportModal(true);
  };

  const sidebarItems = [{
    id: 'templates' as const,
    icon: Layout,
    label: 'Templates',
    available: true
  }, {
    id: 'schemes' as const,
    icon: Shapes,
    label: 'Schemes',
    available: canAccessColorSchemes
  }, {
    id: 'moods' as const,
    icon: Palette,
    label: 'Moods',
    available: canAccessColorMood
  }, {
    id: 'background-settings' as const,
    icon: ImageIcon,
    label: 'Background',
    available: true
  }, {
    id: 'from-image' as const,
    icon: ImageIcon,
    label: 'From Image',
    available: true
  }, {
    id: 'admin-presets' as const,
    icon: Shield,
    label: 'Color Presets',
    available: true
  }, {
    id: 'current-palettes' as const,
    icon: Layers,
    label: 'Current Palettes',
    available: true
  }, {
    id: 'saved-palettes' as const,
    icon: Save,
    label: 'Saved Palettes',
    available: true
  }, {
    id: 'settings' as const,
    icon: Settings,
    label: 'Settings',
    available: true
  }, {
    id: 'history' as const,
    icon: RotateCcw,
    label: 'History',
    available: true
  }, {
    id: 'test-plans' as const,
    icon: LayoutDashboard,
    label: 'Test Plans',
    available: process.env.NODE_ENV !== 'production'
  }];

  if (isFullscreen) {
    return <FullscreenPreview
      template={selectedTemplate}
      colorPalette={colorPalette}
      selectedScheme={selectedScheme}
      colorMode={colorMode}
      isDarkMode={colorMode === 'dark'}
      isGenerating={isGenerating}
      autogenerateCount={autogenerateCount}
      onClose={() => setIsFullscreen(false)}
      onGenerateColors={handleGenerateColors}
      onSchemeChange={handleSchemeChange}
      onTemplateChange={setSelectedTemplate}
      onTemplateToggle={() => {}}
      onModeChange={handleColorModeChange}
      onColorChange={(palette, moodId) => {
        setColorPalette(palette);
        if (moodId) setSelectedMoodId(moodId);
      }}
      onDownloadPDF={handleDownloadPDF}
    />;
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background workspace-background relative">
        {/* Vibrant animated background overlay */}
        <div className="absolute inset-0 workspace-background opacity-60 z-0" />

        {/* Top Navigation Bar */}
        <div className="h-14 border-b border-border bg-card/90 backdrop-blur-md relative z-10">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">Studio</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="h-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    logoutUser();
                    navigate('/');
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex relative z-10">
          {/* Left Sidebar */}
          <div className="w-72 border-r border-border bg-card/50 backdrop-blur-md flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground">Design Tools</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {sidebarItems.filter(item => item.available).map((item) => (
                  <Popover key={item.id}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start h-auto px-3 py-2 rounded-sm">
                        <item.icon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />
                        <span className="text-sm text-sidebar-foreground truncate">{item.label}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className={`${item.id === 'templates' ? 'w-48' : item.id === 'schemes' ? 'w-80' : item.id === 'moods' ? 'w-64' : 'w-64'} p-0`}
                      side="right"
                      align="start"
                    >
                      <div className="p-4 border-b border-border">
                        <h3 className="font-medium text-xs">{item.label}</h3>
                      </div>

                      {item.id === 'templates' ? (
                        <div className="h-fit">
                          <div className="p-4 pt-3">
                            <div className="space-y-2">
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Choose from built-in templates or your custom imports.
                                </p>

                                {/* Default Templates Popover */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start h-auto px-3 py-2 rounded-sm"
                                      onClick={() => console.log('Default Templates button clicked')}
                                    >
                                      <span className="text-xs">🟦 Default Templates</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[500px] p-4"
                                    side="right"
                                    align="start"
                                    alignOffset={-100}
                                    sideOffset={20}
                                    avoidCollisions={false}
                                    onOpenAutoFocus={() => console.log('Default Templates popover opened')}
                                  >
                                    <div className="space-y-3">
                                      <h3 className="font-medium text-xs">Default Templates</h3>
                                      <div className="max-h-96 overflow-y-auto">
                                        <div className="space-y-2">
                                          <p className="text-xs text-muted-foreground">
                                            Choose from our built-in professional templates.
                                          </p>
                                          <Suspense fallback={<div className="text-xs text-muted-foreground">Loading templates...</div>}>
                                            <TemplateSelector
                                              selectedTemplate={selectedTemplate}
                                              onTemplateChange={setSelectedTemplate}
                                              colorPalette={colorPalette}
                                            />
                                          </Suspense>
                                        </div>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {/* Custom Templates Popover */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start h-auto px-3 py-2 rounded-sm"
                                      onClick={() => console.log('Custom Templates button clicked')}
                                    >
                                      <span className="text-xs">🟩 Custom Templates</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[500px] p-4"
                                    side="right"
                                    align="start"
                                    alignOffset={-100}
                                    sideOffset={20}
                                    avoidCollisions={false}
                                    onOpenAutoFocus={() => console.log('Custom Templates popover opened')}
                                  >
                                    <div className="space-y-3">
                                      <h3 className="font-medium text-xs">Custom Templates</h3>
                                      <div className="max-h-96 overflow-y-auto">
                                        <Suspense fallback={<div className="text-xs text-muted-foreground">Loading custom templates...</div>}>
                                          <TemplatesSection
                                            selectedTemplate={selectedTemplate}
                                            onTemplateChange={setSelectedTemplate}
                                            colorPalette={colorPalette}
                                            showOnlyCustom={true}
                                          />
                                        </Suspense>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : item.id === 'schemes' ? (
                        <div className="h-fit">
                          <div className="p-4 pt-3">
                            <div className="space-y-2">
                              <div className="space-y-4">
                                <p className="text-xs text-muted-foreground">
                                  Choose a color scheme to generate harmonious palettes.
                                </p>
                                <ColorSchemeSelector selectedScheme={selectedScheme} onSchemeChange={handleSchemeChange} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-fit">
                          <div className="p-4 pt-3">
                            <div className="space-y-2">
                              {item.id === 'moods' && <InlineColorMoods onMoodSelect={(palette, moodId) => handleMoodSelect(moodId || '')} currentPalette={colorPalette} selectedMoodId={selectedMoodId} />}

                              {item.id === 'background-settings' && <div className="space-y-4">
                                <BackgroundCustomizer settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
                              </div>}

                              {item.id === 'from-image' && <div className="space-y-4">
                                <p className="text-xs text-muted-foreground">
                                  Generate colors from your uploaded images.
                                </p>

                                {/* Upload Image Popover */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start h-auto px-3 py-2 rounded-sm">
                                      <span className="text-xs">📷 Upload Image</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-64 p-4"
                                    side="right"
                                    align="start"
                                    sideOffset={20}
                                    avoidCollisions={false}
                                  >
                                    <div className="space-y-3">
                                      <h3 className="font-medium text-xs">Upload Image</h3>
                                      <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                          Upload an image to extract its dominant colors.
                                        </p>
                                        <ImageUploadGenerator 
                                          onPaletteGenerated={(palette) => setColorPalette(palette)}
                                          isGenerating={false}
                                          setIsGenerating={() => {}}
                                        />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {/* Website URL Popover */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start h-auto px-3 py-2 rounded-sm">
                                      <span className="text-xs">🌐 Website URL</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-64 p-4"
                                    side="right"
                                    align="start"
                                    sideOffset={20}
                                    avoidCollisions={false}
                                  >
                                    <div className="space-y-3">
                                      <h3 className="font-medium text-xs">Website Colors</h3>
                                      <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                          Generate colors from any website.
                                        </p>
                                        <WebsiteColorGenerator onPaletteGenerated={(palette) => setColorPalette(palette)} isGenerating={false} setIsGenerating={() => {}} />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>}

                              {item.id === 'admin-presets' && <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Browse professionally curated color palettes.
                                </p>
                                <Button onClick={() => setActiveModal('admin-presets')} className="w-full h-6 px-2 text-xs rounded-sm">
                                  Browse Presets
                                </Button>
                              </div>}

                              {item.id === 'current-palettes' && (
                                <ScrollArea className="h-80">
                                  <div className="space-y-3">
                                    <p className="text-xs text-muted-foreground">
                                      Edit and lock current palette colors
                                    </p>
                                    <div className="space-y-2">
                                      {Object.entries(colorPalette).slice(0, 8).map(([key, value]) => {
                                        const isLocked = lockedColors.has(key as keyof ColorPalette);
                                        return (
                                          <div key={key} className="flex items-center gap-2">
                                            <div
                                              className={`w-6 h-6 rounded border flex-shrink-0 cursor-pointer ${isLocked ? 'border-orange-300 border-2' : 'border-border'}`}
                                              style={{ backgroundColor: value }}
                                              title={`Click to edit ${key.replace(/-/g, ' ')}`}
                                            />
                                            <div className="flex-1 min-w-0">
                                              <div className="text-[10px] font-medium text-foreground truncate mb-1">
                                                {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                              </div>
                                              <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                                                disabled={isLocked}
                                                className={`w-full h-4 border rounded cursor-pointer ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
                                                style={{ backgroundColor: value }}
                                              />
                                              <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                                                disabled={isLocked}
                                                className={`w-full text-[9px] font-mono mt-1 px-1 py-0.5 border rounded bg-background ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary focus:border-primary focus:outline-none'}`}
                                                placeholder="#000000"
                                              />
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleToggleLock(key as keyof ColorPalette)}
                                              className={`h-5 w-5 p-0 flex-shrink-0 ${isLocked ? 'text-orange-500 hover:text-orange-600' : 'text-muted-foreground hover:text-foreground'}`}
                                              title={isLocked ? 'Unlock color' : 'Lock color'}
                                            >
                                              {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                                            </Button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </ScrollArea>
                              )}

                              {item.id === 'saved-palettes' && <SavedPalettesContent currentPalette={colorPalette} currentTemplate={selectedTemplate} onPaletteSelect={handleSavedPaletteSelect} onTemplateChange={setSelectedTemplate} />}

                              {item.id === 'settings' && <div className="space-y-2">
                                <h3 className="text-xs font-medium">Settings</h3>
                                <p className="text-xs text-muted-foreground">
                                  Configure preferences and account.
                                </p>

                                <div className="space-y-2">
                                  <OpenAIKeyInput onKeySet={() => { }} />
                                  <Button variant="outline" className="w-full h-6 px-2 text-xs rounded-sm" onClick={() => navigate('/dashboard')}>
                                    Account Settings
                                  </Button>
                                </div>
                              </div>}

                              {item.id === 'history' && <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  View your palette generation history and recover previous palettes.
                                </p>
                                <Button variant="outline" className="w-full h-6 px-2 text-xs rounded-sm" onClick={() => navigate('/history')}>
                                  View History
                                </Button>
                              </div>}

                              {item.id === 'test-plans' && <div className="space-y-4">
                                <h3 className="text-sm font-medium">Test Plan Switcher</h3>
                                <p className="text-xs text-muted-foreground">
                                  Simulate different subscription plans for testing UI features. 
                                  This override is temporary and only affects the current session.
                                </p>
                                <TestPlanSwitcher />
                              </div>}
                            </div>
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>

            {/* Template Theme Mode Selector */}
            <div className="p-4 border-t border-border">
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-sidebar-foreground">Template Mode</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full h-8 justify-start px-3 relative text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                      {colorMode === 'light' ? <Sun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> :
                        colorMode === 'light-midtone' ? <CloudSun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> :
                          colorMode === 'midtone' ? <Sunset className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> :
                            colorMode === 'midtone-dark' ? <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0 opacity-70" /> :
                              <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />}
                      <span className="text-sm text-sidebar-foreground truncate">Theme Mode</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4" side="right" align="end">
                    <div className="space-y-3">
                      <h3 className="font-medium text-xs">Choose Theme Mode</h3>
                      <div className="grid gap-2">
                        {[
                          {
                            mode: 'light' as ColorMode,
                            label: 'Light',
                            description: 'Lightness 85-100',
                            icon: Sun,
                            sample: '#f8fafc'
                          },
                          {
                            mode: 'light-midtone' as ColorMode,
                            label: 'Light Midtone',
                            description: 'Lightness 70-84',
                            icon: CloudSun,
                            sample: '#e2e8f0'
                          },
                          {
                            mode: 'midtone' as ColorMode,
                            label: 'Midtone',
                            description: 'Lightness 40-69',
                            icon: Sunset,
                            sample: '#64748b'
                          },
                          {
                            mode: 'midtone-dark' as ColorMode,
                            label: 'Midtone Dark',
                            description: 'Lightness 25-39',
                            icon: Moon,
                            sample: '#334155'
                          },
                          {
                            mode: 'dark' as ColorMode,
                            label: 'Dark',
                            description: 'Lightness 0-24',
                            icon: Moon,
                            sample: '#0f172a'
                          }
                        ].map((option) => (
                          <Button
                            key={option.mode}
                            variant={colorMode === option.mode ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleColorModeChange(option.mode)}
                            className="w-full justify-start h-auto p-2"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <option.icon className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                              <div
                                className="w-4 h-4 rounded border border-border flex-shrink-0"
                                style={{ backgroundColor: option.sample }}
                              />
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Action Bar */}
            <div className="h-12 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleGenerateColors}
                  disabled={isGenerating}
                  size="sm"
                  className="relative overflow-hidden"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-2">Generate</span>
                </Button>

                {isPro && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full px-2 py-1.5 rounded-sm text-xs"
                      >
                        <Bot className="h-3 w-3 mr-1.5" />
                        AI Colors
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="left" align="start">
                      <div className="space-y-3">
                        <h3 className="font-medium text-xs">AI Colors</h3>
                        <div className="space-y-2">
                          <AIColorGenerator
                            isDarkMode={colorMode === 'dark'}
                            onPaletteGenerated={handleAIPaletteGenerated}
                            backgroundSettings={backgroundSettings}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-muted/30">
              <LivePreview 
                template={selectedTemplate}
                colorPalette={colorPalette}
                backgroundSettings={backgroundSettings}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <PDFExportModal
          isOpen={showPDFExportModal}
          onClose={() => setShowPDFExportModal(false)}
          colorPalette={colorPalette}
          onBasicExport={() => {
            incrementDownload();
            setShowPDFExportModal(false);
          }}
          onProfessionalExport={() => {
            incrementDownload();
            setShowPDFExportModal(false);
          }}
          isPro={isPro}
          templateName={selectedTemplate}
        />

        <ProUpsellModal
          isOpen={showProUpsellModal}
          onClose={() => setShowProUpsellModal(false)}
          templateName="PDF Export"
        />

        <AdminPresetsModal
          isOpen={activeModal === 'admin-presets'}
          onClose={() => setActiveModal(null)}
          onPresetSelect={(preset) => {
            setColorPalette(preset);
            setActiveModal(null);
            toast({
              title: "🎨 Preset Applied",
              description: "Applied color preset.",
            });
          }}
        />

        <Button
          onClick={handleAutoGenerate}
          className="fixed bottom-4 right-4 z-40 shadow-lg"
          size="icon"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
