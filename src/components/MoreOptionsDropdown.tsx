import React, { useState } from 'react';
import { MoreHorizontal, Zap, ImageIcon, Settings, BookOpen, Layers, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-9 px-3"
          title="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">More</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end" side="top">
        <div className="space-y-1">
          {/* Auto Generate Link */}
          <button
            onClick={() => handleItemClick(() => window.location.href = '/autogenerate')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Auto Generate</span>
          </button>
          
          <Separator />
          
          {/* From Image */}
          <button
            onClick={() => handleItemClick(onImageGeneratorClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            <span>From Image</span>
            <span className="ml-auto text-xs text-muted-foreground">Pro</span>
          </button>
          
          <Separator />
          
          {/* Background */}
          <button
            onClick={() => handleItemClick(onBackgroundClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Layers className="h-4 w-4" />
            <span>Background</span>
          </button>
          
          <Separator />
          
          {/* Colors */}
          <button
            onClick={() => handleItemClick(onColorsClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Colors</span>
          </button>
          
          {/* Admin Presets */}
          <button
            onClick={() => handleItemClick(onAdminPresetsClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Palette className="h-4 w-4" />
            <span>Admin Presets</span>
          </button>
          
          <Separator />
          
          {/* Sets */}
          <button
            onClick={() => handleItemClick(onSetsClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Sets</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MoreOptionsDropdown;