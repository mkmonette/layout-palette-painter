
import React from 'react';
import { X, RefreshCw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LivePreview from '@/components/LivePreview';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
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
}

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  template,
  colorPalette,
  selectedScheme,
  isDarkMode,
  isGenerating,
  onClose,
  onGenerateColors,
  onSchemeChange
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Color Scheme Selector */}
          <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
            <div className="flex items-center space-x-4">
              <ColorSchemeSelector
                selectedScheme={selectedScheme}
                onSchemeChange={onSchemeChange}
                onGenerateScheme={onGenerateColors}
                isGenerating={isGenerating}
              />
            </div>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          {/* Generate Button */}
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
            Generate Colors
          </Button>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="bg-white/95 backdrop-blur-sm border shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Template Preview */}
      <div className="w-full h-full pt-20 pb-4 px-4">
        <div className="w-full h-full border rounded-lg overflow-hidden shadow-lg bg-white">
          <LivePreview
            template={template}
            colorPalette={colorPalette}
          />
        </div>
      </div>

      {/* Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="p-3 bg-white/95 backdrop-blur-sm border shadow-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="capitalize font-medium">
                Template: {template.replace('-', ' ')}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                {isDarkMode ? 'Dark' : 'Light'} Mode
              </span>
              <span className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-700">
                {selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)} Scheme
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Press ESC or click X to exit fullscreen
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FullscreenPreview;
