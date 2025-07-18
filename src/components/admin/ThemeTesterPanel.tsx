import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateColorScheme } from '@/utils/colorGenerator';
import type { ColorPalette } from '@/utils/colorGenerator';

// Extended theme modes with specific lightness ranges
type ThemeMode = 'light' | 'light-midtone' | 'midtone' | 'midtone-dark' | 'dark';

const themeModeRanges = {
  light: [85, 100],
  'light-midtone': [70, 84],
  midtone: [45, 65],
  'midtone-dark': [30, 44],
  dark: [10, 25]
} as const;

const themeModeLabels = {
  light: 'Light',
  'light-midtone': 'Light-Midtone',
  midtone: 'Midtone',
  'midtone-dark': 'Midtone-Dark',
  dark: 'Dark'
} as const;

// Generate HSL color with specific lightness range
const generateHSLColorWithRange = (lightnessRange: [number, number], baseHue?: number, saturationRange: [number, number] = [60, 100]): string => {
  const [minLightness, maxLightness] = lightnessRange;
  const h = baseHue ?? Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) + saturationRange[0];
  const l = Math.floor(Math.random() * (maxLightness - minLightness)) + minLightness;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Generate palette with specific theme mode
const generatePaletteForThemeMode = (mode: ThemeMode): ColorPalette => {
  const lightnessRange = [...themeModeRanges[mode]] as [number, number];
  const baseHue = Math.floor(Math.random() * 360);
  
  // Generate complementary hues for variety
  const accentHue = (baseHue + 60) % 360;
  const highlightHue = (baseHue + 180) % 360;
  
  // Adjust saturation based on mode
  const baseSaturation: [number, number] = mode === 'dark' ? [40, 80] : [60, 100];
  const mutedSaturation: [number, number] = [20, 50];
  
  return {
    brand: generateHSLColorWithRange(lightnessRange, baseHue, baseSaturation),
    accent: generateHSLColorWithRange(lightnessRange, accentHue, baseSaturation),
    highlight: generateHSLColorWithRange(lightnessRange, highlightHue, baseSaturation),
    'button-primary': generateHSLColorWithRange(lightnessRange, baseHue, baseSaturation),
    'button-secondary': generateHSLColorWithRange(lightnessRange, undefined, mutedSaturation),
    'button-text': mode === 'dark' || mode === 'midtone-dark' ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 5%)',
    'button-secondary-text': mode === 'dark' || mode === 'midtone-dark' ? 'hsl(0, 0%, 90%)' : 'hsl(0, 0%, 10%)',
    'text-primary': mode === 'dark' || mode === 'midtone-dark' ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 5%)',
    'text-secondary': mode === 'dark' || mode === 'midtone-dark' ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 45%)',
    'section-bg-1': generateHSLColorWithRange(lightnessRange, undefined, [0, 20]),
    'section-bg-2': generateHSLColorWithRange(lightnessRange, undefined, [0, 15]),
    'section-bg-3': generateHSLColorWithRange(lightnessRange, undefined, [0, 10]),
    border: generateHSLColorWithRange(lightnessRange, undefined, [0, 25]),
    'input-bg': generateHSLColorWithRange(lightnessRange, undefined, [0, 10]),
    'input-text': mode === 'dark' || mode === 'midtone-dark' ? 'hsl(0, 0%, 90%)' : 'hsl(0, 0%, 10%)'
  };
};

// Get readable text color based on background lightness
const getReadableTextColor = (bgColor: string, darkText = 'hsl(0, 0%, 10%)', lightText = 'hsl(0, 0%, 90%)'): string => {
  const hslMatch = bgColor.match(/hsl\([\d.]+,\s*[\d.]+%,\s*([\d.]+)%\)/);
  if (!hslMatch) return darkText;
  
  const lightness = parseFloat(hslMatch[1]);
  return lightness > 60 ? darkText : lightText;
};

const ThemeTesterPanel = () => {
  const [selectedMode, setSelectedMode] = useState<ThemeMode>('light');
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);

  // Generate initial palette
  useEffect(() => {
    setCurrentPalette(generatePaletteForThemeMode(selectedMode));
  }, [selectedMode]);

  const handleModeChange = (mode: ThemeMode) => {
    setSelectedMode(mode);
  };

  const handleRegenerateColors = () => {
    setCurrentPalette(generatePaletteForThemeMode(selectedMode));
  };

  if (!currentPalette) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Theme Tester Panel</h2>
        <p className="text-muted-foreground">Test different theme modes and see how they affect color generation.</p>
      </div>

      {/* Theme Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle>🎚 Theme Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.keys(themeModeRanges) as ThemeMode[]).map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? 'default' : 'outline'}
                className="flex flex-col h-auto p-4 text-center"
                onClick={() => handleModeChange(mode)}
              >
                <span className="font-semibold">{themeModeLabels[mode]}</span>
                <span className="text-xs opacity-70">
                  L: {themeModeRanges[mode][0]}–{themeModeRanges[mode][1]}
                </span>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button onClick={handleRegenerateColors} variant="secondary">
              🎲 Regenerate Colors
            </Button>
            <Badge variant="outline" className="px-3 py-1">
              Current: {themeModeLabels[selectedMode]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`theme-${selectedMode} p-6 rounded-lg border-2`}
            style={{
              backgroundColor: currentPalette['section-bg-1'],
              borderColor: currentPalette.border,
              color: currentPalette['text-primary']
            }}
          >
            {/* Background Colors Display */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{ color: currentPalette['text-secondary'] }}>
                Background Colors
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {['section-bg-1', 'section-bg-2', 'section-bg-3'].map((bgKey) => (
                  <div key={bgKey} className="text-center">
                    <div 
                      className="w-full h-12 rounded border mb-2"
                      style={{ 
                        backgroundColor: currentPalette[bgKey as keyof ColorPalette],
                        borderColor: currentPalette.border 
                      }}
                    />
                    <span className="text-xs" style={{ color: currentPalette['text-secondary'] }}>
                      {bgKey}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Colors Display */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{ color: currentPalette['text-secondary'] }}>
                Primary & Accent Colors
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {['brand', 'accent', 'highlight'].map((colorKey) => (
                  <div key={colorKey} className="text-center">
                    <div 
                      className="w-full h-12 rounded border mb-2"
                      style={{ 
                        backgroundColor: currentPalette[colorKey as keyof ColorPalette],
                        borderColor: currentPalette.border 
                      }}
                    />
                    <span className="text-xs" style={{ color: currentPalette['text-secondary'] }}>
                      {colorKey}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Preview */}
            <div 
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: currentPalette['section-bg-2'] }}
            >
              <h1 className="text-2xl font-bold mb-2" style={{ color: currentPalette['text-primary'] }}>
                Sample Heading
              </h1>
              <p className="mb-4" style={{ color: currentPalette['text-secondary'] }}>
                This is a sample paragraph to demonstrate how text appears with the current theme mode. 
                The contrast is automatically adjusted based on the selected lightness range.
              </p>
              
              {/* Button Examples */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 rounded font-medium"
                  style={{
                    backgroundColor: currentPalette['button-primary'],
                    color: getReadableTextColor(currentPalette['button-primary'])
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded font-medium border"
                  style={{
                    backgroundColor: currentPalette['button-secondary'],
                    color: getReadableTextColor(currentPalette['button-secondary']),
                    borderColor: currentPalette.border
                  }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded font-medium"
                  style={{
                    backgroundColor: currentPalette.accent,
                    color: getReadableTextColor(currentPalette.accent)
                  }}
                >
                  Accent Button
                </button>
              </div>
            </div>

            {/* Input Example */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2" style={{ color: currentPalette['text-primary'] }}>
                Sample Input Field
              </label>
              <input
                type="text"
                placeholder="Enter text here..."
                className="w-full px-3 py-2 rounded border"
                style={{
                  backgroundColor: currentPalette['input-bg'],
                  color: currentPalette['input-text'],
                  borderColor: currentPalette.border
                }}
              />
            </div>
          </div>

          {/* Color Values Display */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-3">Generated Color Values</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm font-mono">
              {Object.entries(currentPalette).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTesterPanel;