import React from 'react';
import { ColorPalette } from '@/utils/colorGenerator';
import { CustomTemplate } from '@/types/template';

interface CustomFigmaTemplateProps {
  colorPalette: ColorPalette;
  customTemplate: CustomTemplate;
}

const CustomFigmaTemplate: React.FC<CustomFigmaTemplateProps> = ({ 
  colorPalette, 
  customTemplate 
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-section-bg-1 to-section-bg-2">
      {/* Header Section */}
      <header className="border-b border-border/20 bg-section-bg-1/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: colorPalette.brand }}
              >
                F
              </div>
              <span className="font-semibold text-text-primary">{customTemplate.name}</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Home</a>
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">About</a>
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Services</a>
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a>
            </nav>
            
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: colorPalette['button-primary'], 
                color: colorPalette['button-text'] 
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                   style={{ 
                     borderColor: colorPalette.highlight + '40',
                     backgroundColor: colorPalette.highlight + '10',
                     color: colorPalette.highlight 
                   }}>
                ✨ Custom Figma Design
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-text-primary">Your Design</span>
                <br />
                <span style={{ color: colorPalette.brand }}>Brought to Life</span>
              </h1>
              
              <p className="text-lg text-text-secondary leading-relaxed max-w-md">
                This is your imported Figma design rendered with dynamic color generation. 
                Your creativity enhanced by intelligent color palettes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  style={{ 
                    backgroundColor: colorPalette['button-primary'], 
                    color: colorPalette['button-text'] 
                  }}
                >
                  Explore Design
                </button>
                <button 
                  className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-md"
                  style={{ 
                    borderColor: colorPalette['button-secondary'], 
                    backgroundColor: colorPalette['button-secondary'],
                    color: colorPalette['button-secondary-text']
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={customTemplate.thumbnail || customTemplate.preview}
                  alt={customTemplate.name}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent"></div>
              </div>
              
              {/* Floating Elements */}
              <div 
                className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl flex items-center justify-center backdrop-blur-sm border"
                style={{ 
                  backgroundColor: colorPalette.accent + '20',
                  borderColor: colorPalette.accent + '30'
                }}
              >
                <span className="text-2xl">🎨</span>
              </div>
              
              <div 
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl backdrop-blur-sm border"
                style={{ 
                  backgroundColor: colorPalette.highlight + '10',
                  borderColor: colorPalette.highlight + '30'
                }}
              >
                <span className="text-sm font-medium" style={{ color: colorPalette.highlight }}>
                  v{customTemplate.version}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-section-bg-2/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Figma Integration Features</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Experience the power of your Figma designs enhanced with intelligent color generation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Design Fidelity",
                description: "Your Figma layouts preserved with dynamic color application"
              },
              {
                icon: "🌈",
                title: "Smart Colors",
                description: "AI-powered color generation that respects your design hierarchy"
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                description: "Instant color updates across your entire design system"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: colorPalette.accent + '20' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/20 bg-section-bg-1/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: colorPalette.brand }}
              >
                F
              </div>
              <span className="text-text-secondary text-sm">
                Imported from Figma • {new Date(customTemplate.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-text-secondary text-sm">
              Custom Template • Version {customTemplate.version}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomFigmaTemplate;