import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, RefreshCw, Palette, Clock, Hash } from 'lucide-react';
import { GeneratedPalette } from '@/types/generator';
import { generatePaletteBatch, savePaletteHistory, getAdminSettings } from '@/utils/autoGenerator';
import { useToast } from '@/hooks/use-toast';

interface AutoGeneratorProps {
  onGenerated?: (palettes: GeneratedPalette[]) => void;
}

const AutoGenerator: React.FC<AutoGeneratorProps> = ({ onGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<GeneratedPalette[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const settings = getAdminSettings();
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const palettes = generatePaletteBatch(settings.maxPalettesPerBatch);
      savePaletteHistory(palettes);
      setLastGenerated(palettes);
      onGenerated?.(palettes);
      
      toast({
        title: "Palettes Generated!",
        description: `Successfully generated ${palettes.length} color palettes.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating palettes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const settings = getAdminSettings();

  return (
    <div className="space-y-6">
      {/* Generator Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AutoGenerator
          </CardTitle>
          <CardDescription>
            Generate {settings.maxPalettesPerBatch} unique color palettes with random templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Palette className="h-4 w-4 mr-2" />
                Generate {settings.maxPalettesPerBatch} Palettes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {lastGenerated.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Generated Palettes</CardTitle>
            <CardDescription>
              Generated {lastGenerated.length} palettes on {new Date(lastGenerated[0]?.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastGenerated.map((palette) => (
                <div key={palette.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {palette.templateName}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(palette.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    {palette.id}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutoGenerator;