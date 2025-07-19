import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Shapes, Sun, Moon, Sunset, Save, Download, Settings, Bot, Wand2, Image as ImageIcon, Shield, Share, ZoomIn, ZoomOut, Plus, User, LogOut, Sparkles, Eye, Maximize, RotateCcw, RefreshCw, BookOpen, PanelLeftClose, PanelLeftOpen, Palette, Menu, X, CloudSun, LayoutDashboard, Layers, Lock, Unlock, Coins } from 'lucide-react';
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
  const [showAutoGenerateConfirmModal, setShowAutoGenerateConfirmModal] = useState(false);
  const [showAutoGenerateResultsModal, setShowAutoGenerateResultsModal] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const {
    remainingAIGenerations,
    maxAIGenerationsPerMonth,
    canUseAIGeneration
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
      <div className="h-screen flex flex-col bg-background workspace-background relative">
        {/* Vibrant animated background overlay */}
        <div className="absolute inset-0 workspace-background opacity-60 z-0" />
        
        {/* Top Navigation Bar */}
        <div className="h-14 border-b border-border bg-card/90 backdrop-blur-md relative z-10">
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

        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Left Sidebar */}
          <div className="w-48 studio-sidebar flex flex-col py-2 space-y-1">
            {sidebarItems.map(item => {
            if (!item.available) return null;
            return <Popover key={item.id}>
                  <PopoverTrigger asChild>
                     <Button variant="ghost" size="sm" className="w-full h-8 justify-start px-3 relative text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                       <item.icon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />
                       <span className="text-sm text-sidebar-foreground truncate">{item.label}</span>
                    </Button>
                  </PopoverTrigger>
                   <PopoverContent className={`${item.id === 'templates' ? 'w-48' : item.id === 'schemes' ? 'w-80' : item.id === 'moods' ? 'w-64' : 'w-64'} p-0`} side="right" align="start">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium text-sm">{item.label}</h3>
                    </div>
                     {item.id === 'templates' ?
                // No ScrollArea for templates - just natural height
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
                                    <Button variant="outline" className="w-full justify-start h-auto px-3 py-2 rounded-sm" onClick={() => console.log('Default Templates button clicked')}>
                                      <span className="text-base sm:text-sm font-medium tracking-tight">🟦 Default Templates</span>
                                    </Button>
                                  </PopoverTrigger>
                                    <PopoverContent className="w-[500px] p-4" side="right" align="start" alignOffset={-100} sideOffset={20} avoidCollisions={false} onOpenAutoFocus={() => console.log('Default Templates popover opened')}>
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
                                  </PopoverContent>
                                </Popover>
                               
                                {/* Custom Templates Popover */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start h-auto px-3 py-2 rounded-sm" onClick={() => console.log('Custom Templates button clicked')}>
                                      <span className="text-base sm:text-sm font-medium tracking-tight">🟩 Custom Templates</span>
                                    </Button>
                                  </PopoverTrigger>
                                    <PopoverContent className="w-[500px] p-4" side="right" align="start" alignOffset={-100} sideOffset={20} avoidCollisions={false} onOpenAutoFocus={() => console.log('Custom Templates popover opened')}>
                                    <div className="space-y-3">
                                      <h3 className="text-2xl sm:text-xl font-bold">Custom Templates</h3>
                                      <div className="max-h-96 overflow-y-auto">
                                        <Suspense fallback={<div className="text-sm sm:text-xs font-normal text-muted-foreground">Loading custom templates...</div>}>
                                          <TemplatesSection selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} colorPalette={colorPalette} showOnlyCustom={true} />
                                        </Suspense>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                             </div>
                           </div>
                         </div>
                       </div> : item.id === 'schemes' ?
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

                             {item.id === 'from-image' && <div className="space-y-2">
                                <p className="text-base sm:text-sm font-normal text-muted-foreground leading-relaxed">
                                  Extract color palettes from images or websites.
                                </p>
                                 
                                 {/* Upload Image Popover */}
                                 <Popover>
                                   <PopoverTrigger asChild>
                                     <Button variant="outline" className="w-full justify-start h-auto px-3 py-2 rounded-sm">
                                       <span className="text-xs">📷 Upload Image</span>
                                     </Button>
                                   </PopoverTrigger>
                                    <PopoverContent className="w-64 p-4" side="right" align="start">
                                     <div className="space-y-3">
                                       <h3 className="font-medium text-xs">Upload Image</h3>
                                       <ImageUploadGenerator onPaletteGenerated={setColorPalette} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
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
                                    <PopoverContent className="w-64 p-4" side="right" align="start">
                                     <div className="space-y-3">
                                       <h3 className="font-medium text-xs">Website URL</h3>
                                       <WebsiteColorGenerator onPaletteGenerated={setColorPalette} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
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
                  </PopoverContent>
                </Popover>;
          })}

            {/* Template Theme Mode Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full h-8 justify-start px-3 relative text-sidebar-foreground hover:bg-sidebar-accent rounded-sm">
                  {colorMode === 'light' ? <Sun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'light-midtone' ? <CloudSun className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'midtone' ? <Sunset className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" /> : colorMode === 'midtone-dark' ? <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0 opacity-70" /> : <Moon className="h-4 w-4 text-sidebar-foreground mr-3 flex-shrink-0" />}
                  <span className="text-sm text-sidebar-foreground truncate">Theme Mode</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" side="right" align="end">
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
             </PopoverContent>
            </Popover>
          </div>


          {/* Main Content Area with Right Sidebar */}
          <div className="flex-1 flex bg-card/40 backdrop-blur-sm">
            {/* Canvas */}
            <div className="flex-1 overflow-auto flex items-start justify-center bg-card/20 backdrop-blur-sm">
              <div className="bg-background border rounded-lg shadow-lg transition-transform duration-200 min-h-full m-2 sm:m-5" style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: isMobile ? 'calc(100vw - 16px)' :
              // Full width minus right sidebar and margins
              'calc(100vw - 400px)',
              // Left sidebar (192px) + right sidebar (192px) + margins (16px)
              minHeight: '400px'
            }} data-preview-element>

            {/* Mobile dropdown menu */}
            {isMobileMenuOpen && <div className="sm:hidden absolute top-0 left-0 right-0 bg-background border-b border-border p-4 space-y-2 z-50">
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm" onClick={() => {
                    handleGenerateColors();
                    setIsMobileMenuOpen(false);
                  }} disabled={isGenerating} className="text-base sm:text-sm font-bold px-2 py-1 rounded-sm">
                     {isGenerating ? <RefreshCw className="h-3 w-3 mr-2 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                     Generate
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => {
                    handleDownloadPDF();
                    setIsMobileMenuOpen(false);
                  }} disabled={!canDownload()} className="text-base sm:text-sm font-bold px-2 py-1 rounded-sm">
                     <Download className="h-3 w-3 mr-2" />
                     Export PDF
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => {
                    handleSave();
                    setIsMobileMenuOpen(false);
                  }} className="text-base sm:text-sm font-bold px-2 py-1 rounded-sm">
                     <Save className="h-3 w-3 mr-2" />
                     Save
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => {
                    handleFullscreenToggle();
                    setIsMobileMenuOpen(false);
                  }} className="text-base sm:text-sm font-bold px-2 py-1 rounded-sm">
                     <Maximize className="h-3 w-3 mr-2" />
                     Fullscreen
                   </Button>
                </div>
              </div>}
                <div className="w-full h-auto overflow-visible">
                  <LivePreview template={selectedTemplate} colorPalette={colorPalette} backgroundSettings={backgroundSettings} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-48 bg-card/80 backdrop-blur-md border-l border-border flex flex-col">
              {/* Sidebar Header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl sm:text-lg font-semibold">Controls</span>
                  {/* Mobile hamburger menu for right sidebar */}
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="sm:hidden px-1 py-1 rounded-sm">
                    {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Template Info */}
                <div className="space-y-1">
                 <span className="text-base sm:text-sm font-medium text-muted-foreground">Template</span>
                 <div className="text-base sm:text-sm font-medium capitalize">
                   {selectedTemplate.replace('-', ' ')}
                 </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 p-3 space-y-3">
                {/* Zoom Controls */}
                <div className="space-y-2">
                  <span className="text-base sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Zoom</span>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50} className="px-1 py-1 rounded-sm">
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-sm sm:text-xs font-medium text-center">{zoomLevel}%</span>
                    <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200} className="px-1 py-1 rounded-sm">
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

        {/* Floating Generate Button */}
        <Button onClick={handleGenerateColors} disabled={isGenerating} className="fixed bottom-6 right-6 h-12 w-12 rounded-sm floating-action z-50 p-2" size="icon">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </TooltipProvider>;
};
export default Dashboard;