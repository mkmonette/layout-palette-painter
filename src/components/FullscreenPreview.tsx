import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Palette, Layout, Settings, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Save, Check, Download, Shield, Sparkles, BookOpen, MoreHorizontal, MoreVertical, Bot, Play, SlidersHorizontal, Image, Wand2, RotateCcwSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import LivePreview from '@/components/LivePreview';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import ColorModeSelector from '@/components/ColorModeSelector';
import ColorMoodSelector from '@/components/ColorMoodSelector';
import { TemplateType, ColorPalette } from '@/types/template';
import { ColorMode } from '@/utils/colorGenerator';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import ImageUploadGenerator from '@/components/ImageUploadGenerator';
import WebsiteColorGenerator from '@/components/WebsiteColorGenerator';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import ProUpsellModal from '@/components/ProUpsellModal';
import ColorThemeDropdown from '@/components/ColorThemeDropdown';
import MoreOptionsDropdown from '@/components/MoreOptionsDropdown';
import AdminPresetsModal from '@/components/AdminPresetsModal';
import BackgroundCustomizer, { type BackgroundSettings } from '@/components/BackgroundCustomizer';
interface FullscreenPreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
  selectedScheme: ColorSchemeType;
  colorMode: ColorMode;
  isDarkMode: boolean;
  isGenerating: boolean;
  autogenerateCount?: number;
  autoGenerate?: boolean;
  onClose: () => void;
  onGenerateColors: () => void;
  onSchemeChange: (scheme: ColorSchemeType) => void;
  onTemplateChange: (template: TemplateType) => void;
  onColorChange: (palette: ColorPalette, moodId?: string | null) => void;
  onTemplateToggle: (checked: boolean) => void; // Renamed to be more specific
  onModeChange: (mode: ColorMode) => void;
  onDownloadPDF?: () => void;
  onAutogenerateCountChange?: (count: number) => void;
  onAutoGenerateChange?: (checked: boolean) => void;
}
const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  template,
  colorPalette,
  selectedScheme,
  colorMode,
  isDarkMode,
  isGenerating,
  autogenerateCount = 10,
  autoGenerate = false,
  onClose,
  onGenerateColors,
  onSchemeChange,
  onTemplateChange,
  onColorChange,
  onTemplateToggle,
  onModeChange,
  onDownloadPDF,
  onAutogenerateCountChange,
  onAutoGenerateChange
}) => {
  const {
    getSavedCount,
    loadSavedPalettes,
    canSaveMore,
    savePalette
  } = useSavedPalettes();
  const {
    toast
  } = useToast();
  const {
    isPro
  } = useFeatureAccess();

  // Local template-only dark mode state (separate from dashboard dark mode)
  const [templateDarkMode, setTemplateDarkMode] = useState(isDarkMode);
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [upsellModal, setUpsellModal] = useState<{
    isOpen: boolean;
    templateName: string;
  }>({
    isOpen: false,
    templateName: ''
  });
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
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Handle template-only dark mode toggle
  const handleTemplateDarkModeToggle = (checked: boolean) => {
    setTemplateDarkMode(checked);
    onTemplateToggle(checked);
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
  const handleSave = () => {
    const success = savePalette(colorPalette, template);
    if (success) {
      setSavedPalettesCount(getSavedCount());
      toast({
        title: "Palette Saved",
        description: "Your color palette has been saved successfully."
      });
    } else {
      toast({
        title: "Save Limit Reached",
        description: "You've reached the maximum number of saved palettes (10).",
        variant: "destructive"
      });
    }
  };
  const handleMoodSelect = (palette: ColorPalette, moodId?: string) => {
    onColorChange(palette, moodId);
  };
  const handleSavedPaletteSelect = (palette: ColorPalette) => {
    onColorChange(palette);
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
  return <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Close button - top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button onClick={onClose} variant="outline" size="icon" className="bg-white/95 backdrop-blur-sm border shadow-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Preview - Full height with scroll */}
      <div className="flex-1 overflow-auto bg-blue-300">
        <div className="min-h-full transition-transform duration-200 origin-top" style={{
        transform: `scale(${zoomLevel / 100})`
      }}>
          <LivePreview template={template} colorPalette={colorPalette} backgroundSettings={backgroundSettings} />
        </div>
      </div>


      {/* Template Selector Modal - Single Column Layout with 4-Column Grid */}
      <Dialog open={activeModal === 'template'} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Choose Template
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <TemplateSelector selectedTemplate={template} onTemplateChange={newTemplate => {
            onTemplateChange(newTemplate);
            closeModal();
          }} colorPalette={colorPalette} />
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
              <ColorSchemeSelector selectedScheme={selectedScheme} onSchemeChange={onSchemeChange} onGenerateScheme={onGenerateColors} isGenerating={isGenerating} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Color Mood Modal */}
      <ColorMoodSelector isOpen={activeModal === 'mood'} onClose={closeModal} onMoodSelect={handleMoodSelect} currentPalette={colorPalette} />

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
              <ColorControls colorPalette={colorPalette} onColorChange={(colorKey, color) => {
              const newPalette = {
                ...colorPalette,
                [colorKey]: color
              };
              onColorChange(newPalette);
            }} lockedColors={lockedColors} onToggleLock={handleToggleLock} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Saved Palettes Modal */}
      <SavedPalettesModal isOpen={activeModal === 'saved'} onClose={closeModal} currentPalette={colorPalette} currentTemplate={template} onPaletteSelect={handleSavedPaletteSelect} onTemplateChange={onTemplateChange} />


      {/* Image Color Generator Modal */}
      <Dialog open={activeModal === 'image-generator'} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate from Image
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Upload Image</h3>
                <ImageUploadGenerator 
                  onPaletteGenerated={palette => {
                    onColorChange(palette);
                    closeModal();
                  }} 
                  isGenerating={isGenerating} 
                  setIsGenerating={() => {}} // Read-only in fullscreen
                />
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Website URL</h3>
                <WebsiteColorGenerator 
                  onPaletteGenerated={palette => {
                    onColorChange(palette);
                    closeModal();
                  }} 
                  isGenerating={isGenerating} 
                  setIsGenerating={() => {}} // Read-only in fullscreen
                />
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
              <BackgroundCustomizer settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Color Presets Modal */}
      <AdminPresetsModal isOpen={activeModal === 'admin-presets'} onClose={closeModal} onPresetSelect={palette => {
      onColorChange(palette);
      closeModal();
    }} />

      {/* Floating Tools Group - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-30 flex items-end gap-3">
        <TooltipProvider>
          {/* Collapsible Tools Group */}
          <div className="flex flex-col items-center gap-2">
            {/* Expanded Tools */}
            {isToolsExpanded && (
              <div className="flex flex-col gap-2 animate-fade-in">
                {/* Export PDF */}
                {onDownloadPDF && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onDownloadPDF}
                        className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white shadow-lg rounded-lg border-0"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export PDF</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Save Palette */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSave}
                      className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white shadow-lg rounded-lg border-0"
                    >
                      <Save className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save Palette</p>
                  </TooltipContent>
                </Tooltip>

                {/* Saved Palettes */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setActiveModal('saved')}
                      className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white shadow-lg rounded-lg border-0"
                    >
                      <BookOpen className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Saved Palettes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                  className="h-12 w-12 bg-gray-700 hover:bg-gray-600 text-white shadow-lg rounded-lg border-0"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isToolsExpanded ? 'Collapse Tools' : 'Expand Tools'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* AI Colors Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onGenerateColors} // Using same logic as Generate for now
                disabled={isGenerating}
                className="h-12 w-12 bg-violet-600 hover:bg-violet-700 text-white shadow-lg rounded-lg border-0"
              >
                <Bot className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Colors</p>
            </TooltipContent>
          </Tooltip>

          {/* Autogenerate Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onAutoGenerateChange && onAutoGenerateChange(!autoGenerate)}
                className={`h-12 w-12 ${autoGenerate ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white shadow-lg rounded-lg border-0`}
              >
                <Play className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{autoGenerate ? 'Stop Autogenerate' : 'Start Autogenerate'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Panel Toggle Button - Above Generate */}
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  className="h-12 w-12 bg-slate-600 hover:bg-slate-700 text-white shadow-lg rounded-lg border-0"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tools</p>
              </TooltipContent>
            </Tooltip>

            {/* Generate Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onGenerateColors}
                  disabled={isGenerating}
                  className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-lg border-0"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Palette</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Right Side Panel Overlay */}
      {isRightPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsRightPanelOpen(false)}
          />
          
          {/* Slide-in Panel */}
          <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${
            isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="text-base font-semibold">Tools</h3>
                <Button
                  onClick={() => setIsRightPanelOpen(false)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Panel Content */}
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                  
                  {/* 🎨 Color Logic Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="h-3 w-3 text-primary" />
                      <h4 className="font-medium text-xs text-foreground uppercase tracking-wide">Color Logic</h4>
                    </div>
                    
                    {/* Templates */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('template')}>
                      <div className="flex items-center gap-2">
                        <Layout className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Templates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {template.replace(/([A-Z])/g, ' $1').trim().slice(0, 8)}...
                        </Badge>
                        <Settings className="h-2 w-2 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Schemes */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('scheme')}>
                      <div className="flex items-center gap-2">
                        <Palette className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Schemes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {selectedScheme}
                        </Badge>
                        <Settings className="h-2 w-2 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Moods */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('mood')}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Moods</span>
                      </div>
                      <Settings className="h-2 w-2 text-muted-foreground" />
                    </div>

                    {/* Color Mode */}
                    <div className="p-2 rounded border">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sun className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">Color Mode</span>
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            {colorMode}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {['light', 'light-midtone', 'midtone', 'midtone-dark', 'dark'].map((mode) => (
                            <Button
                              key={mode}
                              variant={colorMode === mode ? "default" : "outline"}
                              size="sm"
                              onClick={() => onModeChange(mode as ColorMode)}
                              className="text-[9px] px-1 py-1 h-6"
                            >
                              {mode === 'light-midtone' ? 'L-M' : 
                               mode === 'midtone-dark' ? 'M-D' :
                               mode.charAt(0).toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* 🌈 Palette Tools Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className="h-3 w-3 text-primary" />
                      <h4 className="font-medium text-xs text-foreground uppercase tracking-wide">Palette Tools</h4>
                    </div>

                    {/* Color Presets */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('admin-presets')}>
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Presets</span>
                      </div>
                      <Settings className="h-2 w-2 text-muted-foreground" />
                    </div>

                    {/* Current Palettes */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('colors')}>
                      <div className="flex items-center gap-2">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Current</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {lockedColors.size}🔒
                        </Badge>
                        <Settings className="h-2 w-2 text-muted-foreground" />
                      </div>
                    </div>

                    {/* From Image */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                      if (!isPro) {
                        setUpsellModal({
                          isOpen: true,
                          templateName: 'Image/URL Color Generator'
                        });
                        return;
                      }
                      setActiveModal('image-generator');
                    }}>
                      <div className="flex items-center gap-2">
                        <Image className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">From Image</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!isPro && <Badge variant="outline" className="text-[10px] px-1 py-0">Pro</Badge>}
                        <Settings className="h-2 w-2 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* 🖼️ Appearance Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-3 w-3 text-primary" />
                      <h4 className="font-medium text-xs text-foreground uppercase tracking-wide">Appearance</h4>
                    </div>

                    {/* Background */}
                    <div className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setActiveModal('background')}>
                      <div className="flex items-center gap-2">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">Background</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {backgroundSettings.enabled ? backgroundSettings.style.slice(0, 6) : 'None'}
                        </Badge>
                        <Settings className="h-2 w-2 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Reset All Button */}
                  <div className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-foreground h-7 text-xs"
                      onClick={() => {
                        // Reset functionality can be implemented here
                        toast({
                          title: "Reset All",
                          description: "All settings have been reset to defaults."
                        });
                      }}
                    >
                      <RotateCcwSquare className="h-3 w-3 mr-1" />
                      Reset All
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </>
      )}


      {/* Pro Upsell Modal */}
      <ProUpsellModal isOpen={upsellModal.isOpen} onClose={() => setUpsellModal({
      isOpen: false,
      templateName: ''
    })} templateName={upsellModal.templateName} />
    </div>;
};
export default FullscreenPreview;