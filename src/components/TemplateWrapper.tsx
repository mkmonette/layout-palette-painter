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
  console.log('backgroundSettings?.enabled:', backgroundSettings?.enabled);
  console.log('backgroundSettings exists:', !!backgroundSettings);
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
      
      {/* Always show test - no condition */}
      <div style={{
        position: 'fixed',
        top: '50px',
        left: '50px',
        width: '400px',
        height: '150px',
        background: 'black',
        color: 'yellow',
        fontSize: '18px',
        fontWeight: 'bold',
        zIndex: 99999,
        border: '10px solid magenta',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div>ALWAYS VISIBLE TEST</div>
        <div>enabled: {String(backgroundSettings?.enabled)}</div>
        <div>settings: {backgroundSettings ? 'exists' : 'null'}</div>
      </div>
      
      
      {/* Restore conditional test */}
      {backgroundSettings?.enabled && (
        <div style={{
          position: 'fixed',
          top: '250px',
          left: '50px',
          width: '300px',
          height: '100px',
          background: 'red',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 99998,
          border: '5px solid yellow',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          CONDITIONAL TEST VISIBLE
        </div>
      )}
      
      {/* Debug: Show raw backgroundSettings */}
      <div style={{
        position: 'fixed',
        top: '350px',
        left: '50px',
        width: '400px',
        height: '100px',
        background: 'orange',
        color: 'black',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 99997,
        border: '3px solid purple',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px'
      }}>
        RAW: {JSON.stringify(backgroundSettings)}
      </div>
      
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