import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Copy as CopyIcon, 
  Download,
  Plus,
  Palette,
  Check,
  X
} from 'lucide-react';
import { ColorPalette } from '@/types/template';
import { ColorRoles } from '@/types/colorRoles';
import { mapPaletteToRoles } from '@/utils/colorRoleMapper';
import { useToast } from '@/hooks/use-toast';

interface ColorPreset {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  roles: ColorRoles;
  originalPalette: ColorPalette;
}

interface PresetManagerProps {
  currentPalette: ColorPalette;
  onApplyPreset: (palette: ColorPalette) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({ 
  currentPalette, 
  onApplyPreset 
}) => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<ColorPreset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  
  // Save preset form state
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('admin-color-presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Failed to load presets:', error);
      }
    }
  }, []);

  // Save presets to localStorage
  const savePresetsToStorage = (updatedPresets: ColorPreset[]) => {
    localStorage.setItem('admin-color-presets', JSON.stringify(updatedPresets));
    setPresets(updatedPresets);
  };

  const generatePresetId = (name: string) => {
    return `preset_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: 'Error',
        description: 'Preset name is required',
        variant: 'destructive'
      });
      return;
    }

    // Check for duplicate names
    if (presets.some(p => p.name.toLowerCase() === presetName.toLowerCase())) {
      toast({
        title: 'Error',
        description: 'A preset with this name already exists',
        variant: 'destructive'
      });
      return;
    }

    const currentRoles = mapPaletteToRoles(currentPalette);
    const newPreset: ColorPreset = {
      id: generatePresetId(presetName),
      name: presetName,
      description: presetDescription,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      roles: currentRoles,
      originalPalette: { ...currentPalette }
    };

    const updatedPresets = [...presets, newPreset];
    savePresetsToStorage(updatedPresets);

    toast({
      title: 'Success',
      description: `Preset "${presetName}" saved successfully`
    });

    // Reset form and close dialog
    setPresetName('');
    setPresetDescription('');
    setSaveDialogOpen(false);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      onApplyPreset(preset.originalPalette);
      toast({
        title: 'Success',
        description: `Applied preset "${preset.name}"`
      });
      setLoadDialogOpen(false);
      setSelectedPreset('');
    }
  };

  const handleDeletePreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset && window.confirm(`Delete preset "${preset.name}"? This action cannot be undone.`)) {
      const updatedPresets = presets.filter(p => p.id !== presetId);
      savePresetsToStorage(updatedPresets);
      toast({
        title: 'Success',
        description: `Preset "${preset.name}" deleted`
      });
    }
  };

  const handleExportPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      const dataStr = JSON.stringify(preset, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `preset_${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Success',
        description: `Preset exported as ${exportFileDefaultName}`
      });
    }
  };

  const handleDuplicatePreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      const duplicatedPreset: ColorPreset = {
        ...preset,
        id: generatePresetId(preset.name + '_copy'),
        name: preset.name + ' (Copy)',
        createdAt: new Date().toISOString()
      };
      
      const updatedPresets = [...presets, duplicatedPreset];
      savePresetsToStorage(updatedPresets);
      
      toast({
        title: 'Success',
        description: `Preset duplicated as "${duplicatedPreset.name}"`
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preset Manager
          </CardTitle>
          <CardDescription>
            Save and load color role presets for quick palette switching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save as Preset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Color Preset</DialogTitle>
                  <DialogDescription>
                    Save the current color roles as a reusable preset
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preset-name">Preset Name *</Label>
                    <Input
                      id="preset-name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="e.g., Midnight Gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description</Label>
                    <Textarea
                      id="preset-description"
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      placeholder="Optional description of this preset"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSaveDialogOpen(false);
                        setPresetName('');
                        setPresetDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSavePreset}>
                      Save Preset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Load Preset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Load Color Preset</DialogTitle>
                  <DialogDescription>
                    Select a preset to apply its colors to the current palette
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {presets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No presets saved yet</p>
                      <p className="text-sm">Save your first preset to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {presets.map((preset) => (
                        <div key={preset.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{preset.name}</h4>
                                <div className="flex gap-1">
                                  <div 
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: preset.originalPalette.brand }}
                                    title={`Brand: ${preset.originalPalette.brand}`}
                                  />
                                  <div 
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: preset.originalPalette.accent }}
                                    title={`Accent: ${preset.originalPalette.accent}`}
                                  />
                                  <div 
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: preset.originalPalette['button-primary'] }}
                                    title={`Primary: ${preset.originalPalette['button-primary']}`}
                                  />
                                </div>
                              </div>
                              {preset.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {preset.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Created {new Date(preset.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleLoadPreset(preset.id)}
                                className="flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Apply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDuplicatePreset(preset.id)}
                                title="Duplicate preset"
                              >
                                <CopyIcon className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportPreset(preset.id)}
                                title="Export as JSON"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletePreset(preset.id)}
                                title="Delete preset"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setLoadDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {presets.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Quick Access</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {presets.slice(0, 6).map((preset) => (
                  <div key={preset.id} className="border rounded p-3 bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{preset.name}</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: preset.originalPalette.brand }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: preset.originalPalette.accent }}
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => handleLoadPreset(preset.id)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetManager;