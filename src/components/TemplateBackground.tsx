import React from 'react';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';
import type { ColorPalette } from '@/types/template';

interface TemplateBackgroundProps {
  settings: BackgroundSettings;
  children: React.ReactNode;
  colorPalette: ColorPalette;
}

const TemplateBackground: React.FC<TemplateBackgroundProps> = ({ settings, children, colorPalette }) => {
  if (!settings.enabled) {
    return null;
  }

  const getBackgroundElement = () => {
    const baseProps = {
      width: "100%",
      height: "100%",
      preserveAspectRatio: "xMidYMid slice",
      style: { opacity: settings.opacity }
    };

    switch (settings.style) {
      case 'wavy-layers':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wavy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path d={`M0,${400 + settings.waveHeight * 0.5} C300,${350 - settings.waveHeight * 0.3} 600,${450 + settings.waveHeight * 0.4} 1200,${400 - settings.waveHeight * 0.2} L1200,800 L0,800 Z`} 
                  fill="url(#wavy-gradient)" />
            <path d={`M0,${300 + settings.waveHeight * 0.3} C400,${250 - settings.waveHeight * 0.4} 800,${350 + settings.waveHeight * 0.3} 1200,${300 - settings.waveHeight * 0.1} L1200,800 L0,800 Z`} 
                  fill={colorPalette.highlight} fillOpacity="0.7" />
          </svg>
        );

      case 'cloudy-blobs':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blur">
                <feGaussianBlur stdDeviation="20" />
              </filter>
            </defs>
            <circle cx="200" cy="150" r={settings.blobSize + 50} fill={colorPalette.brand} fillOpacity="0.8" filter="url(#blur)" />
            <circle cx="800" cy="300" r={settings.blobSize + 70} fill={colorPalette.accent} fillOpacity="0.7" filter="url(#blur)" />
            <circle cx="400" cy="600" r={settings.blobSize + 40} fill={colorPalette.highlight} fillOpacity="0.8" filter="url(#blur)" />
            <circle cx="1000" cy="100" r={settings.blobSize + 30} fill={colorPalette.brand} fillOpacity="0.6" filter="url(#blur)" />
          </svg>
        );

      case 'geometric-patterns':
        const scale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric" x="0" y="0" width={100 * scale} height={100 * scale} patternUnits="userSpaceOnUse">
                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill={colorPalette.brand} fillOpacity="0.6" />
                <circle cx="50" cy="50" r="15" fill={colorPalette.accent} fillOpacity="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric)" />
          </svg>
        );

      case 'mesh-gradients':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="mesh1" cx="20%" cy="30%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity={0.8 * (settings.meshIntensity / 50)} />
                <stop offset="100%" stopColor={colorPalette.brand} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mesh2" cx="80%" cy="20%">
                <stop offset="0%" stopColor={colorPalette.accent} stopOpacity={0.7 * (settings.meshIntensity / 50)} />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mesh3" cx="40%" cy="80%">
                <stop offset="0%" stopColor={colorPalette.highlight} stopOpacity={0.8 * (settings.meshIntensity / 50)} />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh1)" />
            <rect width="100%" height="100%" fill="url(#mesh2)" />
            <rect width="100%" height="100%" fill="url(#mesh3)" />
          </svg>
        );

      case 'flowing-shapes':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.8" />
                <stop offset="50%" stopColor={colorPalette.accent} stopOpacity="0.6" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path d="M0,200 C300,100 600,300 1200,150 L1200,0 L0,0 Z" fill="url(#flow-gradient)" />
            <path d="M0,600 C400,500 800,700 1200,550 L1200,800 L0,800 Z" fill={colorPalette.brand} fillOpacity="0.5" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {getBackgroundElement()}
      {children}
    </div>
  );
};

export default TemplateBackground;