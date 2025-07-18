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

      case 'circuit-board':
        const circuitScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-board" x="0" y="0" width={100 * circuitScale} height={100 * circuitScale} patternUnits="userSpaceOnUse">
                <g>
                  <line x1="10" y1="10" x2="90" y2="10" stroke={colorPalette.brand} strokeWidth="2" opacity="0.7" />
                  <line x1="10" y1="10" x2="10" y2="50" stroke={colorPalette.brand} strokeWidth="2" opacity="0.7" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke={colorPalette.accent} strokeWidth="1.5" opacity="0.6" />
                  <line x1="90" y1="10" x2="90" y2="30" stroke={colorPalette.brand} strokeWidth="2" opacity="0.7" />
                  <line x1="50" y1="50" x2="90" y2="50" stroke={colorPalette.accent} strokeWidth="1.5" opacity="0.6" />
                  <circle cx="10" cy="10" r="3" fill={colorPalette.highlight} opacity="0.8" />
                  <circle cx="50" cy="50" r="2" fill={colorPalette.brand} opacity="0.7" />
                  <circle cx="90" cy="30" r="2.5" fill={colorPalette.accent} opacity="0.6" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-board)" />
          </svg>
        );

      case 'data-flow':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flow-line-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.2" />
                <stop offset="50%" stopColor={colorPalette.accent} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M0,${150 + i * 100} Q${300 * settings.patternScale / 50},${100 + i * 100} ${600 * settings.patternScale / 50},${150 + i * 100} T1200,${150 + i * 100}`}
                stroke="url(#flow-line-gradient)"
                strokeWidth={4 * settings.patternScale / 50}
                fill="none"
                opacity={0.7 - i * 0.1}
              />
            ))}
          </svg>
        );

      case 'matrix-dots':
        const matrixScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="matrix-dots" x="0" y="0" width={20 * matrixScale} height={20 * matrixScale} patternUnits="userSpaceOnUse">
                <circle cx={10 * matrixScale} cy={10 * matrixScale} r={1.5 * matrixScale} fill={colorPalette.brand} opacity="0.8">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#matrix-dots)" />
          </svg>
        );

      case 'glowing-rings':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.9" />
                <stop offset="70%" stopColor={colorPalette.accent} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.1" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            {Array.from({ length: 4 }, (_, i) => (
              <circle
                key={i}
                cx={300 + i * 200}
                cy={200 + (i % 2) * 400}
                r={60 * settings.patternScale / 50}
                fill="none"
                stroke="url(#glow-gradient)"
                strokeWidth="3"
                filter="url(#glow)"
                opacity={0.8}
              />
            ))}
          </svg>
        );

      case 'digital-grid':
        const digitalScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="digital-grid" x="0" y="0" width={40 * digitalScale} height={40 * digitalScale} patternUnits="userSpaceOnUse">
                <path d={`M${40 * digitalScale} 0 L0 0 0 ${40 * digitalScale}`} fill="none" stroke={colorPalette.brand} strokeWidth="0.8" opacity="0.6" />
                <circle cx={20 * digitalScale} cy={20 * digitalScale} r={2 * digitalScale} fill={colorPalette.accent} opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#digital-grid)" />
          </svg>
        );

      case 'pixel-noise':
        const pixelScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pixel-noise" x="0" y="0" width={8 * pixelScale} height={8 * pixelScale} patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width={4 * pixelScale} height={4 * pixelScale} fill={colorPalette.brand} opacity="0.3" />
                <rect x={4 * pixelScale} y={4 * pixelScale} width={4 * pixelScale} height={4 * pixelScale} fill={colorPalette.accent} opacity="0.2" />
                <rect x={0} y={4 * pixelScale} width={4 * pixelScale} height={4 * pixelScale} fill={colorPalette.highlight} opacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pixel-noise)" />
          </svg>
        );

      case 'soft-shapes':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="soft-blur">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>
            {Array.from({ length: 12 }, (_, i) => {
              const x = (i % 4) * 300;
              const y = Math.floor(i / 4) * 250;
              const isTriangle = i % 2 === 0;
              const size = 50 * settings.patternScale / 50;
              return isTriangle ? (
                <polygon
                  key={i}
                  points={`${x + size},${y} ${x},${y + size * 1.5} ${x + size * 2},${y + size * 1.5}`}
                  fill={[colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3]}
                  fillOpacity="0.4"
                  filter="url(#soft-blur)"
                />
              ) : (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={size * 1.5}
                  height={size * 1.5}
                  rx={10}
                  fill={[colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3]}
                  fillOpacity="0.4"
                  filter="url(#soft-blur)"
                />
              );
            })}
          </svg>
        );

      case 'paper-texture':
        const paperScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="paper-texture" x="0" y="0" width={4 * paperScale} height={4 * paperScale} patternUnits="userSpaceOnUse">
                <circle cx={2 * paperScale} cy={2 * paperScale} r={0.5 * paperScale} fill={colorPalette.brand} opacity="0.1" />
                <circle cx={1 * paperScale} cy={3 * paperScale} r={0.3 * paperScale} fill={colorPalette.accent} opacity="0.08" />
                <circle cx={3 * paperScale} cy={1 * paperScale} r={0.4 * paperScale} fill={colorPalette.highlight} opacity="0.09" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paper-texture)" />
          </svg>
        );

      case 'repeating-symbols':
        const symbolScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="repeating-symbols" x="0" y="0" width={60 * symbolScale} height={60 * symbolScale} patternUnits="userSpaceOnUse">
                <g transform={`scale(${symbolScale})`}>
                  <path d="M20,10 L40,10 M30,0 L30,20" stroke={colorPalette.brand} strokeWidth="2" opacity="0.6" />
                  <path d="M10,40 L20,30 L30,40 L20,50 Z" fill="none" stroke={colorPalette.accent} strokeWidth="1.5" opacity="0.5" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#repeating-symbols)" />
          </svg>
        );

      case 'diagonal-hatch':
        const hatchScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-hatch" x="0" y="0" width={20 * hatchScale} height={20 * hatchScale} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1={5 * hatchScale} x2={20 * hatchScale} y2={5 * hatchScale} stroke={colorPalette.brand} strokeWidth="1" opacity="0.5" />
                <line x1="0" y1={15 * hatchScale} x2={20 * hatchScale} y2={15 * hatchScale} stroke={colorPalette.accent} strokeWidth="0.8" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal-hatch)" />
          </svg>
        );

      case 'rounded-grid':
        const roundedScale = settings.patternScale / 50;
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rounded-grid" x="0" y="0" width={50 * roundedScale} height={50 * roundedScale} patternUnits="userSpaceOnUse">
                <rect x={5 * roundedScale} y={5 * roundedScale} width={40 * roundedScale} height={40 * roundedScale} rx={8 * roundedScale} fill="none" stroke={colorPalette.brand} strokeWidth="1.5" opacity="0.6" />
                <circle cx={25 * roundedScale} cy={25 * roundedScale} r={3 * roundedScale} fill={colorPalette.accent} opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rounded-grid)" />
          </svg>
        );

      case 'brush-strokes':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="brush-texture">
                <feTurbulence baseFrequency="0.9" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
              </filter>
            </defs>
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M${i * 150},${200 + (i % 2) * 400} Q${i * 150 + 200},${150 + (i % 2) * 400} ${i * 150 + 400},${200 + (i % 2) * 400}`}
                stroke={[colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3]}
                strokeWidth={8 * settings.patternScale / 50}
                fill="none"
                opacity="0.4"
                filter="url(#brush-texture)"
              />
            ))}
          </svg>
        );

      case 'paint-splatter':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 20 }, (_, i) => {
              const x = Math.random() * 1200;
              const y = Math.random() * 800;
              const size = (5 + Math.random() * 15) * settings.patternScale / 50;
              const color = [colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3];
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  opacity={0.3 + Math.random() * 0.3}
                />
              );
            })}
          </svg>
        );

      case 'ink-blot':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="ink-blur">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M${200 + i * 150},${300 + (i % 2) * 200} C${150 + i * 150},${250 + (i % 2) * 200} ${250 + i * 150},${200 + (i % 2) * 200} ${300 + i * 150},${350 + (i % 2) * 200} C${280 + i * 150},${400 + (i % 2) * 200} ${180 + i * 150},${380 + (i % 2) * 200} ${200 + i * 150},${300 + (i % 2) * 200} Z`}
                fill={[colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3]}
                fillOpacity="0.3"
                filter="url(#ink-blur)"
                transform={`scale(${settings.patternScale / 50})`}
              />
            ))}
          </svg>
        );

      case 'watercolor':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="watercolor-blur">
                <feGaussianBlur stdDeviation="20" />
              </filter>
              <radialGradient id="watercolor-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.4" />
                <stop offset="70%" stopColor={colorPalette.accent} stopOpacity="0.2" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.1" />
              </radialGradient>
            </defs>
            {Array.from({ length: 4 }, (_, i) => (
              <ellipse
                key={i}
                cx={300 + i * 200}
                cy={200 + (i % 2) * 400}
                rx={100 * settings.patternScale / 50}
                ry={60 * settings.patternScale / 50}
                fill="url(#watercolor-gradient)"
                filter="url(#watercolor-blur)"
                opacity={0.6}
              />
            ))}
          </svg>
        );

      case 'hand-drawn':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="hand-drawn-rough">
                <feTurbulence baseFrequency="0.02" numOctaves="3" result="roughness" />
                <feDisplacementMap in="SourceGraphic" in2="roughness" scale="2" />
              </filter>
            </defs>
            {Array.from({ length: 10 }, (_, i) => (
              <path
                key={i}
                d={`M${i * 120},${200 + Math.sin(i) * 100} Q${i * 120 + 60},${150 + Math.cos(i) * 80} ${i * 120 + 120},${250 + Math.sin(i + 1) * 90}`}
                stroke={[colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3]}
                strokeWidth={2 * settings.patternScale / 50}
                fill="none"
                opacity="0.5"
                filter="url(#hand-drawn-rough)"
              />
            ))}
          </svg>
        );

      case 'stained-glass':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 15 }, (_, i) => {
              const x = (i % 5) * 240;
              const y = Math.floor(i / 5) * 260;
              const color = [colorPalette.brand, colorPalette.accent, colorPalette.highlight][i % 3];
              return (
                <polygon
                  key={i}
                  points={`${x + 20},${y + 10} ${x + 100},${y + 30} ${x + 180},${y + 80} ${x + 120},${y + 150} ${x + 40},${y + 120}`}
                  fill={color}
                  fillOpacity="0.4"
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.8"
                  transform={`scale(${settings.patternScale / 50})`}
                />
              );
            })}
          </svg>
        );

      case 'wave-divider':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave-divider-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.8" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path 
              d={`M0,0 Q300,${50 * settings.patternScale / 50} 600,0 T1200,0 L1200,${100 * settings.patternScale / 50} Q900,${150 * settings.patternScale / 50} 600,${100 * settings.patternScale / 50} T0,${100 * settings.patternScale / 50} Z`}
              fill="url(#wave-divider-gradient)"
            />
            <path 
              d={`M0,${700 * settings.patternScale / 50} Q300,${750 * settings.patternScale / 50} 600,${700 * settings.patternScale / 50} T1200,${700 * settings.patternScale / 50} L1200,800 L0,800 Z`}
              fill="url(#wave-divider-gradient)"
            />
          </svg>
        );

      case 'slant-diagonal':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="slant-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.7" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <polygon 
              points={`0,0 ${400 * settings.patternScale / 50},0 0,${300 * settings.patternScale / 50}`}
              fill="url(#slant-gradient)"
            />
            <polygon 
              points={`1200,800 ${800 * settings.patternScale / 50},800 1200,${500 * settings.patternScale / 50}`}
              fill="url(#slant-gradient)"
            />
          </svg>
        );

      case 'curved-overlay':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="curved-overlay-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.6" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.2" />
              </radialGradient>
            </defs>
            <path 
              d={`M0,0 Q600,${150 * settings.patternScale / 50} 1200,0 L1200,${200 * settings.patternScale / 50} Q600,${350 * settings.patternScale / 50} 0,${200 * settings.patternScale / 50} Z`}
              fill="url(#curved-overlay-gradient)"
            />
          </svg>
        );

      case 'notched-corners':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="notched-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.5" />
                <stop offset="100%" stopColor={colorPalette.accent} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <polygon 
              points={`${100 * settings.patternScale / 50},0 1200,0 1200,${100 * settings.patternScale / 50} ${1100 * settings.patternScale / 50},${200 * settings.patternScale / 50} 0,${200 * settings.patternScale / 50} 0,${100 * settings.patternScale / 50}`}
              fill="url(#notched-gradient)"
            />
            <polygon 
              points={`0,${600 * settings.patternScale / 50} ${100 * settings.patternScale / 50},${700 * settings.patternScale / 50} 1200,${700 * settings.patternScale / 50} 1200,800 0,800`}
              fill="url(#notched-gradient)"
            />
          </svg>
        );

      case 'blob-separator':
        return (
          <svg {...baseProps} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blob-blur">
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <linearGradient id="blob-separator-gradient">
                <stop offset="0%" stopColor={colorPalette.brand} stopOpacity="0.6" />
                <stop offset="50%" stopColor={colorPalette.accent} stopOpacity="0.4" />
                <stop offset="100%" stopColor={colorPalette.highlight} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path 
              d={`M0,${200 * settings.patternScale / 50} C200,${150 * settings.patternScale / 50} 400,${250 * settings.patternScale / 50} 600,${200 * settings.patternScale / 50} C800,${150 * settings.patternScale / 50} 1000,${250 * settings.patternScale / 50} 1200,${200 * settings.patternScale / 50} L1200,${300 * settings.patternScale / 50} C1000,${350 * settings.patternScale / 50} 800,${250 * settings.patternScale / 50} 600,${300 * settings.patternScale / 50} C400,${350 * settings.patternScale / 50} 200,${250 * settings.patternScale / 50} 0,${300 * settings.patternScale / 50} Z`}
              fill="url(#blob-separator-gradient)"
              filter="url(#blob-blur)"
            />
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