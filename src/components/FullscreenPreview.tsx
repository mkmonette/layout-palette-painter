import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Palette, Layout, Settings, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Save, Check, Download, Shield, Sparkles, BookOpen, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LivePreview from '@/components/LivePreview';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
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

      {/* Generate Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-30">
        <TooltipProvider>
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
        </TooltipProvider>
      </div>

      {/* Pro Upsell Modal */}
      <ProUpsellModal isOpen={upsellModal.isOpen} onClose={() => setUpsellModal({
      isOpen: false,
      templateName: ''
    })} templateName={upsellModal.templateName} />
    </div>;
};
export default FullscreenPreview;