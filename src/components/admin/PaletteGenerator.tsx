import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Wand2,
  RefreshCw,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Save
} from 'lucide-react';
import { ColorPalette } from '@/types/template';
import { ColorRoles, ColorRole } from '@/types/colorRoles';
import { mapPaletteToRoles } from '@/utils/colorRoleMapper';
import { generateAIColorPalette, isOpenAIInitialized } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';
import { ColorSchemeType } from '@/components/ColorSchemeSelector';

interface PaletteGeneratorProps {
  currentPalette: ColorPalette;
  onApplyPreset: (palette: ColorPalette) => void;
  currentScheme?: string;
  currentMood?: string;
  currentMode?: 'light' | 'dark';
  onSchemeChange?: (scheme: string) => void;
  onMoodChange?: (mood: string) => void;
  onModeChange?: (mode: 'light' | 'dark') => void;
}

const COLOR_ROLE_CATEGORIES = {
  brand: ['brand', 'accent', 'highlight'],
  buttons: ['button-primary', 'button-text', 'button-secondary', 'button-secondary-text'],
  backgrounds: ['section-bg-1', 'section-bg-2', 'section-bg-3'],
  text: ['text-primary', 'text-secondary'],
  forms: ['input-bg', 'input-text'],
  borders: ['border']
} as const;

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ 
  currentPalette, 
  onApplyPreset,
  currentScheme,
  currentMood,
  currentMode,
  onSchemeChange,
  onMoodChange,
  onModeChange
}) => {
  const { toast } = useToast();
  
  // Working palette state for live editing
  const [workingPalette, setWorkingPalette] = useState<ColorPalette>(currentPalette);
  
  // Palette generation state
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState(currentMood || '');
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>((currentScheme as ColorSchemeType) || 'random');
  const [isDarkMode, setIsDarkMode] = useState(currentMode === 'dark');
  const [isGenerating, setIsGenerating] = useState(false);

  // Save preset state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');

  // Update working palette when current palette changes
  useEffect(() => {
    setWorkingPalette(currentPalette);
  }, [currentPalette]);

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
        if (selectedMood && selectedMood !== 'none') {
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

  // Save current palette as preset
  const handleSaveCurrentPalette = () => {
    if (!presetName.trim()) {
      toast({
        title: 'Error',
        description: 'Preset name is required',
        variant: 'destructive'
      });
      return;
    }

    // Get existing presets
    const existingPresets = JSON.parse(localStorage.getItem('admin-color-presets') || '[]');
    
    // Check for duplicate names
    if (existingPresets.some((p: any) => p.name.toLowerCase() === presetName.toLowerCase())) {
      toast({
        title: 'Error',
        description: 'A preset with this name already exists',
        variant: 'destructive'
      });
      return;
    }

    const currentRoles = mapPaletteToRoles(workingPalette);
    const generatePresetId = (name: string) => {
      return `preset_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    };

    const newPreset = {
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

    const updatedPresets = [...existingPresets, newPreset];
    localStorage.setItem('admin-color-presets', JSON.stringify(updatedPresets));

    toast({
      title: 'Success',
      description: `Preset "${presetName}" saved successfully`
    });

    // Reset form and close dialog
    setPresetName('');
    setPresetDescription('');
    setSaveDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Palette Generator</h2>
          <p className="text-muted-foreground">Generate AI-powered color palettes and customize roles</p>
        </div>
      </div>

      {/* AI Palette Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Palette Generator
          </CardTitle>
          <CardDescription>
            Use AI to generate color palettes based on mood, scheme, and custom prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheme-select">Color Scheme</Label>
              <Select value={selectedScheme} onValueChange={(value: ColorSchemeType) => {
                setSelectedScheme(value);
                onSchemeChange?.(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood-select">Mood</Label>
              <Select value={selectedMood} onValueChange={(value) => {
                setSelectedMood(value);
                onMoodChange?.(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific mood</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={(checked) => {
                    setIsDarkMode(checked);
                    onModeChange?.(checked ? 'dark' : 'light');
                  }}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="generation-prompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="generation-prompt"
              placeholder="Enter additional context or specific requirements for the palette..."
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateAIPalette} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate AI Palette'}
            </Button>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Current
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Current Palette</DialogTitle>
                  <DialogDescription>
                    Save the current palette as a preset for quick access later
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-name">Preset Name</Label>
                    <Input
                      id="preset-name"
                      placeholder="Enter preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preset-description">Description (Optional)</Label>
                    <Textarea
                      id="preset-description"
                      placeholder="Describe this color palette..."
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
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
                    <Button onClick={handleSaveCurrentPalette}>
                      Save Preset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleResetPalette}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

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
        </CardContent>
      </Card>

      {/* Color Role Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Role Editor
          </CardTitle>
          <CardDescription>
            Fine-tune individual color roles for your design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(COLOR_ROLE_CATEGORIES).map(([category, roles]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-medium capitalize">{category} Colors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <div key={role} className="space-y-2">
                    <Label className="text-sm font-medium">{role.replace('-', ' ')}</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={workingPalette[role as keyof ColorPalette] || '#000000'}
                        onChange={(e) => handleRoleColorChange(role as ColorRole, e.target.value)}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={workingPalette[role as keyof ColorPalette] || '#000000'}
                        onChange={(e) => handleRoleColorChange(role as ColorRole, e.target.value)}
                        className="font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaletteGenerator;