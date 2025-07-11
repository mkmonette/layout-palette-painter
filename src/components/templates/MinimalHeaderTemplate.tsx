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
        style={{ backgroundColor: colorPalette["text-primary"] }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="text-2xl font-light transition-colors duration-300"
              style={{ color: colorPalette["section-bg-1"] }}
            >
              Minimal
            </div>
            <nav className="hidden md:flex space-x-8">
              {['Work', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  style={{ color: colorPalette["text-secondary"] }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <Button 
            size="sm"
            className="px-6 py-2 text-sm font-medium rounded-full"
            style={{ backgroundColor: colorPalette.accent, color: colorPalette["button-text"] }}
          >
            Hire Me
          </Button>
        </div>
      </header>

      {/* Content Section */}
      <section 
        className="px-6 py-24 transition-colors duration-300"
        style={{ backgroundColor: colorPalette["section-bg-1"] }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-7xl font-light mb-8 leading-tight transition-colors duration-300"
            style={{ color: colorPalette["text-primary"] }}
          >
            Clean Design, 
            <span 
              className="italic transition-colors duration-300"
              style={{ color: colorPalette.brand }}
            >
              Bold Impact
            </span>
          </h1>
          
          <p 
            className="text-lg mb-12 leading-relaxed max-w-2xl mx-auto transition-colors duration-300"
            style={{ color: colorPalette["text-secondary"] }}
          >
            Minimalist design philosophy meets powerful functionality. 
            Every element serves a purpose, every detail matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
            >
              View Portfolio
            </Button>
            <Button 
              size="lg"
              variant="ghost"
              className="px-8 py-3 text-lg font-medium rounded-full transition-all duration-300"
              style={{ color: colorPalette.highlight }}
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinimalHeaderTemplate;