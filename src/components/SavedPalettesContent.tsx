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
    <div className="space-y-3">
      {/* Status Indicator */}
      <div className="p-2 bg-muted rounded text-center">
        {savedPalettes.length === 0 ? (
          <p className="text-xs text-muted-foreground">No saved palettes yet</p>
        ) : savedPalettes.length >= MAX_PALETTES ? (
          <p className="text-xs text-destructive">Limit reached ({MAX_PALETTES})</p>
        ) : (
          <p className="text-xs text-green-600">
            {savedPalettes.length}/{MAX_PALETTES} saved
          </p>
        )}
      </div>

      {/* Save Current Palette Section */}
      <div className="border rounded p-2 space-y-2">
        <h4 className="text-xs font-medium">Save Current</h4>
        
        {/* Current Palette Preview */}
        <div className="flex flex-wrap items-center gap-1 max-w-full overflow-hidden">
          {Object.entries(currentPalette).slice(0, 6).map(([key, color]) => (
            <div 
              key={key}
              className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: color }}
              title={`${key}: ${color}`}
            />
          ))}
          {Object.entries(currentPalette).length > 6 && (
            <span className="text-xs text-muted-foreground">+{Object.entries(currentPalette).length - 6}</span>
          )}
        </div>

        {showSaveForm ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Palette name..."
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && savePalette()}
            />
            <div className="flex gap-1">
              <Button 
                onClick={savePalette}
                disabled={!canSave}
                size="sm"
                className="h-6 text-xs flex-1"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSaveForm(false)}
                size="sm"
                className="h-6 text-xs px-2"
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
            className="w-full h-6 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            {canSave ? 'Save Current' : 'Limit Reached'}
          </Button>
        )}
      </div>

      {/* Saved Palettes List */}
      {savedPalettes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Saved ({savedPalettes.length})</h4>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2 pr-2">
              {savedPalettes.map((palette) => (
                <div key={palette.id} className="border rounded bg-card shadow-sm">
                  <div className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-medium truncate">{palette.name}</h5>
                        <p className="text-xs text-muted-foreground truncate">
                          {(palette.template || 'modern-hero').replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="flex items-center gap-1 mb-2">
                      {Object.entries(palette).slice(0, 6).map(([key, color]) => {
                        if (key === 'id' || key === 'name' || key === 'savedAt' || key === 'template') return null;
                        return (
                          <div 
                            key={key}
                            className="w-2 h-2 rounded-full border border-white shadow-sm"
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
                        className="flex-1 text-xs h-6"
                      >
                        <Palette className="h-2 w-2 mr-1" />
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePalette(palette.id)}
                        className="px-1 h-6"
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    </div>
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