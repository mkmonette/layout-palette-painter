import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Palette, Camera, Zap } from 'lucide-react';

interface CreativeShowcaseTemplateProps {
  colorPalette: ColorPalette;
}

export const CreativeShowcaseTemplate: React.FC<CreativeShowcaseTemplateProps> = ({ 
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
          <div className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
               style={{
                 backgroundImage: `linear-gradient(45deg, ${colorPalette.brand}, ${colorPalette.accent})`
               }}>
            Creative Studio
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Portfolio', 'Services', 'Process', 'Contact'].map((item) => (
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
            className="hidden md:block px-6 py-2 font-semibold rounded-xl"
            style={{
              backgroundColor: colorPalette['button-primary'],
              color: colorPalette['button-text'],
            }}
          >
            Let's Create
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top, ${colorPalette['section-bg-1']} 0%, ${colorPalette['section-bg-2']} 100%)`,
          color: colorPalette['text-primary']
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full animate-pulse" 
               style={{ backgroundColor: colorPalette.accent }}></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full animate-bounce" 
               style={{ backgroundColor: colorPalette.brand }}></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full animate-pulse" 
               style={{ backgroundColor: colorPalette.highlight }}></div>
          <div className="absolute bottom-40 right-10 w-2 h-2 rounded-full animate-bounce" 
               style={{ backgroundColor: colorPalette.accent }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="text-center space-y-12 max-w-6xl mx-auto">
            
            {/* Creative Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2" 
                 style={{ 
                   borderColor: colorPalette.accent,
                   backgroundColor: colorPalette['section-bg-3'] + '30'
                 }}>
              <Sparkles className="w-5 h-5" style={{ color: colorPalette.accent }} />
              <span className="text-lg font-medium">Creative Excellence Redefined</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black leading-none tracking-tighter">
                <span className="block">CREATE</span>
                <span 
                  className="block bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${colorPalette.brand}, ${colorPalette.accent}, ${colorPalette.highlight})`
                  }}
                >
                  INSPIRE
                </span>
                <span className="block">INNOVATE</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p 
              className="text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto font-light"
              style={{ color: colorPalette['text-secondary'] }}
            >
              Where imagination meets execution. We craft visual experiences that 
              captivate audiences and transform brands into cultural movements.
            </p>

            {/* Hero Image with Creative Layout */}
            <div className="relative mt-16 mb-12">
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* Main Center Image */}
                <div className="md:col-span-2 relative">
                  <div 
                    className="rounded-3xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500"
                    style={{ backgroundColor: colorPalette['section-bg-3'] }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Creative design workspace with tools and inspiration"
                      className="w-full h-[500px] object-cover"
                    />
                    
                    {/* Creative Overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"
                    ></div>
                  </div>

                  {/* Floating Creative Icon */}
                  <div 
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: colorPalette.brand + 'E6' }}
                  >
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Side Images */}
                <div className="space-y-6">
                  <div 
                    className="rounded-2xl overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-500"
                    style={{ backgroundColor: colorPalette['section-bg-3'] }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Creative process in action"
                      className="w-full h-[230px] object-cover"
                    />
                  </div>

                  <div 
                    className="rounded-2xl overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-500"
                    style={{ backgroundColor: colorPalette['section-bg-3'] }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Design inspiration and creativity"
                      className="w-full h-[230px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                size="lg"
                className="px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform"
                style={{
                  backgroundColor: colorPalette['button-primary'],
                  color: colorPalette['button-text'],
                  border: 'none'
                }}
              >
                Start Creating
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-5 text-xl font-bold rounded-2xl border-2 transition-all duration-300 hover:scale-105 transform"
                style={{
                  borderColor: colorPalette.accent,
                  color: colorPalette['text-primary'],
                  backgroundColor: 'transparent'
                }}
              >
                <Camera className="mr-3 w-6 h-6" />
                View Portfolio
              </Button>
            </div>

            {/* Creative Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: colorPalette.brand + '20' }}
                >
                  <Zap className="w-8 h-8" style={{ color: colorPalette.brand }} />
                </div>
                <div className="text-3xl font-black">1000+</div>
                <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                  Projects Created
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: colorPalette.accent + '20' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: colorPalette.accent }} />
                </div>
                <div className="text-3xl font-black">50+</div>
                <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                  Awards Won
                </div>
              </div>

              <div className="text-center space-y-2">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: colorPalette.highlight + '20' }}
                >
                  <Palette className="w-8 h-8" style={{ color: colorPalette.highlight }} />
                </div>
                <div className="text-3xl font-black">200+</div>
                <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                  Happy Clients
                </div>
              </div>

              <div className="text-center space-y-2">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: colorPalette.brand + '20' }}
                >
                  <Camera className="w-8 h-8" style={{ color: colorPalette.brand }} />
                </div>
                <div className="text-3xl font-black">24/7</div>
                <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                  Creative Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};