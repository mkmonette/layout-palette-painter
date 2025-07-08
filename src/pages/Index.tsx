import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Settings, Eye, Moon, Sun, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import LivePreview from '@/components/LivePreview';
import FullscreenPreview from '@/components/FullscreenPreview';
import { generateColorPalette, generateColorScheme, ColorPalette } from '@/utils/colorGenerator';
import { TemplateType } from '@/types/template';

const Index = () => {
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

  const handleGenerateColors = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = generateColorScheme(selectedScheme, isDarkMode);
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

  const handleModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    // Automatically generate a new palette when switching modes
    const newPalette = generateColorScheme(selectedScheme, checked);
    setColorPalette(newPalette);
  };

  const handleSchemeChange = (scheme: ColorSchemeType) => {
    setSelectedScheme(scheme);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Render fullscreen mode
  if (isFullscreen) {
    return (
      <FullscreenPreview
        template={selectedTemplate}
        colorPalette={colorPalette}
        selectedScheme={selectedScheme}
        isDarkMode={isDarkMode}
        isGenerating={isGenerating}
        onClose={() => setIsFullscreen(false)}
        onGenerateColors={handleGenerateColors}
        onSchemeChange={handleSchemeChange}
      />
    );
  }

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
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-gray-600" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleModeToggle}
                />
                <Moon className="h-4 w-4 text-gray-600" />
                <Label className="text-sm text-gray-600">
                  {isDarkMode ? 'Dark' : 'Light'} Mode
                </Label>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Mode Selection and Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Selection */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-blue-600" />
                ) : (
                  <Sun className="h-5 w-5 text-blue-600" />
                )}
                <h2 className="text-lg font-semibold">Color Mode</h2>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <Sun className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Light</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleModeToggle}
                />
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Dark</span>
                  <Moon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Generate palettes optimized for {isDarkMode ? 'dark' : 'light'} backgrounds
              </p>
            </Card>

            {/* Color Scheme Selection */}
            <ColorSchemeSelector
              selectedScheme={selectedScheme}
              onSchemeChange={handleSchemeChange}
              onGenerateScheme={handleGenerateColors}
              isGenerating={isGenerating}
            />

            {/* Template Selection */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Choose Template</h2>
              </div>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                colorPalette={colorPalette}
              />
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <h3 className="font-medium text-gray-900 mb-2">How to use:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choose between light or dark mode</li>
                <li>• Select a color scheme type</li>
                <li>• Pick a layout template</li>
                <li>• Click "Generate" for automatic palettes</li>
                <li>• Or manually adjust individual colors</li>
                <li>• See changes instantly in the preview</li>
              </ul>
            </Card>
          </div>

          {/* Center Panel - Live Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">
                      Template: {selectedTemplate.replace('-', ' ')}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                      {isDarkMode ? 'Dark' : 'Light'} Mode
                    </span>
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-700">
                      {selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)} Scheme
                    </span>
                  </div>
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
              <div className="border rounded-lg overflow-hidden shadow-inner bg-white">
                <LivePreview
                  template={selectedTemplate}
                  colorPalette={colorPalette}
                />
              </div>
            </Card>
          </div>

          {/* Right Panel - Color Controls */}
          <div className="lg:col-span-1 space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
