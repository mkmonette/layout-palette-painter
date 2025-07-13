import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, TrendingUp, Users, Globe, Lightbulb, Target } from 'lucide-react';

interface StartupVisionTemplateProps {
  colorPalette: ColorPalette;
}

export const StartupVisionTemplate: React.FC<StartupVisionTemplateProps> = ({ 
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
          <div className="text-xl font-bold flex items-center gap-2" style={{ color: colorPalette.brand }}>
            <Rocket className="w-6 h-6" />
            VisionCorp
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Vision', 'Team', 'Investors', 'Join Us'].map((item) => (
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
            Join Beta
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${colorPalette['section-bg-1']} 0%, ${colorPalette['section-bg-2']} 100%)`,
          color: colorPalette['text-primary']
        }}
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full opacity-10 animate-pulse" 
               style={{ backgroundColor: colorPalette.brand }}></div>
          <div className="absolute bottom-1/4 right-1/6 w-48 h-48 rounded-full opacity-10 animate-pulse" 
               style={{ backgroundColor: colorPalette.accent }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 animate-ping" 
               style={{ backgroundColor: colorPalette.highlight }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
              
              {/* Left Column - Content */}
              <div className="space-y-10">
                
                {/* Startup Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border-2" 
                     style={{ 
                       borderColor: colorPalette.brand,
                       backgroundColor: colorPalette['section-bg-3'] + '40'
                     }}>
                  <Rocket className="w-5 h-5" style={{ color: colorPalette.brand }} />
                  <span className="text-base font-semibold">Disrupting the Future</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight">
                    Build the
                    <br />
                    <span 
                      className="bg-gradient-to-r bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent}, ${colorPalette.highlight})`
                      }}
                    >
                      Impossible
                    </span>
                  </h1>
                </div>

                {/* Dynamic Subheadline */}
                <p 
                  className="text-xl lg:text-2xl leading-relaxed max-w-xl font-medium"
                  style={{ color: colorPalette['text-secondary'] }}
                >
                  From bold ideas to breakthrough solutions. We're not just building a company – 
                  we're crafting the technologies that will shape tomorrow's world.
                </p>

                {/* Vision Metrics */}
                <div className="grid grid-cols-3 gap-6 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: colorPalette.brand }}>
                      $2.5M
                    </div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Funding Raised
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: colorPalette.accent }}>
                      50K+
                    </div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Early Adopters
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: colorPalette.highlight }}>
                      15
                    </div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Team Members
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 pt-6">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform"
                    style={{
                      backgroundColor: colorPalette['button-primary'],
                      color: colorPalette['button-text'],
                      border: 'none'
                    }}
                  >
                    Join the Vision
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-bold rounded-xl border-2 transition-all duration-300 hover:scale-105 transform"
                    style={{
                      borderColor: colorPalette.accent,
                      color: colorPalette['text-primary'],
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Lightbulb className="mr-2 w-5 h-5" />
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Right Column - Vision Showcase */}
              <div className="relative">
                
                {/* Main Image */}
                <div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{ backgroundColor: colorPalette['section-bg-3'] }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Innovative startup team working on breakthrough technology"
                    className="w-full h-[600px] object-cover"
                  />
                  
                  {/* Innovation Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"
                  ></div>
                </div>

                {/* Floating Startup Elements */}
                <div 
                  className="absolute -top-6 -left-6 p-4 rounded-2xl shadow-xl backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: colorPalette.brand + 'E6',
                    borderColor: colorPalette.border
                  }}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                    <div>
                      <div className="font-bold text-sm text-white">Growth</div>
                      <div className="text-xs text-white/80">
                        300% YoY
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -bottom-6 -right-6 p-4 rounded-2xl shadow-xl backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: colorPalette['section-bg-1'] + 'F0',
                    borderColor: colorPalette.border
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" style={{ color: colorPalette.accent }} />
                    <div>
                      <div className="font-bold text-sm">Global Reach</div>
                      <div className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                        50+ Countries
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute top-1/3 -right-12 p-3 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: colorPalette.accent + 'E6' }}
                >
                  <div className="text-center">
                    <Globe className="w-6 h-6 mx-auto mb-1 text-white" />
                    <div className="text-xs text-white">
                      Global Impact
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="pt-20 border-t" style={{ borderColor: colorPalette.border }}>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                
                <div className="text-center space-y-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.brand + '20' }}
                  >
                    <Target className="w-8 h-8" style={{ color: colorPalette.brand }} />
                  </div>
                  <h3 className="text-xl font-bold">Mission Driven</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colorPalette['text-secondary'] }}>
                    Every line of code, every decision, every innovation is guided by our 
                    commitment to solving real-world problems.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.accent + '20' }}
                  >
                    <Lightbulb className="w-8 h-8" style={{ color: colorPalette.accent }} />
                  </div>
                  <h3 className="text-xl font-bold">Innovation First</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colorPalette['text-secondary'] }}>
                    We don't just follow trends – we create them. Our breakthrough 
                    technologies set new industry standards.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.highlight + '20' }}
                  >
                    <Users className="w-8 h-8" style={{ color: colorPalette.highlight }} />
                  </div>
                  <h3 className="text-xl font-bold">People Powered</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colorPalette['text-secondary'] }}>
                    Our diverse team of visionaries, engineers, and dreamers work 
                    together to turn impossible ideas into reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};