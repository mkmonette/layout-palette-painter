
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, RefreshCw, Eye, Zap } from 'lucide-react';
import LivePreview from '@/components/LivePreview';
import { generateColorScheme } from '@/utils/colorGenerator';
import { TemplateType, ColorPalette } from '@/types/template';

const LivePreviewSection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    brand: '#3B82F6',
    accent: '#F59E0B',
    "button-primary": '#3B82F6',
    "button-text": '#FFFFFF',
    "button-secondary": '#FFFFFF',
    "button-secondary-text": '#3B82F6',
    "text-primary": '#1F2937',
    "text-secondary": '#6B7280',
    "section-bg-1": '#FFFFFF',
    "section-bg-2": '#F9FAFB',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: '#10B981',
    "input-bg": '#FFFFFF',
    "input-text": '#1F2937'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateColors = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = generateColorScheme('random', false);
      setColorPalette(newPalette);
      setIsGenerating(false);
    }, 800);
  };

  const templates: { id: TemplateType; name: string }[] = [
    { id: 'modern-hero', name: 'Modern Hero' },
    { id: 'creative-portfolio', name: 'Portfolio' },
    { id: 'tech-startup', name: 'Tech Startup' },
    { id: 'saas-product', name: 'SaaS Product' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Zap className="h-3 w-3 mr-1" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl font-bold mb-4">See It in Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-generated color palettes. Try different templates and generate 
            new color schemes instantly.
          </p>
        </div>

        <Card className="p-6 bg-gray-50/50 border-0 shadow-xl">
          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Template:</span>
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleGenerateColors}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Palette className="h-4 w-4 mr-2" />
              )}
              Generate New Colors
            </Button>
          </div>

          {/* Live Preview */}
          <div className="border rounded-lg overflow-hidden shadow-inner bg-white">
            <div className="transform scale-75 origin-top w-[133.33%] h-[133.33%]">
              <LivePreview
                template={selectedTemplate}
                colorPalette={colorPalette}
                showSaveButton={true}
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

          {/* Color Palette Display */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Palette:</h3>
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(colorPalette).map(([key, color]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium capitalize">{key}</div>
                    <div className="text-gray-500">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LivePreviewSection;
