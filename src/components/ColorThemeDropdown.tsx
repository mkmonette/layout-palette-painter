import React, { useState } from 'react';
import { ChevronDown, Palette, Contrast, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-9 px-3"
          title="Color theme options"
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Color Theme</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start" side="top">
        <DropdownMenuItem onClick={onSchemeClick} className="flex items-center gap-2">
          <Contrast className="h-4 w-4" />
          <span>Scheme</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onMoodClick} className="flex items-center gap-2">
          <Paintbrush className="h-4 w-4" />
          <span>Color Mood</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorThemeDropdown;