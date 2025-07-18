import React, { useState, useEffect } from 'react';
import { Layout, Shapes, Sun, Moon, Sunset, Save, Download, Settings, Bot, Wand2, Image as ImageIcon, Shield, Share, ZoomIn, ZoomOut, Plus, User, LogOut, Sparkles, Eye, Maximize, RotateCcw, RefreshCw, BookOpen, PanelLeftClose, PanelLeftOpen, Palette, Menu, X, CloudSun } from 'lucide-react';
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
import ImageColorGenerator from '@/components/ImageColorGenerator';
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

  // New state for sidebar sections
  const [activeSection, setActiveSection] = useState<'templates' | 'schemes' | 'moods' | 'background-settings' | 'ai-colors' | 'from-image' | 'admin-presets' | 'saved-palettes' | 'settings' | 'test-plans'>('templates');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showColorMood, setShowColorMood] = useState(false);
  const [isContextPanelCollapsed, setIsContextPanelCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [showAutoGenerateConfirmModal, setShowAutoGenerateConfirmModal] = useState(false);
  const [showAutoGenerateResultsModal, setShowAutoGenerateResultsModal] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);

  // Set initial panel state based on mobile detection
  useEffect(() => {
    setIsContextPanelCollapsed(isMobile);
  }, [isMobile]);
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
    
    // Update dashboard dark mode based on color mode
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
    console.log('handleAutoGenerate called', { autogenerateCount, selectedTemplate });
    try {
      // Generate palettes using current studio settings
      const newPalettes = generatePaletteBatch(autogenerateCount).map(palette => ({
        ...palette,
        templateId: selectedTemplate,
        templateName: selectedTemplate.replace('-', ' ')
      }));
      
      setGeneratedPalettes(newPalettes);
      setShowAutoGenerateConfirmModal(false);
      setShowAutoGenerateResultsModal(true);
      
      toast({
        title: "Palettes Generated!",
        description: `Generated ${autogenerateCount} color palettes for ${selectedTemplate.replace('-', ' ')}`,
      });
    } catch (error) {
      console.error('Error in handleAutoGenerate:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate palettes. Please try again.",
        variant: "destructive"
      });
    }
  }, [autogenerateCount, selectedTemplate, setGeneratedPalettes, setShowAutoGenerateConfirmModal, setShowAutoGenerateResultsModal, toast]);
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
  const handleSidebarItemClick = (sectionId: typeof activeSection) => {
    if (activeSection === sectionId && !isContextPanelCollapsed) {
      // If clicking the same active section and panel is open, close it
      setIsContextPanelCollapsed(true);
    } else {
      // Otherwise, set the section and ensure panel is open
      setActiveSection(sectionId);
      setIsContextPanelCollapsed(false);
    }
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
    icon: Sparkles,
    label: 'Moods',
    available: canAccessColorMood
  }, {
    id: 'background-settings' as const,
    icon: Palette,
    label: 'Background',
    available: true
  }, {
    id: 'ai-colors' as const,
    icon: Bot,
    label: `AI Colors (${maxAIGenerationsPerMonth - remainingAIGenerations}/${maxAIGenerationsPerMonth})`,
    available: canUseAIGeneration,
    isPro: true
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
      <div className="h-screen flex flex-col bg-background">
        {/* Top Navigation Bar */}
        <div className="h-14 border-b border-white/20" style={{
        backgroundColor: '#3b82f6'
      }}>
          <div className="flex items-center justify-between px-4 h-full bg-blue-700">
            <div className="flex items-center space-x-4">
               <h1 className="text-base font-medium text-white">
                 Color Palette Generator
               </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* AI Quota Display */}
              {canUseAIGeneration && <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="text-sm text-white/80">
                    AI Colors: {maxAIGenerationsPerMonth - remainingAIGenerations}/{maxAIGenerationsPerMonth}
                  </span>
                </div>}

              {/* Plan Badge */}
              <Badge variant={isPro ? "default" : "secondary"} className="bg-white/20 text-white border-white/30">
                {isPro ? "Pro" : "Free"}
              </Badge>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-white border-[rgba(43,43,43,0.5)] hover:text-white hover:border-white/70 bg-gray-950 hover:bg-gray-800 px-2 py-1 rounded-sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Dashboard Dark Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button variant="ghost" size="sm" className="w-8 h-8 p-1 text-white hover:bg-white/20 hover:text-white rounded-sm" onClick={() => {
                  // Dashboard dark mode toggle - only affects dashboard UI
                  const newDashboardDarkMode = !isDashboardDarkMode;
                  setIsDashboardDarkMode(newDashboardDarkMode);
                  if (newDashboardDarkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  toast({
                    title: "Dashboard Dark Mode",
                    description: "Dashboard appearance changed. Use sidebar toggle to generate dark template colors.",
                    variant: "default"
                  });
                }}>
                    {isDashboardDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Dashboard {isDashboardDarkMode ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              </Tooltip>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer bg-white/20 hover:bg-white/30">
                    <AvatarFallback className="bg-transparent">
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div style={{
          backgroundColor: '#5b99fe'
        }} className="w-16 border-r flex flex-col items-center py-4 space-y-2 bg-sky-600">
            {sidebarItems.map(item => {
            if (!item.available) return null;
            return <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button variant={activeSection === item.id ? "default" : "ghost"} size="sm" className="w-8 h-8 p-1 relative text-white hover:bg-white/20 rounded-sm" onClick={() => handleSidebarItemClick(item.id)}>
                      <item.icon className="h-5 w-5 text-white" />
                      {item.isPro && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <Sparkles className="h-2 w-2 text-blue-600" />
                        </div>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>;
          })}

            {/* Template Theme Mode Selector */}
            <div className="flex-1" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-1 text-white hover:bg-white/20 rounded-sm">
                  {colorMode === 'light' ? <Sun className="h-4 w-4" /> : 
                   colorMode === 'light-midtone' ? <CloudSun className="h-4 w-4" /> :
                   colorMode === 'midtone' ? <Sunset className="h-4 w-4" /> : 
                   colorMode === 'midtone-dark' ? <Moon className="h-4 w-4" style={{ filter: 'brightness(0.7)' }} /> :
                   <Moon className="h-4 w-4" />}
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
                        available: true 
                      },
                      { 
                        mode: 'light-midtone' as ColorMode, 
                        label: 'Light Midtone', 
                        description: 'Lightness 70-84', 
                        icon: CloudSun,
                        available: canAccessTemplateDarkMode 
                      },
                      { 
                        mode: 'midtone' as ColorMode, 
                        label: 'Midtone', 
                        description: 'Lightness 45-65', 
                        icon: Sunset,
                        available: canAccessTemplateDarkMode 
                      },
                      { 
                        mode: 'midtone-dark' as ColorMode, 
                        label: 'Midtone Dark', 
                        description: 'Lightness 30-44', 
                        icon: Moon,
                        available: canAccessTemplateDarkMode 
                      },
                      { 
                        mode: 'dark' as ColorMode, 
                        label: 'Dark', 
                        description: 'Lightness 10-25', 
                        icon: Moon,
                        available: canAccessTemplateDarkMode 
                      }
                    ].map(({ mode, label, description, icon: Icon, available }) => (
                       <Button
                         key={mode}
                         variant={colorMode === mode ? "default" : "outline"}
                         size="sm"
                         className="justify-start h-auto px-2 py-1 relative rounded-sm"
                         disabled={!available}
                         onClick={() => {
                          if (!available) {
                            setUpsellModal({
                              isOpen: true,
                              templateName: 'Template dark mode'
                            });
                            return;
                          }
                          handleModeChange(mode);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-3 flex-shrink-0" style={mode === 'midtone-dark' ? { filter: 'brightness(0.7)' } : {}} />
                        <div className="text-left">
                           <div className="font-medium text-xs">{label}</div>
                           <div className="text-[11px] text-muted-foreground">{description}</div>
                        </div>
                        {!available && (
                           <Badge variant="secondary" className="ml-auto text-[11px] px-1 py-0">
                             Pro
                           </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                   <div className="text-[11px] text-muted-foreground pt-2 border-t">
                     Theme modes control the lightness range of generated colors
                   </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Context Panel */}
          {!isContextPanelCollapsed && <div className="w-80 min-w-80 max-w-80 bg-background border-r flex flex-col">
            <div className="p-4 border-b flex items-center justify-between h-12 bg-green-200">
               <h2 className="text-base font-semibold text-foreground">
                 {sidebarItems.find(item => item.id === activeSection)?.label}
               </h2>
               <Button variant="ghost" size="sm" onClick={() => setIsContextPanelCollapsed(true)} className="h-6 w-6 p-1 rounded-sm">
                 <PanelLeftClose className="h-4 w-4" />
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              {activeSection === 'templates' && 
                <TemplatesSection 
                  selectedTemplate={selectedTemplate} 
                  onTemplateChange={setSelectedTemplate} 
                  colorPalette={colorPalette} 
                />
              }

              {activeSection === 'schemes' && <div className="space-y-4">
                   <p className="text-xs text-muted-foreground">
                     Choose a color scheme to generate harmonious palettes.
                   </p>
                  <ColorSchemeSelector selectedScheme={selectedScheme} onSchemeChange={handleSchemeChange} onGenerateScheme={handleGenerateColors} isGenerating={isGenerating} />
                </div>}

              {activeSection === 'moods' && <InlineColorMoods onMoodSelect={handleMoodSelect} currentPalette={colorPalette} selectedMoodId={selectedMoodId} />}

              {activeSection === 'background-settings' && <div className="space-y-4">
                  <BackgroundCustomizer settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
                </div>}

              {activeSection === 'ai-colors' && <AIColorGenerator
                isDarkMode={colorMode === 'dark'} 
                onPaletteGenerated={handleAIPaletteGenerated}
                backgroundSettings={backgroundSettings}
              />}

              {activeSection === 'from-image' && <ImageColorGenerator onPaletteGenerated={setColorPalette} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />}

              {activeSection === 'admin-presets' && <div className="space-y-4">
                   <p className="text-xs text-muted-foreground">
                     Browse and apply professionally curated color palettes.
                   </p>
                   <Button onClick={() => setActiveModal('admin-presets')} className="w-full px-2 py-1 rounded-sm">
                     Browse Color Presets
                   </Button>
                </div>}
              {activeSection === 'saved-palettes' && <SavedPalettesContent currentPalette={colorPalette} currentTemplate={selectedTemplate} onPaletteSelect={handleSavedPaletteSelect} onTemplateChange={setSelectedTemplate} />}
              {activeSection === 'settings' && <div className="space-y-4">
                   <h3 className="text-sm font-medium">Application Settings</h3>
                   <p className="text-xs text-muted-foreground">
                     Configure your preferences and account settings.
                   </p>
                  
                  <div className="space-y-3">
                    <OpenAIKeyInput onKeySet={() => {}} />
                  </div>
                   <Button variant="outline" className="w-full px-2 py-1 rounded-sm" onClick={() => navigate('/history')}>
                     View History
                   </Button>
                </div>}

              {activeSection === 'test-plans' && <div className="space-y-4">
                   <h3 className="text-sm font-medium">Test Plan Switcher</h3>
                   <p className="text-xs text-muted-foreground">
                     Simulate different subscription plans for testing UI features. 
                     This override is temporary and only affects the current session.
                   </p>
                  <TestPlanSwitcher />
                </div>}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t space-y-2 bg-sky-200">
              {/* Main Generate Buttons - Responsive Layout */}
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={handleGenerateColors} className="w-full text-[11px] sm:text-xs h-8 sm:h-9 whitespace-normal leading-tight px-2 py-1 rounded-sm" disabled={isGenerating}>
                  {isGenerating ? <RefreshCw className="mr-1 h-3 w-3 sm:h-4 sm:w-4 animate-spin flex-shrink-0" /> : <Wand2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                  Generate Colors
                </Button>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button onClick={canUseAIGeneration ? () => setActiveSection('ai-colors') : () => setActiveModal('pro-upsell')} variant={canUseAIGeneration ? "default" : "outline"} disabled={isGenerating} className="w-full text-[11px] h-8 sm:h-9 whitespace-normal leading-tight bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium sm:text-xs px-2 py-1 rounded-sm">
                       <Bot className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                       AI Colors {!canUseAIGeneration && '🔒 PRO'}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Use AI to generate palettes based on mood or theme
                  </TooltipContent>
                </Tooltip>
              </div>
              
            </div>
            </div>}

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col bg-muted/30">
            {/* Canvas Toolbar */}
            <div style={{
            backgroundColor: '#fef3e0'
          }} className="h-12 border-b flex items-center justify-between px-2 sm:px-4 bg-sky-200">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => setIsContextPanelCollapsed(!isContextPanelCollapsed)} className="hidden sm:flex px-1 py-1 rounded-sm">
                       {isContextPanelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isContextPanelCollapsed ? 'Show Panel' : 'Hide Panel'}
                  </TooltipContent>
                </Tooltip>
                
                {/* Mobile hamburger menu */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden px-1 py-1 rounded-sm"
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
                
                 <span className="text-xs text-muted-foreground hidden sm:block">Template Preview</span>
                 <span className="text-[11px] text-muted-foreground hidden sm:block">•</span>
                 <span className="text-[11px] text-muted-foreground capitalize hidden sm:block">
                   {selectedTemplate.replace('-', ' ')}
                 </span>
                 <span className="text-xs text-muted-foreground sm:hidden">
                   {selectedTemplate.replace('-', ' ')}
                 </span>
              </div>
              
              {/* Desktop controls */}
              <div className="hidden sm:flex items-center space-x-2">
                 <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50} className="px-1 py-1 rounded-sm">
                   <ZoomOut className="h-4 w-4" />
                 </Button>
                <span className="text-xs text-muted-foreground min-w-12 text-center">{zoomLevel}%</span>
                 <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200} className="px-1 py-1 rounded-sm">
                   <ZoomIn className="h-4 w-4" />
                 </Button>
                 <Tooltip>
                   <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleGenerateColors} disabled={isGenerating} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-sm">
                        {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                        Generate
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent>Generate new color palette</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => canAccessAutoGenerator ? setShowAutoGenerateConfirmModal(true) : setUpsellModal({ isOpen: true, templateName: 'Auto Generate feature' })} className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto Generate
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent>Generate multiple color palettes</TooltipContent>
                 </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!canDownload()} className="px-2 py-1 rounded-sm">
                       <Download className="h-4 w-4 mr-2" />
                       Export PDF
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export color palette as PDF</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="outline" size="sm" onClick={handleSave} className="px-2 py-1 rounded-sm">
                       <Save className="h-4 w-4 mr-2" />
                       Save
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save current palette</TooltipContent>
                </Tooltip>
                <Button variant="outline" size="sm" onClick={handleFullscreenToggle} className="bg-amber-500 hover:bg-amber-400 px-2 py-1 rounded-sm">
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
              
              {/* Mobile zoom controls only */}
              <div className="flex sm:hidden items-center space-x-1">
                 <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50} className="h-6 w-6 p-1 rounded-sm">
                   <ZoomOut className="h-3 w-3" />
                 </Button>
                <span className="text-[11px] text-muted-foreground min-w-8 text-center">{zoomLevel}%</span>
                 <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200} className="h-6 w-6 p-1 rounded-sm">
                   <ZoomIn className="h-3 w-3" />
                 </Button>
              </div>
            </div>

            {/* Mobile dropdown menu */}
            {isMobileMenuOpen && (
              <div className="sm:hidden bg-background border-b border-border p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm" onClick={() => { handleGenerateColors(); setIsMobileMenuOpen(false); }} disabled={isGenerating} className="bg-green-500 hover:bg-green-600 text-white text-[11px] px-2 py-1 rounded-sm">
                     {isGenerating ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
                     Generate
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => { handleDownloadPDF(); setIsMobileMenuOpen(false); }} disabled={!canDownload()} className="text-[11px] px-2 py-1 rounded-sm">
                     <Download className="h-3 w-3 mr-1" />
                     Export PDF
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => { handleSave(); setIsMobileMenuOpen(false); }} className="text-[11px] px-2 py-1 rounded-sm">
                     <Save className="h-3 w-3 mr-1" />
                     Save
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => { handleFullscreenToggle(); setIsMobileMenuOpen(false); }} className="bg-amber-500 hover:bg-amber-400 text-[11px] px-2 py-1 rounded-sm">
                     <Maximize className="h-3 w-3 mr-1" />
                     Fullscreen
                   </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setIsContextPanelCollapsed(!isContextPanelCollapsed); setIsMobileMenuOpen(false); }}
                  className="w-full justify-start text-[11px] px-2 py-1 rounded-sm"
                >
                  {isContextPanelCollapsed ? <PanelLeftOpen className="h-3 w-3 mr-2" /> : <PanelLeftClose className="h-3 w-3 mr-2" />}
                  {isContextPanelCollapsed ? 'Show Panel' : 'Hide Panel'}
                </Button>
              </div>
            )}

            {/* Canvas */}
            <div className="flex-1 overflow-auto flex items-start justify-center bg-sky-200">
              <div className="bg-background border rounded-lg shadow-lg transition-transform duration-200 min-h-full m-2 sm:m-5" style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: isMobile ? 
                'calc(100vw - 16px)' : // Full width minus equal margins (8px each side)
                `calc(100vw - ${isContextPanelCollapsed ? '104px' : '424px'})`, // Sidebar + panel width + equal margins (40px total)
              minHeight: '400px'
            }} data-preview-element>
                <div className="w-full h-auto overflow-visible">
                  <LivePreview template={selectedTemplate} colorPalette={colorPalette} backgroundSettings={backgroundSettings} />
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
        <PDFExportModal
          isOpen={showPDFExportModal}
          onClose={() => setShowPDFExportModal(false)}
          onBasicExport={handleBasicPDFExport}
          onProfessionalExport={handleProfessionalPDFExport}
          isPro={isPro}
          colorPalette={colorPalette}
          templateName={selectedTemplate}
        />

        {/* Auto Generate Modals */}
        <AutoGenerateConfirmModal
          isOpen={showAutoGenerateConfirmModal}
          onClose={() => setShowAutoGenerateConfirmModal(false)}
          selectedTemplate={selectedTemplate}
          selectedScheme={selectedScheme}
          selectedMoodId={selectedMoodId}
          autogenerateCount={autogenerateCount}
          colorPalette={colorPalette}
          onGenerate={handleAutoGenerate}
          onShowGeneratedPalettes={() => {
            setShowAutoGenerateConfirmModal(false);
            setShowAutoGenerateResultsModal(true);
          }}
          hasGeneratedPalettes={generatedPalettes.length > 0}
        />

        <AutoGenerateResultsModal
          isOpen={showAutoGenerateResultsModal}
          onClose={() => setShowAutoGenerateResultsModal(false)}
          generatedPalettes={generatedPalettes}
          backgroundSettings={backgroundSettings}
          onApplyPalette={setColorPalette}
          onRegenerateClick={() => {
            setShowAutoGenerateResultsModal(false);
            setShowAutoGenerateConfirmModal(true);
          }}
        />

        {/* Floating Generate Button */}
        <Button
          onClick={handleGenerateColors}
          disabled={isGenerating}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 z-50 p-2"
          size="icon"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </TooltipProvider>;
};
export default Dashboard;