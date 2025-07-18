import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save } from 'lucide-react';

interface ThemeToneConfig {
  planId: string;
  planName: string;
  availableTones: string[];
}

const THEME_TONES = [
  { id: 'light', name: 'Light', description: 'Bright, clean look' },
  { id: 'light-midtone', name: 'Light-Midtone', description: 'Softly balanced' },
  { id: 'midtone', name: 'Midtone', description: 'Neutral balanced' },
  { id: 'dark-midtone', name: 'Dark-Midtone', description: 'Rich contrast' },
  { id: 'dark', name: 'Dark', description: 'Deep, modern look' }
];

const ThemeToneSettings = () => {
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<ThemeToneConfig[]>([
    { planId: 'free', planName: 'Free', availableTones: ['light', 'light-midtone', 'midtone'] },
    { planId: 'pro', planName: 'Pro', availableTones: ['light', 'light-midtone', 'midtone', 'dark-midtone', 'dark'] },
    { planId: 'enterprise', planName: 'Enterprise', availableTones: ['light', 'light-midtone', 'midtone', 'dark-midtone', 'dark'] }
  ]);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('theme_tone_settings');
    if (savedSettings) {
      try {
        setConfigurations(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading theme tone settings:', error);
      }
    }
  }, []);

  const handleToneToggle = (planId: string, toneId: string, checked: boolean) => {
    setConfigurations(prev => prev.map(config => {
      if (config.planId === planId) {
        const updatedTones = checked 
          ? [...config.availableTones, toneId]
          : config.availableTones.filter(tone => tone !== toneId);
        return { ...config, availableTones: updatedTones };
      }
      return config;
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('theme_tone_settings', JSON.stringify(configurations));
      toast({
        title: "Settings Saved",
        description: "Theme tone configurations have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme tone settings.",
        variant: "destructive"
      });
    }
  };

  const getTonePreview = (toneId: string) => {
    const colors = {
      'light': 'bg-gray-50 border-gray-200',
      'light-midtone': 'bg-gray-100 border-gray-300',
      'midtone': 'bg-gray-300 border-gray-400',
      'dark-midtone': 'bg-gray-600 border-gray-700',
      'dark': 'bg-gray-900 border-gray-800'
    };
    return colors[toneId as keyof typeof colors] || 'bg-gray-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Theme Tone Configuration</CardTitle>
              <CardDescription>
                Configure which theme tones are available for each subscription plan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Tones Overview */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium">Available Theme Tones</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {THEME_TONES.map((tone) => (
                <div key={tone.id} className="text-center space-y-2">
                  <div className={`w-full h-12 rounded-md border-2 ${getTonePreview(tone.id)}`} />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{tone.name}</div>
                    <div className="text-xs text-muted-foreground">{tone.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Configuration */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Plan Access Configuration</Label>
            {configurations.map((config) => (
              <Card key={config.planId} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{config.planName} Plan</h4>
                      <Badge variant="outline">
                        {config.availableTones.length} / {THEME_TONES.length} tones
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {THEME_TONES.map((tone) => {
                      const isChecked = config.availableTones.includes(tone.id);
                      return (
                        <div key={tone.id} className="space-y-2">
                          <div className={`w-full h-8 rounded border ${getTonePreview(tone.id)}`} />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${config.planId}-${tone.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => 
                                handleToneToggle(config.planId, tone.id, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`${config.planId}-${tone.id}`} 
                              className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tone.name}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeToneSettings;