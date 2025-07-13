import React, { useState, useEffect } from 'react';
import { Trash2, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface SavedPalettesContentProps {
  currentPalette: ColorPalette;
  currentTemplate: TemplateType;
  onPaletteSelect: (palette: ColorPalette) => void;
  onTemplateChange?: (template: TemplateType) => void;
}

const SavedPalettesContent: React.FC<SavedPalettesContentProps> = ({
  currentPalette,
  currentTemplate,
  onPaletteSelect,
  onTemplateChange
}) => {
  const { toast } = useToast();
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  const MAX_PALETTES = 10;

  useEffect(() => {
    loadSavedPalettes();
  }, []);

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

  const savePalette = () => {
    if (!paletteName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your palette.",
        variant: "destructive"
      });
      return;
    }

    if (savedPalettes.length >= MAX_PALETTES) {
      toast({
        title: "Save Limit Reached",
        description: "You can manage saved palettes or upgrade.",
        variant: "destructive"
      });
      return;
    }

    const newPalette: SavedPalette = {
      ...currentPalette,
      id: Date.now().toString(),
      name: paletteName.trim(),
      template: currentTemplate,
      savedAt: new Date().toISOString()
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));

    setPaletteName('');
    setShowSaveForm(false);
    
    toast({
      title: "Palette Saved",
      description: `"${newPalette.name}" has been saved successfully.`
    });
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
    
    toast({
      title: "Palette Applied",
      description: `"${palette.name}" applied with ${palette.template?.replace('-', ' ')} template.`
    });
  };

  const canSave = savedPalettes.length < MAX_PALETTES;
  const remainingSlots = MAX_PALETTES - savedPalettes.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Saved Palettes</h3>
        <p className="text-sm text-muted-foreground">
          Manage your saved color palettes and apply them to templates.
        </p>
      </div>

      {/* Status Indicator */}
      <div className="p-3 bg-muted rounded-lg text-center">
        {savedPalettes.length === 0 ? (
          <p className="text-muted-foreground">📭 No saved palettes yet.</p>
        ) : savedPalettes.length >= MAX_PALETTES ? (
          <p className="text-destructive">❗ You've reached the limit. Upgrade to save more palettes.</p>
        ) : (
          <p className="text-green-600">
            ✅ You've saved {savedPalettes.length} out of {MAX_PALETTES} palettes ({remainingSlots} remaining).
          </p>
        )}
      </div>

      {/* Save Current Palette Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Save Current Palette</h4>
        
        {/* Current Palette Preview */}
        <div className="flex items-center gap-3">
          {Object.entries(currentPalette).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>

        {showSaveForm ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter palette name..."
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && savePalette()}
            />
            <div className="flex gap-2">
              <Button 
                onClick={savePalette}
                disabled={!canSave}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSaveForm(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => setShowSaveForm(true)}
            disabled={!canSave}
            size="sm"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {canSave ? 'Save Current Palette' : 'Save Limit Reached'}
          </Button>
        )}
      </div>

      {/* Saved Palettes List */}
      {savedPalettes.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Saved Palettes</h4>
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 gap-4 pr-4">
              {savedPalettes.map((palette) => (
                <div key={palette.id} className="border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                  {/* Template Preview */}
                  <div className="border-b bg-muted">
                    <div className="h-32 relative overflow-hidden">
                      <div className="absolute inset-0 transform scale-25 origin-top-left w-[400%] h-[400%]">
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
                        <h5 className="font-medium text-sm truncate">{palette.name}</h5>
                        <p className="text-xs text-muted-foreground capitalize">
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
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(palette.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SavedPalettesContent;