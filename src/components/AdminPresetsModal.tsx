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
      
      const savedPresets = localStorage.getItem('admin-color-presets');
      console.log('Found admin presets:', savedPresets);
      
      if (savedPresets) {
        const parsedPresets = JSON.parse(savedPresets) as AdminPreset[];
        console.log('Parsed presets:', parsedPresets);
        setPresets(parsedPresets);
      } else {
        console.log('No admin presets found');
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