import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Star } from 'lucide-react';

interface GradientHeroTemplateProps {
  colorPalette: ColorPalette;
}

const GradientHeroTemplate: React.FC<GradientHeroTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full relative overflow-hidden min-h-screen">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          background: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.highlight}, ${colorPalette.accent})`
        }}
      />
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: colorPalette.accent }} />
      <div className="absolute bottom-32 left-16 w-8 h-8 rounded-full opacity-30" style={{ backgroundColor: colorPalette.highlight }} />
      <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full opacity-15" style={{ backgroundColor: colorPalette.brand }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-6" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8" style={{ color: colorPalette.brand }} />
            <span className="text-2xl font-bold" style={{ color: colorPalette["text-primary"] }}>Nexus</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <Button 
            variant="outline" 
            className="px-6 py-2 rounded-full border-2"
            style={{ borderColor: colorPalette.accent, color: colorPalette.accent, backgroundColor: colorPalette["section-bg-1"] }}
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-4xl mx-auto">
          {/* Rating */}
          <div className="flex items-center justify-center space-x-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" style={{ color: colorPalette.accent }} />
            ))}
            <span className="ml-3 text-sm font-medium" style={{ color: colorPalette["text-secondary"] }}>
              4.9/5 from 10,000+ users
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
            <span style={{ color: colorPalette["text-primary"] }}>The Future</span>
            <br />
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(45deg, ${colorPalette.brand}, ${colorPalette.highlight})`
              }}
            >
              is Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto" style={{ color: colorPalette["text-secondary"] }}>
            Revolutionary technology that transforms the way you work, live, and innovate. 
            Join millions who've already embraced the future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="px-10 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
              style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg"
              variant="ghost"
              className="px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center space-x-2"
              style={{ color: colorPalette["text-primary"] }}
            >
              <span>Watch Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GradientHeroTemplate;