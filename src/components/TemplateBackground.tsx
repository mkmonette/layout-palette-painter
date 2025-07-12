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
  console.log('TemplateBackground DOM element should be visible now');

  if (!settings.enabled) {
    console.log('TemplateBackground DISABLED - returning null');
    return null;
  }

  console.log('TemplateBackground ENABLED - rendering visible element');

  // Super prominent test element
  return (
    <>
      <div 
        id="template-background-test"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => console.log('Background clicked!')}
      >
        <div style={{
          backgroundColor: 'yellow',
          padding: '20px',
          border: '5px solid blue',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'black'
        }}>
          BACKGROUND WORKS! CHECK CONSOLE
        </div>
      </div>
    </>
  );
};

export default TemplateBackground;