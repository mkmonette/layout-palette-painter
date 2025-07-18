import React, { useState } from 'react';
import { Sparkles, Save, Download, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateType, ColorPalette } from '@/types/template';
import { GeneratedPalette } from '@/types/generator';
import LivePreview from '@/components/LivePreview';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';

interface AutoGenerateResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedPalettes: GeneratedPalette[];
  backgroundSettings: BackgroundSettings;
  onApplyPalette: (palette: ColorPalette) => void;
  onRegenerateClick: () => void;
}

const AutoGenerateResultsModal: React.FC<AutoGenerateResultsModalProps> = ({
  isOpen,
  onClose,
  generatedPalettes,
  backgroundSettings,
  onApplyPalette,
  onRegenerateClick
}) => {
  const { toast } = useToast();
  const { savePalette, MAX_PALETTES } = useSavedPalettes();
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);

  const convertToColorPalette = (palette: GeneratedPalette): ColorPalette => ({
    brand: palette.colors[0],
    accent: palette.colors[2],
    "button-primary": palette.colors[0],
    "button-text": palette.colors[3],
    "button-secondary": palette.colors[3],
    "button-secondary-text": palette.colors[1],
    "text-primary": palette.colors[4],
    "text-secondary": '#6B7280',
    "section-bg-1": palette.colors[3],
    "section-bg-2": '#F9FAFB',
    "section-bg-3": '#F3F4F6',
    border: '#E5E7EB',
    highlight: palette.colors[1],
    "input-bg": palette.colors[3],
    "input-text": palette.colors[4]
  });

  const handleSavePalette = (palette: GeneratedPalette) => {
    const colorPalette = convertToColorPalette(palette);
    const success = savePalette(colorPalette, palette.templateId as TemplateType, `AutoGen ${palette.templateName}`);
    
    if (success) {
      toast({
        title: "Palette Saved!",
        description: "Added to your saved palettes library",
      });
    } else {
      toast({
        title: "Save Failed",
        description: `You've reached the maximum number of saved palettes (${MAX_PALETTES})`,
        variant: "destructive"
      });
    }
  };

  const handleApplyPalette = (palette: GeneratedPalette) => {
    const colorPalette = convertToColorPalette(palette);
    onApplyPalette(colorPalette);
    onClose();
    toast({
      title: "Palette Applied!",
      description: "The selected color palette has been applied to your project",
    });
  };

  const getDaysRemaining = (timestamp: string) => {
    const createdDate = new Date(timestamp);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days retention
    
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[calc(100vh-40px)] my-5 p-0 flex flex-col">
        <DialogHeader className="px-8 py-6 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Generated Color Palettes
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {generatedPalettes.length} palettes generated • Select one to apply
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onRegenerateClick}
              className="h-12 px-6"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {generatedPalettes.map((palette, index) => (
              <Card
                key={palette.id}
                className={`transition-all hover:shadow-lg cursor-pointer ${
                  selectedPaletteIndex === index
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaletteIndex(index)}
              >
                {/* Template Preview */}
                <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100 border-b relative">
                  {/* Desktop Frame */}
                  <div className="absolute inset-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-2 bg-gray-50 border-b border-gray-200 flex items-center px-2">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-red-400"></div>
                        <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                        <div className="w-1 h-1 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="h-[calc(100%-8px)] transform scale-[0.25] origin-top-left w-[400%]">
                      <LivePreview
                        template={palette.templateId as TemplateType}
                        colorPalette={convertToColorPalette(palette)}
                        showSaveButton={false}
                        backgroundSettings={backgroundSettings}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{palette.templateName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getDaysRemaining(palette.timestamp)}d
                    </Badge>
                  </div>
                  
                  {/* Color Palette Strip */}
                  <div className="flex items-center gap-1 mb-4">
                    {palette.colors.slice(0, 5).map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-6 h-6 rounded border border-gray-200 flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSavePalette(palette);
                      }}
                      className="flex-1"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPalette(palette);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AutoGenerateResultsModal;