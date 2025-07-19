import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LivePreview from '@/components/LivePreview';
import { TemplateType, ColorPalette } from '@/types/template';

interface SimpleFullscreenPreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
  isOpen: boolean;
  onClose: () => void;
}

const SimpleFullscreenPreview: React.FC<SimpleFullscreenPreviewProps> = ({
  template,
  colorPalette,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-white flex flex-col m-0 p-0">
      {/* Exit button - top right */}
      <div className="absolute top-4 right-4 z-[10000]">
        <Button 
          onClick={onClose} 
          variant="outline" 
          size="icon" 
          className="bg-white/95 backdrop-blur-sm border shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Preview - Full screen */}
      <div className="flex-1 overflow-auto w-full h-full m-0 p-0">
        <div className="min-h-screen w-full m-0 p-0">
          <LivePreview template={template} colorPalette={colorPalette} />
        </div>
      </div>
    </div>
  );
};

export default SimpleFullscreenPreview;