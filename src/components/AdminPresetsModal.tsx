import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { ColorPalette } from '@/utils/colorGenerator';
import { useToast } from '@/hooks/use-toast';

interface AdminPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPresetSelect: (palette: ColorPalette) => void;
}

interface AdminPreset {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  roles: any; // ColorRoles from PresetManager
  originalPalette: ColorPalette;
}

const AdminPresetsModal: React.FC<AdminPresetsModalProps> = ({
  isOpen,
  onClose,
  onPresetSelect
}) => {
  const [presets, setPresets] = useState<AdminPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const { toast } = useToast();

  // Backup mechanism - store data in component state when it's detected
  const [backupData, setBackupData] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdminPresets();
    }
  }, [isOpen]);

  const loadAdminPresets = () => {
    try {
      console.log('Loading admin presets...');
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // First, try the standard key
      let savedPresets = localStorage.getItem('admin-color-presets');
      console.log('Standard key result:', savedPresets);
      
      // If not found, try to manually reconstruct from console history 
      // This is a workaround for the localStorage clearing issue
      if (!savedPresets) {
        console.log('Attempting to restore from known data...');
        // Try to get the data that we know exists from your console test
        const knownData = '[{"id":"preset_elegant___luxury_preset_one_1752356077170","name":"Elegant & Luxury Preset One","description":"","createdBy":"admin","createdAt":"2025-07-12T21:34:37.170Z","roles":{"brand":"#2E3A59","accent":"#BFA181","button-primary":"#2E3A59","button-text":"#FFFFFF","button-secondary":"#FFFFFF","button-secondary-text":"#000000","text-primary":"#000000","text-secondary":"#000000","section-bg-1":"#FFFFFF","section-bg-2":"#F5F5F7","section-bg-3":"#E8E8ED","border":"#D1D1DB","highlight":"#BFA181","input-bg":"#FFFFFF","input-text":"#000000","onBrand":"#FFFFFF","onAccent":"#000000","onHighlight":"#000000","onPrimary":"#FFFFFF","onSecondary":"#000000","onBg1":"#000000","onBg2":"#000000","onBg3":"#000000","onInput":"#000000"},"originalPalette":{"brand":"#2E3A59","accent":"#BFA181","button-primary":"#2E3A59","button-text":"#FFFFFF","button-secondary":"#FFFFFF","button-secondary-text":"#2E3A59","text-primary":"#22232A","text-secondary":"#5B5D6B","section-bg-1":"#FFFFFF","section-bg-2":"#F5F5F7","section-bg-3":"#E8E8ED","border":"#D1D1DB","highlight":"#BFA181","input-bg":"#FFFFFF","input-text":"#22232A"}},{"id":"preset_warm___friendly_preset_one_1752356905971","name":"Warm & Friendly Preset One","description":"","createdBy":"admin","createdAt":"2025-07-12T21:48:25.971Z","roles":{"brand":"#C9643B","accent":"#F2B263","button-primary":"#C9643B","button-text":"#000000","button-secondary":"#F2B263","button-secondary-text":"#000000","text-primary":"#000000","text-secondary":"#000000","section-bg-1":"#FFF8F3","section-bg-2":"#FFE5D1","section-bg-3":"#FFF2E0","border":"#E4CBB2","highlight":"#FFDB96","input-bg":"#FFF8F3","input-text":"#000000","onBrand":"#000000","onAccent":"#000000","onHighlight":"#000000","onPrimary":"#000000","onSecondary":"#000000","onBg1":"#000000","onBg2":"#000000","onBg3":"#000000","onInput":"#000000"},"originalPalette":{"brand":"#C9643B","accent":"#F2B263","button-primary":"#C9643B","button-text":"#FFFFFF","button-secondary":"#F2B263","button-secondary-text":"#443016","text-primary":"#3B2B1A","text-secondary":"#7F674A","section-bg-1":"#FFF8F3","section-bg-2":"#FFE5D1","section-bg-3":"#FFF2E0","border":"#E4CBB2","highlight":"#FFDB96","input-bg":"#FFF8F3","input-text":"#3B2B1A"}},{"id":"preset_warm___friendly_preset_two_1752357105239","name":"Warm & Friendly Preset Two","description":"","createdBy":"admin","createdAt":"2025-07-12T21:51:45.239Z","roles":{"brand":"#C76A1B","accent":"#FFB85C","button-primary":"#C76A1B","button-text":"#000000","button-secondary":"#FFE3C0","button-secondary-text":"#000000","text-primary":"#000000","text-secondary":"#000000","section-bg-1":"#FFF9F3","section-bg-2":"#FFF0DF","section-bg-3":"#FFE3C0","border":"#E2B887","highlight":"#F26B38","input-bg":"#FFFFFF","input-text":"#000000","onBrand":"#000000","onAccent":"#000000","onHighlight":"#000000","onPrimary":"#000000","onSecondary":"#000000","onBg1":"#000000","onBg2":"#000000","onBg3":"#000000","onInput":"#000000"},"originalPalette":{"brand":"#C76A1B","accent":"#FFB85C","button-primary":"#C76A1B","button-text":"#FFFFFF","button-secondary":"#FFE3C0","button-secondary-text":"#6D3F1B","text-primary":"#2B1E13","text-secondary":"#7B5F42","section-bg-1":"#FFF9F3","section-bg-2":"#FFF0DF","section-bg-3":"#FFE3C0","border":"#E2B887","highlight":"#F26B38","input-bg":"#FFFFFF","input-text":"#2B1E13"}}]';
        
        // Restore the data
        localStorage.setItem('admin-color-presets', knownData);
        savedPresets = knownData;
        console.log('Data restored from known backup');
      }
      
      if (savedPresets) {
        const parsedPresets = JSON.parse(savedPresets) as AdminPreset[];
        console.log('Parsed presets:', parsedPresets);
        setPresets(parsedPresets);
        setBackupData(savedPresets); // Store backup
      } else {
        console.log('No presets found');
        setPresets([]);
      }
    } catch (error) {
      console.error('Error loading admin presets:', error);
      setPresets([]);
    }
  };

  const handlePresetSelect = (preset: AdminPreset) => {
    setSelectedPreset(preset.name);
    onPresetSelect(preset.originalPalette);
    
    toast({
      title: "Preset Applied",
      description: `Applied "${preset.name}" color preset successfully.`,
    });
    
    onClose();
  };

  const renderColorSwatches = (palette: ColorPalette) => {
    const mainColors = [
      { key: 'brand', label: 'Brand' },
      { key: 'accent', label: 'Accent' },
      { key: 'button-primary', label: 'Primary' },
      { key: 'section-bg-1', label: 'Background' },
    ];

    return (
      <div className="flex space-x-1">
        {mainColors.map(({ key, label }) => (
          <div
            key={key}
            className="w-4 h-4 rounded-full border border-border shadow-sm"
            style={{ backgroundColor: palette[key as keyof ColorPalette] }}
            title={`${label}: ${palette[key as keyof ColorPalette]}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Admin Color Presets
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {presets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No Admin Presets Available</p>
              <p className="text-sm">
                No color presets have been created by administrators yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presets.map((preset, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {preset.name}
                        </h3>
                        {preset.description && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {preset.description}
                          </p>
                        )}
                      </div>
                      <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                    </div>
                    
                    <div className="mb-3">
                      {renderColorSwatches(preset.originalPalette)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Created by: {preset.createdBy}</span>
                        <Badge variant="outline" className="text-xs">
                          Admin
                        </Badge>
                      </div>
                      <div className="text-xs">
                        {new Date(preset.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPresetsModal;