
import React, { useState, useEffect } from 'react';
import { Trash2, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ColorPalette, TemplateType } from '@/types/template';
import LivePreview from '@/components/LivePreview';

interface SavedPalette extends ColorPalette {
  id: string;
  name: string;
  savedAt: string;
  template: TemplateType;
}

interface SavedPalettesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: ColorPalette;
  currentTemplate: TemplateType;
  onPaletteSelect: (palette: ColorPalette) => void;
  onTemplateChange?: (template: TemplateType) => void;
}

const SavedPalettesModal: React.FC<SavedPalettesModalProps> = ({
  isOpen,
  onClose,
  currentPalette,
  currentTemplate,
  onPaletteSelect,
  onTemplateChange
}) => {
  const { toast } = useToast();
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const MAX_PALETTES = 10;

  useEffect(() => {
    loadSavedPalettes();
  }, [isOpen]);

  const loadSavedPalettes = () => {
    try {
      const saved = localStorage.getItem('savedPalettes');
      if (saved) {
        const palettes = JSON.parse(saved);
        // Migrate old palettes that don't have template field
        const migratedPalettes = palettes.map((palette: any) => ({
          ...palette,
          template: palette.template || 'modern-hero' // Default template for old palettes
        }));
        setSavedPalettes(migratedPalettes);
        
        // Save migrated data back to localStorage
        if (migratedPalettes.some((p: any) => !palettes.find((orig: any) => orig.id === p.id && orig.template))) {
          localStorage.setItem('savedPalettes', JSON.stringify(migratedPalettes));
        }
      }
    } catch (error) {
      console.error('Error loading saved palettes:', error);
    }
  };


  const deletePalette = (id: string) => {
    const updatedPalettes = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    
    toast({
      title: "Palette Deleted",
      description: "Palette has been removed from your saved collection."
    });
  };

  const applyPalette = (palette: SavedPalette) => {
    onPaletteSelect(palette);
    if (onTemplateChange && palette.template) {
      onTemplateChange(palette.template);
    }
    onClose();
    
    toast({
      title: "Palette Applied",
      description: `"${palette.name}" applied with ${palette.template?.replace('-', ' ')} template.`
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🟡 Saved Palettes
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="p-4 space-y-4">
            {/* Status Indicator */}
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              {savedPalettes.length === 0 ? (
                <p className="text-gray-600">📭 No saved palettes yet.</p>
              ) : savedPalettes.length >= MAX_PALETTES ? (
                <p className="text-red-600">❗ You've reached the limit. Upgrade to save more palettes.</p>
              ) : (
                 <p className="text-green-600">
                   ✅ You've saved {savedPalettes.length} out of {MAX_PALETTES} palettes ({MAX_PALETTES - savedPalettes.length} remaining).
                 </p>
              )}
            </div>


            {/* Saved Palettes List */}
            {savedPalettes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Your Saved Palettes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedPalettes.map((palette) => (
                  <div key={palette.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Template Preview */}
                    <div className="border-b bg-gray-50">
                      <div className="h-72 relative overflow-hidden">
                        <div className="absolute inset-0 transform scale-50 origin-top-left w-[200%] h-[200%]">
                          <LivePreview
                            template={palette.template || 'modern-hero'}
                            colorPalette={palette}
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
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm truncate">{palette.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">
                            {(palette.template || 'modern-hero').replace('-', ' ')} Template
                          </p>
                        </div>
                      </div>
                      
                      {/* Color Swatches */}
                      <div className="flex items-center gap-1 mb-2">
                        {Object.entries(palette).map(([key, color]) => {
                          if (key === 'id' || key === 'name' || key === 'savedAt' || key === 'template') return null;
                          return (
                            <div 
                              key={key}
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              title={`${key}: ${color}`}
                            />
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyPalette(palette)}
                          className="flex-1 text-xs"
                        >
                          <Palette className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePalette(palette.id)}
                          className="px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(palette.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SavedPalettesModal;
