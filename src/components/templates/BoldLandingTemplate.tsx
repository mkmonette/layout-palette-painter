
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';

interface BoldLandingTemplateProps {
  colorPalette: ColorPalette;
}

const BoldLandingTemplate: React.FC<BoldLandingTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Bold Header */}
      <header 
        className="px-6 py-4 transition-colors duration-300"
        style={{ backgroundColor: colorPalette.primary }}
      >
        <div className="flex items-center justify-between">
          <div 
            className="text-2xl font-black uppercase transition-colors duration-300"
            style={{ color: colorPalette.background }}
          >
            BOLD
          </div>
          <nav className="hidden md:flex space-x-6">
            {['HOME', 'FEATURES', 'PRICING', 'CONTACT'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="font-bold text-sm hover:opacity-80 transition-opacity"
                style={{ color: colorPalette.background }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="px-6 py-20 transition-colors duration-300"
        style={{ backgroundColor: colorPalette.background }}
      >
        <div className="text-center">
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 transition-colors duration-300"
            style={{ 
              backgroundColor: colorPalette.accent,
              color: colorPalette.background
            }}
          >
            🚀 LAUNCHING SOON
          </div>
          <h1 
            className="text-5xl md:text-7xl font-black mb-6 leading-tight transition-colors duration-300"
            style={{ color: colorPalette.text }}
          >
            MAKE IT
            <br />
            <span style={{ color: colorPalette.secondary }}>HAPPEN</span>
          </h1>
          <p 
            className="text-xl font-medium mb-10 max-w-2xl mx-auto transition-colors duration-300"
            style={{ color: colorPalette.textLight }}
          >
            Don't wait for the perfect moment. Take action now and build something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="px-12 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: colorPalette.secondary,
                color: colorPalette.background,
                border: 'none'
              }}
            >
              Start Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-12 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: colorPalette.accent,
                borderWidth: '3px',
                color: colorPalette.accent,
                backgroundColor: 'transparent'
              }}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoldLandingTemplate;
