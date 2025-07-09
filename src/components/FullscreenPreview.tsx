
import React, { useState } from 'react';
import { X, RefreshCw, Palette, Eye, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import LivePreview from '@/components/LivePreview';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import { TemplateType, ColorPalette } from '@/types/template';

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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

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
        <div className="min-h-full">
          <LivePreview
            template={template}
            colorPalette={colorPalette}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-center gap-2 p-4 max-w-7xl mx-auto">
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

          {/* Template Info */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 ml-4">
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

      {/* Template Selector Modal */}
      <Dialog open={activeModal === 'template'} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
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

      {/* Color Scheme Modal */}
      <Dialog open={activeModal === 'scheme'} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
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
    </div>
  );
};

export default FullscreenPreview;
