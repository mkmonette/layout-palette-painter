
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Play, Star, Zap } from 'lucide-react';

interface GradientHeroTemplateProps {
  colorPalette: ColorPalette;
}

const GradientHeroTemplate: React.FC<GradientHeroTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Background with gradient */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          background: `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.secondary}, ${colorPalette.accent})`
        }}
      />
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: colorPalette.accent }} />
      <div className="absolute bottom-32 left-16 w-8 h-8 rounded-full opacity-30" style={{ backgroundColor: colorPalette.secondary }} />
      <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full opacity-15" style={{ backgroundColor: colorPalette.primary }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-6" style={{ backgroundColor: colorPalette.background }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8" style={{ color: colorPalette.primary }} />
            <span className="text-2xl font-bold" style={{ color: colorPalette.text }}>Nexus</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette.text }}>
                {item}
              </a>
            ))}
          </nav>
          <Button size="sm" style={{ backgroundColor: colorPalette.accent, color: colorPalette.background }}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center" style={{ backgroundColor: colorPalette.background }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: colorPalette.accent }} />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium" style={{ color: colorPalette.textLight }}>
              Rated 4.9/5 by 10,000+ users
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span style={{ color: colorPalette.text }}>The future is</span>
            <br />
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`
              }}
            >
              beautiful
            </span>
          </h1>
          
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: colorPalette.textLight }}>
            Experience the next generation of design tools. Create, collaborate, and ship faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: colorPalette.primary, color: colorPalette.background }}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="ghost"
              className="px-8 py-4 text-lg font-medium rounded-full hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              style={{ color: colorPalette.text }}
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GradientHeroTemplate;
