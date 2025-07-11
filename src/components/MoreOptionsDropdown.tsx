import React, { useState } from 'react';
import { MoreHorizontal, Zap, ImageIcon, Eye, Settings, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface MoreOptionsDropdownProps {
  onImageGeneratorClick: () => void;
  accessibilityMode: boolean;
  onAccessibilityModeChange: (checked: boolean) => void;
  showAccessibilityReport: boolean;
  onAccessibilityReportToggle: () => void;
  onColorsClick: () => void;
  onSetsClick: () => void;
}

const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
  onImageGeneratorClick,
  accessibilityMode,
  onAccessibilityModeChange,
  showAccessibilityReport,
  onAccessibilityReportToggle,
  onColorsClick,
  onSetsClick
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
          
          {/* A11y Mode Toggle */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <span className="text-sm">A11y Mode</span>
            </div>
            <Switch
              checked={accessibilityMode}
              onCheckedChange={onAccessibilityModeChange}
            />
          </div>
          
          {/* Contrast Toggle */}
          {!accessibilityMode && (
            <button
              onClick={() => handleItemClick(onAccessibilityReportToggle)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Contrast</span>
              <span className="ml-auto text-xs">{showAccessibilityReport ? '👁️' : '👁️‍🗨️'}</span>
            </button>
          )}
          
          <Separator />
          
          {/* Colors */}
          <button
            onClick={() => handleItemClick(onColorsClick)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Colors</span>
          </button>
          
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