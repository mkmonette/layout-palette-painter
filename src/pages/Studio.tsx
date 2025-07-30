import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Shapes, Sun, Moon, Sunset, Save, Download, Settings, Bot, Wand2, Image as ImageIcon, Shield, Share, ZoomIn, ZoomOut, Plus, User, LogOut, Sparkles, Eye, Maximize, RotateCcw, RefreshCw, BookOpen, PanelLeftClose, PanelLeftOpen, Palette, Menu, X, CloudSun, LayoutDashboard, Layers, Lock, Unlock, Coins, ToggleLeft, ToggleRight, Sliders, CreditCard, ChevronDown } from 'lucide-react';
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
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
  // Default palette for the template
  const defaultPalette: ColorPalette = {
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

  const [colorPalette, setColorPalette] = useState<ColorPalette>(defaultPalette);
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
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [fromImageExpanded, setFromImageExpanded] = useState(false);
  const [showAutoGenerateConfirmModal, setShowAutoGenerateConfirmModal] = useState(false);
  const [showAutoGenerateResultsModal, setShowAutoGenerateResultsModal] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [mobileMode, setMobileMode] = useState<'generate' | 'ai'>('generate');
  const [showAIControlsPopup, setShowAIControlsPopup] = useState(false);
  
  // Mobile popup states
  const [showTemplatesPopup, setShowTemplatesPopup] = useState(false);
  const [showBackgroundPopup, setShowBackgroundPopup] = useState(false);
  const [showThemeModePopup, setShowThemeModePopup] = useState(false);
  const [showSchemePopup, setShowSchemePopup] = useState(false);
  const [showMoodsPopup, setShowMoodsPopup] = useState(false);
  const [showPresetsPopup, setShowPresetsPopup] = useState(false);
  const [showCurrentPalettePopup, setShowCurrentPalettePopup] = useState(false);
  const [showSavedPalettePopup, setShowSavedPalettePopup] = useState(false);
  const [showImageUploadPopup, setShowImageUploadPopup] = useState(false);
  const [showSavePalettePopup, setShowSavePalettePopup] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [showUserProfilePopup, setShowUserProfilePopup] = useState(false);
  const {
    remainingAIGenerations,
    maxAIGenerationsPerMonth,
    canUseAIGeneration,
    currentPlan,
    planName
  } = useFeatureAccess();
  
  // Coin balance state
  const [coinBalance, setCoinBalance] = useState(0);

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

  // Load coin balance from localStorage
  React.useEffect(() => {
    const loadCoinBalance = () => {
      const savedBalance = localStorage.getItem('user_coin_balance');
      if (savedBalance) {
        setCoinBalance(parseInt(savedBalance, 10) || 0);
      } else {
        // Set default balance for new users
        const defaultBalance = 100;
        setCoinBalance(defaultBalance);
        localStorage.setItem('user_coin_balance', defaultBalance.toString());
      }
    };
    loadCoinBalance();
  }, []);

  // Load palette from URL parameters if present
  useEffect(() => {
    const loadPaletteParam = searchParams.get('loadPalette');
    if (loadPaletteParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(loadPaletteParam));
        if (decodedData.palette && decodedData.template) {
          // Set the template first
          setSelectedTemplate(decodedData.template);
          
          // Set the color palette
          const { id, name, savedAt, template, ...paletteColors } = decodedData.palette;
          setColorPalette(paletteColors);
          
          toast({
            title: "Palette Loaded",
            description: `Loaded "${name}" with ${template} template for editing.`
          });
        }
      } catch (error) {
        console.error('Failed to load palette from URL:', error);
        toast({
          title: "Error Loading Palette",
          description: "Failed to load the selected palette. Using default settings.",
          variant: "destructive"
        });
      }
    }
  }, [searchParams, toast]);
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/login');
  };
  const handleGenerateColors = async () => {
    if (isGenerating) return; // Prevent multiple simultaneous generations

    // Check if trying to generate restricted mode colors without pro access
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
        // If accessibility mode fails, fall back to regular generation
        if (error instanceof Error && error.message.includes('No accessible palette found')) {
          toast({
            title: "⚠️ No Contrast-Safe Palettes Found",
            description: "Generating regular palette instead. Try adjusting mood or scheme for accessible colors.",
            variant: "destructive"
          });
          // Generate regular palette as fallback
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

    // Auto-fix text contrast if needed
    const fixedPalette = autoFixTextContrast(newPalette, colorKey);
    setColorPalette(fixedPalette);
  };
  const handleModeChange = (newMode: ColorMode) => {
    // Check if trying to use restricted modes without pro access
    if ((newMode === 'dark' || newMode === 'midtone') && !canAccessTemplateDarkMode) {
      toast({
        title: "Pro Feature Required",
        description: `${newMode === 'dark' ? 'Dark' : 'Midtone'} mode color generation requires a Pro subscription.`,
        variant: "destructive"
      });
      return;
    }
    setColorMode(newMode);

    // Template color mode only affects template generation, not studio interface
    // Studio interface dark mode is controlled separately via dashboard dark mode toggle

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

  const handleResetToDefault = () => {
    setColorPalette({ ...defaultPalette });
    setLockedColors(new Set());
    toast({
      title: "Palette Reset",
      description: "Colors have been reset to template defaults."
    });
  };

  // Auto-fix text contrast when backgrounds change
  const autoFixTextContrast = (palette: ColorPalette, changedKey: keyof ColorPalette): ColorPalette => {
    const result = {
      ...palette
    };

    // Only auto-fix if a background color was changed
    const backgroundKeys = ['section-bg-1', 'button-primary', 'button-secondary', 'input-bg'];
    if (backgroundKeys.includes(changedKey)) {
      const issues = validatePaletteContrast(result);
      issues.forEach(issue => {
        if (!issue.isValid && issue.suggestedColor) {
          // Check if the background that was changed affects this text color
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
    console.log('handleAutoGenerate called', {
      autogenerateCount,
      selectedTemplate,
      selectedScheme,
      colorMode,
      selectedMoodId
    });
    try {
      // Generate palettes using current studio settings
      const newPalettes = generatePaletteBatch(autogenerateCount, selectedTemplate, selectedScheme, colorMode, colorPalette, selectedMoodId);
      setGeneratedPalettes(newPalettes);
      setShowAutoGenerateConfirmModal(false);
      setShowAutoGenerateResultsModal(true);
      toast({
        title: "Palettes Generated!",
        description: `Generated ${autogenerateCount} color palettes using your current settings`
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
        templateName: 'PDF Export'
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
        templateName: 'Professional PDF Export'
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
        const livePreviewContainer = document.querySelector('.min-h-full.transition-transform') as HTMLElement;
        if (!livePreviewContainer) {
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
          previewElement: livePreviewContainer,
          isDarkMode: colorMode === 'dark',
          isPro: true,
          projectName
        });
      } else {
        await generateColorPalettePDF({
          colorPalette,
          templateName: selectedTemplate.replace('-', ' '),
          previewElement,
          isDarkMode: colorMode === 'dark',
          isPro: true,
          projectName
        });
      }
      toast({
        title: "Professional PDF Downloaded",
        description: "Professional color palette PDF with accessibility analysis has been downloaded."
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);
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
  if (isFullscreen) {
    return <FullscreenPreview template={selectedTemplate} colorPalette={colorPalette} selectedScheme={selectedScheme} colorMode={colorMode} isDarkMode={colorMode === 'dark'} isGenerating={isGenerating} autogenerateCount={autogenerateCount} onClose={() => setIsFullscreen(false)} onGenerateColors={handleGenerateColors} onSchemeChange={handleSchemeChange} onTemplateChange={setSelectedTemplate} onColorChange={(palette, moodId) => {
      setColorPalette(palette);
      if (moodId !== undefined) setSelectedMoodId(moodId);
    }} onTemplateToggle={(checked: boolean) => {}} onModeChange={handleModeChange} onDownloadPDF={handleDownloadPDF} onAutogenerateCountChange={setAutogenerateCount} />;
  }
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
    icon: Sparkles,
    label: 'Moods',
    available: canAccessColorMood
  }, {
    id: 'background-settings' as const,
    icon: Palette,
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
    id: 'test-plans' as const,
    icon: Shield,
    label: 'Test Plans',
    available: process.env.NODE_ENV !== 'production'
  }];
  return <TooltipProvider>
      <div className="min-h-screen w-full flex flex-col bg-background workspace-background relative overflow-x-hidden">
        {/* Vibrant animated background overlay */}
        <div className="absolute inset-0 workspace-background opacity-60 z-0" />
        
        {/* Mobile Top Toolbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/90 backdrop-blur-md border-b border-border shadow-sm safe-area-top">
          <div className="flex items-center justify-between h-full px-3 sm:px-4">
            <div className="flex items-center justify-evenly w-full gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="flex-1 max-w-[60px] h-10" onClick={() => {}}>
                <Menu className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 max-w-[60px] h-10" onClick={() => {}}>
                <Palette className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 max-w-[60px] h-10" onClick={() => {}}>
                <Layers className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 max-w-[60px] h-10" onClick={() => {}}>
                <Settings className="w-5 h-5" />
              </Button>
              
              {/* User Profile Menu */}
              <Popover open={showUserProfilePopup} onOpenChange={setShowUserProfilePopup}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-1 max-w-[60px] h-10 hover:bg-accent">
                    <Menu className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 p-0 mr-2 z-[60] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                  align="end" 
                  sideOffset={8}
                >
                  <div className="p-4 space-y-4">
                    {/* User Info Section - Bordered Container */}
                    <Card className="p-4 border">
                      <div className="flex flex-col items-center space-y-3">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* User Details */}
                        <div className="text-center space-y-1">
                          <h3 className="font-semibold text-base">{currentUser?.username || 'User'}</h3>
                          <p className="text-sm text-muted-foreground">user@example.com</p>
                          <div className="flex items-center justify-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {planName}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Upgrade Button */}
                        <Button 
                          onClick={() => {
                            setShowUserProfilePopup(false);
                            setActiveModal('pro-upsell');
                          }}
                          size="sm" 
                          className="w-full"
                          variant={isPro ? "outline" : "default"}
                        >
                          {isPro ? "Manage Plan" : "Upgrade Plan"}
                        </Button>
                        
                        {/* Coins Row */}
                        <div className="w-full flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">{coinBalance} coins</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setShowUserProfilePopup(false);
                              // Add coin purchase logic here
                            }}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Navigation Links */}
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => {
                          setShowUserProfilePopup(false);
                          navigate('/dashboard');
                        }}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          setShowUserProfilePopup(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Toolbar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 bg-card/90 backdrop-blur-md border-t border-border shadow-sm safe-area-bottom">
          <div className="flex items-center justify-between h-full px-2 sm:px-3">
            <div className="flex items-center justify-evenly w-full gap-1">
              {/* Button 1: Templates & Layout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 max-w-[60px] h-10 hover:bg-accent"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setShowTemplatesPopup(true)}>
                    Templates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowBackgroundPopup(true)}>
                    Background Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowThemeModePopup(true)}>
                    Theme Mode
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Button 2: Palette Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 max-w-[60px] h-10 hover:bg-accent"
                  >
                    <Palette className="w-5 h-5" />
                  </Button>
                 </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setShowSchemePopup(true)}>
                    Scheme
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowMoodsPopup(true)}>
                    Moods
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPresetsPopup(true)}>
                    Presets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCurrentPalettePopup(true)}>
                    Current Palette
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSavedPalettePopup(true)}>
                    Saved Palettes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Button 3: Center Toggle Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 max-w-[60px] h-10 bg-primary/20 text-primary border border-primary/30" 
                onClick={() => setMobileMode(mobileMode === 'generate' ? 'ai' : 'generate')}
              >
                {mobileMode === 'generate' ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
              </Button>
              
              {/* Button 4: From Image */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 max-w-[60px] h-10 hover:bg-accent" 
                onClick={() => setShowImageUploadPopup(true)}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              
              {/* Button 5: Save & Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 max-w-[60px] h-10 hover:bg-accent"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setShowSavePalettePopup(true)}>
                    Save Palette
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowExportPopup(true)}>
                    Export PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Action Bar - Shows above bottom toolbar */}
        <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
          <div className="flex items-center justify-center h-12 px-4">
            {mobileMode === 'generate' ? (
              // Generate Mode
              <Button 
                onClick={handleGenerateColors} 
                disabled={isGenerating}
                className="flex-1 max-w-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate
              </Button>
            ) : (
              // AI Colors Mode
              <div className="flex items-center space-x-2 w-full max-w-xs">
                <Button 
                  onClick={() => setShowAIControlsPopup(true)}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 h-10 px-3"
                >
                  <Sliders className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => canUseAIGeneration ? setShowAutoGenerateConfirmModal(true) : setUpsellModal({
                    isOpen: true,
                    templateName: 'AI Colors'
                  })}
                  disabled={!canUseAIGeneration}
                  className="flex-1 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Colors
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* AI Controls Popup - Full Screen Mobile */}
        {showAIControlsPopup && (
          <div className="md:hidden fixed inset-0 z-[100] bg-background/95 backdrop-blur-md">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">AI Controls</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAIControlsPopup(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* AI Quota Display */}
                {canUseAIGeneration && (
                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Generations</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {maxAIGenerationsPerMonth - remainingAIGenerations}/{maxAIGenerationsPerMonth} used this month
                    </div>
                  </div>
                )}

                {/* Color Scheme */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Color Scheme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['monochromatic', 'analogous', 'complementary', 'triadic', 'split-complementary', 'tetradic'].map((scheme) => (
                      <Button
                        key={scheme}
                        variant={selectedScheme === scheme ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedScheme(scheme as ColorSchemeType)}
                        className="text-xs capitalize h-8"
                      >
                        {scheme.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Mode */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Color Mode</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['normal', 'vibrant', 'muted', 'dark'].map((mode) => (
                      <Button
                        key={mode}
                        variant={colorMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setColorMode(mode as ColorMode)}
                        className="text-xs capitalize h-8"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generation Count */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Generate Count</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((count) => (
                      <Button
                        key={count}
                        variant={autogenerateCount === count ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutogenerateCount(count)}
                        className="text-xs h-8"
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-border">
                <Button 
                  onClick={() => setShowAIControlsPopup(false)}
                  className="w-full h-10"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Top Navigation Bar - Hidden on mobile */}
        <div className="hidden md:block h-14 border-b border-border bg-card/90 backdrop-blur-md relative z-10">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center space-x-4">
               <h1 className="text-3xl sm:text-2xl font-bold text-foreground leading-tight">
                 Color Palette Generator
               </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* AI Quota Display */}
              {canUseAIGeneration && <div className="flex items-center space-x-2">
                   <Sparkles className="h-4 w-4 text-foreground" />
                   <span className="text-sm sm:text-xs font-normal text-muted-foreground">
                     AI Colors: {maxAIGenerationsPerMonth - remainingAIGenerations}/{maxAIGenerationsPerMonth}
                   </span>
                </div>}


              {/* Plan Badge */}
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="px-2 py-1 rounded-sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Dashboard Dark Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button variant="ghost" size="sm" className="w-8 h-8 p-1 text-foreground hover:bg-accent hover:text-accent-foreground rounded-sm" onClick={() => {
                  // Dashboard dark mode toggle - only affects dashboard UI
                  const newDashboardDarkMode = !isDashboardDarkMode;
                  setIsDashboardDarkMode(newDashboardDarkMode);
                  if (newDashboardDarkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  toast({
                    title: "Studio Dark Mode",
                    description: "Studio interface appearance changed. This doesn't affect template colors.",
                    variant: "default"
                  });
                }}>
                    {isDashboardDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Studio {isDashboardDarkMode ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              </Tooltip>

              {/* Hamburger Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Coin Balance</span>
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {coinBalance.toLocaleString()}
                    </Badge>
                  </div>
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
            </div>
          </div>
        </div>

        <div className="flex flex-1 relative z-10 min-h-0">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden md:flex w-full md:w-48 lg:w-64 max-w-xs studio-sidebar flex-col py-2 space-y-1 overflow-visible">\n
            {/* Templates Menu with Submenus */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 justify-between px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm"
                onClick={() => setTemplatesExpanded(!templatesExpanded)}
              >
                <div className="flex items-center">
                  <Layout className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />
                  <span className="text-sm text-sidebar-foreground truncate">Templates</span>
                </div>
                <ChevronDown className={`h-3 w-3 transition-transform ${templatesExpanded ? 'rotate-180' : ''}`} />
              </Button>
              
              {templatesExpanded && (
                <div className="pl-4 space-y-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full h-7 justify-start px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                        <span className="text-xs">🟦 Default Templates</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px] p-4 z-[60] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-xl font-bold">Default Templates</h3>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="space-y-2">
                            <p className="text-sm font-normal text-muted-foreground leading-relaxed">
                              Choose from our built-in professional templates.
                            </p>
                            <Suspense fallback={<div className="text-sm sm:text-xs font-normal text-muted-foreground">Loading templates...</div>}>
                              <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} colorPalette={colorPalette} />
                            </Suspense>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full h-7 justify-start px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                        <span className="text-xs">🟩 Custom Templates</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px] p-4 z-[60] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-xl font-bold">Custom Templates</h3>
                        <div className="max-h-96 overflow-y-auto">
                          <Suspense fallback={<div className="text-sm sm:text-xs font-normal text-muted-foreground">Loading custom templates...</div>}>
                            <TemplatesSection selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} colorPalette={colorPalette} showOnlyCustom={true} />
                          </Suspense>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* From Image Menu with Submenus */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 justify-between px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm"
                onClick={() => setFromImageExpanded(!fromImageExpanded)}
              >
                <div className="flex items-center">
                  <ImageIcon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />
                  <span className="text-sm text-sidebar-foreground truncate">From Image</span>
                </div>
                <ChevronDown className={`h-3 w-3 transition-transform ${fromImageExpanded ? 'rotate-180' : ''}`} />
              </Button>
              
              {fromImageExpanded && (
                <div className="pl-4 space-y-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full h-7 justify-start px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                        <span className="text-xs">📷 Upload Image</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px] p-4 z-[60] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-xl font-bold">Upload Image</h3>
                        <div className="max-h-96 overflow-y-auto">
                          <Suspense fallback={<div className="text-sm sm:text-xs font-normal text-muted-foreground">Loading...</div>}>
                            <ImageUploadGenerator onPaletteGenerated={setColorPalette} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
                          </Suspense>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full h-7 justify-start px-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                        <span className="text-xs">🌐 Website URL</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px] p-4 z-[60] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-xl font-bold">Website URL</h3>
                        <div className="max-h-96 overflow-y-auto">
                          <Suspense fallback={<div className="text-sm sm:text-xs font-normal text-muted-foreground">Loading...</div>}>
                            <WebsiteColorGenerator onPaletteGenerated={setColorPalette} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
                          </Suspense>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* Other Sidebar Items */}
            {sidebarItems.filter(item => item.id !== 'templates' && item.id !== 'from-image').map(item => {
            if (!item.available) return null;
            return <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="w-full h-8 justify-start px-3 relative text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                       <item.icon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />
                       <span className="text-sm text-sidebar-foreground truncate">{item.label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent className={`${item.id === 'schemes' ? 'w-80' : item.id === 'moods' ? 'w-64' : 'w-64'} p-0`} side="right" align="start">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium text-sm">{item.label}</h3>
                    </div>
                     {item.id === 'schemes' ?
                // No ScrollArea for schemes - just natural height
                <div className="h-fit">
                          <div className="p-4 pt-3">
                            <div className="space-y-2">
                              <div className="space-y-4">
                               <p className="text-base sm:text-sm font-normal text-muted-foreground leading-relaxed">
                                 Choose a color scheme to generate harmonious palettes.
                               </p>
                                <ColorSchemeSelector selectedScheme={selectedScheme} onSchemeChange={handleSchemeChange} />
                              </div>
                            </div>
                          </div>
                        </div> :
                // Natural height for all other menu items
                <div className="h-fit">
                         <div className="p-4 pt-3">
                           <div className="space-y-2">
                              {item.id === 'moods' && <InlineColorMoods onMoodSelect={handleMoodSelect} currentPalette={colorPalette} selectedMoodId={selectedMoodId} />}

                             {item.id === 'background-settings' && <div className="space-y-4">
                                 <BackgroundCustomizer settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
                               </div>}


                               {item.id === 'admin-presets' && <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                      Browse professionally curated color palettes.
                                    </p>
                                    <Button onClick={() => setActiveModal('admin-presets')} className="w-full h-6 px-2 text-xs rounded-sm">
                                      Browse Presets
                                    </Button>
                                 </div>}

                               {item.id === 'current-palettes' && <div className="space-y-3">
                                     <div className="flex items-center justify-between">
                                       <p className="text-base sm:text-sm font-normal text-muted-foreground leading-relaxed">
                                         Edit and lock current palette colors
                                       </p>
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={handleResetToDefault}
                                         className="h-7 px-2 text-xs"
                                         title="Reset to template default colors"
                                       >
                                         <RotateCcw className="h-3 w-3 mr-1" />
                                         Reset
                                       </Button>
                                     </div>
                                      <ScrollArea className="h-80">
                                       <div className="space-y-4 pr-4">
                                         {Object.entries(colorPalette).slice(0, 8).map(([key, value]) => {
                              const isLocked = lockedColors.has(key as keyof ColorPalette);
                              return <div key={key} className="space-y-2">
                                                {/* Label and lock icon on one line */}
                                                <div className="flex items-center justify-between">
                                                 <div className="text-base sm:text-sm font-medium text-foreground truncate">
                                                   {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                 </div>
                                                  <Button variant="ghost" size="sm" onClick={() => handleToggleLock(key as keyof ColorPalette)} className={`h-4 w-4 p-0 flex-shrink-0 ${isLocked ? 'text-orange-500 hover:text-orange-600' : 'text-muted-foreground hover:text-foreground'}`} title={isLocked ? 'Unlock color' : 'Lock color'}>
                                                    {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                                                  </Button>
                                                </div>
                                                
                                                {/* Color picker and color code on one line */}
                                                <div className="flex items-center gap-2">
                                                  <div className="relative">
                                                    <div className={`w-6 h-6 rounded border flex-shrink-0 cursor-pointer ${isLocked ? 'border-orange-300 border-2' : 'border-border'}`} style={{
                                      backgroundColor: value
                                    }} title={`Click to edit ${key.replace(/-/g, ' ')}`} />
                                                    <input type="color" value={value} onChange={e => handleColorChange(key as keyof ColorPalette, e.target.value)} disabled={isLocked} className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                                  </div>
                                                  <div className="flex-1">
                                                    <input type="text" value={value} onChange={e => handleColorChange(key as keyof ColorPalette, e.target.value)} disabled={isLocked} className={`w-full text-[9px] font-mono px-1 py-0.5 border rounded bg-background ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary focus:border-primary focus:outline-none'}`} placeholder="#000000" />
                                                  </div>
                                                </div>
                                              </div>;
                            })}
                                       </div>
                                     </ScrollArea>
                                  </div>}
                                
                               {item.id === 'saved-palettes' && <ScrollArea className="h-80">
                                   <SavedPalettesContent currentPalette={colorPalette} currentTemplate={selectedTemplate} onPaletteSelect={handleSavedPaletteSelect} onTemplateChange={setSelectedTemplate} />
                                 </ScrollArea>}
                             
                              {item.id === 'settings' && <div className="space-y-2">
                                 <h3 className="text-2xl sm:text-xl font-bold">Settings</h3>
                                 <p className="text-sm font-normal text-muted-foreground leading-relaxed">
                                   Configure preferences and account.
                                   </p>
                                 
                                 <div className="space-y-2">
                                   <OpenAIKeyInput onKeySet={() => {}} />
                                 </div>
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
                       </div>}
                   </DropdownMenuContent>
                 </DropdownMenu>;
          })}

            {/* Template Theme Mode Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full h-8 justify-start px-3 relative text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                  {colorMode === 'light' ? <Sun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'light-midtone' ? <CloudSun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'midtone' ? <Sunset className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'midtone-dark' ? <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0 opacity-70" /> : <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />}
                  <span className="text-sm text-sidebar-foreground truncate">Theme Mode</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4" side="right" align="end">
                <div className="space-y-3">
                  <h3 className="font-medium text-xs">Choose Theme Mode</h3>
                  <div className="grid gap-2">
                    {[{
                    mode: 'light' as ColorMode,
                    label: 'Light',
                    description: 'Lightness 85-100',
                    icon: Sun,
                    available: true
                  }, {
                    mode: 'light-midtone' as ColorMode,
                    label: 'Light Midtone',
                    description: 'Lightness 70-84',
                    icon: CloudSun,
                    available: canAccessTemplateDarkMode
                  }, {
                    mode: 'midtone' as ColorMode,
                    label: 'Midtone',
                    description: 'Lightness 45-65',
                    icon: Sunset,
                    available: canAccessTemplateDarkMode
                  }, {
                    mode: 'midtone-dark' as ColorMode,
                    label: 'Midtone Dark',
                    description: 'Lightness 30-44',
                    icon: Moon,
                    available: canAccessTemplateDarkMode
                  }, {
                    mode: 'dark' as ColorMode,
                    label: 'Dark',
                    description: 'Lightness 10-25',
                    icon: Moon,
                    available: canAccessTemplateDarkMode
                  }].map(({
                    mode,
                    label,
                    description,
                    icon: Icon,
                    available
                  }) => <Button key={mode} variant={colorMode === mode ? "default" : "outline"} size="sm" className="justify-start h-auto px-2 py-1 relative rounded-sm" disabled={!available} onClick={() => {
                    if (!available) {
                      setUpsellModal({
                        isOpen: true,
                        templateName: 'Dark Mode Templates'
                      });
                      return;
                    }
                    handleModeChange(mode);
                  }}>
                        <Icon className={`h-4 w-4 mr-2 flex-shrink-0 ${mode === 'midtone-dark' ? 'opacity-70' : ''}`} />
                          <div className="text-left">
                             <div className="text-base sm:text-sm font-medium">{label}</div>
                             <div className="text-sm sm:text-xs font-normal text-muted-foreground">{description}</div>
                          </div>
                        {!available && <Badge variant="secondary" className="ml-auto text-sm sm:text-xs font-normal px-1 py-0">
                             Pro
                           </Badge>}
                      </Button>)}
                  </div>
                 <div className="text-sm sm:text-xs font-normal text-muted-foreground pt-2 border-t leading-relaxed">
                   Theme modes control the lightness range of generated colors
                 </div>
                </div>
             </DropdownMenuContent>
            </DropdownMenu>
          </div>


          {/* Main Content Area with Right Sidebar */}
          <div className="flex-1 flex bg-card/40 backdrop-blur-sm min-h-0">
            {/* Canvas */}
            <div className="flex-1 overflow-hidden flex items-start justify-center bg-card/20 backdrop-blur-sm">
              {/* Mobile Canvas - Always desktop layout, scaled down */}
              <div className="md:hidden w-full overflow-hidden flex justify-center pt-14 pb-14">
                <div className="preview-wrapper">
                  <div 
                    className="preview-content bg-background border rounded-lg shadow-lg"
                    data-preview-element
                  >
                    {/* Simulated desktop viewport wrapper */}
                    <div className="desktop-viewport-simulator">
                      <LivePreview template={selectedTemplate} colorPalette={colorPalette} backgroundSettings={backgroundSettings} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Desktop Canvas */}
              <div className="hidden md:block bg-background border rounded-lg shadow-lg transition-transform duration-200 min-h-full m-2 lg:m-4 xl:m-6" style={{
              transform: `scale(${Math.min(zoomLevel / 100, 1.2)})`, // Limit max zoom for responsiveness
              transformOrigin: 'top center',
              width: 'calc(100% - 2rem)', // Take available space minus margins
              minHeight: '400px',
              maxWidth: '1200px'
            }} data-preview-element>

                {/* Desktop Preview Container */}
                <div className="w-full h-auto overflow-visible">
                  <LivePreview template={selectedTemplate} colorPalette={colorPalette} backgroundSettings={backgroundSettings} />
                </div>
               </div>
             </div>

            {/* Right Sidebar - Hidden on mobile, responsive width */}
            <div className="hidden md:flex w-48 lg:w-56 xl:w-64 flex-shrink-0 bg-card/80 backdrop-blur-md border-l border-border flex-col overflow-y-auto">
              {/* Sidebar Header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg lg:text-xl font-semibold">Controls</span>
                </div>
                
                {/* Template Info */}
                <div className="space-y-1">
                 <span className="text-sm font-medium text-muted-foreground">Template</span>
                 <div className="text-sm font-medium capitalize truncate">
                   {selectedTemplate.replace('-', ' ')}
                 </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {/* Zoom Controls */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Zoom</span>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50} className="px-2 py-1 rounded-sm flex-shrink-0">
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium text-center min-w-[3rem]">{zoomLevel}%</span>
                    <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200} className="px-2 py-1 rounded-sm flex-shrink-0">
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <span className="text-base sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Actions</span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleFullscreenToggle} className="w-full bg-amber-500 hover:bg-amber-400 px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                       <Maximize className="h-3 w-3 mr-1.5" />
                       Fullscreen
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Enter fullscreen preview mode</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleGenerateColors} disabled={isGenerating} className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                       {isGenerating ? <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1.5" />}
                       Generate
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Generate new color palette</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={() => canAccessAutoGenerator ? setShowAutoGenerateConfirmModal(true) : setUpsellModal({
                      isOpen: true,
                      templateName: 'Auto Generate'
                    })} className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                       <Sparkles className="h-3 w-3 mr-1.5" />
                       Auto Gen
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Generate multiple color palettes</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {canUseAIGeneration ? <Popover>
                          <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                               <Bot className="h-3 w-3 mr-1.5" />
                               AI Colors
                             </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-4" side="left" align="start">
                            <div className="space-y-3">
                              <h3 className="text-2xl sm:text-xl font-bold">AI Colors</h3>
                              <div className="space-y-2">
                                <AIColorGenerator isDarkMode={colorMode === 'dark'} onPaletteGenerated={handleAIPaletteGenerated} backgroundSettings={backgroundSettings} />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover> : <Button variant="outline" size="sm" className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold" onClick={() => setUpsellModal({
                      isOpen: true,
                      templateName: 'AI Colors'
                    })}>
                           <Bot className="h-3 w-3 mr-1.5" />
                           AI Colors 🔒
                         </Button>}
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Use AI to generate palettes based on mood or theme</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!canDownload()} className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                       <Download className="h-3 w-3 mr-1.5" />
                       Export PDF
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Export color palette as PDF</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleSave} className="w-full px-2 py-1.5 rounded-sm text-base sm:text-sm font-bold">
                       <Save className="h-3 w-3 mr-1.5" />
                       Save
                     </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm sm:text-xs font-normal">Save current palette</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Popups */}
        {/* Templates Popup */}
        <Drawer open={showTemplatesPopup} onOpenChange={setShowTemplatesPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Templates</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <Suspense fallback={<div className="text-sm text-muted-foreground">Loading templates...</div>}>
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate} 
                    onTemplateChange={setSelectedTemplate}
                    colorPalette={colorPalette}
                  />
                </Suspense>
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowTemplatesPopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Background Settings Popup */}
        <Drawer open={showBackgroundPopup} onOpenChange={setShowBackgroundPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Background Settings</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <BackgroundCustomizer
                  settings={backgroundSettings}
                  onSettingsChange={setBackgroundSettings}
                />
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowBackgroundPopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Theme Mode Popup */}
        <Drawer open={showThemeModePopup} onOpenChange={setShowThemeModePopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Theme Mode</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-3">Color Mode</h3>
                    <ColorModeSelector
                      selectedMode={colorMode}
                      onModeChange={handleModeChange}
                      disabled={!canAccessTemplateDarkMode}
                    />
                  </div>
                </div>
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowThemeModePopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Scheme Popup */}
        <Drawer open={showSchemePopup} onOpenChange={setShowSchemePopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Color Scheme</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <ColorSchemeSelector
                  selectedScheme={selectedScheme}
                  onSchemeChange={handleSchemeChange}
                />
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowSchemePopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Moods Popup */}
        <Drawer open={showMoodsPopup} onOpenChange={setShowMoodsPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Color Moods</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                {canAccessColorMood ? (
                  <InlineColorMoods
                    currentPalette={colorPalette}
                    onMoodSelect={handleMoodSelect}
                    selectedMoodId={selectedMoodId}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Color Moods require a Pro subscription</p>
                  </div>
                )}
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowMoodsPopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Presets Popup */}
        <Drawer open={showPresetsPopup} onOpenChange={setShowPresetsPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Admin Presets</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                {currentUser ? (
                  <Button
                    onClick={() => {
                      setShowPresetsPopup(false);
                      setActiveModal('admin-presets');
                    }}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Open Admin Presets
                  </Button>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Admin access required</p>
                  </div>
                )}
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowPresetsPopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Current Palette Popup */}
        <Drawer open={showCurrentPalettePopup} onOpenChange={setShowCurrentPalettePopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Current Palette</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <ColorControls
                  colorPalette={colorPalette}
                  onColorChange={handleColorChange}
                  lockedColors={lockedColors}
                  onToggleLock={handleToggleLock}
                />
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowCurrentPalettePopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Saved Palettes Popup */}
        <Drawer open={showSavedPalettePopup} onOpenChange={setShowSavedPalettePopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Saved Palettes</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <SavedPalettesContent
                  currentPalette={colorPalette}
                  currentTemplate={selectedTemplate}
                  onPaletteSelect={handleSavedPaletteSelect}
                />
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowSavedPalettePopup(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Save Palette Popup */}
        <Drawer open={showSavePalettePopup} onOpenChange={setShowSavePalettePopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Save Palette</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Save your current color palette for future use.
                  </p>
                  <Button
                    onClick={() => {
                      handleSave();
                      setShowSavePalettePopup(false);
                    }}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Current Palette
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    {savedPalettesCount}/{MAX_PALETTES} palettes saved
                  </div>
                </div>
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowSavePalettePopup(false)}
                  className="w-full"
                  variant="outline"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Image Upload Popup */}
        <Drawer open={showImageUploadPopup} onOpenChange={setShowImageUploadPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Generate from Image</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload an image to extract colors and generate a palette
                  </p>
                  <ImageUploadGenerator
                    onPaletteGenerated={(palette) => {
                      setColorPalette(palette);
                      setShowImageUploadPopup(false);
                    }}
                    isGenerating={isGenerating}
                    setIsGenerating={setIsGenerating}
                  />
                </div>
              </ScrollArea>
              <div className="flex-shrink-0 p-4 border-t bg-card">
                <Button 
                  onClick={() => setShowImageUploadPopup(false)}
                  className="w-full"
                  variant="outline"
                >
                  Done
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Export PDF Popup */}
        <Drawer open={showExportPopup} onOpenChange={setShowExportPopup}>
          <DrawerContent className="md:hidden fixed inset-0 z-[100] w-full h-full max-w-full max-h-full m-0 rounded-none border-0 p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="flex-shrink-0 px-4 py-3 border-b">
                <DrawerTitle className="text-lg font-semibold">Export PDF</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Save Palette */}
                  <div>
                    <h3 className="text-base font-medium mb-3">Save Palette</h3>
                    <Button
                      onClick={() => {
                        handleSave();
                        setShowExportPopup(false);
                      }}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Current Palette
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Saved: {savedPalettesCount}/{MAX_PALETTES} palettes
                    </p>
                  </div>
                  
                  {/* Export PDF */}
                  <div>
                    <h3 className="text-base font-medium mb-3">Export PDF</h3>
                    <Button
                      onClick={() => {
                        handleDownloadPDF();
                        setShowExportPopup(false);
                      }}
                      disabled={!canDownload()}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                    {!canDownload() && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Upgrade to Pro for unlimited PDF exports
                      </p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Modals */}
        <AdminPresetsModal isOpen={activeModal === 'admin-presets'} onClose={closeModal} onPresetSelect={palette => {
        setColorPalette(palette);
        closeModal();
      }} />


        {/* Pro Upsell Modal */}
        <ProUpsellModal isOpen={upsellModal.isOpen || activeModal === 'pro-upsell'} onClose={() => {
        setUpsellModal({
          isOpen: false,
          templateName: ''
        });
        setActiveModal(null);
      }} templateName={activeModal === 'pro-upsell' ? 'AI Colors' : upsellModal.templateName} />

        {/* Color Mood Modal */}
        <ColorMoodSelector isOpen={showColorMood} onClose={() => setShowColorMood(false)} onMoodSelect={(palette, moodId) => {
        handleMoodSelect(palette, moodId);
        setShowColorMood(false);
      }} currentPalette={colorPalette} />

         {/* PDF Export Modal */}
        <PDFExportModal isOpen={showPDFExportModal} onClose={() => setShowPDFExportModal(false)} onBasicExport={handleBasicPDFExport} onProfessionalExport={handleProfessionalPDFExport} isPro={isPro} colorPalette={colorPalette} templateName={selectedTemplate} />

        {/* Auto Generate Modals */}
        <AutoGenerateConfirmModal isOpen={showAutoGenerateConfirmModal} onClose={() => setShowAutoGenerateConfirmModal(false)} selectedTemplate={selectedTemplate} selectedScheme={selectedScheme} selectedMoodId={selectedMoodId} autogenerateCount={autogenerateCount} colorPalette={colorPalette} onGenerate={handleAutoGenerate} onShowGeneratedPalettes={() => {
        setShowAutoGenerateConfirmModal(false);
        setShowAutoGenerateResultsModal(true);
      }} hasGeneratedPalettes={generatedPalettes.length > 0} />

        <AutoGenerateResultsModal isOpen={showAutoGenerateResultsModal} onClose={() => setShowAutoGenerateResultsModal(false)} generatedPalettes={generatedPalettes} backgroundSettings={backgroundSettings} onApplyPalette={setColorPalette} onRegenerateClick={() => {
        setShowAutoGenerateResultsModal(false);
        setShowAutoGenerateConfirmModal(true);
      }} />

        {/* Floating Generate Button - Hidden on Mobile */}
        <Button onClick={handleGenerateColors} disabled={isGenerating} className="hidden md:block fixed bottom-6 right-6 h-12 w-12 rounded-sm floating-action z-50 p-2" size="icon">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </TooltipProvider>;
};
export default Dashboard;