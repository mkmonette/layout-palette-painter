import React, { useState } from 'react';
import { MoreHorizontal, Zap, ImageIcon, Settings, BookOpen, Layers, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface MoreOptionsDropdownProps {
  onImageGeneratorClick: () => void;
  onColorsClick: () => void;
  onSetsClick: () => void;
  onBackgroundClick: () => void;
  onAdminPresetsClick: () => void;
}

const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
  onImageGeneratorClick,
  onColorsClick,
  onSetsClick,
  onBackgroundClick,
  onAdminPresetsClick
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
          title="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="top">
        {/* Auto Generate Link */}
        <DropdownMenuItem onClick={() => window.location.href = '/autogenerate'} className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span>Auto Generate</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* From Image */}
        <DropdownMenuItem onClick={onImageGeneratorClick} className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          <span>From Image</span>
          <Badge variant="secondary" className="ml-auto text-xs">Pro</Badge>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Background */}
        <DropdownMenuItem onClick={onBackgroundClick} className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Background</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Colors */}
        <DropdownMenuItem onClick={onColorsClick} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Colors</span>
        </DropdownMenuItem>
        
        {/* Color Presets */}
        <DropdownMenuItem onClick={onAdminPresetsClick} className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Color Presets</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Sets */}
        <DropdownMenuItem onClick={onSetsClick} className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Sets</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOptionsDropdown;