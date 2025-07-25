import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type BackgroundStyle = 'wavy-layers' | 'cloudy-blobs' | 'mesh-gradients' | 'flowing-shapes' | 'geometric-patterns' | 'wavy-lines' | 'organic-blobs' | 'zigzag-chevron' | 'diagonal-stripes' | 'concentric-circles' | 'isometric-cubes' | 'hexagon-mesh' | 'triangles-lowpoly' | 'dotted-grid' | 'radial-burst' | 'circuit-board' | 'data-flow' | 'matrix-dots' | 'digital-grid' | 'pixel-noise' | 'soft-shapes' | 'repeating-symbols' | 'diagonal-hatch' | 'rounded-grid' | 'brush-strokes' | 'paint-splatter' | 'ink-blot' | 'watercolor' | 'hand-drawn' | 'stained-glass' | 'wave-divider' | 'slant-diagonal' | 'curved-overlay' | 'notched-corners' | 'blob-separator';

export type BackgroundMode = 'svg' | 'gradient';

export type GradientFillType = 'none' | 'solid' | 'gradient';

export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal';

export type ColorRole = 'section-bg-1' | 'section-bg-2' | 'section-bg-3' | 'brand' | 'accent' | 'highlight' | 'button-primary' | 'button-secondary';

export interface BackgroundSettings {
  enabled: boolean;
  mode: BackgroundMode;
  // SVG settings
  style: BackgroundStyle;
  waveHeight: number;
  blobSize: number;
  meshIntensity: number;
  patternScale: number;
  opacity: number;
  // Gradient settings
  gradientFillType: GradientFillType;
  gradientStartColor: ColorRole;
  gradientEndColor: ColorRole;
  gradientDirection: GradientDirection;
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
  { value: 'wavy-lines', label: 'Wavy Lines' },
  { value: 'organic-blobs', label: 'Organic Blobs' },
  { value: 'zigzag-chevron', label: 'Zigzag / Chevron' },
  { value: 'diagonal-stripes', label: 'Diagonal Stripes' },
  { value: 'concentric-circles', label: 'Concentric Circles' },
  { value: 'isometric-cubes', label: 'Isometric Cubes' },
  { value: 'hexagon-mesh', label: 'Hexagon Mesh' },
  { value: 'triangles-lowpoly', label: 'Triangles / Low-poly' },
  { value: 'dotted-grid', label: 'Dotted Grid' },
  { value: 'radial-burst', label: 'Radial Burst' },
  { value: 'circuit-board', label: 'Circuit Board Lines' },
  { value: 'data-flow', label: 'Data Flow Lines' },
  { value: 'matrix-dots', label: 'Matrix Dots' },
  { value: 'digital-grid', label: 'Digital Grid Mesh' },
  { value: 'pixel-noise', label: 'Pixel Noise' },
  { value: 'soft-shapes', label: 'Soft Triangles/Squares' },
  { value: 'repeating-symbols', label: 'Repeating X/+' },
  { value: 'diagonal-hatch', label: 'Diagonal Hatch' },
  { value: 'rounded-grid', label: 'Rounded Grid' },
  { value: 'brush-strokes', label: 'Brush Strokes' },
  { value: 'paint-splatter', label: 'Paint Splatter' },
  { value: 'ink-blot', label: 'Ink Blot' },
  { value: 'watercolor', label: 'Watercolor Textures' },
  { value: 'hand-drawn', label: 'Hand-drawn Lines' },
  { value: 'stained-glass', label: 'Stained Glass Shards' },
  { value: 'wave-divider', label: 'Wave Divider' },
  { value: 'slant-diagonal', label: 'Slant Diagonal' },
  { value: 'curved-overlay', label: 'Curved Top Overlay' },
  { value: 'notched-corners', label: 'Notched Corners' },
  { value: 'blob-separator', label: 'Blob Section Separator' },
] as const;

const backgroundModes = [
  { value: 'svg', label: 'SVG Background' },
  { value: 'gradient', label: 'Gradient Background' },
] as const;

const gradientFillTypes = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
] as const;

const gradientDirections = [
  { value: 'horizontal', label: 'Horizontal (left→right)' },
  { value: 'vertical', label: 'Vertical (top→bottom)' },
  { value: 'diagonal', label: 'Diagonal (45°)' },
] as const;

const colorRoles = [
  { value: 'section-bg-1', label: 'Section Background 1' },
  { value: 'section-bg-2', label: 'Section Background 2' },
  { value: 'section-bg-3', label: 'Section Background 3' },
  { value: 'brand', label: 'Brand Color' },
  { value: 'accent', label: 'Accent Color' },
  { value: 'highlight', label: 'Highlight Color' },
  { value: 'button-primary', label: 'Primary Button' },
  { value: 'button-secondary', label: 'Secondary Button' },
] as const;

export function BackgroundCustomizer({ settings, onSettingsChange }: BackgroundCustomizerProps) {
  const updateSettings = (updates: Partial<BackgroundSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const renderGradientControls = () => {
    if (!settings.enabled || settings.mode !== 'gradient') return null;

    return (
      <div className="space-y-4">
        {/* Fill Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fill Type</Label>
          <Select
            value={settings.gradientFillType}
            onValueChange={(fillType: GradientFillType) => updateSettings({ gradientFillType: fillType })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select fill type" />
            </SelectTrigger>
            <SelectContent>
              {gradientFillTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gradient controls - only show if gradient fill type is selected */}
        {settings.gradientFillType === 'gradient' && (
          <>
            {/* Start Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Color</Label>
              <Select
                value={settings.gradientStartColor}
                onValueChange={(color: ColorRole) => updateSettings({ gradientStartColor: color })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select start color" />
                </SelectTrigger>
                <SelectContent>
                  {colorRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Color</Label>
              <Select
                value={settings.gradientEndColor}
                onValueChange={(color: ColorRole) => updateSettings({ gradientEndColor: color })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select end color" />
                </SelectTrigger>
                <SelectContent>
                  {colorRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Direction */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Direction</Label>
              <Select
                value={settings.gradientDirection}
                onValueChange={(direction: GradientDirection) => updateSettings({ gradientDirection: direction })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {gradientDirections.map((dir) => (
                    <SelectItem key={dir.value} value={dir.value}>
                      {dir.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Solid color control - only show if solid fill type is selected */}
        {settings.gradientFillType === 'solid' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <Select
              value={settings.gradientStartColor}
              onValueChange={(color: ColorRole) => updateSettings({ gradientStartColor: color })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {colorRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const renderStyleSliders = () => {
    if (!settings.enabled || settings.mode !== 'svg') return null;

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

      case 'wavy-lines':
      case 'organic-blobs':
      case 'zigzag-chevron':
      case 'diagonal-stripes':
      case 'concentric-circles':
      case 'isometric-cubes':
      case 'hexagon-mesh':
      case 'triangles-lowpoly':
      case 'dotted-grid':
      case 'radial-burst':
      case 'circuit-board':
      case 'data-flow':
      case 'matrix-dots':
      case 'digital-grid':
      case 'pixel-noise':
      case 'soft-shapes':
      case 'repeating-symbols':
      case 'diagonal-hatch':
      case 'rounded-grid':
      case 'brush-strokes':
      case 'paint-splatter':
      case 'ink-blot':
      case 'watercolor':
      case 'hand-drawn':
      case 'stained-glass':
      case 'wave-divider':
      case 'slant-diagonal':
      case 'curved-overlay':
      case 'notched-corners':
      case 'blob-separator':
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
    <div className="space-y-3">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="enable-background" className="text-xs font-medium">
          Enable Background
        </Label>
        <Switch
          id="enable-background"
          checked={settings.enabled}
          onCheckedChange={(enabled) => updateSettings({ enabled })}
        />
      </div>

      {settings.enabled && (
        <>
          {/* Background Mode Dropdown */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Mode</Label>
            <Select
              value={settings.mode}
              onValueChange={(mode: BackgroundMode) => updateSettings({ mode })}
            >
              <SelectTrigger className="w-full h-7 text-xs">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {backgroundModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value} className="text-xs">
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SVG Background Controls */}
          {settings.mode === 'svg' && (
            <>
              {/* Background Style Dropdown */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Style</Label>
                <Select
                  value={settings.style}
                  onValueChange={(style: BackgroundStyle) => updateSettings({ style })}
                >
                  <SelectTrigger className="w-full h-7 text-xs">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value} className="text-xs">
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style-specific sliders */}
              {renderStyleSliders()}
            </>
          )}

          {/* Gradient Background Controls */}
          {settings.mode === 'gradient' && renderGradientControls()}

          {/* Opacity Slider - Always shown when enabled */}
          <div className="space-y-2">
            <Label htmlFor="opacity" className="text-xs font-medium">
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
    </div>
  );
};

export default BackgroundCustomizer;