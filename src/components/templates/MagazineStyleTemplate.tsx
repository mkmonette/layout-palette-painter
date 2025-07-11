
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Calendar, User, BookOpen } from 'lucide-react';

interface MagazineStyleTemplateProps {
  colorPalette: ColorPalette;
}

const MagazineStyleTemplate: React.FC<MagazineStyleTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 py-6 border-b-2" style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: colorPalette["text-primary"] }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-serif font-bold tracking-tight" style={{ color: colorPalette["text-primary"] }}>
              EDITORIAL
            </div>
            <div className="text-sm font-light" style={{ color: colorPalette["text-secondary"] }}>
              Design Magazine
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Latest', 'Design', 'Typography', 'Inspiration', 'About'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-sm uppercase tracking-wider font-medium hover:opacity-70 transition-opacity"
                style={{ color: colorPalette["text-primary"] }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Article */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span 
                  className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded"
                  style={{ backgroundColor: colorPalette.brand, color: colorPalette["button-text"] }}
                >
                  Featured
                </span>
                <div className="flex items-center space-x-2 text-sm" style={{ color: colorPalette["text-secondary"] }}>
                  <Calendar className="w-4 h-4" />
                  <span>March 15, 2024</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight" style={{ color: colorPalette["text-primary"] }}>
                The Art of
                <span className="block italic" style={{ color: colorPalette.brand }}>
                  Digital Typography
                </span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed font-light" style={{ color: colorPalette["text-secondary"] }}>
                Exploring the intersection of traditional typographic principles and modern digital design. 
                How letterforms shape our digital experiences.
              </p>
              <div className="flex items-center space-x-6">
                <Button 
                  className="px-8 py-3 font-medium uppercase tracking-wider"
                  style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
                >
                  Read Article
                </Button>
                <div className="flex items-center space-x-2" style={{ color: colorPalette["text-secondary"] }}>
                  <User className="w-4 h-4" />
                  <span className="text-sm">By Sarah Chen</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div 
                className="w-full h-80 rounded-lg shadow-lg flex items-center justify-center"
                style={{ backgroundColor: colorPalette.accent + '20' }}
              >
                <BookOpen className="w-24 h-24" style={{ color: colorPalette.accent }} />
              </div>
              <div 
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-lg shadow-lg flex items-center justify-center"
                style={{ backgroundColor: colorPalette.brand }}
              >
                <span className="text-2xl font-bold" style={{ color: colorPalette["button-text"] }}>Aa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MagazineStyleTemplate;
