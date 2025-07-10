import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Palette, Eye, Settings, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import LivePreview from '@/components/LivePreview';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import ColorMoodSelector from '@/components/ColorMoodSelector';
import { TemplateType, ColorPalette } from '@/types/template';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';

interface FullscreenPreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
  selectedScheme: ColorSchemeType;
  isDarkMode: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerateColors: () => void;
  onSchemeChange: (scheme: ColorSchemeType) => void;
  onTemplateChange: (template: TemplateType) => void;
  onColorChange: (colorKey: keyof ColorPalette, color: string) => void;
  onModeToggle: (checked: boolean) => void;
}

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  template,
  colorPalette,
  selectedScheme,
  isDarkMode,
  isGenerating,
  onClose,
  onGenerateColors,
  onSchemeChange,
  onTemplateChange,
  onColorChange,
  onModeToggle
}) => {
  const { getSavedCount, loadSavedPalettes, canSaveMore, savePalette } = useSavedPalettes();
  const { toast } = useToast();
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

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

  const handleMoodSelect = (palette: ColorPalette) => {
    // Apply the mood palette to all color properties
    Object.keys(palette).forEach(key => {
      onColorChange(key as keyof ColorPalette, palette[key as keyof ColorPalette]);
    });
  };

  const handleSavedPaletteSelect = (palette: ColorPalette) => {
    Object.keys(palette).forEach(key => {
      if (key !== 'id' && key !== 'name' && key !== 'savedAt') {
        onColorChange(key as keyof ColorPalette, palette[key as keyof ColorPalette]);
      }
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
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-between gap-2 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Generate Colors Button */}
            <Button
              onClick={onGenerateColors}
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

            {/* Template Selector */}
            <Button
              onClick={() => setActiveModal('template')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Template
            </Button>

            {/* Color Scheme */}
            <Button
              onClick={() => setActiveModal('scheme')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Scheme
            </Button>

            {/* Color Mood */}
            <Button
              onClick={() => setActiveModal('mood')}
              variant="outline"
              className="flex items-center gap-2"
            >
              🎨
              Color Mood
            </Button>

            {/* Saved Palettes */}
            <Button
              onClick={() => setActiveModal('saved')}
              variant="outline"
              className="flex items-center gap-2"
            >
              🟡
              Saved ({savedPalettesCount}/10)
            </Button>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!canSaveMore()}
              className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
            >
              {canSaveMore() ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Limit Reached
                </>
              )}
            </Button>

            {/* Light/Dark Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <Sun className="h-4 w-4 text-gray-600" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={onModeToggle}
              />
              <Moon className="h-4 w-4 text-gray-600" />
            </div>

            {/* Customize Colors */}
            <Button
              onClick={() => setActiveModal('colors')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Colors
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
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

          {/* Template Info */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
            <span className="capitalize font-medium">
              {template.replace('-', ' ')}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
            <span className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-700">
              {selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)}
            </span>
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
                onColorChange={onColorChange}
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
    </div>
  );
};

export default FullscreenPreview;
