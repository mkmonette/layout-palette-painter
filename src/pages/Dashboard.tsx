import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Settings, Eye, Moon, Sun, Maximize, ZoomIn, ZoomOut, RotateCcw, Download, Sparkles } from 'lucide-react';
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
import AccessibilityIndicator from '@/components/AccessibilityIndicator';
import ImageColorGenerator from '@/components/ImageColorGenerator';
import BackgroundModeSelector, { BackgroundMode } from '@/components/BackgroundModeSelector';

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
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [autogenerateCount, setAutogenerateCount] = useState(10);
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; templateName: string }>({ isOpen: false, templateName: '' });
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [showAccessibilityReport, setShowAccessibilityReport] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('midtone');

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleGenerateColors = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const newPalette = generateColorSchemeWithLocks(selectedScheme, isDarkMode, colorPalette, lockedColors, accessibilityMode);
        setColorPalette(newPalette);
        setIsGenerating(false);
        
        // Auto-show accessibility report if accessibility mode is on
        if (accessibilityMode) {
          setShowAccessibilityReport(true);
        }
      } catch (error) {
        // If accessibility mode fails, fall back to regular generation
        if (error instanceof Error && error.message.includes('No accessible palette found')) {
          toast({
            title: "⚠️ No Contrast-Safe Palettes Found",
            description: "Generating regular palette instead. Try adjusting mood or scheme for accessible colors.",
            variant: "destructive",
          });
          // Generate regular palette as fallback
          const fallbackPalette = generateColorSchemeWithLocks(selectedScheme, isDarkMode, colorPalette, lockedColors, false);
          setColorPalette(fallbackPalette);
        }
        setIsGenerating(false);
      }
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
    try {
      const newPalette = generateColorSchemeWithLocks(selectedScheme, checked, colorPalette, lockedColors, accessibilityMode);
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

  const handleBackgroundModeChange = (mode: BackgroundMode) => {
    setBackgroundMode(mode);
  };

  const getBackgroundStyle = () => {
    switch (backgroundMode) {
      case 'light':
        return 'bg-white';
      case 'dark':
        return 'bg-gray-900';
      case 'midtone':
      default:
        return 'bg-gray-100';
    }
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
        accessibilityMode={accessibilityMode}
        showAccessibilityReport={showAccessibilityReport}
        autogenerateCount={autogenerateCount}
        onClose={() => setIsFullscreen(false)}
        onGenerateColors={handleGenerateColors}
        onSchemeChange={handleSchemeChange}
        onTemplateChange={setSelectedTemplate}
        onColorChange={(palette) => setColorPalette(palette)}
        onModeToggle={handleModeToggle}
        onAccessibilityModeToggle={setAccessibilityMode}
        onShowAccessibilityReport={setShowAccessibilityReport}
        onDownloadPDF={handleDownloadPDF}
        onAutogenerateCountChange={setAutogenerateCount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Palette Painter
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {currentUser?.username}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="capitalize font-medium">
                  {selectedTemplate.replace('-', ' ')}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
                <span className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-700">
                  {selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)}
                </span>
              </div>
              <Button
                onClick={() => navigate('/history')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>History</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>Logout</span>
              </Button>
              <Button
                onClick={handleFullscreenToggle}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Maximize className="h-4 w-4" />
                <span>Fullscreen</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Live Preview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Plan Selector for Testing */}
        <PlanSelector />
        
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Live Preview</h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleZoomOut}
                variant="outline"
                size="icon"
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <Button
                onClick={handleZoomIn}
                variant="outline"
                size="icon"
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleZoomReset}
                variant="outline"
                size="icon"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`border rounded-lg overflow-auto shadow-inner h-[500px] transition-colors duration-300 ${getBackgroundStyle()}`}>
            <div 
              className="min-h-full transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
              data-preview-element
            >
              <LivePreview
                template={selectedTemplate}
                colorPalette={colorPalette}
              />
            </div>
          </div>
          
          {/* Accessibility Report */}
          <AccessibilityIndicator
            palette={colorPalette}
            isVisible={showAccessibilityReport || accessibilityMode}
          />
        </Card>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-between gap-2 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateColors}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Palette className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>

            <Button
              onClick={() => setActiveModal('template')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Template
            </Button>

            <Button
              onClick={() => {
                if (!canAccessColorSchemes) {
                  setUpsellModal({ isOpen: true, templateName: 'Color schemes' });
                  return;
                }
                setActiveModal('scheme');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Scheme {!canAccessColorSchemes && '🔒'}
            </Button>

            <Button
              onClick={() => {
                if (!canAccessColorMood) {
                  setUpsellModal({ isOpen: true, templateName: 'Color moods' });
                  return;
                }
                setActiveModal('mood');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              🎨
              Color Mood {!canAccessColorMood && '🔒'}
            </Button>

            <Button
              onClick={() => setActiveModal('saved')}
              variant="outline"
              className="flex items-center gap-2"
            >
              🟡
              Saved ({savedPalettesCount}/{MAX_PALETTES})
            </Button>

            <div className="flex items-center gap-2">
              <Dialog open={activeModal === 'autogenerate-count'} onOpenChange={() => setActiveModal(activeModal === 'autogenerate-count' ? null : 'autogenerate-count')}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-8 px-3"
                  >
                    <span className="text-xs font-medium">Sets</span>
                    <span className="font-bold text-primary">{autogenerateCount}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-80 p-6" style={{ 
                  position: 'fixed',
                  bottom: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  margin: 0
                }}>
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
              
              <Button
                onClick={() => {
                  if (!canAccessAutoGenerator) {
                    setUpsellModal({ isOpen: true, templateName: 'Autogenerate' });
                    return;
                  }
                  // Store global settings in localStorage
                  localStorage.setItem('autogenerate-global-settings', JSON.stringify({
                    template: selectedTemplate,
                    scheme: selectedScheme,
                    isDarkMode,
                    count: autogenerateCount,
                    palette: colorPalette
                  }));
                  navigate('/autogenerate');
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                🤖
                Autogenerate Colors {!canAccessAutoGenerator && '🔒'}
              </Button>
            </div>

            {/* Pro Image/URL Color Generator Button */}
            <Button
              onClick={() => {
                if (!isPro) {
                  setUpsellModal({ isOpen: true, templateName: 'Image/URL Color Generator' });
                  return;
                }
                setActiveModal('image-generator');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              From Image {!isPro && '🔒'}
            </Button>

            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <Sun className="h-4 w-4 text-gray-600" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  if (!canAccessDarkMode) {
                    setUpsellModal({ isOpen: true, templateName: 'Dark mode' });
                    return;
                  }
                  handleModeToggle(checked);
                }}
                disabled={!canAccessDarkMode}
              />
              <Moon className="h-4 w-4 text-gray-600" />
              {!canAccessDarkMode && <span className="text-xs text-gray-500">🔒</span>}
            </div>

            {/* Accessibility Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <span className="text-xs">🎯</span>
              <Switch
                checked={accessibilityMode}
                onCheckedChange={setAccessibilityMode}
              />
              <span className="text-xs text-gray-600 whitespace-nowrap">A11y Mode</span>
            </div>

            {/* Accessibility Report Toggle */}
            {!accessibilityMode && (
              <Button
                onClick={() => setShowAccessibilityReport(!showAccessibilityReport)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                {showAccessibilityReport ? '👁️' : '👁️‍🗨️'}
                <span>Contrast</span>
              </Button>
            )}

            <Button
              onClick={() => setActiveModal('colors')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Colors
            </Button>

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!canDownload()}
            >
              <Download className="h-4 w-4" />
              {isPro ? 'PDF' : `PDF (${getRemainingDownloads()}/3)`}
            </Button>

            <BackgroundModeSelector onModeChange={handleBackgroundModeChange} />
          </div>
        </div>
      </div>

      {/* Template Selector Modal - Single Column Layout with 4-Column Grid */}
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

      {/* Color Scheme Modal - 2 Column Layout */}
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

      {/* Image Color Generator Modal */}
      <Dialog open={activeModal === 'image-generator'} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate from Image or Website
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              <ImageColorGenerator
                onPaletteGenerated={(palette) => {
                  setColorPalette(palette);
                  closeModal();
                }}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Pro Upsell Modal */}
      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, templateName: '' })}
        templateName={upsellModal.templateName}
      />

    </div>
  );
};

export default Dashboard;
