
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';

interface ModernHeroTemplateProps {
  colorPalette: ColorPalette;
}

const ModernHeroTemplate: React.FC<ModernHeroTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header 
        className="px-6 py-4 border-b transition-colors duration-300"
        style={{ backgroundColor: colorPalette.background, borderColor: colorPalette.textLight + '30' }}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: colorPalette.primary }}>
            Your Brand
          </div>
          <nav className="hidden md:flex space-x-6">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="hover:opacity-80 transition-opacity"
                style={{ color: colorPalette.text }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="px-6 py-20 text-center transition-colors duration-300"
        style={{ backgroundColor: colorPalette.background }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300"
            style={{ color: colorPalette.text }}
          >
            Build Something
            <span className="block" style={{ color: colorPalette.primary }}>
              Amazing Today
            </span>
          </h1>
          <p 
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto transition-colors duration-300"
            style={{ color: colorPalette.textLight }}
          >
            Create stunning websites with our modern tools and beautiful color palettes. 
            Perfect for designers and developers who want to move fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: colorPalette.primary, 
                color: colorPalette.background,
                border: 'none'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: colorPalette.secondary,
                color: colorPalette.secondary,
                backgroundColor: 'transparent'
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHeroTemplate;
