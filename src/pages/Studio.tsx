import React, { useState, useEffect } from 'react';
import { Layout, Shapes, Sun, Moon, Sunset, Save, Download, Settings, Bot, Wand2, Image as ImageIcon, Shield, Share, ZoomIn, ZoomOut, Plus, User, LogOut, Sparkles, Eye, Maximize, RotateCcw, RefreshCw, BookOpen, PanelLeftClose, PanelLeftOpen, Palette, Menu, X, CloudSun, LayoutDashboard } from 'lucide-react';
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
import TemplateSelector from '@/components/TemplateSelector';
import TemplatesSection from '@/components/TemplatesSection';
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
import { ColorMode } from '@/utils/colorGenerator';
import AutoGenerateConfirmModal from '@/components/AutoGenerateConfirmModal';
import AutoGenerateResultsModal from '@/components/AutoGenerateResultsModal';
import { generatePaletteBatch } from '@/utils/autoGenerator';
import { GeneratedPalette } from '@/types/generator';

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const {
    isPro,
    canAccessTemplateDarkMode,
    canAccessColorSchemes,
    canAccessColorMood,
    canAccessAutoGenerator
  } = useFeatureAccess();
  const {
    canDownload,
    getRemainingDownloads,
    incrementDownload
  } = useDownloadLimits();
  const {
    getSavedCount,
    loadSavedPalettes,
    MAX_PALETTES,
    savePalette
  } = useSavedPalettes();
  
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [isDashboardDarkMode, setIsDashboardDarkMode] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>('random');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
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
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [autogenerateCount, setAutogenerateCount] = useState(10);
  const [upsellModal, setUpsellModal] = useState<{
    isOpen: boolean;
    templateName: string;
  }>({
    isOpen: false,
    templateName: ''
  });
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const projectName = 'Color Palette Project';
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
    gradientDirection: 'horizontal'
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [showColorMood, setShowColorMood] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [showAutoGenerateConfirmModal, setShowAutoGenerateConfirmModal] = useState(false);
  const [showAutoGenerateResultsModal, setShowAutoGenerateResultsModal] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);

  const {
    remainingAIGenerations,
    maxAIGenerationsPerMonth,
    canUseAIGeneration
  } = useFeatureAccess();

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

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/login');
  };

  // Handler functions and effects

  const handleGenerateColors = async () => {
    if (isGenerating) return;

    if ((colorMode === 'dark' || colorMode === 'midtone') && !canAccessTemplateDarkMode) {
      toast({
        title: "Pro Feature Required",
        description: `${colorMode === 'dark' ? 'Dark' : 'Midtone'} mode color generation requires a Pro subscription.`,
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(selectedScheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
        setColorPalette(newPalette);
      } catch (error) {
        if (error instanceof Error && error.message.includes('No accessible palette found')) {
          toast({
            title: "⚠️ No Contrast-Safe Palettes Found",
            description: "Generating regular palette instead. Try adjusting mood or scheme for accessible colors.",
            variant: "destructive"
          });
          const fallbackPalette = generateColorSchemeWithLocks(selectedScheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
          setColorPalette(fallbackPalette);
        }
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleColorChange = (colorKey: keyof ColorPalette, color: string) => {
    const newPalette = {
      ...colorPalette,
      [colorKey]: color
    };

    const fixedPalette = autoFixTextContrast(newPalette, colorKey);
    setColorPalette(fixedPalette);
  };

  const handleModeChange = (newMode: ColorMode) => {
    if ((newMode === 'dark' || newMode === 'midtone') && !canAccessTemplateDarkMode) {
      toast({
        title: "Pro Feature Required",
        description: `${newMode === 'dark' ? 'Dark' : 'Midtone'} mode color generation requires a Pro subscription.`,
        variant: "destructive"
      });
      return;
    }
    
    setColorMode(newMode);
    
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDashboardDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDashboardDarkMode(false);
    }
    
    try {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, newMode, colorPalette, lockedColors, false);
      setColorPalette(newPalette);
      toast({
        title: "Color Mode Updated",
        description: `Generated ${newMode} color palette with proper lightness ranges.`,
        variant: "default"
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('No accessible palette found')) {
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
    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(scheme, colorMode, colorPalette, lockedColors, false, selectedMoodId);
        setColorPalette(newPalette);
      } catch (error) {
        console.error('Error generating color scheme:', error);
      }
    }, 100);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closeModal = () => setActiveModal(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleMoodSelect = (palette: ColorPalette, moodId?: string) => {
    setColorPalette(palette);
    setSelectedMoodId(moodId || null);
  };

  const handleSavedPaletteSelect = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  const handleToggleLock = (colorKey: keyof ColorPalette) => {
    setLockedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(colorKey)) {
        newSet.delete(colorKey);
        console.log(`Unlocked color: ${colorKey}`);
      } else {
        newSet.add(colorKey);
        console.log(`Locked color: ${colorKey}`);
      }
      console.log('All locked colors:', Array.from(newSet));
      return newSet;
    });
  };

  const autoFixTextContrast = (palette: ColorPalette, changedKey: keyof ColorPalette): ColorPalette => {
    const result = { ...palette };

    const backgroundKeys = ['section-bg-1', 'button-primary', 'button-secondary', 'input-bg'];
    if (backgroundKeys.includes(changedKey)) {
      const issues = validatePaletteContrast(result);
      issues.forEach(issue => {
        if (!issue.isValid && issue.suggestedColor) {
          if (issue.backgroundRole === changedKey) {
            result[issue.textRole as keyof ColorPalette] = issue.suggestedColor;
            toast({
              title: "Auto-fixed Text Contrast",
              description: `Adjusted ${issue.textRole} for better readability`
            });
          }
        }
      });
    }
    return result;
  };

  const handleAIPaletteGenerated = (aiPalette: ColorPalette) => {
    setColorPalette(aiPalette);
  };

  const handleAutoGenerate = React.useCallback(() => {
    console.log('handleAutoGenerate called', { autogenerateCount, selectedTemplate, selectedScheme, colorMode, selectedMoodId });
    try {
      const newPalettes = generatePaletteBatch(
        autogenerateCount,
        selectedTemplate,
        selectedScheme,
        colorMode,
        colorPalette,
        selectedMoodId
      );
      
      setGeneratedPalettes(newPalettes);
      setShowAutoGenerateConfirmModal(false);
      setShowAutoGenerateResultsModal(true);
      
      toast({
        title: "Palettes Generated!",
        description: `Generated ${autogenerateCount} color palettes using your current settings`,
      });
    } catch (error) {
      console.error('Error in handleAutoGenerate:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate palettes. Please try again.",
        variant: "destructive"
      });
    }
  }, [autogenerateCount, selectedTemplate, selectedScheme, colorMode, colorPalette, selectedMoodId, setGeneratedPalettes, setShowAutoGenerateConfirmModal, setShowAutoGenerateResultsModal, toast]);

  const handleSave = () => {
    const success = savePalette(colorPalette, selectedTemplate);
    if (success) {
      setSavedPalettesCount(getSavedCount());
      toast({
        title: "Palette Saved",
        description: "Your color palette has been saved successfully."
      });
    } else {
      toast({
        title: "Save Limit Reached",
        description: "You've reached the maximum number of saved palettes.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = () => {
    if (!canDownload()) {
      setUpsellModal({
        isOpen: true,
        templateName: 'PDF downloads'
      });
      return;
    }
    setShowPDFExportModal(true);
  };

  const handleBasicPDFExport = async () => {
    setShowPDFExportModal(false);
    
    if (!incrementDownload()) {
      toast({
        title: "Download Limit Reached",
        description: "You've reached your daily download limit. Upgrade to Pro for unlimited downloads.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const previewElement = document.querySelector('[data-preview-element]') as HTMLElement;
      if (!previewElement) {
        const livePreviewContainer = document.querySelector('.min-h-full.transition-transform') as HTMLElement;
        if (!livePreviewContainer) {
          toast({
            title: "Error",
            description: "Could not find template preview to capture.",
            variant: "destructive"
          });
          return;
        }
        
        await generateBasicColorPalettePDF({
          colorPalette,
          templateName: selectedTemplate.replace('-', ' '),
          previewElement: livePreviewContainer,
          isDarkMode: colorMode === 'dark'
        });
      } else {
        await generateBasicColorPalettePDF({
          colorPalette,
          templateName: selectedTemplate.replace('-', ' '),
          previewElement,
          isDarkMode: colorMode === 'dark'
        });
      }
      
      const remaining = getRemainingDownloads();
      toast({
        title: "Basic PDF Downloaded",
        description: `Basic color palette PDF has been downloaded. ${remaining === Infinity ? 'Unlimited' : remaining} downloads remaining today.`
      });
    } catch (error) {
      console.error('Basic PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate basic PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfessionalPDFExport = async () => {
    setShowPDFExportModal(false);
    
    if (!isPro) {
      setUpsellModal({
        isOpen: true,
        templateName: 'Professional PDF reports'
      });
      return;
    }

    if (!incrementDownload()) {
      toast({
        title: "Download Limit Reached",
        description: "You've reached your daily download limit.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const previewElement = document.querySelector('[data-preview-element]') as HTMLElement;
      if (!previewElement) {
        toast({
          title: "Error",
          description: "Could not find template preview to capture.",
          variant: "destructive"
        });
        return;
      }

      await generateColorPalettePDF({
        colorPalette,
        templateName: selectedTemplate.replace('-', ' '),
        previewElement,
        includeColorCodes: true,
        includeAccessibilityReport: true,
        isDarkMode: colorMode === 'dark'
      });
      
      const remaining = getRemainingDownloads();
      toast({
        title: "Professional PDF Downloaded",
        description: `Professional color palette PDF has been downloaded. ${remaining === Infinity ? 'Unlimited' : remaining} downloads remaining today.`
      });
    } catch (error) {
      console.error('Professional PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate professional PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const updateSavedCount = () => {
      setSavedPalettesCount(getSavedCount());
    };
    
    updateSavedCount();
    window.addEventListener('storage', updateSavedCount);
    
    return () => {
      window.removeEventListener('storage', updateSavedCount);
    };
  }, [getSavedCount]);

  // Sidebar items with improved semantic colors
  const sidebarItems = [
    {
      id: 'templates',
      label: 'Templates',
      icon: Layout,
      available: true
    },
    {
      id: 'schemes',
      label: 'Color Schemes',
      icon: Palette,
      available: canAccessColorSchemes
    },
    {
      id: 'moods',
      label: 'Color Moods',
      icon: Sparkles,
      available: canAccessColorMood
    },
    {
      id: 'from-image',
      label: 'From Image/URL',
      icon: ImageIcon,
      available: true
    },
    {
      id: 'background-settings',
      label: 'Background',
      icon: Shapes,
      available: true
    },
    {
      id: 'admin-presets',
      label: 'Presets',
      icon: Shield,
      available: isPro
    },
    {
      id: 'saved-palettes',
      label: 'Saved Palettes',
      icon: BookOpen,
      available: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      available: true
    },
    {
      id: 'test-plans',
      label: 'Test Plans',
      icon: User,
      available: currentUser?.id === 'admin'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {isFullscreen ? (
        <FullscreenPreview
          selectedTemplate={selectedTemplate}
          colorPalette={colorPalette}
          onClose={handleFullscreenToggle}
          onColorChange={setColorPalette}
          onTemplateChange={setSelectedTemplate}
          onModeChange={handleModeChange}
          colorMode={colorMode}
          backgroundSettings={backgroundSettings}
          onBackgroundSettingsChange={setBackgroundSettings}
          onSave={handleSave}
          onDownload={handleDownloadPDF}
          onTemplateSelect={setSelectedTemplate}
          onColorSchemeSelect={handleSchemeChange}
          onMoodSelect={handleMoodSelect}
          lockedColors={lockedColors}
          onToggleLock={handleToggleLock}
          selectedScheme={selectedScheme}
          onGenerateColors={handleGenerateColors}
          isGenerating={isGenerating}
          selectedMoodId={selectedMoodId}
        />
      ) : (
        <div className="h-screen flex flex-col">
          <header className="bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center justify-between relative z-50">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">Studio</h1>
              <Badge 
                variant="secondary" 
                className="bg-secondary text-secondary-foreground border-0 hover:bg-secondary/80"
              >
                Beta
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      variant="ghost" 
                      size="icon"
                      className="text-foreground hover:bg-accent lg:hidden"
                    >
                      {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle menu</p>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <div className={`w-48 bg-background/95 backdrop-blur-sm border-r border-border p-3 overflow-y-auto transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:block absolute lg:relative top-0 left-0 h-full z-40`}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Templates</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setActiveModal('template')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Layout className="mr-2 h-3 w-3" />
                      {selectedTemplate.replace('-', ' ')}
                    </Button>
                    
                    <div>
                      <Tabs value="current" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-7">
                          <TabsTrigger value="pro" className="text-xs">Pro</TabsTrigger>
                          <TabsTrigger value="current" className="text-xs">Basic</TabsTrigger>
                          <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Color Tools</h3>
                  <div className="space-y-1">
                    <ColorThemeDropdown 
                      onSchemeClick={() => setActiveModal('color-scheme')}
                      onMoodClick={() => setActiveModal('color-mood')}
                    />
                    
                    <Button
                      onClick={() => setActiveModal('color-mood')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Palette className="mr-2 h-3 w-3" />
                      Mood
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Generation</h3>
                  <div className="space-y-1">
                    <Button
                      onClick={handleGenerateColors}
                      disabled={isGenerating}
                      variant="default"
                      size="sm"
                      className="w-full h-8 text-xs"
                    >
                      <RefreshCw className={`mr-2 h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      Generate
                    </Button>

                    <Button
                      onClick={() => setActiveModal('ai-generator')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Bot className="mr-2 h-3 w-3" />
                      AI Color
                    </Button>

                    <Button
                      onClick={() => setActiveModal('image-generator')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <ImageIcon className="mr-2 h-3 w-3" />
                      Image
                    </Button>

                    <Button
                      onClick={() => setActiveModal('website-generator')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <CloudSun className="mr-2 h-3 w-3" />
                      Website
                    </Button>

                    {canAccessAutoGenerator && (
                      <Button
                        onClick={() => setShowAutoGenerateConfirmModal(true)}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-8 text-xs"
                      >
                        <Sparkles className="mr-2 h-3 w-3" />
                        Auto Gen
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Tools</h3>
                  <div className="space-y-1">
                    <Button
                      onClick={() => setActiveModal('saved-palettes')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <BookOpen className="mr-2 h-3 w-3" />
                      <span className="flex-1 text-left">Saved</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs h-4 ml-1"
                      >
                        {savedPalettesCount}/{MAX_PALETTES}
                      </Badge>
                    </Button>

                    <Button
                      onClick={() => setActiveModal('background')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Shapes className="mr-2 h-3 w-3" />
                      Background
                    </Button>

                    <Button
                      onClick={() => setActiveModal('color-controls')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col" style={{ width: 'calc(100% - 24rem)' }}>
              <div className="flex-1 bg-muted/50 relative">
                <LivePreview
                  selectedTemplate={selectedTemplate}
                  colorPalette={colorPalette}
                  onColorChange={handleColorChange}
                  colorMode={colorMode}
                  backgroundSettings={backgroundSettings}
                  zoomLevel={zoomLevel}
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-48 bg-background/95 backdrop-blur-sm border-l border-border p-3 overflow-y-auto">
              <div className="space-y-3">
                {/* Template Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Template Info</h3>
                  <Card className="p-3">
                    <h3 className="text-sm font-medium text-foreground capitalize">
                      {selectedTemplate.replace('-', ' ')}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current template design
                    </p>
                  </Card>
                </div>

                {/* Zoom Controls */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Zoom</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={handleZoomOut}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex-1 text-center">
                      <span className="text-xs text-foreground font-medium">{zoomLevel}%</span>
                    </div>
                    
                    <Button
                      onClick={handleZoomIn}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleZoomReset}
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                </div>

                {/* Color Mode */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Color Mode</h3>
                  <ColorModeSelector
                    colorMode={colorMode}
                    onModeChange={handleModeChange}
                    disabled={!canAccessTemplateDarkMode}
                    className="w-full"
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Actions</h3>
                  <div className="space-y-1">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      PDF
                    </Button>

                    <Button
                      onClick={handleSave}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Save className="mr-2 h-3 w-3" />
                      Save
                    </Button>

                    <Button
                      onClick={handleFullscreenToggle}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Maximize className="mr-2 h-3 w-3" />
                      Fullscreen
                    </Button>

                    <MoreOptionsDropdown
                      onOpenAIKeyModal={() => setActiveModal('openai-key')}
                      onAdminPresetsModal={() => setActiveModal('admin-presets')}
                      remainingAIGenerations={remainingAIGenerations}
                      maxAIGenerationsPerMonth={maxAIGenerationsPerMonth}
                      canUseAI={canUseAIGeneration}
                      colorPalette={colorPalette}
                      selectedTemplate={selectedTemplate}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modals */}
      {activeModal === 'template' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Template</DialogTitle>
            </DialogHeader>
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              onTemplateChange={setSelectedTemplate} 
              colorPalette={colorPalette} 
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'color-scheme' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Color Schemes</DialogTitle>
            </DialogHeader>
            <ColorSchemeSelector 
              selectedScheme={selectedScheme} 
              onSchemeChange={handleSchemeChange}
              onGenerateScheme={handleGenerateColors}
              isGenerating={isGenerating}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'color-mood' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Color Mood</DialogTitle>
            </DialogHeader>
            <InlineColorMoods
              onMoodSelect={handleMoodSelect}
              currentPalette={colorPalette}
              selectedMoodId={selectedMoodId}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'color-controls' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Colors</DialogTitle>
            </DialogHeader>
            <ColorControls
              colorPalette={colorPalette}
              onColorChange={handleColorChange}
              lockedColors={lockedColors}
              onToggleLock={handleToggleLock}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'saved-palettes' && (
        <SavedPalettesModal
          isOpen={true}
          onClose={closeModal}
          currentPalette={colorPalette}
          currentTemplate={selectedTemplate}
          onPaletteSelect={handleSavedPaletteSelect}
          onTemplateChange={setSelectedTemplate}
        />
      )}

      {activeModal === 'ai-generator' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Color Generator</DialogTitle>
            </DialogHeader>
            <AIColorGenerator
              isDarkMode={colorMode === 'dark'}
              onPaletteGenerated={handleAIPaletteGenerated}
              backgroundSettings={backgroundSettings}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'image-generator' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate from Image</DialogTitle>
            </DialogHeader>
            <ImageUploadGenerator
              onPaletteGenerated={setColorPalette}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'website-generator' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate from Website</DialogTitle>
            </DialogHeader>
            <WebsiteColorGenerator
              onPaletteGenerated={setColorPalette}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'background' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Background Settings</DialogTitle>
            </DialogHeader>
            <BackgroundCustomizer
              settings={backgroundSettings}
              onSettingsChange={setBackgroundSettings}
            />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'openai-key' && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OpenAI Configuration</DialogTitle>
            </DialogHeader>
            <OpenAIKeyInput onKeySet={closeModal} />
          </DialogContent>
        </Dialog>
      )}

      {activeModal === 'admin-presets' && (
        <AdminPresetsModal
          isOpen={true}
          onClose={closeModal}
          onPaletteSelect={setColorPalette}
        />
      )}

      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal(prev => ({ ...prev, isOpen: false }))}
        templateName={upsellModal.templateName}
      />

      <PDFExportModal
        isOpen={showPDFExportModal}
        onClose={() => setShowPDFExportModal(false)}
        onBasicExport={handleBasicPDFExport}
        onProfessionalExport={handleProfessionalPDFExport}
        isPro={isPro}
        colorPalette={colorPalette}
        templateName={selectedTemplate}
      />

      <AutoGenerateConfirmModal
        isOpen={showAutoGenerateConfirmModal}
        onClose={() => setShowAutoGenerateConfirmModal(false)}
        onConfirm={handleAutoGenerate}
        count={autogenerateCount}
        onCountChange={setAutogenerateCount}
        templateName={selectedTemplate}
        colorScheme={selectedScheme}
        colorMode={colorMode}
      />

      <AutoGenerateResultsModal
        isOpen={showAutoGenerateResultsModal}
        onClose={() => setShowAutoGenerateResultsModal(false)}
        palettes={generatedPalettes}
        onPaletteSelect={(palette) => {
          setColorPalette(palette.colors);
          setShowAutoGenerateResultsModal(false);
        }}
        templateName={selectedTemplate}
      />
    </div>
  );
};

export default Dashboard;
