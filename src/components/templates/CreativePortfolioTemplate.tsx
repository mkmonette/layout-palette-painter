
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';

interface CreativePortfolioTemplateProps {
  colorPalette: ColorPalette;
}

const CreativePortfolioTemplate: React.FC<CreativePortfolioTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Creative Header */}
      <header 
        className="px-6 py-6 relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: colorPalette["section-bg-1"] }}
      >
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-10 transition-colors duration-300"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full transition-colors duration-300"
              style={{ backgroundColor: colorPalette.brand }}
            />
            <div 
              className="text-xl font-semibold italic transition-colors duration-300"
              style={{ color: colorPalette["text-primary"] }}
            >
              Creative Studio
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Portfolio', 'Services', 'About', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="relative hover:opacity-70 transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-current before:scale-x-0 hover:before:scale-x-100 before:transition-transform"
                style={{ color: colorPalette["text-primary"] }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="px-6 py-16 relative transition-colors duration-300"
        style={{ backgroundColor: colorPalette["section-bg-1"] }}
      >
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 opacity-20 transition-colors duration-300"
          style={{ backgroundColor: colorPalette.highlight }}
        />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors duration-300"
              style={{ color: colorPalette["text-primary"] }}
            >
              Bringing ideas to 
              <span 
                className="block italic transition-colors duration-300"
                style={{ color: colorPalette.brand }}
              >
                visual life
              </span>
            </h1>
            <p 
              className="text-lg mb-8 leading-relaxed transition-colors duration-300"
              style={{ color: colorPalette["text-secondary"] }}
            >
              We craft unique digital experiences through thoughtful design, 
              innovative thinking, and artistic vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: colorPalette["button-primary"],
                  color: colorPalette["button-text"],
                  border: 'none'
                }}
              >
                View Our Work
              </Button>
              <Button 
                variant="ghost"
                className="px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{ color: colorPalette["button-secondary-text"] }}
              >
                Get In Touch →
              </Button>
            </div>
          </div>
          <div className="relative">
            <div 
              className="w-full h-64 rounded-2xl transition-colors duration-300 flex items-center justify-center"
              style={{ backgroundColor: colorPalette.brand + '20' }}
            >
              <div 
                className="w-32 h-32 rounded-full transition-colors duration-300"
                style={{ backgroundColor: colorPalette.highlight }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreativePortfolioTemplate;
