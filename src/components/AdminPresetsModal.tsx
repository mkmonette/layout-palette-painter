import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Check, RefreshCw, FilterX } from 'lucide-react';
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
  scheme?: string;
  mood?: string;
  mode?: 'light' | 'dark';
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

  // Filter states
  const [filterScheme, setFilterScheme] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      console.log('🚀 AdminPresetsModal opened - calling loadAdminPresets');
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
      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] ENHANCED VERSION - Loading admin presets...`);
      console.log('Browser cache timestamp:', Date.now());
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

  // Filter presets based on selected filters
  const filteredPresets = presets.filter(preset => {
    const schemeMatch = filterScheme === 'all' || preset.scheme === filterScheme;
    const moodMatch = filterMood === 'all' || preset.mood === filterMood;
    const modeMatch = filterMode === 'all' || preset.mode === filterMode;
    
    return schemeMatch && moodMatch && modeMatch;
  });

  // Get unique values for filter options
  const uniqueSchemes = [...new Set(presets.map(p => p.scheme).filter(Boolean))];
  const uniqueMoods = [...new Set(presets.map(p => p.mood).filter(Boolean))];
  const uniqueModes = [...new Set(presets.map(p => p.mode).filter(Boolean))];

  const clearFilters = () => {
    setFilterScheme('all');
    setFilterMood('all');
    setFilterMode('all');
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
            <>
              {/* Filter Controls */}
              <div className="border-b pb-4 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">Filter Presets</h4>
                    <Badge variant="secondary" className="text-xs">
                      {filteredPresets.length} of {presets.length}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    <FilterX className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Scheme</label>
                    <Select value={filterScheme} onValueChange={setFilterScheme}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schemes</SelectItem>
                        {uniqueSchemes.map(scheme => (
                          <SelectItem key={scheme} value={scheme}>
                            {scheme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Mood</label>
                    <Select value={filterMood} onValueChange={setFilterMood}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Moods</SelectItem>
                        {uniqueMoods.map(mood => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Mode</label>
                    <Select value={filterMode} onValueChange={setFilterMode}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        {uniqueModes.map(mode => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Filtered Results */}
              {filteredPresets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FilterX className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No presets match your filters</p>
                  <p className="text-xs">Try adjusting or clearing your filter settings</p>
                </div>
              ) : (
                <ScrollArea className="h-[420px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPresets.map((preset, index) => (
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
                        
                        {/* Scheme, Mood, Mode badges */}
                        {(preset.scheme || preset.mood || preset.mode) && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {preset.scheme && (
                              <Badge variant="secondary" className="text-xs">
                                {preset.scheme}
                              </Badge>
                            )}
                            {preset.mood && (
                              <Badge variant="secondary" className="text-xs">
                                {preset.mood}
                              </Badge>
                            )}
                            {preset.mode && (
                              <Badge variant="secondary" className="text-xs">
                                {preset.mode}
                              </Badge>
                            )}
                          </div>
                        )}
                        
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
            </>
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