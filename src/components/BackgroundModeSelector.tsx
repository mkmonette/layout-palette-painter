import React, { useState, useEffect } from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type BackgroundMode = 'light' | 'midtone' | 'dark';

interface BackgroundModeSelectorProps {
  onModeChange: (mode: BackgroundMode) => void;
}

const BackgroundModeSelector: React.FC<BackgroundModeSelectorProps> = ({ onModeChange }) => {
  const [selectedMode, setSelectedMode] = useState<BackgroundMode>('midtone');
  const [isOpen, setIsOpen] = useState(false);

  // Load saved mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('background-mode') as BackgroundMode;
    if (savedMode && ['light', 'midtone', 'dark'].includes(savedMode)) {
      setSelectedMode(savedMode);
      onModeChange(savedMode);
    }
  }, [onModeChange]);

  const handleModeSelect = (mode: BackgroundMode) => {
    setSelectedMode(mode);
    localStorage.setItem('background-mode', mode);
    onModeChange(mode);
    setIsOpen(false);
  };

  const modes = [
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
          title="Choose background tone"
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm">Background Mode</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end" side="top">
        <div className="space-y-1">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleModeSelect(mode.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedMode === mode.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </div>
              {selectedMode === mode.value && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundModeSelector;