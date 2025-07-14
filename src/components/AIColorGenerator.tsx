import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Wand2, AlertTriangle, Crown, Info } from 'lucide-react';
import { generateAIColorPalette, isOpenAIInitialized } from '@/utils/openaiService';
import { ColorPalette } from '@/utils/colorGenerator';
import { useToast } from '@/hooks/use-toast';
import { validatePaletteContrast, ContrastIssue } from '@/utils/contrastChecker';
import { useAIQuota } from '@/hooks/useAIQuota';

interface AIColorGeneratorProps {
  isDarkMode: boolean;
  onPaletteGenerated: (palette: ColorPalette) => void;
  backgroundSettings?: {
    enabled: boolean;
    mode: 'svg' | 'gradient';
    style?: string;
    opacity?: number;
  };
}

const AIColorGenerator: React.FC<AIColorGeneratorProps> = ({ isDarkMode, onPaletteGenerated, backgroundSettings }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState('');
  const [backgroundStyle, setBackgroundStyle] = useState('');
  const [description, setDescription] = useState('');
  const [contrastIssues, setContrastIssues] = useState<ContrastIssue[]>([]);
  const { toast } = useToast();
  const { 
    canGenerate, 
    isPro, 
    remainingGenerations, 
    maxGenerations, 
    usedGenerations,
    incrementUsage 
  } = useAIQuota();

  const predefinedMoods = [
    'Professional and trustworthy',
    'Warm and friendly', 
    'Vibrant and energetic',
    'Calm and peaceful',
    'Bold and modern',
    'Elegant and sophisticated',
    'Fun and playful',
    'Minimalist and clean'
  ];

  const predefinedThemes = [
    'Technology and innovation',
    'Healthcare and wellness',
    'Finance and banking',
    'E-commerce and retail',
    'Education and learning',
    'Creative and artistic',
    'Food and restaurant',
    'Travel and adventure'
  ];

  const backgroundStyleOptions = [
    'Clean and minimal backgrounds',
    'Dynamic wavy patterns',
    'Organic blob shapes',
    'Geometric patterns',
    'Flowing organic shapes',
    'Gradient overlays',
    'Subtle textures'
  ];

  const handleGenerate = async () => {
    if (!isOpenAIInitialized()) {
      toast({
        title: "OpenAI Not Setup",
        description: "Please set your OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    if (!mood && !theme && !backgroundStyle && !description) {
      toast({
        title: "Input Required",
        description: "Please specify a theme, background style, mood, or description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setContrastIssues([]);

    try {
      const palette = await generateAIColorPalette({
        mood,
        theme,
        backgroundStyle,
        description,
        isDarkMode,
        backgroundSettings
      });

      // Validate contrast
      const issues = validatePaletteContrast(palette);
      setContrastIssues(issues);

      // Increment usage count
      incrementUsage();
      
      // Apply the palette
      onPaletteGenerated(palette);

      const invalidIssues = issues.filter(issue => !issue.isValid);
      if (invalidIssues.length > 0) {
        toast({
          title: "Palette Generated with Warnings",
          description: `${invalidIssues.length} contrast issue(s) detected. ${remainingGenerations - 1} generations remaining.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "AI Palette Generated",
          description: `Perfect! All colors meet accessibility standards. ${remainingGenerations - 1} generations remaining.`,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI palette",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearInputs = () => {
    setMood('');
    setTheme('');
    setBackgroundStyle('');
    setDescription('');
    setContrastIssues([]);
  };

  if (!isOpenAIInitialized()) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Color Generation
          </CardTitle>
          <CardDescription className="text-xs">
            Set up your OpenAI API key to enable AI color generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              OpenAI API key required to use AI color generation features.
            </p>
            <Button 
              onClick={() => {
                // This will trigger the OpenAI key input in settings
                toast({
                  title: "Setup Required",
                  description: "Go to Settings to configure your OpenAI API key",
                });
              }}
              variant="outline"
              size="sm"
            >
              Go to Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGenerateButton = () => {
    if (!isPro) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Button
                  disabled
                  size="sm"
                  className="w-full opacity-50"
                >
                  <Crown className="h-3 w-3 mr-2" />
                  PRO Feature
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI generation is available for PRO users only. Upgrade to access this feature.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (!canGenerate && remainingGenerations === 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Button
                  disabled
                  size="sm"
                  className="w-full opacity-50"
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Limit Reached
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>You've reached your monthly limit of {maxGenerations} AI generations. Resets next month.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || (!mood && !theme && !backgroundStyle && !description)}
        size="sm"
        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isGenerating ? (
          <>
            <Wand2 className="h-3 w-3 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3 mr-2" />
            Generate
          </>
        )}
      </Button>
    );
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Color Generation
          {isPro && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{usedGenerations}/{maxGenerations} AI generations used this month</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {isPro 
            ? `Describe your vision and let AI create the perfect color palette (${remainingGenerations} remaining)` 
            : "AI color generation is available for PRO users"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Theme</label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select a theme..." />
            </SelectTrigger>
            <SelectContent>
              {predefinedThemes.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Settings */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Background Style</label>
          <Select value={backgroundStyle} onValueChange={setBackgroundStyle}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select background style..." />
            </SelectTrigger>
            <SelectContent>
              {backgroundStyleOptions.map((style) => (
                <SelectItem key={style} value={style} className="text-xs">{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mood Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Mood</label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select a mood..." />
            </SelectTrigger>
            <SelectContent>
              {predefinedMoods.map((m) => (
                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Custom Description</label>
          <Input
            placeholder="e.g., bright summer colors for a beach app..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {getGenerateButton()}
          <Button
            onClick={clearInputs}
            variant="outline"
            size="sm"
            disabled={isGenerating}
          >
            Clear
          </Button>
        </div>

        {/* Contrast Issues Display */}
        {contrastIssues.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Accessibility Check
            </h4>
            <div className="space-y-1">
              {contrastIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {issue.textRole} on {issue.backgroundRole}
                  </span>
                  <Badge 
                    variant={issue.isValid ? "default" : "destructive"}
                    className="h-5 text-xs"
                  >
                    {issue.ratio}:1 {issue.isValid ? '✓' : '⚠'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIColorGenerator;