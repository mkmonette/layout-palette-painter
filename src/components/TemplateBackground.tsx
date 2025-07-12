import React from 'react';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';
import type { ColorPalette } from '@/types/template';

interface TemplateBackgroundProps {
  settings: BackgroundSettings;
  children: React.ReactNode;
  colorPalette: ColorPalette;
}

const TemplateBackground: React.FC<TemplateBackgroundProps> = ({ settings, children, colorPalette }) => {
  // Debug logging
  console.log('TemplateBackground component mounting...');
  console.log('TemplateBackground received settings:', settings);
  console.log('TemplateBackground received colorPalette:', colorPalette);

  const getSvgBackground = () => {
    if (!settings.enabled) {
      console.log('Background disabled, returning null');
      return null;
    }

    console.log('Generating SVG background for style:', settings.style);
    console.log('Color palette colors:', {
      'section-bg-2': colorPalette['section-bg-2'],
      'section-bg-3': colorPalette['section-bg-3'],
      highlight: colorPalette.highlight,
      accent: colorPalette.accent
    });
    const baseOpacity = 1; // Make it fully opaque for debugging
    console.log('Using opacity:', baseOpacity);
    
    switch (settings.style) {
      case 'wavy-layers':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            style={{ 
              zIndex: 0,
              border: '5px solid purple', // Debug border to see if SVG is there
              background: 'rgba(255,255,255,0.5)' // Debug background
            }}
          >
            <defs>
              <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="wave-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0000ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffff00" stopOpacity="1" />
              </linearGradient>
            </defs>
            
            {/* Layer 1 */}
            <path
              d={`M0,${400 - settings.waveHeight * 2} C300,${320 - settings.waveHeight} 600,${480 + settings.waveHeight} 1200,${400 - settings.waveHeight} V800 H0 Z`}
              fill="url(#wave-gradient-1)"
            />
            
            {/* Layer 2 */}
            <path
              d={`M0,${500 + settings.waveHeight} C400,${420 + settings.waveHeight * 1.5} 800,${580 - settings.waveHeight * 1.5} 1200,${500 + settings.waveHeight} V800 H0 Z`}
              fill="url(#wave-gradient-2)"
            />
          </svg>
        );

      case 'cloudy-blobs':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="blob-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
              </filter>
            </defs>
            
            {/* Large background blob */}
            <ellipse
              cx="300"
              cy="200"
              rx={120 + settings.blobSize * 2}
              ry={80 + settings.blobSize * 1.5}
              fill="var(--section-bg-2)"
              opacity={baseOpacity * 0.6}
              filter="url(#blob-blur)"
            />
            
            {/* Medium blob */}
            <ellipse
              cx="800"
              cy="400"
              rx={90 + settings.blobSize * 1.5}
              ry={110 + settings.blobSize * 1.8}
              fill="var(--section-bg-3)"
              opacity={baseOpacity * 0.5}
              filter="url(#blob-blur)"
            />
            
            {/* Small accent blob */}
            <ellipse
              cx="600"
              cy="150"
              rx={60 + settings.blobSize}
              ry={40 + settings.blobSize * 0.8}
              fill={colorPalette.highlight}
              opacity={baseOpacity * 0.3}
              filter="url(#blob-blur)"
            />
            
            {/* Tiny accent blob */}
            <ellipse
              cx="200"
              cy="600"
              rx={40 + settings.blobSize * 0.6}
              ry={50 + settings.blobSize * 0.7}
              fill={colorPalette.accent}
              opacity={baseOpacity * 0.4}
              filter="url(#blob-blur)"
            />
          </svg>
        );

      case 'mesh-gradients':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="mesh-1" cx="30%" cy="30%">
                <stop offset="0%" stopColor={colorPalette.highlight} stopOpacity={baseOpacity * settings.meshIntensity / 100} />
                <stop offset="70%" stopColor={colorPalette['section-bg-2']} stopOpacity={baseOpacity * 0.2} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="mesh-2" cx="70%" cy="60%">
                <stop offset="0%" stopColor={colorPalette.accent} stopOpacity={baseOpacity * settings.meshIntensity / 100} />
                <stop offset="70%" stopColor={colorPalette['section-bg-3']} stopOpacity={baseOpacity * 0.3} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="mesh-3" cx="20%" cy="80%">
                <stop offset="0%" stopColor={colorPalette['section-bg-2']} stopOpacity={baseOpacity * settings.meshIntensity / 100} />
                <stop offset="70%" stopColor={colorPalette.highlight} stopOpacity={baseOpacity * 0.1} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#mesh-1)" />
            <rect width="100%" height="100%" fill="url(#mesh-2)" />
            <rect width="100%" height="100%" fill="url(#mesh-3)" />
          </svg>
        );

      case 'flowing-shapes':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette['section-bg-2']} stopOpacity={baseOpacity * 0.7} />
                <stop offset="50%" stopColor={colorPalette.highlight} stopOpacity={baseOpacity * 0.4} />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity={baseOpacity * 0.3} />
              </linearGradient>
            </defs>
            
            <path
              d={`M0,0 C${200 + settings.waveHeight * 2},${100 + settings.waveHeight} ${400 - settings.waveHeight},${300 + settings.waveHeight * 1.5} ${600 + settings.waveHeight * 1.5},${200 - settings.waveHeight} C${800 - settings.waveHeight},${100 + settings.waveHeight * 2} ${1000 + settings.waveHeight * 0.5},${300 - settings.waveHeight} 1200,0 V800 H0 Z`}
              fill="url(#flow-gradient)"
            />
          </svg>
        );

      case 'geometric-patterns':
        const scale = settings.patternScale / 100;
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="geometric-pattern"
                x="0"
                y="0"
                width={80 * scale}
                height={80 * scale}
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points={`${20 * scale},${10 * scale} ${35 * scale},${30 * scale} ${20 * scale},${50 * scale} ${5 * scale},${30 * scale}`}
                  fill={colorPalette['section-bg-2']}
                  opacity={baseOpacity * 0.4}
                />
                <circle
                  cx={60 * scale}
                  cy={60 * scale}
                  r={8 * scale}
                  fill={colorPalette.highlight}
                  opacity={baseOpacity * 0.3}
                />
              </pattern>
              <pattern
                id="geometric-accent"
                x="40"
                y="40"
                width={60 * scale}
                height={60 * scale}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={10 * scale}
                  y={10 * scale}
                  width={15 * scale}
                  height={15 * scale}
                  fill={colorPalette.accent}
                  opacity={baseOpacity * 0.2}
                  transform={`rotate(45 ${17.5 * scale} ${17.5 * scale})`}
                />
              </pattern>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
            <rect width="100%" height="100%" fill="url(#geometric-accent)" />
          </svg>
        );

      default:
        return null;
    }
  };

  const svgBackground = getSvgBackground();
  console.log('SVG background element:', svgBackground);

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
      {svgBackground}
    </div>
  );
};

export default TemplateBackground;