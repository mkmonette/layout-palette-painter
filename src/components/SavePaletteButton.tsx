
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { ColorPalette, TemplateType } from '@/types/template';

interface SavePaletteButtonProps {
  colorPalette: ColorPalette;
  template: TemplateType;
  onSave?: () => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

const SavePaletteButton: React.FC<SavePaletteButtonProps> = ({
  colorPalette,
  template,
  onSave,
  size = 'default',
  variant = 'outline',
  className = ''
}) => {
  const { toast } = useToast();
  const { canSaveMore, savePalette } = useSavedPalettes();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!canSaveMore()) {
      toast({
        title: "Save Limit Reached",
        description: "You can manage saved palettes or upgrade.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Generate a default name based on template and timestamp
    const templateName = template.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    const timestamp = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const defaultName = `${templateName} - ${timestamp}`;

    const success = savePalette(colorPalette, template, defaultName);
    
    if (success) {
      toast({
        title: "Palette Saved",
        description: `"${defaultName}" has been saved successfully.`
      });
      onSave?.();
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save palette. Please try again.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleSave}
      disabled={!canSaveMore() || isLoading}
      size={size}
      variant={variant}
      className={className}
      title={!canSaveMore() ? "Save limit reached" : "Save current palette"}
    >
      <Save className="h-4 w-4 mr-2" />
      {isLoading ? 'Saving...' : 'Save'}
    </Button>
  );
};

export default SavePaletteButton;
