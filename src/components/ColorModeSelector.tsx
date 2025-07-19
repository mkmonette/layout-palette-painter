import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Sunset, Moon, CloudSun, CloudMoon } from 'lucide-react';
import { ColorMode } from '@/utils/colorGenerator';

interface ColorModeSelectorProps {
  selectedMode: ColorMode;
  onModeChange: (mode: ColorMode) => void;
  disabled?: boolean;
}

const ColorModeSelector: React.FC<ColorModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  disabled = false
}) => {
  const modes: { id: ColorMode; label: string; icon: React.ElementType; description: string }[] = [
    {
      id: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Bright, high-contrast colors (85-100% lightness)'
    },
    {
      id: 'light-midtone',
      label: 'Light-Mid',
      icon: CloudSun,
      description: 'Light with subtle depth (65-85% lightness)'
    },
    {
      id: 'midtone',
      label: 'Midtone',
      icon: Sunset,
      description: 'Balanced, medium-intensity colors (45-65% lightness)'
    },
    {
      id: 'midtone-dark',
      label: 'Mid-Dark',
      icon: CloudMoon,
      description: 'Dark with medium contrast (25-45% lightness)'
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Deep, low-contrast colors (10-25% lightness)'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color Mode</label>
      <div className="grid grid-cols-5 gap-1">{modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Button
              key={mode.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange(mode.id)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-muted'
              }`}
              title={mode.description}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{mode.label}</span>
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {modes.find(m => m.id === selectedMode)?.description}
      </p>
    </div>
  );
};

export default ColorModeSelector;