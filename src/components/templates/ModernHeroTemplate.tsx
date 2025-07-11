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
        style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: colorPalette.border }}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: colorPalette.brand }}>
            Your Brand
          </div>
          <nav className="hidden md:flex space-x-6">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="hover:opacity-80 transition-opacity"
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
        className="px-6 py-20 transition-colors duration-300"
        style={{ backgroundColor: colorPalette["section-bg-1"] }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight transition-colors duration-300"
                style={{ color: colorPalette["text-primary"] }}
              >
                Modern Solutions for 
                <span 
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(45deg, ${colorPalette.brand}, ${colorPalette.accent})` }}
                >
                  Tomorrow's Challenges
                </span>
              </h1>
              
              <p 
                className="text-xl mb-8 leading-relaxed transition-colors duration-300"
                style={{ color: colorPalette["text-secondary"] }}
              >
                Innovative technology and design come together to create 
                exceptional experiences that drive real results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold rounded-lg border-2"
                  style={{ borderColor: colorPalette["button-secondary-text"], color: colorPalette["button-secondary-text"] }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="w-full h-96 rounded-2xl transition-colors duration-300 flex items-center justify-center"
                style={{ backgroundColor: colorPalette.accent + '20' }}
              >
                <div 
                  className="w-48 h-48 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: colorPalette.brand }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHeroTemplate;