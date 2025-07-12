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
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          border: '10px solid purple', // Debug border
          background: 'rgba(255,255,255,0.3)' // Debug background
        }}
      >
        {/* Simple solid red rectangle */}
        <rect x="0" y="0" width="1200" height="400" fill="red" />
        
        {/* Simple solid blue rectangle */}
        <rect x="0" y="400" width="1200" height="400" fill="blue" />
        
        {/* Simple green circle */}
        <circle cx="600" cy="400" r="200" fill="green" />
        
        {/* Yellow text */}
        <text x="600" y="400" fill="yellow" fontSize="48" textAnchor="middle" dominantBaseline="middle">
          SVG WORKS!
        </text>
      </svg>
    </div>
  );
};

export default TemplateBackground;