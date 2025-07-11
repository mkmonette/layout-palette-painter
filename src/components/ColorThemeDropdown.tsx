import React, { useState } from 'react';
import { ChevronDown, Palette, Contrast, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';


interface ColorThemeDropdownProps {
  onSchemeClick: () => void;
  onMoodClick: () => void;
}

const ColorThemeDropdown: React.FC<ColorThemeDropdownProps> = ({
  onSchemeClick,
  onMoodClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };


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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorThemeDropdown;