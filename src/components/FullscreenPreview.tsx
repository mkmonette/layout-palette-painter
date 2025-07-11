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
import AccessibilityIndicator from '@/components/AccessibilityIndicator';
import { TemplateType, ColorPalette } from '@/types/template';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import ImageColorGenerator from '@/components/ImageColorGenerator';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import ProUpsellModal from '@/components/ProUpsellModal';
import ColorThemeDropdown from '@/components/ColorThemeDropdown';
import MoreOptionsDropdown from '@/components/MoreOptionsDropdown';
import { BackgroundMode } from '@/components/BackgroundModeSelector';

interface FullscreenPreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
  selectedScheme: ColorSchemeType;
  isDarkMode: boolean;
  isGenerating: boolean;
  accessibilityMode?: boolean;
  showAccessibilityReport?: boolean;
  autogenerateCount?: number;
  backgroundMode?: BackgroundMode;
  autoGenerate?: boolean;
  onClose: () => void;
  onGenerateColors: () => void;
  onSchemeChange: (scheme: ColorSchemeType) => void;
  onTemplateChange: (template: TemplateType) => void;
  onColorChange: (palette: ColorPalette, moodId?: string | null) => void;
  onModeToggle: (checked: boolean) => void;
  onAccessibilityModeToggle?: (checked: boolean) => void;
  onShowAccessibilityReport?: (show: boolean) => void;
  onDownloadPDF?: () => void;
  onAutogenerateCountChange?: (count: number) => void;
  onBackgroundModeChange?: (mode: BackgroundMode) => void;
  onAutoGenerateChange?: (checked: boolean) => void;
}

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  template,
  colorPalette,
  selectedScheme,
  isDarkMode,
  isGenerating,
  accessibilityMode = false,
  showAccessibilityReport = false,
  autogenerateCount = 10,
  backgroundMode = 'midtone',
  autoGenerate = false,
  onClose,
  onGenerateColors,
  onSchemeChange,
  onTemplateChange,
  onColorChange,
  onModeToggle,
  onAccessibilityModeToggle,
  onShowAccessibilityReport,
  onDownloadPDF,
  onAutogenerateCountChange,
  onBackgroundModeChange,
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
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="px-4 py-3 relative">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            {/* Template Selector */}
            <Button
              onClick={() => setActiveModal('template')}
              variant="outline"
              className="flex items-center gap-2 h-9 px-3 flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">Template</span>
            </Button>

            {/* Color Theme Dropdown */}
            <div className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <ColorThemeDropdown
                onSchemeClick={() => setActiveModal('scheme')}
                onMoodClick={() => setActiveModal('mood')}
                onBackgroundModeChange={onBackgroundModeChange || (() => {})}
                backgroundMode={backgroundMode}
              />
            </div>

            {/* Light/Dark Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white h-9 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
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
                variant="outline"
                className="flex items-center gap-2 h-9 px-3 flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Download className="h-4 w-4" />
                <span className="text-sm whitespace-nowrap">PDF</span>
              </Button>
            )}

            {/* Save Sets */}
            <Button
              onClick={() => setActiveModal('saved')}
              variant="outline"
              className="flex items-center gap-2 h-9 px-3 flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm whitespace-nowrap">Save ({savedPalettesCount}/10)</span>
            </Button>

            {/* More Options Dropdown */}
            <div className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <MoreOptionsDropdown
                autoGenerate={autoGenerate || false}
                onAutoGenerateChange={onAutoGenerateChange || (() => {})}
                onImageGeneratorClick={() => {
                  if (!isPro) {
                    setUpsellModal({ isOpen: true, templateName: 'Image/URL Color Generator' });
                    return;
                  }
                  setActiveModal('image-generator');
                }}
                accessibilityMode={accessibilityMode}
                onAccessibilityModeChange={onAccessibilityModeToggle || (() => {})}
                showAccessibilityReport={showAccessibilityReport}
                onAccessibilityReportToggle={() => onShowAccessibilityReport && onShowAccessibilityReport(!showAccessibilityReport)}
                onColorsClick={() => setActiveModal('colors')}
                onSetsClick={() => {}}
              />
            </div>

            {/* Generate Button - Last item */}
            <Button 
              onClick={onGenerateColors}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 h-9 font-medium flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Palette className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white h-9 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <Button
                onClick={handleZoomOut}
                variant="ghost"
                size="sm"
                disabled={zoomLevel <= 50}
                className="h-6 w-6 p-0"
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
                className="h-6 w-6 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleZoomReset}
                variant="ghost"
                size="sm"
                title="Reset Zoom"
                className="h-6 w-6 p-0"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Scroll indicator gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/95 to-transparent pointer-events-none" />
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

      {/* Accessibility Report */}
      {(showAccessibilityReport || accessibilityMode) && (
        <div className="fixed bottom-20 left-4 right-4 z-10 bg-white/95 backdrop-blur-md border rounded-lg shadow-lg">
          <AccessibilityIndicator
            palette={colorPalette}
            isVisible={showAccessibilityReport || accessibilityMode}
          />
        </div>
      )}

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
