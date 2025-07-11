import React, { useState } from 'react';
import { ChevronDown, Palette, Contrast, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { BackgroundMode } from './BackgroundModeSelector';

interface ColorThemeDropdownProps {
  onSchemeClick: () => void;
  onMoodClick: () => void;
  onBackgroundModeChange: (mode: BackgroundMode) => void;
  backgroundMode: BackgroundMode;
}

const ColorThemeDropdown: React.FC<ColorThemeDropdownProps> = ({
  onSchemeClick,
  onMoodClick,
  onBackgroundModeChange,
  backgroundMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const backgroundModes = [
    { value: 'light' as const, label: 'Light', icon: '☀️' },
    { value: 'midtone' as const, label: 'Midtone', icon: '🌤️' },
    { value: 'dark' as const, label: 'Dark', icon: '🌙' }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-9 px-3"
          title="Color theme options"
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Color Theme</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start" side="top">
        <div className="space-y-1">
          <button
            onClick={() => handleItemClick(onSchemeClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Contrast className="h-4 w-4" />
            <span>Scheme</span>
          </button>
          
          <button
            onClick={() => handleItemClick(onMoodClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Paintbrush className="h-4 w-4" />
            <span>Color Mood</span>
          </button>
          
          <Separator />
          
          <div className="px-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">Background Mode</span>
          </div>
          
          {backgroundModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => {
                onBackgroundModeChange(mode.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                backgroundMode === mode.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorThemeDropdown;