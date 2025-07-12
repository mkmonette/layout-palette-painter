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
  const getGradientStyle = () => {
    if (!backgroundSettings?.enabled || backgroundSettings.mode !== 'gradient') return {};

    const { gradientFillType, gradientStartColor, gradientEndColor, gradientDirection, opacity } = backgroundSettings;

    if (gradientFillType === 'none') return {};

    const startColorValue = colorPalette[gradientStartColor];
    const endColorValue = colorPalette[gradientEndColor];

    if (gradientFillType === 'solid') {
      return {
        background: startColorValue,
        opacity: opacity,
      };
    }

    if (gradientFillType === 'gradient') {
      let direction = '';
      switch (gradientDirection) {
        case 'horizontal':
          direction = 'to right';
          break;
        case 'vertical':
          direction = 'to bottom';
          break;
        case 'diagonal':
          direction = '45deg';
          break;
        default:
          direction = 'to right';
      }

      return {
        background: `linear-gradient(${direction}, ${startColorValue}, ${endColorValue})`,
        opacity: opacity,
      };
    }

    return {};
  };

  return (
    <div 
      className="template-wrapper relative w-full min-h-screen"
      style={{
        '--section-bg-1': colorPalette['section-bg-1'],
        '--section-bg-2': colorPalette['section-bg-2'], 
        '--section-bg-3': colorPalette['section-bg-3'],
        '--highlight': colorPalette.highlight,
        '--accent': colorPalette.accent,
        '--brand': colorPalette.brand,
        '--button-primary': colorPalette['button-primary'],
        '--button-secondary': colorPalette['button-secondary'],
      } as React.CSSProperties}
    >
      {/* Background container - handles both SVG and Gradient */}
      {backgroundSettings?.enabled && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9998,
          pointerEvents: 'none'
        }}>
          {/* SVG Background */}
          {backgroundSettings.mode === 'svg' && (
            <TemplateBackground 
              settings={backgroundSettings}
              colorPalette={colorPalette}
            >
              <></>
            </TemplateBackground>
          )}
          
          {/* Gradient Background */}
          {backgroundSettings.mode === 'gradient' && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                ...getGradientStyle()
              }}
            />
          )}
        </div>
      )}
      
      {/* Template Content */}
      <div className="template-content relative z-10" style={{ 
        background: 'rgba(255,255,255,0.8)', // Semi-transparent so we can see background
        minHeight: '100vh',
        position: 'relative' // Ensure proper stacking context
      }}>
        {children}
      </div>
    </div>
  );
};

export default TemplateWrapper;