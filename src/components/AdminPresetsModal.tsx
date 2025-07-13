import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, RefreshCw } from 'lucide-react';
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

  // Listen for localStorage changes to update presets in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-color-presets') {
        loadAdminPresets();
      }
    };

    // Also listen for custom events when the modal is open
    const handleCustomUpdate = () => {
      if (isOpen) {
        loadAdminPresets();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin-presets-updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-presets-updated', handleCustomUpdate);
    };
  }, [isOpen]);

  const loadAdminPresets = () => {
    try {
      console.clear(); // Clear console to ensure fresh logs
      console.log('🔍 Loading admin presets... (ENHANCED VERSION)');
      console.log('Current localStorage keys:', Object.keys(localStorage));
      
      // Check for any preset-related keys
      const allKeys = Object.keys(localStorage);
      const presetKeys = allKeys.filter(key => key.toLowerCase().includes('preset'));
      console.log('Preset-related keys found:', presetKeys);
      
      // Check multiple possible keys
      const possibleKeys = ['admin-color-presets', 'color-presets', 'presets', 'savedPresets'];
      possibleKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`Found data in '${key}':`, data.substring(0, 200) + '...');
        }
      });
      
      const savedPresets = localStorage.getItem('admin-color-presets');
      console.log('Found admin presets:', savedPresets);
      
      if (savedPresets) {
        const parsedPresets = JSON.parse(savedPresets) as AdminPreset[];
        console.log('Parsed presets:', parsedPresets);
        console.log('Number of presets:', parsedPresets.length);
        setPresets(parsedPresets);
        
        // Backup mechanism - store in component state
        setBackupData(savedPresets);
      } else {
        console.log('No admin presets found in admin-color-presets key');
        
        // Check savedPalettes as fallback since it exists in localStorage
        const savedPalettesData = localStorage.getItem('savedPalettes');
        console.log('Checking savedPalettes data:', savedPalettesData ? savedPalettesData.substring(0, 200) + '...' : 'null');
        
        if (savedPalettesData) {
          try {
            const savedPalettes = JSON.parse(savedPalettesData);
            console.log('Parsed savedPalettes:', savedPalettes);
            
            // Check if these are admin presets by looking for createdBy: 'admin'
            if (Array.isArray(savedPalettes)) {
              const adminPresets = savedPalettes.filter(preset => preset && preset.createdBy === 'admin');
              console.log('Found admin presets in savedPalettes:', adminPresets.length);
              
              if (adminPresets.length > 0) {
                console.log('Using admin presets from savedPalettes');
                setPresets(adminPresets);
                return;
              }
            }
          } catch (error) {
            console.error('Error parsing savedPalettes:', error);
          }
        }
        
        setPresets([]);
      }
    } catch (error) {
      console.error('Error loading admin presets:', error);
      console.log('Attempting to use backup data...');
      if (backupData) {
        try {
          const parsedBackup = JSON.parse(backupData) as AdminPreset[];
          setPresets(parsedBackup);
        } catch (backupError) {
          console.error('Backup data also failed:', backupError);
          setPresets([]);
        }
      } else {
        setPresets([]);
      }
    }
  };

  const clearLocalStorageCache = () => {
    console.log('Clearing localStorage cache...');
    console.log('Before clear - all localStorage keys:', Object.keys(localStorage));
    localStorage.removeItem('admin-color-presets');
    console.log('After clear - all localStorage keys:', Object.keys(localStorage));
    setPresets([]);
    setBackupData(null);
    toast({
      title: "Cache Cleared",
      description: "Local storage cache has been cleared. Please refresh to see updated presets.",
    });
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
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Admin Color Presets
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0">
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
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={loadAdminPresets}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={clearLocalStorageCache}
              className="flex items-center gap-2 text-destructive"
            >
              Clear Cache
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPresetsModal;