import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Palette, Eye, Settings, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Save, Check, Download, Shield, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import ImageColorGenerator from '@/components/ImageColorGenerator';
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
  isDarkMode: boolean;
  isGenerating: boolean;
  autogenerateCount?: number;
  
  autoGenerate?: boolean;
  onClose: () => void;
  onGenerateColors: () => void;
  onSchemeChange: (scheme: ColorSchemeType) => void;
  onTemplateChange: (template: TemplateType) => void;
  onColorChange: (palette: ColorPalette, moodId?: string | null) => void;
  onModeToggle: (checked: boolean) => void;
  onDownloadPDF?: () => void;
  onAutogenerateCountChange?: (count: number) => void;
  
  onAutoGenerateChange?: (checked: boolean) => void;
}

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  template,
  colorPalette,
  selectedScheme,
  isDarkMode,
  isGenerating,
  autogenerateCount = 10,
  
  autoGenerate = false,
  onClose,
  onGenerateColors,
  onSchemeChange,
  onTemplateChange,
  onColorChange,
  onModeToggle,
  onDownloadPDF,
  onAutogenerateCountChange,
  
  onAutoGenerateChange
}) => {
  const { getSavedCount, loadSavedPalettes, canSaveMore, savePalette } = useSavedPalettes();
  const { toast } = useToast();
  const { isPro } = useFeatureAccess();
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [lockedColors, setLockedColors] = useState<Set<keyof ColorPalette>>(new Set());
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; templateName: string }>({ isOpen: false, templateName: '' });
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
        description: "Your color palette has been saved successfully.",
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

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Close button - top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="bg-white/95 backdrop-blur-sm border shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Preview - Full height with scroll */}
      <div className="flex-1 overflow-auto">
        <div 
          className="min-h-full transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <LivePreview
            template={template}
            colorPalette={colorPalette}
            backgroundSettings={backgroundSettings}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-md border rounded-full shadow-lg px-4 py-3">
          <div className="flex items-center justify-center gap-3">
            {/* Template Selector */}
            <Button
              onClick={() => setActiveModal('template')}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
              title="Template"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Color Theme Dropdown */}
            <div className="flex-shrink-0">
              <ColorThemeDropdown
                onSchemeClick={() => setActiveModal('scheme')}
                onMoodClick={() => setActiveModal('mood')}
              />
            </div>

            {/* Light/Dark Mode Toggle */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-50">
              <Sun className="h-3 w-3 text-yellow-500" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={onModeToggle}
              />
              <Moon className="h-3 w-3 text-gray-600" />
            </div>

            {/* PDF Download */}
            {onDownloadPDF && (
              <Button
                onClick={onDownloadPDF}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            {/* Save Sets */}
            <Button
              onClick={() => setActiveModal('saved')}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full relative"
              title={`Saved Palettes (${savedPalettesCount}/10)`}
            >
              <BookOpen className="h-4 w-4" />
              {savedPalettesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {savedPalettesCount}
                </span>
              )}
            </Button>

            {/* More Options Dropdown */}
            <div className="flex-shrink-0">
              <MoreOptionsDropdown
                onImageGeneratorClick={() => {
                  if (!isPro) {
                    setUpsellModal({ isOpen: true, templateName: 'Image/URL Color Generator' });
                    return;
                  }
                  setActiveModal('image-generator');
                }}
                onColorsClick={() => setActiveModal('colors')}
                onSetsClick={() => {}}
                onBackgroundClick={() => setActiveModal('background')}
                onAdminPresetsClick={() => setActiveModal('admin-presets')}
              />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50">
              <Button
                onClick={handleZoomOut}
                variant="ghost"
                size="sm"
                disabled={zoomLevel <= 50}
                className="h-6 w-6 p-0 rounded-full"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium text-gray-600 min-w-[2.5rem] text-center">
                {zoomLevel}%
              </span>
              <Button
                onClick={handleZoomIn}
                variant="ghost"
                size="sm"
                disabled={zoomLevel >= 200}
                className="h-6 w-6 p-0 rounded-full"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleZoomReset}
                variant="ghost"
                size="sm"
                title="Reset Zoom"
                className="h-6 w-6 p-0 rounded-full"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={onGenerateColors}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9 w-9 p-0 rounded-full"
              title="Generate Colors"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Palette className="h-4 w-4" />
              )}
            </Button>
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
            <TemplateSelector
              selectedTemplate={template}
              onTemplateChange={(newTemplate) => {
                onTemplateChange(newTemplate);
                closeModal();
              }}
              colorPalette={colorPalette}
            />
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
                onSchemeChange={onSchemeChange}
                onGenerateScheme={onGenerateColors}
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
                onColorChange={(colorKey, color) => {
                  const newPalette = { ...colorPalette, [colorKey]: color };
                  onColorChange(newPalette);
                }}
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
        currentTemplate={template}
        onPaletteSelect={handleSavedPaletteSelect}
        onTemplateChange={onTemplateChange}
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
                  onColorChange(palette);
                  closeModal();
                }}
                isGenerating={isGenerating}
                setIsGenerating={() => {}} // Read-only in fullscreen
              />
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
              <BackgroundCustomizer
                settings={backgroundSettings}
                onSettingsChange={setBackgroundSettings}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Admin Presets Modal */}
      <AdminPresetsModal
        isOpen={activeModal === 'admin-presets'}
        onClose={closeModal}
        onPresetSelect={(palette) => {
          onColorChange(palette);
          closeModal();
        }}
      />

      {/* Pro Upsell Modal */}
      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, templateName: '' })}
        templateName={upsellModal.templateName}
      />
    </div>
  );
};

export default FullscreenPreview;
