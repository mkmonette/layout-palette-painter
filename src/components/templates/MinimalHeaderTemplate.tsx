
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';

interface MinimalHeaderTemplateProps {
  colorPalette: ColorPalette;
}

const MinimalHeaderTemplate: React.FC<MinimalHeaderTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Minimal Header */}
      <header 
        className="px-6 py-6 transition-colors duration-300"
        style={{ backgroundColor: colorPalette.text }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="text-2xl font-light transition-colors duration-300"
              style={{ color: colorPalette.background }}
            >
              Minimal
            </div>
            <nav className="hidden md:flex space-x-8">
              {['Work', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  style={{ color: colorPalette.textLight }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <Button 
            size="sm"
            className="transition-all duration-300"
            style={{ 
              backgroundColor: colorPalette.accent,
              color: colorPalette.text,
              border: 'none'
            }}
          >
            Hire Me
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <section 
        className="px-6 py-16 transition-colors duration-300"
        style={{ backgroundColor: colorPalette.background }}
      >
        <div className="max-w-3xl">
          <h1 
            className="text-3xl md:text-5xl font-light mb-6 leading-tight transition-colors duration-300"
            style={{ color: colorPalette.text }}
          >
            Clean design speaks 
            <span style={{ color: colorPalette.primary }}> louder</span> than words
          </h1>
          <p 
            className="text-lg mb-8 max-w-xl transition-colors duration-300"
            style={{ color: colorPalette.textLight }}
          >
            Minimalist approach to web design. Less clutter, more focus on what truly matters.
          </p>
          <div className="flex items-center space-x-6">
            <Button 
              variant="outline"
              className="transition-all duration-300"
              style={{ 
                borderColor: colorPalette.primary,
                color: colorPalette.primary,
                backgroundColor: 'transparent'
              }}
            >
              View Portfolio
            </Button>
            <a 
              href="#" 
              className="text-sm uppercase tracking-wider underline hover:no-underline transition-all duration-300"
              style={{ color: colorPalette.secondary }}
            >
              Read More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinimalHeaderTemplate;
