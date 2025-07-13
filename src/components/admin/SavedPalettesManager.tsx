import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Copy as CopyIcon, 
  Download,
  Edit,
  Check,
  X,
  Palette as PaletteIcon,
  Smile,
  Sun,
  Moon
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
  scheme?: string;
  mood?: string;
  mode?: 'light' | 'dark';
}

interface SavedPalettesManagerProps {
  currentPalette: ColorPalette;
  onApplyPreset: (palette: ColorPalette) => void;
  currentScheme?: string;
  currentMood?: string;
  currentMode?: 'light' | 'dark';
}

const SavedPalettesManager: React.FC<SavedPalettesManagerProps> = ({ 
  currentPalette, 
  onApplyPreset,
  currentScheme,
  currentMood,
  currentMode
}) => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<ColorPreset[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  
  // Save preset form state
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  
  // Preset action states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingPreset, setRenamingPreset] = useState<ColorPreset | null>(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');

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
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('admin-presets-updated'));
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
      originalPalette: { ...currentPalette },
      scheme: currentScheme,
      mood: currentMood && currentMood !== 'none' ? currentMood : undefined,
      mode: currentMode
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
      
      // Dispatch event to notify AdminPresetsModal of changes
      window.dispatchEvent(new CustomEvent('admin-presets-updated'));
      
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

  const handleRenamePreset = (preset: ColorPreset) => {
    setRenamingPreset(preset);
    setNewPresetName(preset.name);
    setNewPresetDescription(preset.description || '');
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (!renamingPreset || !newPresetName.trim()) {
      toast({
        title: 'Error',
        description: 'Preset name is required',
        variant: 'destructive'
      });
      return;
    }

    // Check for duplicate names (excluding current preset)
    if (presets.some(p => p.id !== renamingPreset.id && p.name.toLowerCase() === newPresetName.toLowerCase())) {
      toast({
        title: 'Error',
        description: 'A preset with this name already exists',
        variant: 'destructive'
      });
      return;
    }

    const updatedPresets = presets.map(p => 
      p.id === renamingPreset.id 
        ? { ...p, name: newPresetName, description: newPresetDescription }
        : p
    );
    
    savePresetsToStorage(updatedPresets);
    
    toast({
      title: 'Success',
      description: `Preset renamed to "${newPresetName}"`
    });

    setRenameDialogOpen(false);
    setRenamingPreset(null);
    setNewPresetName('');
    setNewPresetDescription('');
  };

  const handleExportAsJSON = (preset: ColorPreset) => {
    const exportData = {
      name: preset.name,
      roles: preset.roles
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'Success',
      description: `Preset exported as ${exportFileDefaultName}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Save & Load Presets</h2>
          <p className="text-muted-foreground">Manage your saved color presets</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Current Palette
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Color Preset</DialogTitle>
                <DialogDescription>
                  Save the current palette as a preset for quick access later
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preset-name">Preset Name *</Label>
                  <Input
                    id="preset-name"
                    placeholder="e.g., Dark Mode Theme"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preset-description">Description (Optional)</Label>
                  <Textarea
                    id="preset-description"
                    placeholder="Brief description of this color palette..."
                    value={presetDescription}
                    onChange={(e) => setPresetDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePreset}>
                    Save Preset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Load Presets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Saved Presets
          </CardTitle>
          <CardDescription>
            Load and manage your saved color presets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {presets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved presets yet.</p>
              <p className="text-sm">Save your current palette to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {presets.map((preset) => (
                <div 
                  key={preset.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{preset.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(preset.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      {preset.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {preset.description}
                        </p>
                      )}
                      
                      {/* Preset Metadata */}
                      {(preset.scheme || preset.mood || preset.mode) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          {preset.scheme && (
                            <div className="flex items-center gap-1">
                              <PaletteIcon className="h-3 w-3" />
                              <span>{preset.scheme}</span>
                            </div>
                          )}
                          {preset.mood && (
                            <div className="flex items-center gap-1">
                              <Smile className="h-3 w-3" />
                              <span>{preset.mood}</span>
                            </div>
                          )}
                          {preset.mode && (
                            <div className="flex items-center gap-1">
                              {preset.mode === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                              <span className="capitalize">{preset.mode}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Color Preview */}
                      <div className="flex gap-1 mb-3">
                        {Object.entries(preset.originalPalette).slice(0, 8).map(([role, color]) => (
                          <div
                            key={role}
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: color }}
                            title={`${role}: ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadPreset(preset.id)}
                        title="Load Preset"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRenamePreset(preset)}
                        title="Rename Preset"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicatePreset(preset.id)}
                        title="Duplicate Preset"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportAsJSON(preset)}
                        title="Export as JSON"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePreset(preset.id)}
                        title="Delete Preset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Preset</DialogTitle>
            <DialogDescription>
              Update the name and description for this preset
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-preset-name">Preset Name *</Label>
              <Input
                id="new-preset-name"
                placeholder="e.g., Dark Mode Theme"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-preset-description">Description (Optional)</Label>
              <Textarea
                id="new-preset-description"
                placeholder="Brief description of this color palette..."
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmRename}>
                Update Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedPalettesManager;