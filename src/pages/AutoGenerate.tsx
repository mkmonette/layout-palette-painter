import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Clock, Save, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [paletteCount, setPaletteCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([]);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);
  const [adminSettings, setAdminSettings] = useState(getAdminSettings());

  useEffect(() => {
    setAdminSettings(getAdminSettings());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const newPalettes = generatePaletteBatch(paletteCount).map(palette => ({
        ...palette,
        templateId: selectedTemplate,
        templateName: allTemplates.find(t => t.id === selectedTemplate)?.name || selectedTemplate
      }));
      
      setGeneratedPalettes(newPalettes);
      setSelectedPaletteIndex(0);
      setIsGenerating(false);
      
      toast({
        title: "Palettes Generated!",
        description: `Generated ${paletteCount} color palettes for ${allTemplates.find(t => t.id === selectedTemplate)?.name}`,
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

  const selectedPalette = selectedPaletteIndex !== null ? generatedPalettes[selectedPaletteIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Select Template
              </h2>
              
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {allTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{template.name}</h3>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Amount Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Number of Palettes</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Count:</span>
                  <span className="font-medium">{paletteCount}</span>
                </div>
                
                <Slider
                  value={[paletteCount]}
                  onValueChange={(value) => setPaletteCount(value[0])}
                  max={adminSettings.maxPalettesPerBatch}
                  min={1}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>Max: {adminSettings.maxPalettesPerBatch}</span>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Palette className="h-5 w-5 mr-2" />
                  Generate {paletteCount} Palette{paletteCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>

            {/* Info Panel */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• History retained for {adminSettings.retentionDays} days only</li>
                <li>• Save palettes to library for long-term access</li>
                <li>• Each generation creates unique color combinations</li>
              </ul>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {generatedPalettes.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Results List */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Generated Palettes</h2>
                  <ScrollArea className="h-[70vh]">
                    <div className="space-y-3 pr-4">
                      {generatedPalettes.map((palette, index) => (
                        <Card
                          key={palette.id}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedPaletteIndex === index
                              ? 'border-blue-500 bg-blue-50'
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPaletteIndex(index)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-sm">Palette #{index + 1}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {getDaysRemaining(palette.timestamp)}d left
                              </Badge>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSavePalette(palette);
                                }}
                                variant="outline"
                                size="sm"
                                disabled={!canSaveMore()}
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 mb-2">
                            {palette.colors.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="flex-1 h-6 rounded"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{palette.templateName}</span>
                            <span>{new Date(palette.timestamp).toLocaleDateString()}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Live Preview */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
                  {selectedPalette && (
                    <Card className="overflow-hidden">
                      <div className="h-[70vh] overflow-auto">
                        <LivePreview
                          template={selectedPalette.templateId as TemplateType}
                          colorPalette={convertToColorPalette(selectedPalette)}
                        />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Palettes Generated Yet</h2>
                <p className="text-gray-500 mb-6">
                  Select a template and choose how many palettes to generate, then click the Generate button.
                </p>
                <div className="text-sm text-gray-400">
                  Ready to create {paletteCount} palette{paletteCount !== 1 ? 's' : ''} for {allTemplates.find(t => t.id === selectedTemplate)?.name}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoGenerate;