import React from 'react';
import TemplateBackground from '@/components/TemplateBackground';
import { ColorPalette } from '@/types/template';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';

interface TemplateWrapperProps {
  children: React.ReactNode;
  colorPalette: ColorPalette;
  backgroundSettings?: BackgroundSettings;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ 
  children, 
  colorPalette, 
  backgroundSettings 
}) => {
  return (
    <div 
      className="template-wrapper relative w-full"
      style={{
        '--section-bg-1': colorPalette['section-bg-1'],
        '--section-bg-2': colorPalette['section-bg-2'], 
        '--section-bg-3': colorPalette['section-bg-3'],
        '--highlight': colorPalette.highlight,
        '--accent': colorPalette.accent,
        '--brand': colorPalette.brand,
      } as React.CSSProperties}
    >
      {/* SVG Background */}
      {backgroundSettings?.enabled && (
        <div className="template-background">
          <TemplateBackground 
            settings={backgroundSettings}
            colorPalette={colorPalette}
          >
            <></>
          </TemplateBackground>
        </div>
      )}
      
      {/* Template Content */}
      <div className="template-content relative z-10">
        {children}
      </div>
    </div>
  );
};

export default TemplateWrapper;