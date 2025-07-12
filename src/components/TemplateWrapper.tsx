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
  console.log('TemplateWrapper rendering with:', { backgroundSettings, colorPalette });
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
      } as React.CSSProperties}
    >
      {/* Debug info */}
      {backgroundSettings?.enabled && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 9999, 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px',
          fontSize: '12px'
        }}>
          Background: {backgroundSettings.style} | Enabled: {backgroundSettings.enabled.toString()} | Opacity: {backgroundSettings.opacity}
        </div>
      )}
      
      {/* SVG Background */}
      {backgroundSettings?.enabled && (
        <div className="template-background" style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1, // Changed from 0 to 1
          border: '2px solid red', // Debug border
          background: 'rgba(255,0,0,0.1)', // Debug background
          overflow: 'visible' // Ensure content isn't clipped
        }}>
          {/* Test if removing TemplateBackground component shows anything */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'purple',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
          }}>
            <div style={{
              background: 'white',
              color: 'black',
              padding: '40px',
              fontSize: '32px',
              fontWeight: 'bold',
              border: '5px solid green'
            }}>
              DIRECT RENDER TEST - DO YOU SEE THIS?
            </div>
          </div>
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