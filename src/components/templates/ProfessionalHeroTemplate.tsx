import React from 'react';
import { ColorPalette } from '../../types/template';
import professionalMan from '../../assets/professional-man.png';

import type { BackgroundSettings } from '../BackgroundCustomizer';

interface ProfessionalHeroTemplateProps {
  colorPalette: ColorPalette;
  isDarkMode: boolean;
  backgroundSettings?: BackgroundSettings;
}

export const ProfessionalHeroTemplate: React.FC<ProfessionalHeroTemplateProps> = ({ 
  colorPalette, 
  isDarkMode,
  backgroundSettings 
}) => {
  const getBackgroundStyle = () => {
    const baseGradient = `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent})`;
    
    // The background settings are handled by TemplateWrapper, so we just use the base gradient
    return {
      background: baseGradient,
    };
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-6 h-6 rounded-full opacity-60"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div 
          className="absolute top-40 right-20 w-4 h-4 rounded-full opacity-40"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div 
          className="absolute bottom-32 left-1/4 w-8 h-8 rounded-full opacity-50"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div 
          className="absolute bottom-20 right-1/3 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div 
          className="absolute top-1/2 right-10 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: colorPalette.highlight }}
        />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 lg:px-12 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 transform rotate-45"
              style={{ backgroundColor: colorPalette['text-primary'] }}
            />
            <span 
              className="text-xl font-bold"
              style={{ color: colorPalette['text-primary'] }}
            >
              Professional Inc.
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="hover:opacity-80 transition-opacity"
              style={{ color: colorPalette['text-primary'] }}
            >
              Home
            </a>
            <a 
              href="#" 
              className="hover:opacity-80 transition-opacity"
              style={{ color: colorPalette['text-primary'] }}
            >
              About Us
            </a>
            <a 
              href="#" 
              className="hover:opacity-80 transition-opacity"
              style={{ color: colorPalette['text-primary'] }}
            >
              Services
            </a>
            <a 
              href="#" 
              className="hover:opacity-80 transition-opacity"
              style={{ color: colorPalette['text-primary'] }}
            >
              Contact
            </a>
          </div>

          <button
            className="px-6 py-2 rounded-lg border-2 hover:opacity-90 transition-opacity"
            style={{ 
              color: colorPalette['button-text'],
              borderColor: colorPalette['button-text'],
              backgroundColor: 'transparent'
            }}
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                  style={{ color: colorPalette['text-primary'] }}
                >
                  Professional
                  <br />
                  <span 
                    className="block"
                    style={{ color: colorPalette['text-primary'] }}
                  >
                    Business
                  </span>
                  <span 
                    className="block"
                    style={{ color: colorPalette['text-primary'] }}
                  >
                    Solutions
                  </span>
                </h1>
                
                <p 
                  className="text-lg lg:text-xl leading-relaxed max-w-lg"
                  style={{ color: colorPalette['text-secondary'] }}
                >
                  Expert consulting and strategic solutions that drive growth, 
                  optimize performance, and deliver exceptional results for your business.
                </p>
              </div>

              <button
                className="px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: colorPalette['button-primary'],
                  color: colorPalette['button-text']
                }}
              >
                SCHEDULE CONSULTATION
              </button>
            </div>

            {/* Right Content - Professional Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={professionalMan}
                  alt="Professional consultant"
                  className="w-full max-w-md mx-auto lg:max-w-lg object-contain"
                />
              </div>
              
              {/* Decorative curved line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
                <svg 
                  width="300" 
                  height="100" 
                  viewBox="0 0 300 100" 
                  className="opacity-60"
                >
                  <path 
                    d="M50 50 Q150 20 250 50" 
                    stroke={colorPalette.accent} 
                    strokeWidth="3" 
                    fill="none"
                  />
                  <circle 
                    cx="250" 
                    cy="50" 
                    r="4" 
                    fill={colorPalette.accent}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};