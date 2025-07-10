
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
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  const MAX_PALETTES = 10;

  useEffect(() => {
    loadSavedPalettes();
  }, [isOpen]);

  const loadSavedPalettes = () => {
    try {
      const saved = localStorage.getItem('savedPalettes');
      if (saved) {
        setSavedPalettes(JSON.parse(saved));
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
    onClose();
    
    toast({
      title: "Palette Applied",
      description: `"${palette.name}" applied with ${palette.template?.replace('-', ' ')} template.`
    });
  };

  const canSave = savedPalettes.length < MAX_PALETTES;
  const remainingSlots = MAX_PALETTES - savedPalettes.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🟡 Saved Palettes
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="p-4 space-y-4">
            {/* Status Indicator */}
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              {savedPalettes.length === 0 ? (
                <p className="text-gray-600">📭 No saved palettes yet.</p>
              ) : savedPalettes.length >= MAX_PALETTES ? (
                <p className="text-red-600">❗ You've reached the limit. Upgrade to save more palettes.</p>
              ) : (
                <p className="text-green-600">
                  ✅ You've saved {savedPalettes.length} out of {MAX_PALETTES} palettes ({remainingSlots} remaining).
                </p>
              )}
            </div>

            {/* Save Current Palette Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Save Current Palette</h3>
              
              {/* Current Palette Preview */}
              <div className="flex items-center gap-3 mb-3">
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="space-y-3">
                <h3 className="font-medium">Your Saved Palettes</h3>
                {savedPalettes.map((palette) => (
                  <div key={palette.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{palette.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {palette.template?.replace('-', ' ') || 'Unknown Template'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyPalette(palette)}
                          >
                            <Palette className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePalette(palette.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Template Preview */}
                      {palette.template && (
                        <div className="mb-3 border rounded-lg overflow-hidden bg-gray-50">
                          <div className="h-32 transform scale-50 origin-top-left w-[200%]">
                            <LivePreview
                              template={palette.template}
                              colorPalette={palette}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Color Swatches */}
                      <div className="flex items-center gap-2">
                        {Object.entries(palette).map(([key, color]) => {
                          if (key === 'id' || key === 'name' || key === 'savedAt' || key === 'template') return null;
                          return (
                            <div key={key} className="flex items-center gap-1">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-gray-500 capitalize">{key}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Saved: {new Date(palette.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SavedPalettesModal;
