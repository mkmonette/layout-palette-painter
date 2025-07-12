import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BackgroundStyle = 'wavy-layers' | 'cloudy-blobs' | 'mesh-gradients' | 'flowing-shapes' | 'geometric-patterns';

interface BackgroundSettings {
  enabled: boolean;
  style: BackgroundStyle;
  waveHeight: number;
  blobSize: number;
  meshIntensity: number;
  patternScale: number;
  opacity: number;
}

interface BackgroundCustomizerProps {
  settings: BackgroundSettings;
  onSettingsChange: (settings: BackgroundSettings) => void;
}

const backgroundStyles = [
  { value: 'wavy-layers', label: 'Wavy Layers' },
  { value: 'cloudy-blobs', label: 'Cloudy Blobs' },
  { value: 'mesh-gradients', label: 'Mesh Gradients' },
  { value: 'flowing-shapes', label: 'Flowing Shapes' },
  { value: 'geometric-patterns', label: 'Geometric Patterns' },
] as const;

export function BackgroundCustomizer({ settings, onSettingsChange }: BackgroundCustomizerProps) {
  const updateSettings = (updates: Partial<BackgroundSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const renderStyleSliders = () => {
    if (!settings.enabled) return null;

    switch (settings.style) {
      case 'wavy-layers':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wave-height" className="text-sm font-medium">
                Wave Height ({settings.waveHeight}%)
              </Label>
              <Slider
                id="wave-height"
                value={[settings.waveHeight]}
                onValueChange={([value]) => updateSettings({ waveHeight: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'cloudy-blobs':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blob-size" className="text-sm font-medium">
                Blob Size ({settings.blobSize}%)
              </Label>
              <Slider
                id="blob-size"
                value={[settings.blobSize]}
                onValueChange={([value]) => updateSettings({ blobSize: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'mesh-gradients':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mesh-intensity" className="text-sm font-medium">
                Mesh Intensity ({settings.meshIntensity}%)
              </Label>
              <Slider
                id="mesh-intensity"
                value={[settings.meshIntensity]}
                onValueChange={([value]) => updateSettings({ meshIntensity: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'flowing-shapes':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flow-curvature" className="text-sm font-medium">
                Flow Curvature ({settings.waveHeight}%)
              </Label>
              <Slider
                id="flow-curvature"
                value={[settings.waveHeight]}
                onValueChange={([value]) => updateSettings({ waveHeight: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'geometric-patterns':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pattern-scale" className="text-sm font-medium">
                Pattern Scale ({settings.patternScale}%)
              </Label>
              <Slider
                id="pattern-scale"
                value={[settings.patternScale]}
                onValueChange={([value]) => updateSettings({ patternScale: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Background Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-background" className="text-sm font-medium">
            Enable Decorative Background
          </Label>
          <Switch
            id="enable-background"
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            <Separator />
            
            {/* Background Style Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background Style</Label>
              <Select
                value={settings.style}
                onValueChange={(style: BackgroundStyle) => updateSettings({ style })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {backgroundStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Style-specific sliders */}
            {renderStyleSliders()}

            {/* Opacity Slider - Always shown when enabled */}
            <div className="space-y-2">
              <Label htmlFor="opacity" className="text-sm font-medium">
                Opacity ({Math.round(settings.opacity * 100)}%)
              </Label>
              <Slider
                id="opacity"
                value={[settings.opacity]}
                onValueChange={([value]) => updateSettings({ opacity: value })}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default BackgroundCustomizer;