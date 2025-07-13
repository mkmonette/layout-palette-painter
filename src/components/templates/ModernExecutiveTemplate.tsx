import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Award, TrendingUp } from 'lucide-react';

interface ModernExecutiveTemplateProps {
  colorPalette: ColorPalette;
}

export const ModernExecutiveTemplate: React.FC<ModernExecutiveTemplateProps> = ({ 
  colorPalette 
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header 
        className="px-6 py-4 border-b"
        style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: colorPalette.border }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: colorPalette.brand }}>
            Executive Solutions
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Services', 'Expertise', 'Results', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="hover:opacity-80 transition-opacity font-medium"
                style={{ color: colorPalette["text-primary"] }}
              >
                {item}
              </a>
            ))}
          </nav>
          <Button
            size="sm"
            className="hidden md:block px-6 py-2 font-semibold rounded-lg"
            style={{
              backgroundColor: colorPalette['button-primary'],
              color: colorPalette['button-text'],
            }}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorPalette['section-bg-1']} 0%, ${colorPalette['section-bg-2']} 100%)`,
          color: colorPalette['text-primary']
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" 
                   style={{ 
                     borderColor: colorPalette.border,
                     backgroundColor: colorPalette['section-bg-3'] + '40'
                   }}>
                <Award className="w-4 h-4" style={{ color: colorPalette.accent }} />
                <span className="text-sm font-medium">Industry Leader Since 2010</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Transform Your
                  <span 
                    className="block bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent})`
                    }}
                  >
                    Business
                  </span>
                  Excellence
                </h1>
              </div>

              {/* Subheadline */}
              <p 
                className="text-xl lg:text-2xl leading-relaxed max-w-xl font-light"
                style={{ color: colorPalette['text-secondary'] }}
              >
                Strategic consulting and innovative solutions that drive sustainable growth 
                and competitive advantage in today's dynamic marketplace.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: colorPalette['button-primary'],
                    color: colorPalette['button-text'],
                    border: 'none'
                  }}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: colorPalette.border,
                    color: colorPalette['text-primary'],
                    backgroundColor: 'transparent'
                  }}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t" style={{ borderColor: colorPalette.border }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.accent + '20' }}
                  >
                    <Users className="w-6 h-6" style={{ color: colorPalette.accent }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Clients Served
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.brand + '20' }}
                  >
                    <TrendingUp className="w-6 h-6" style={{ color: colorPalette.brand }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <div 
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{ backgroundColor: colorPalette['section-bg-3'] }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Modern business team in executive meeting"
                    className="w-full h-[600px] object-cover"
                  />
                  
                  {/* Image Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  ></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div 
                className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: colorPalette['section-bg-3'] + 'E6' }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: colorPalette.brand }}>
                    15+
                  </div>
                  <div className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                    Years
                  </div>
                </div>
              </div>

              <div 
                className="absolute -bottom-6 -left-6 w-32 h-20 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: colorPalette.accent + 'E6' }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    Award Winner
                  </div>
                  <div className="text-xs text-white/80">
                    2023 Excellence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};