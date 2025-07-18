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

      case 'wavy-lines':
        const waveScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wavy-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M0,${100 + i * 120 * waveScale} Q300,${50 + i * 120 * waveScale} 600,${100 + i * 120 * waveScale} T1200,${100 + i * 120 * waveScale}`}
                stroke="url(#wavy-line-gradient)"
                strokeWidth={3 * waveScale}
                fill="none"
              />
            ))}
          </svg>
        );

      case 'organic-blobs':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="organic-blur">
                <feGaussianBlur stdDeviation="15" />
              </filter>
            </defs>
            <path
              d={`M${200 * settings.patternScale / 50},${150 * settings.patternScale / 50} C${300 * settings.patternScale / 50},${100 * settings.patternScale / 50} ${400 * settings.patternScale / 50},${200 * settings.patternScale / 50} ${350 * settings.patternScale / 50},${250 * settings.patternScale / 50} C${300 * settings.patternScale / 50},${300 * settings.patternScale / 50} ${150 * settings.patternScale / 50},${280 * settings.patternScale / 50} ${200 * settings.patternScale / 50},${150 * settings.patternScale / 50} Z`}
              fill={colorPalette.brand}
              fillOpacity="0.7"
              filter="url(#organic-blur)"
            />
            <path
              d={`M${800 * settings.patternScale / 50},${300 * settings.patternScale / 50} C${900 * settings.patternScale / 50},${200 * settings.patternScale / 50} ${1000 * settings.patternScale / 50},${400 * settings.patternScale / 50} ${950 * settings.patternScale / 50},${450 * settings.patternScale / 50} C${850 * settings.patternScale / 50},${500 * settings.patternScale / 50} ${700 * settings.patternScale / 50},${380 * settings.patternScale / 50} ${800 * settings.patternScale / 50},${300 * settings.patternScale / 50} Z`}
              fill={colorPalette.accent}
              fillOpacity="0.6"
              filter="url(#organic-blur)"
            />
          </svg>
        );

      case 'zigzag-chevron':
        const zigzagScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="zigzag" x="0" y="0" width={80 * zigzagScale} height={40 * zigzagScale} patternUnits="userSpaceOnUse">
                <path
                  d={`M0,${20 * zigzagScale} L${20 * zigzagScale},0 L${40 * zigzagScale},${20 * zigzagScale} L${60 * zigzagScale},0 L${80 * zigzagScale},${20 * zigzagScale}`}
                  stroke={colorPalette.brand}
                  strokeWidth="2"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#zigzag)" opacity="0.7" />
          </svg>
        );

      case 'diagonal-stripes':
        const stripeScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-stripes" x="0" y="0" width={40 * stripeScale} height={40 * stripeScale} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect x="0" y="0" width={20 * stripeScale} height={40 * stripeScale} fill={colorPalette.brand} fillOpacity="0.6" />
                <rect x={20 * stripeScale} y="0" width={20 * stripeScale} height={40 * stripeScale} fill={colorPalette.accent} fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
          </svg>
        );

      case 'concentric-circles':
        const circleScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="concentric-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.8" />
                <stop offset="50%" stopColor={colorPalette.accent} stopOpacity="0.4" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.2" />
              </radialGradient>
            </defs>
            {Array.from({ length: 8 }, (_, i) => (
              <circle
                key={i}
                cx="600"
                cy="400"
                r={(i + 1) * 50 * circleScale}
                fill="none"
                stroke="url(#concentric-gradient)"
                strokeWidth="2"
                opacity={0.8 - i * 0.1}
              />
            ))}
          </svg>
        );

      case 'isometric-cubes':
        const cubeScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="isometric-cubes" x="0" y="0" width={60 * cubeScale} height={60 * cubeScale} patternUnits="userSpaceOnUse">
                <g transform={`scale(${cubeScale})`}>
                  <path d="M30,10 L50,20 L50,40 L30,30 Z" fill={colorPalette.brand} fillOpacity="0.8" />
                  <path d="M10,20 L30,10 L30,30 L10,40 Z" fill={colorPalette.accent} fillOpacity="0.6" />
                  <path d="M10,40 L30,30 L50,40 L30,50 Z" fill={colorPalette.highlight} fillOpacity="0.7" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometric-cubes)" />
          </svg>
        );

      case 'hexagon-mesh':
        const hexScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon-mesh" x="0" y="0" width={80 * hexScale} height={69.3 * hexScale} patternUnits="userSpaceOnUse">
                <polygon
                  points={`40,0 60,11.55 60,34.65 40,46.2 20,34.65 20,11.55`.split(' ').map(coord => coord.split(',').map(n => parseFloat(n) * hexScale).join(',')).join(' ')}
                  fill="none"
                  stroke={colorPalette.brand}
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon-mesh)" />
          </svg>
        );

      case 'triangles-lowpoly':
        const triScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 20 }, (_, i) => {
              const x = (i % 5) * 240 * triScale;
              const y = Math.floor(i / 5) * 200 * triScale;
              const colors = [colorPalette.brand, colorPalette.accent, colorPalette.highlight];
              const color = colors[i % 3];
              return (
                <polygon
                  key={i}
                  points={`${x + 120 * triScale},${y} ${x},${y + 200 * triScale} ${x + 240 * triScale},${y + 200 * triScale}`}
                  fill={color}
                  fillOpacity={0.6 - (i % 3) * 0.1}
                />
              );
            })}
          </svg>
        );

      case 'dotted-grid':
        const dotScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotted-grid" x="0" y="0" width={30 * dotScale} height={30 * dotScale} patternUnits="userSpaceOnUse">
                <circle cx={15 * dotScale} cy={15 * dotScale} r={2 * dotScale} fill={colorPalette.brand} fillOpacity="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotted-grid)" />
          </svg>
        );

      case 'radial-burst':
        const burstScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="burst-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.9" />
                <stop offset="70%" stopColor={colorPalette.accent} stopOpacity="0.4" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.1" />
              </radialGradient>
            </defs>
            {Array.from({ length: 32 }, (_, i) => {
              const angle = (i * 360) / 32;
              const x1 = 600;
              const y1 = 400;
              const x2 = 600 + Math.cos((angle * Math.PI) / 180) * 600 * burstScale;
              const y2 = 400 + Math.sin((angle * Math.PI) / 180) * 400 * burstScale;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#burst-gradient)"
                  strokeWidth={i % 4 === 0 ? 3 : 1}
                  opacity={0.6}
                />
              );
            })}
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