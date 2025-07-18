import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, RefreshCw, Eye, Zap, Sparkles, Play, Wand2, Monitor } from 'lucide-react';
import LivePreview from '@/components/LivePreview';
import { generateColorScheme } from '@/utils/colorGenerator';
import { TemplateType, ColorPalette } from '@/types/template';

const LivePreviewSection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bold-landing');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    brand: 'hsl(263, 85%, 58%)',
    accent: 'hsl(188, 94%, 50%)',
    "button-primary": 'hsl(263, 85%, 58%)',
    "button-text": '#FFFFFF',
    "button-secondary": '#FFFFFF',
    "button-secondary-text": 'hsl(263, 85%, 58%)',
    "text-primary": 'hsl(224, 71%, 4%)',
    "text-secondary": 'hsl(220, 9%, 46%)',
    "section-bg-1": '#FFFFFF',
    "section-bg-2": 'hsl(220, 14%, 96%)',
    "section-bg-3": 'hsl(220, 13%, 91%)',
    border: 'hsl(220, 13%, 91%)',
    highlight: 'hsl(142, 76%, 36%)',
    "input-bg": '#FFFFFF',
    "input-text": 'hsl(224, 71%, 4%)'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateColors = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = generateColorScheme('random', 'light');
      setColorPalette(newPalette);
      setIsGenerating(false);
    }, 1200);
  };

  const templates: { id: TemplateType; name: string; description: string }[] = [
    { id: 'bold-landing', name: 'Bold Landing', description: 'Powerful & impactful' },
    { id: 'creative-portfolio', name: 'Creative Portfolio', description: 'Artistic & bold' },
    { id: 'gradient-hero', name: 'Gradient Hero', description: 'Modern & vibrant' },
    { id: 'split-screen', name: 'Split Screen', description: 'Balanced & engaging' }
  ];

  return (
    <section className="relative">
      <div className="text-center mb-16">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm px-6 py-3 backdrop-blur-sm">
          <Play className="h-4 w-4 mr-2" />
          Interactive Demo
        </Badge>
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          See It in <span className="gradient-text">Action</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Experience the power of AI-generated color palettes. Try different templates and generate 
          new color schemes instantly with our live preview.
        </p>
      </div>

      <div className="relative">
        {/* Floating Color Orbs for Section */}
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-primary/20 animate-float hidden lg:block" />
        <div className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-secondary/20 animate-bounce-subtle hidden lg:block" />
        
        <Card className="live-preview-container p-0 overflow-hidden">
          {/* Enhanced Controls */}
          <div className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Choose Template:</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`h-auto p-4 flex flex-col items-start text-left transition-all duration-300 ${
                        selectedTemplate === template.id 
                          ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                          : 'hover:bg-primary/10 hover:border-primary/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs opacity-70 mt-1">{template.description}</div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleGenerateColors}
                  disabled={isGenerating}
                  size="lg"
                  className="hero-gradient border-0 text-white shadow-xl font-semibold px-8 py-4 group"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                  ) : (
                    <Wand2 className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate New Colors'}
                  {!isGenerating && <Sparkles className="h-4 w-4 ml-2" />}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Watch colors transform in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Live Preview */}
          <div className="relative bg-gradient-to-br from-white to-primary/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/5 pointer-events-none" />
            <div className="relative">
              {/* Preview Container - Full width display */}
              <div className="w-full max-w-none">
                <LivePreview
                  template={selectedTemplate}
                  colorPalette={colorPalette}
                  showSaveButton={false}
                  backgroundSettings={{ 
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
                  }}
                />
              </div>
            </div>
            
            {/* Preview Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium">Live Preview</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Color Palette Display */}
          <div className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Current Color Palette:</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Object.entries(colorPalette).map(([key, color]) => (
                <div key={key} className="group cursor-pointer color-card-hover">
                  <div 
                    className="w-full h-16 rounded-xl border-2 border-white shadow-lg mb-3 relative overflow-hidden"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-2 w-2 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium capitalize text-sm mb-1">{key.replace(/-/g, ' ')}</div>
                    <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1">
                      {color}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click "Generate New Colors" to see the magic happen ✨
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>AI Generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>WCAG Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Export Ready</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LivePreviewSection;