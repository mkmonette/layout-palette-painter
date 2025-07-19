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
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 z-[99999] bg-white flex flex-col"
      style={{
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      }}
    >
      {/* Exit button - top right */}
      <div className="absolute top-4 right-4" style={{ zIndex: 100000 }}>
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
      <div 
        className="flex-1 overflow-auto w-full h-full"
        style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
      >
        <div 
          className="min-h-screen w-full"
          style={{ margin: 0, padding: 0, minHeight: '100vh', width: '100%' }}
        >
          <LivePreview template={template} colorPalette={colorPalette} />
        </div>
      </div>
    </div>
  );
};

export default SimpleFullscreenPreview;