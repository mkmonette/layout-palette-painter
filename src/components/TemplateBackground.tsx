import React from 'react';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';
import type { ColorPalette } from '@/types/template';

interface TemplateBackgroundProps {
  settings: BackgroundSettings;
  children: React.ReactNode;
  colorPalette: ColorPalette;
}

const TemplateBackground: React.FC<TemplateBackgroundProps> = ({ settings, children, colorPalette }) => {
  console.log('TemplateBackground rendering with settings:', settings);

  if (!settings.enabled) {
    return null;
  }

  // Super simple SVG test
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 999,
      pointerEvents: 'none',
      background: 'rgba(255,0,255,0.1)' // Debug background
    }}>
      {/* Bright overlay div instead of SVG to test */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '200px',
        backgroundColor: 'red',
        border: '5px solid yellow',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        zIndex: 1000
      }}>
        BACKGROUND WORKS!
      </div>
    </div>
  );
};

export default TemplateBackground;