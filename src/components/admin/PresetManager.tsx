import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Copy as CopyIcon, 
  Download,
  Plus,
  Palette,
  Check,
  X,
  Wand2,
  ChevronDown,
  ChevronUp,
  Edit,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ColorPalette } from '@/types/template';
import { ColorRoles, ColorRole } from '@/types/colorRoles';
import { mapPaletteToRoles } from '@/utils/colorRoleMapper';
import { generateAIColorPalette, isOpenAIInitialized } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';
import { ColorSchemeType } from '@/components/ColorSchemeSelector';

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

interface PresetManagerProps {
  currentPalette: ColorPalette;
  onApplyPreset: (palette: ColorPalette) => void;
}

const COLOR_ROLE_CATEGORIES = {
  brand: ['brand', 'accent', 'highlight'],
  buttons: ['button-primary', 'button-text', 'button-secondary', 'button-secondary-text'],
  backgrounds: ['section-bg-1', 'section-bg-2', 'section-bg-3'],
  text: ['text-primary', 'text-secondary'],
  forms: ['input-bg', 'input-text'],
  borders: ['border']
} as const;

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
  
  // Working palette state for live editing
  const [workingPalette, setWorkingPalette] = useState<ColorPalette>(currentPalette);
  
  // Section collapse states
  const [paletteGenOpen, setPaletteGenOpen] = useState(true);
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  
  // Palette generation state
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>('random');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Preset action states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingPreset, setRenamingPreset] = useState<ColorPreset | null>(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');

  // Filter states
  const [filterScheme, setFilterScheme] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');

  // Get unique values for filter options
  const getUniqueSchemes = () => {
    const schemes = presets.map(p => p.scheme).filter(Boolean);
    return [...new Set(schemes)];
  };

  const getUniqueMoods = () => {
    const moods = presets.map(p => p.mood).filter(Boolean);
    return [...new Set(moods)];
  };

  // Filter presets based on current filter selections
  const filteredPresets = presets.filter(preset => {
    const schemeMatch = filterScheme === 'all' || preset.scheme === filterScheme;
    const moodMatch = filterMood === 'all' || preset.mood === filterMood;
    const modeMatch = filterMode === 'all' || preset.mode === filterMode;
    return schemeMatch && moodMatch && modeMatch;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilterScheme('all');
    setFilterMood('all');
    setFilterMode('all');
  };

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

  // Update working palette when current palette changes
  useEffect(() => {
    setWorkingPalette(currentPalette);
  }, [currentPalette]);

  // Save presets to localStorage
  const savePresetsToStorage = (updatedPresets: ColorPreset[]) => {
    console.log('Saving presets to localStorage:', updatedPresets);
    localStorage.setItem('admin-color-presets', JSON.stringify(updatedPresets));
    console.log('Presets saved successfully');
    setPresets(updatedPresets);
  };

  const generatePresetId = (name: string) => {
    return `preset_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  };

  // Generate AI palette
  const handleGenerateAIPalette = async () => {
    if (!isOpenAIInitialized()) {
      toast({
        title: 'OpenAI Not Configured',
        description: 'Please configure OpenAI API key in the OpenAI Settings tab',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Build enhanced prompt with scheme information
      let enhancedPrompt = generationPrompt;
      
      if (selectedScheme !== 'random') {
        const schemeDescriptions = {
          monochromatic: 'using a monochromatic color scheme (various shades of the same color)',
          analogous: 'using an analogous color scheme (colors next to each other on the color wheel)',
          complementary: 'using a complementary color scheme (opposite colors on the color wheel)',
          triadic: 'using a triadic color scheme (three evenly spaced colors)',
          tetradic: 'using a tetradic color scheme (four colors forming a rectangle)'
        };
        
        enhancedPrompt = `Generate a color palette ${schemeDescriptions[selectedScheme]}`;
        if (selectedMood) {
          enhancedPrompt += ` that feels ${selectedMood}`;
        }
        if (isDarkMode) {
          enhancedPrompt += ` and is optimized for a dark theme`;
        } else {
          enhancedPrompt += ` and is optimized for a light theme`;
        }
        enhancedPrompt += '. Output cohesive and UI-friendly colors.';
        
        if (generationPrompt) {
          enhancedPrompt += ` Additional context: ${generationPrompt}`;
        }
      }

      const aiPalette = await generateAIColorPalette({
        mood: selectedMood,
        description: enhancedPrompt,
        isDarkMode
      });
      
      setWorkingPalette(aiPalette);
      onApplyPreset(aiPalette);
      
      toast({
        title: 'Success',
        description: 'AI palette generated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate palette',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a specific color role
  const handleRoleColorChange = (role: ColorRole, color: string) => {
    const updatedPalette = { ...workingPalette, [role]: color };
    setWorkingPalette(updatedPalette);
    onApplyPreset(updatedPalette);
  };

  // Reset palette to default
  const handleResetPalette = () => {
    setWorkingPalette(currentPalette);
    setGenerationPrompt('');
    setSelectedMood('');
    setIsDarkMode(false);
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

    const currentRoles = mapPaletteToRoles(workingPalette);
    const newPreset: ColorPreset = {
      id: generatePresetId(presetName),
      name: presetName,
      description: presetDescription,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      roles: currentRoles,
      originalPalette: { ...workingPalette },
      scheme: selectedScheme !== 'random' ? selectedScheme : undefined,
      mood: selectedMood || undefined,
      mode: isDarkMode ? 'dark' : 'light'
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Palette Generator & Preset Manager
          </CardTitle>
          <CardDescription>
            Generate AI palettes, edit color roles, and save presets for quick switching
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Top Row - Live Preview and Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Live Template Preview */}
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
                  Live Template Preview
                </CardTitle>
                <CardDescription className="text-sm">
                  See how your color roles apply to real UI components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              {/* Header Section */}
              <div 
                className="p-4 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: workingPalette['section-bg-1'] || '#FFFFFF',
                  color: workingPalette['text-primary'] || '#000000'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="text-xs bg-white/10 border-current">
                    section-bg-1
                  </Badge>
                </div>
                <h1 className="text-lg font-bold mb-2">Platform Header</h1>
                <p className="text-sm mb-3 opacity-80">
                  Header section with primary background and text colors
                </p>
                <button 
                  className="text-sm px-3 py-1.5 rounded font-medium transition-colors"
                  style={{ 
                    backgroundColor: workingPalette['button-primary'] || '#3366FF',
                    color: workingPalette['button-text'] || '#FFFFFF'
                  }}
                >
                  Primary CTA
                </button>
              </div>

              {/* Content Card */}
              <div 
                className="p-4 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: workingPalette['section-bg-2'] || '#F9FAFB',
                  color: workingPalette['text-primary'] || '#000000'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="text-xs bg-white/10 border-current">
                    section-bg-2
                  </Badge>
                </div>
                <h2 className="text-base font-semibold mb-2">Content Block</h2>
                <p 
                  className="text-sm mb-3"
                  style={{ color: workingPalette['text-secondary'] || workingPalette['text-primary'] }}
                >
                  Content with secondary text for descriptions and details
                </p>
                <button 
                  className="text-sm px-3 py-1.5 rounded font-medium transition-colors"
                  style={{ 
                    backgroundColor: workingPalette['button-secondary'] || '#6C757D',
                    color: workingPalette['button-secondary-text'] || '#FFFFFF'
                  }}
                >
                  Secondary Action
                </button>
              </div>

              {/* Form Section */}
              <div 
                className="p-4 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: workingPalette['section-bg-3'] || '#F3F4F6',
                  color: workingPalette['text-primary'] || '#000000'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="text-xs bg-white/10 border-current">
                    section-bg-3
                  </Badge>
                </div>
                <h3 className="text-sm font-medium mb-3">Form Elements</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Email Input
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full text-xs px-2 py-1.5 rounded transition-colors"
                      style={{ 
                        backgroundColor: workingPalette['input-bg'] || '#FFFFFF',
                        color: workingPalette['input-text'] || '#000000',
                        border: `1px solid ${workingPalette.border || '#D1D5DB'}`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand Footer */}
              <div 
                className="p-4 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: workingPalette.brand || '#3366FF',
                  color: '#FFFFFF'  // Using white as fallback for brand text
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="outline" 
                    className="text-xs border-current bg-white/10"
                    style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}
                  >
                    brand
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold">Brand Section</h4>
                    <p className="text-xs opacity-90">Powered by your brand colors</p>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: workingPalette.accent || '#FF6B35' }}
                  >
                    !
                  </div>
                </div>
              </div>

              {/* Color Values Display */}
              <div className="text-xs space-y-1 p-3 bg-background/50 rounded border">
                <div className="font-medium mb-2">Current Values:</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>Primary: <span className="font-mono">{workingPalette['button-primary']}</span></div>
                  <div>Brand: <span className="font-mono">{workingPalette.brand}</span></div>
                  <div>BG-1: <span className="font-mono">{workingPalette['section-bg-1']}</span></div>
                  <div>BG-2: <span className="font-mono">{workingPalette['section-bg-2']}</span></div>
                </div>
              </div>
            </CardContent>
            </Card>

            {/* Right Column - Controls */}
            <div className="space-y-4">
              {/* Palette Generator Section */}
              <Collapsible open={paletteGenOpen} onOpenChange={setPaletteGenOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">🎨 Palette Generator</span>
                    </div>
                    {paletteGenOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheme-select">Color Scheme</Label>
                      <Select value={selectedScheme} onValueChange={(value: ColorSchemeType) => setSelectedScheme(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a color scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="random">Random - Completely random combinations</SelectItem>
                          <SelectItem value="monochromatic">Monochromatic - Shades of same color</SelectItem>
                          <SelectItem value="analogous">Analogous - Adjacent colors</SelectItem>
                          <SelectItem value="complementary">Complementary - Opposite colors</SelectItem>
                          <SelectItem value="triadic">Triadic - Three evenly spaced</SelectItem>
                          <SelectItem value="tetradic">Tetradic - Four colors rectangle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mood-select">Mood</Label>
                      <Select value={selectedMood} onValueChange={setSelectedMood}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mood" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="warm">Warm & Friendly</SelectItem>
                          <SelectItem value="cool">Cool & Calm</SelectItem>
                          <SelectItem value="vibrant">Vibrant & Energetic</SelectItem>
                          <SelectItem value="elegant">Elegant & Luxury</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="playful">Playful & Fun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="dark-mode"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        className="rounded border-border"
                      />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="custom-prompt">Custom Theme Description (Optional)</Label>
                    <Textarea
                      id="custom-prompt"
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      placeholder="e.g., Tech startup with blue and orange accents"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateAIPalette}
                      disabled={isGenerating || !isOpenAIInitialized()}
                      className="flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate Palette'}
                    </Button>
                    <Button variant="outline" onClick={handleResetPalette}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  
                  {!isOpenAIInitialized() && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded">
                      ⚠️ <strong>OpenAI API Key Required:</strong> Please configure your OpenAI API key in the OpenAI Settings tab to enable AI palette generation.
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Role Editor Section */}
              <Collapsible open={roleEditorOpen} onOpenChange={setRoleEditorOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span className="font-medium">🧰 Color Role Editor</span>
                    </div>
                    {roleEditorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  {Object.entries(COLOR_ROLE_CATEGORIES).map(([categoryName, roles]) => (
                    <div key={categoryName} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {categoryName}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {roles.map((role) => (
                          <div key={role} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div
                              className="w-8 h-8 rounded border border-border flex-shrink-0"
                              style={{ backgroundColor: workingPalette[role] }}
                            />
                            <div className="flex-1 min-w-0">
                              <label className="text-sm font-medium block mb-1">
                                {role}
                              </label>
                              <input
                                type="color"
                                value={workingPalette[role] || '#000000'}
                                onChange={(e) => handleRoleColorChange(role as ColorRole, e.target.value)}
                                className="w-full h-6 border border-border rounded cursor-pointer"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {workingPalette[role]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Save & Load Presets Section */}
          <Collapsible open={presetsOpen} onOpenChange={setPresetsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span className="font-medium">💾 Save & Load Presets</span>
                </div>
                {presetsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
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
                  {/* Filter Controls */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Filter Presets</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="h-7 px-2 text-xs"
                      >
                        <FilterX className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Scheme</Label>
                        <Select value={filterScheme} onValueChange={setFilterScheme}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Schemes</SelectItem>
                            <SelectItem value="monochromatic">Monochromatic</SelectItem>
                            <SelectItem value="analogous">Analogous</SelectItem>
                            <SelectItem value="complementary">Complementary</SelectItem>
                            <SelectItem value="triadic">Triadic</SelectItem>
                            <SelectItem value="tetradic">Tetradic</SelectItem>
                            {getUniqueSchemes().map(scheme => (
                              <SelectItem key={scheme} value={scheme}>
                                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Mood</Label>
                        <Select value={filterMood} onValueChange={setFilterMood}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Moods</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="warm">Warm & Friendly</SelectItem>
                            <SelectItem value="cool">Cool & Calm</SelectItem>
                            <SelectItem value="vibrant">Vibrant & Energetic</SelectItem>
                            <SelectItem value="elegant">Elegant & Luxury</SelectItem>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                            <SelectItem value="playful">Playful & Fun</SelectItem>
                            {getUniqueMoods().map(mood => (
                              <SelectItem key={mood} value={mood}>
                                {mood.charAt(0).toUpperCase() + mood.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Mode</Label>
                        <Select value={filterMode} onValueChange={setFilterMode}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Modes</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>Showing {filteredPresets.length} of {presets.length} presets</span>
                    </div>
                  </div>

                  {filteredPresets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No presets match your filters</p>
                      <p className="text-sm">Try adjusting your filter criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredPresets.map((preset) => (
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
                               
                               {/* Scheme, Mood, Mode badges */}
                               {(preset.scheme || preset.mood || preset.mode) && (
                                 <div className="flex flex-wrap gap-1 mb-2">
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
                                onClick={() => handleRenamePreset(preset)}
                                title="Rename preset"
                              >
                                <Edit className="h-3 w-3" />
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
                                onClick={() => handleExportAsJSON(preset)}
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
                   
                   {presets.length > 0 && (
                     <div className="flex justify-end">
                       <Button 
                         variant="outline" 
                         onClick={() => setLoadDialogOpen(false)}
                       >
                         Close
                       </Button>
                     </div>
                   )}
                 </div>
               </DialogContent>
             </Dialog>
               </div>

               {/* Rename Preset Dialog */}
              <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Preset</DialogTitle>
                    <DialogDescription>
                      Update the name and description of this preset
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-preset-name">Preset Name *</Label>
                      <Input
                        id="new-preset-name"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Enter new preset name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-preset-description">Description</Label>
                      <Textarea
                        id="new-preset-description"
                        value={newPresetDescription}
                        onChange={(e) => setNewPresetDescription(e.target.value)}
                        placeholder="Optional description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setRenameDialogOpen(false);
                          setRenamingPreset(null);
                          setNewPresetName('');
                          setNewPresetDescription('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmRename}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

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
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetManager;