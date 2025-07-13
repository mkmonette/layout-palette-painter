import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Shapes, 
  Sun, 
  Moon, 
  Save, 
  Download, 
  Settings, 
  Bot, 
  Wand2, 
  Image as ImageIcon, 
  Shield,
  Undo,
  Redo,
  Share,
  ZoomIn,
  ZoomOut,
  Plus,
  User,
  LogOut,
  Sparkles,
  Eye,
  Maximize,
  RotateCcw,
  RefreshCw,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TemplateSelector from '@/components/TemplateSelector';
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
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { generateColorPalettePDF } from '@/utils/pdfGenerator';
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
import { initializeOpenAI } from '@/utils/openaiService';
import { validatePaletteContrast, getAccessibleVersion } from '@/utils/contrastChecker';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const { isPro, canAccessDarkMode, canAccessColorSchemes, canAccessColorMood, canAccessAutoGenerator } = useFeatureAccess();
  const { canDownload, getRemainingDownloads, incrementDownload } = useDownloadLimits();

  const { getSavedCount, loadSavedPalettes, MAX_PALETTES } = useSavedPalettes();
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; templateName: string }>({ isOpen: false, templateName: '' });
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
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

  // New state for sidebar sections
  const [activeSection, setActiveSection] = useState<'templates' | 'schemes' | 'moods' | 'ai-colors' | 'auto-generate' | 'from-image' | 'admin-presets' | 'saved-palettes' | 'settings'>('templates');
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showColorMood, setShowColorMood] = useState(false);
  const [isContextPanelCollapsed, setIsContextPanelCollapsed] = useState(false);
  const { remainingAIGenerations, maxAIGenerationsPerMonth, canUseAIGeneration } = useFeatureAccess();

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
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleGenerateColors = async () => {
    if (isGenerating) return; // Prevent multiple simultaneous generations
    
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(selectedScheme, isDarkMode, colorPalette, lockedColors, false, selectedMoodId);
        setColorPalette(newPalette);
      } catch (error) {
        // If accessibility mode fails, fall back to regular generation
        if (error instanceof Error && error.message.includes('No accessible palette found')) {
          toast({
            title: "⚠️ No Contrast-Safe Palettes Found",
            description: "Generating regular palette instead. Try adjusting mood or scheme for accessible colors.",
            variant: "destructive",
          });
          // Generate regular palette as fallback
          const fallbackPalette = generateColorSchemeWithLocks(selectedScheme, isDarkMode, colorPalette, lockedColors, false, selectedMoodId);
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

  const handleModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    try {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, checked, colorPalette, lockedColors, false);
      setColorPalette(newPalette);
    } catch (error) {
      if (error instanceof Error && error.message.includes('No accessible palette found')) {
        toast({
          title: "⚠️ No Contrast-Safe Palettes Found",
          description: "No contrast-safe palettes found for current settings. Try adjusting mood or scheme.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSchemeChange = (scheme: ColorSchemeType) => {
    setSelectedScheme(scheme);
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
    const result = { ...palette };
    
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
              description: `Adjusted ${issue.textRole} for better readability`,
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

  const handleDownloadPDF = async () => {
    if (!canDownload()) {
      setUpsellModal({ isOpen: true, templateName: 'PDF downloads' });
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

    try {
      const previewElement = document.querySelector('[data-preview-element]') as HTMLElement;
      if (!previewElement) {
        // Fallback to finding the live preview container
        const livePreviewContainer = document.querySelector('.min-h-full.transition-transform') as HTMLElement;
        if (!livePreviewContainer) {
          toast({
            title: "Error",
            description: "Could not find template preview to capture.",
            variant: "destructive",
          });
          return;
        }
        await generateColorPalettePDF({
          colorPalette,
          templateName: selectedTemplate.replace('-', ' '),
          previewElement: livePreviewContainer,
          isDarkMode,
          isPro,
        });
      } else {
        await generateColorPalettePDF({
          colorPalette,
          templateName: selectedTemplate.replace('-', ' '),
          previewElement,
          isDarkMode,
          isPro,
        });
      }
      
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
    return (
      <FullscreenPreview
        template={selectedTemplate}
        colorPalette={colorPalette}
        selectedScheme={selectedScheme}
        isDarkMode={isDarkMode}
        isGenerating={isGenerating}
        autogenerateCount={autogenerateCount}
        onClose={() => setIsFullscreen(false)}
        onGenerateColors={handleGenerateColors}
        onSchemeChange={handleSchemeChange}
        onTemplateChange={setSelectedTemplate}
        onColorChange={(palette, moodId) => {
          setColorPalette(palette);
          if (moodId !== undefined) setSelectedMoodId(moodId);
        }}
        onModeToggle={handleModeToggle}
        onDownloadPDF={handleDownloadPDF}
        onAutogenerateCountChange={setAutogenerateCount}
      />
    );
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

  const sidebarItems = [
    { id: 'templates' as const, icon: Palette, label: 'Templates', available: true },
    { id: 'schemes' as const, icon: Shapes, label: 'Schemes', available: canAccessColorSchemes },
    { id: 'moods' as const, icon: Sparkles, label: 'Moods', available: canAccessColorMood },
    { id: 'ai-colors' as const, icon: Bot, label: 'AI Colors', available: canUseAIGeneration, isPro: true },
    { id: 'auto-generate' as const, icon: Wand2, label: 'Auto Generate', available: canAccessAutoGenerator, isPro: true },
    { id: 'from-image' as const, icon: ImageIcon, label: 'From Image', available: true },
    { id: 'admin-presets' as const, icon: Shield, label: 'Admin Presets', available: true },
    { id: 'saved-palettes' as const, icon: Save, label: 'Saved Palettes', available: true },
    { id: 'settings' as const, icon: Settings, label: 'Settings', available: true }
  ];

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Top Navigation Bar */}
        <div className="h-14 border-b bg-card flex items-center justify-between px-4 z-10">
          <div className="flex items-center space-x-4">
            {isEditingName ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="bg-transparent text-foreground font-medium text-lg outline-none border-b border-border"
                autoFocus
              />
            ) : (
              <h1 
                className="text-lg font-medium text-foreground cursor-pointer hover:text-primary"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
              </h1>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* AI Quota Display */}
            {canUseAIGeneration && (
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  AI Colors: {maxAIGenerationsPerMonth - remainingAIGenerations}/{maxAIGenerationsPerMonth}
                </span>
              </div>
            )}

            {/* Plan Badge */}
            <Badge variant={isPro ? "default" : "secondary"}>
              {isPro ? "Pro" : "Free"}
            </Badge>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>

              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
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

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-16 bg-card border-r flex flex-col items-center py-4 space-y-2">
            {sidebarItems.map((item) => {
              if (!item.available) return null;
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeSection === item.id ? "default" : "ghost"}
                      size="sm"
                      className="w-10 h-10 p-0 relative"
                      onClick={() => handleSidebarItemClick(item.id)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.isPro && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="h-2 w-2 text-primary-foreground" />
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}

            {/* Dark Mode Toggle */}
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => {
                    if (!canAccessDarkMode) {
                      setUpsellModal({ isOpen: true, templateName: 'Dark mode' });
                      return;
                    }
                    handleModeToggle(!isDarkMode);
                  }}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Context Panel */}
          {!isContextPanelCollapsed && (
            <div className="w-80 bg-background border-r flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsContextPanelCollapsed(true)}
                className="h-8 w-8 p-0"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeSection === 'templates' && (
                <div className="space-y-6">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                    colorPalette={colorPalette}
                  />
                  <BackgroundCustomizer
                    settings={backgroundSettings}
                    onSettingsChange={setBackgroundSettings}
                  />
                </div>
              )}

              {activeSection === 'schemes' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose a color scheme to generate harmonious palettes.
                  </p>
                  <ColorSchemeSelector
                    selectedScheme={selectedScheme}
                    onSchemeChange={handleSchemeChange}
                    onGenerateScheme={handleGenerateColors}
                    isGenerating={isGenerating}
                  />
                </div>
              )}

              {activeSection === 'moods' && (
                <InlineColorMoods
                  onMoodSelect={handleMoodSelect}
                  currentPalette={colorPalette}
                  selectedMoodId={selectedMoodId}
                />
              )}

              {activeSection === 'ai-colors' && (
                <AIColorGenerator 
                  isDarkMode={isDarkMode}
                  onPaletteGenerated={handleAIPaletteGenerated}
                />
              )}

              {activeSection === 'auto-generate' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate multiple color palettes automatically.
                  </p>
                  <Button 
                    onClick={handleGenerateColors}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    Auto Generate Sets
                  </Button>
                </div>
              )}

              {activeSection === 'from-image' && (
                <ImageColorGenerator
                  onPaletteGenerated={setColorPalette}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              )}

              {activeSection === 'admin-presets' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Browse and apply professionally curated color palettes.
                  </p>
                  <Button 
                    onClick={() => setActiveModal('admin-presets')}
                    className="w-full"
                  >
                    Browse Admin Presets
                  </Button>
                </div>
              )}

              {activeSection === 'saved-palettes' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Access your saved color palettes.
                  </p>
                  <Button 
                    onClick={() => setActiveModal('saved')}
                    className="w-full"
                  >
                    View Saved Palettes ({savedPalettesCount}/{MAX_PALETTES})
                  </Button>
                </div>
              )}

              {activeSection === 'settings' && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Application Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your preferences and account settings.
                  </p>
                  <div className="space-y-3">
                    <OpenAIKeyInput onKeySet={() => {}} />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
                    View History
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t space-y-2">
              {/* Main Generate Buttons - Responsive Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                  onClick={handleGenerateColors}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 whitespace-normal leading-tight"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="mr-1 h-3 w-3 sm:h-4 sm:w-4 animate-spin flex-shrink-0" />
                  ) : (
                    <Palette className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  )}
                  🎨 Generate Colors
                </Button>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={canUseAIGeneration ? () => setActiveSection('ai-colors') : () => setActiveModal('pro-upsell')}
                      className="w-full text-xs sm:text-sm h-9 sm:h-10 whitespace-normal leading-tight"
                      variant={canUseAIGeneration ? "default" : "outline"}
                      disabled={isGenerating}
                    >
                      <Bot className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      AI Colors {!canUseAIGeneration && '🔒 PRO'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Use AI to generate palettes based on mood or theme
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadPDF}
                  className="flex-1"
                  disabled={!canDownload()}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setActiveModal('saved')}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            </div>
          )}

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col bg-muted/30">
            {/* Canvas Toolbar */}
            <div className="h-12 bg-background border-b flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsContextPanelCollapsed(!isContextPanelCollapsed)}
                    >
                      {isContextPanelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isContextPanelCollapsed ? 'Show Panel' : 'Hide Panel'}
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm text-muted-foreground">Template Preview</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {selectedTemplate.replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-12 text-center">{zoomLevel}%</span>
                <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
                <Button variant="outline" size="sm" onClick={handleFullscreenToggle}>
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden p-2 flex items-center justify-center">
              <div 
                className="bg-background border rounded-lg shadow-lg transition-transform duration-200 w-full h-full max-w-none"
                style={{ 
                  transform: `scale(${zoomLevel / 100})`,
                  maxWidth: `calc(100vw - ${isContextPanelCollapsed ? '80px' : '400px'})`, // Dynamic based on panel state
                  maxHeight: 'calc(100vh - 120px)', // Account for top bar and toolbar
                  aspectRatio: '16/9',
                  width: `min(100%, calc((100vh - 120px) * 16/9))`, // Fit by height
                  height: `min(calc(100vw - ${isContextPanelCollapsed ? '80px' : '400px'}) * 9/16, calc(100vh - 120px))` // Fit by width
                }}
                data-preview-element
              >
                <div className="w-full h-full overflow-hidden">
                  <LivePreview
                    template={selectedTemplate}
                    colorPalette={colorPalette}
                    backgroundSettings={backgroundSettings}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modals */}
        <AdminPresetsModal
          isOpen={activeModal === 'admin-presets'}
          onClose={closeModal}
          onPresetSelect={(palette) => {
            setColorPalette(palette);
            closeModal();
          }}
        />

        <SavedPalettesModal
          isOpen={activeModal === 'saved'}
          onClose={closeModal}
          currentPalette={colorPalette}
          currentTemplate={selectedTemplate}
          onPaletteSelect={handleSavedPaletteSelect}
          onTemplateChange={setSelectedTemplate}
        />

        {/* Pro Upsell Modal */}
        <ProUpsellModal
          isOpen={upsellModal.isOpen || activeModal === 'pro-upsell'}
          onClose={() => {
            setUpsellModal({ isOpen: false, templateName: '' });
            setActiveModal(null);
          }}
          templateName={activeModal === 'pro-upsell' ? 'AI Colors' : upsellModal.templateName}
        />

        {/* Color Mood Modal */}
        <ColorMoodSelector
          isOpen={showColorMood}
          onClose={() => setShowColorMood(false)}
          onMoodSelect={(palette, moodId) => {
            handleMoodSelect(palette, moodId);
            setShowColorMood(false);
          }}
          currentPalette={colorPalette}
        />
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
