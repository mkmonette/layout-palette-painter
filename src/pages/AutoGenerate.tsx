import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Clock, Save, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { TemplateType, ColorPalette, Template } from '@/types/template';
import { GeneratedPalette } from '@/types/generator';
import { generatePaletteBatch, getAdminSettings } from '@/utils/autoGenerator';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import LivePreview from '@/components/LivePreview';

// Template definitions (reusing from TemplateSelector)
const allTemplates: Template[] = [
  { id: 'modern-hero', name: 'Modern Hero', description: 'Clean hero section with centered content', isPro: false },
  { id: 'minimal-header', name: 'Minimal Header', description: 'Simple header with navigation', isPro: false },
  { id: 'bold-landing', name: 'Bold Landing', description: 'Eye-catching landing page design', isPro: false },
  { id: 'creative-portfolio', name: 'Creative Portfolio', description: 'Artistic portfolio layout', isPro: false },
  { id: 'gradient-hero', name: 'Gradient Hero', description: 'Modern gradient background with floating elements', isPro: false },
  { id: 'split-screen', name: 'Split Screen', description: 'Dynamic split layout with image showcase', isPro: false },
  { id: 'magazine-style', name: 'Magazine Style', description: 'Editorial design with typography focus', isPro: false },
  { id: 'startup-landing', name: 'Startup Landing', description: 'Tech startup focused design', isPro: false },
  { id: 'tech-startup', name: 'Tech Startup', description: 'Modern tech company with glassmorphism', isPro: false },
  { id: 'creative-agency', name: 'Creative Agency', description: 'Bold creative studio design', isPro: false },
  { id: 'saas-product', name: 'SaaS Product', description: 'Clean SaaS landing with features', isPro: false },
  { id: 'ecommerce-landing', name: 'E-commerce Landing', description: 'Product-focused e-commerce design', isPro: false }
];

const AutoGenerate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savePalette, canSaveMore } = useSavedPalettes();

  // Global settings from Dashboard
  const [globalSettings] = useState(() => {
    const stored = localStorage.getItem('autogenerate-global-settings');
    return stored ? JSON.parse(stored) : {
      template: 'modern-hero',
      scheme: 'random',
      isDarkMode: false,
      count: 10,
      palette: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
        textLight: '#6B7280'
      }
    };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);
  const [adminSettings] = useState(getAdminSettings());

  useEffect(() => {
    // Auto-generate when component mounts with global settings
    if (globalSettings.count > 0) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const newPalettes = generatePaletteBatch(globalSettings.count).map(palette => ({
        ...palette,
        templateId: globalSettings.template,
        templateName: allTemplates.find(t => t.id === globalSettings.template)?.name || globalSettings.template
      }));
      
      setGeneratedPalettes(newPalettes);
      setSelectedPaletteIndex(0);
      setIsGenerating(false);
      
      toast({
        title: "Palettes Generated!",
        description: `Generated ${globalSettings.count} color palettes for ${allTemplates.find(t => t.id === globalSettings.template)?.name}`,
      });
    }, 1500);
  };

  const handleSavePalette = (palette: GeneratedPalette) => {
    const colorPalette: ColorPalette = {
      primary: palette.colors[0],
      secondary: palette.colors[1],
      accent: palette.colors[2],
      background: palette.colors[3],
      text: palette.colors[4],
      textLight: '#6B7280'
    };

    const success = savePalette(colorPalette, palette.templateId as TemplateType, `AutoGen ${palette.templateName}`);
    
    if (success) {
      toast({
        title: "Palette Saved!",
        description: "Added to your saved palettes library",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "You've reached the maximum number of saved palettes (10)",
        variant: "destructive"
      });
    }
  };

  const getDaysRemaining = (timestamp: string) => {
    const createdDate = new Date(timestamp);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + adminSettings.retentionDays);
    
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const convertToColorPalette = (palette: GeneratedPalette): ColorPalette => ({
    primary: palette.colors[0],
    secondary: palette.colors[1],
    accent: palette.colors[2],
    background: palette.colors[3],
    text: palette.colors[4],
    textLight: '#6B7280'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AutoGenerate Colors
                </h1>
                <p className="text-sm text-gray-600">
                  Generate multiple color palettes for your selected template
                </p>
              </div>
            </div>
            
            <div className="w-[140px]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {generatedPalettes.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-6">Generated Palettes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {generatedPalettes.map((palette, index) => (
                <Card
                  key={palette.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPaletteIndex === index
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaletteIndex(index)}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-white relative">
                    <div className="absolute inset-0 scale-[0.25] origin-top-left" style={{ width: '400%', height: '400%' }}>
                      <LivePreview
                        template={palette.templateId as TemplateType}
                        colorPalette={convertToColorPalette(palette)}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Palette #{index + 1}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getDaysRemaining(palette.timestamp)}d left
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {palette.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 h-4 rounded"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>{palette.templateName}</span>
                      <span>{new Date(palette.timestamp).toLocaleDateString()}</span>
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSavePalette(palette);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={!canSaveMore()}
                    >
                      <Save className="h-3 w-3 mr-2" />
                      Save to Library
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Generating Palettes...</h2>
            <p className="text-gray-500 mb-6">
              Creating {globalSettings.count} color palettes for {allTemplates.find(t => t.id === globalSettings.template)?.name}
            </p>
            <div className="text-sm text-gray-400">
              Using global settings from Dashboard
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Template:</span>
              <Badge variant="outline" className="capitalize">
                {globalSettings.template.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Scheme:</span>
              <Badge variant="outline" className="capitalize">
                {globalSettings.scheme}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Mode:</span>
              <Badge variant="outline">
                {globalSettings.isDarkMode ? 'Dark' : 'Light'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Count:</span>
              <Badge variant="outline">
                {globalSettings.count} palettes
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoGenerate;