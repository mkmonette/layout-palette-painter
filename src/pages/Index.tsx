
import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import LivePreview from '@/components/LivePreview';
import { generateColorPalette, ColorPalette } from '@/utils/colorGenerator';
import { TemplateType } from '@/types/template';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateColors = async () => {
    setIsGenerating(true);
    // Simulate generation delay for better UX
    setTimeout(() => {
      const newPalette = generateColorPalette();
      setColorPalette(newPalette);
      setIsGenerating(false);
    }, 800);
  };

  const handleColorChange = (colorKey: keyof ColorPalette, color: string) => {
    setColorPalette(prev => ({
      ...prev,
      [colorKey]: color
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
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
                <p className="text-sm text-gray-600">Automatic Color Palette Generator</p>
              </div>
            </div>
            <Button
              onClick={handleGenerateColors}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Palette className="h-4 w-4 mr-2" />
              )}
              Generate Colors
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Choose Template</h2>
              </div>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </Card>

            {/* Color Controls */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Customize Colors</h2>
              </div>
              <ColorControls
                colorPalette={colorPalette}
                onColorChange={handleColorChange}
              />
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <h3 className="font-medium text-gray-900 mb-2">How to use:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select a layout template</li>
                <li>• Click "Generate Colors" for automatic palettes</li>
                <li>• Or manually adjust individual colors</li>
                <li>• See changes instantly in the preview</li>
              </ul>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <div className="text-sm text-gray-500 capitalize">
                  Template: {selectedTemplate.replace('-', ' ')}
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden shadow-inner bg-white">
                <LivePreview
                  template={selectedTemplate}
                  colorPalette={colorPalette}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
