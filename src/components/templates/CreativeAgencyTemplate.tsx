
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Eye, ArrowUpRight } from 'lucide-react';

interface CreativeAgencyTemplateProps {
  colorPalette: ColorPalette;
}

const CreativeAgencyTemplate: React.FC<CreativeAgencyTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: colorPalette.brand }} />
        <div className="absolute bottom-20 right-10 w-24 h-24 rotate-45 opacity-15" style={{ backgroundColor: colorPalette.highlight }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full opacity-25" style={{ backgroundColor: colorPalette.accent }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Palette className="w-8 h-8" style={{ color: colorPalette.brand }} />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1" style={{ color: colorPalette.accent }} />
            </div>
            <span className="text-3xl font-black tracking-tight" style={{ color: colorPalette["text-primary"] }}>
              CREA<span style={{ color: colorPalette.brand }}>TIVE</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <Button className="font-bold uppercase tracking-wider rounded-full px-6" style={{ backgroundColor: colorPalette.accent, color: colorPalette["button-text"] }}>
            Let's Talk
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-3 mb-8">
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: colorPalette.brand }} />
                <span className="font-bold uppercase tracking-widest text-sm" style={{ color: colorPalette["text-secondary"] }}>
                  Award Winning Agency
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
                <span style={{ color: colorPalette["text-primary"] }}>WE</span>
                <br />
                <span style={{ color: colorPalette.brand }}>CREATE</span>
                <br />
                <span className="italic" style={{ color: colorPalette.highlight }}>magic</span>
              </h1>
              
              <p className="text-xl mb-10 leading-relaxed font-medium" style={{ color: colorPalette["text-secondary"] }}>
                Bold ideas. Stunning visuals. Unforgettable brands. 
                We turn your vision into reality through creative excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg"
                  className="px-8 py-4 text-lg font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
                >
                  <span>View Portfolio</span>
                  <Eye className="w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-bold uppercase tracking-wider rounded-full border-3 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  style={{ borderColor: colorPalette.highlight, color: colorPalette.highlight, borderWidth: '3px' }}
                >
                  <span>Start Project</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="h-40 rounded-3xl transform rotate-3 hover:rotate-6 transition-transform duration-300" style={{ backgroundColor: colorPalette.brand }} />
                  <div className="h-32 rounded-3xl transform -rotate-2 hover:rotate-1 transition-transform duration-300" style={{ backgroundColor: colorPalette.accent }} />
                </div>
                <div className="space-y-6 mt-8">
                  <div className="h-32 rounded-3xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300" style={{ backgroundColor: colorPalette.highlight }} />
                  <div className="h-40 rounded-3xl transform rotate-2 hover:-rotate-1 transition-transform duration-300" style={{ backgroundColor: colorPalette.brand + '80' }} />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full animate-bounce" style={{ backgroundColor: colorPalette.accent }} />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rotate-45 animate-pulse" style={{ backgroundColor: colorPalette.highlight }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreativeAgencyTemplate;
