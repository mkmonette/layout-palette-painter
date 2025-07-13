import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Zap, Shield, Code, Database, Cloud } from 'lucide-react';

interface TechInnovationTemplateProps {
  colorPalette: ColorPalette;
}

export const TechInnovationTemplate: React.FC<TechInnovationTemplateProps> = ({ 
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
            <Cpu className="w-6 h-6" />
            TechCore
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Solutions', 'Technology', 'API', 'Docs'].map((item) => (
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
            Get API Key
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorPalette['section-bg-1']} 0%, ${colorPalette['section-bg-2']} 50%, ${colorPalette['section-bg-3']} 100%)`,
          color: colorPalette['text-primary']
        }}
      >
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(${colorPalette.accent}40 1px, transparent 1px), linear-gradient(90deg, ${colorPalette.accent}40 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 animate-ping" 
               style={{ backgroundColor: colorPalette.accent }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 animate-pulse" 
               style={{ backgroundColor: colorPalette.brand }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 animate-ping" 
               style={{ backgroundColor: colorPalette.highlight }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
            
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Tech Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border" 
                   style={{ 
                     borderColor: colorPalette.accent,
                     backgroundColor: colorPalette['section-bg-3'] + '50'
                   }}>
                <Cpu className="w-5 h-5" style={{ color: colorPalette.accent }} />
                <span className="text-base font-semibold tracking-wide">Next-Gen Technology</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight">
                  The Future
                  <br />
                  <span 
                    className="bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent})`
                    }}
                  >
                    is Code
                  </span>
                </h1>
              </div>

              {/* Subheadline */}
              <p 
                className="text-xl lg:text-2xl leading-relaxed max-w-2xl font-medium"
                style={{ color: colorPalette['text-secondary'] }}
              >
                Revolutionary AI-powered solutions that automate complex workflows, 
                enhance productivity, and transform how businesses operate in the digital age.
              </p>

              {/* Tech Features */}
              <div className="grid md:grid-cols-3 gap-6 py-8">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.brand + '20' }}
                  >
                    <Shield className="w-5 h-5" style={{ color: colorPalette.brand }} />
                  </div>
                  <div>
                    <div className="font-semibold">Secure</div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Bank-level encryption
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.accent + '20' }}
                  >
                    <Zap className="w-5 h-5" style={{ color: colorPalette.accent }} />
                  </div>
                  <div>
                    <div className="font-semibold">Lightning Fast</div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Microsecond response
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.highlight + '20' }}
                  >
                    <Cloud className="w-5 h-5" style={{ color: colorPalette.highlight }} />
                  </div>
                  <div>
                    <div className="font-semibold">Scalable</div>
                    <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                      Global infrastructure
                    </div>
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
                  Start Building
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
                  <Code className="mr-2 w-5 h-5" />
                  View Docs
                </Button>
              </div>
            </div>

            {/* Right Column - Hero Visualization */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Main Tech Visualization */}
                <div 
                  className="rounded-3xl overflow-hidden shadow-2xl border"
                  style={{ 
                    backgroundColor: colorPalette['section-bg-3'],
                    borderColor: colorPalette.border
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Advanced technology and AI visualization"
                    className="w-full h-[600px] object-cover"
                  />
                  
                  {/* Tech Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  ></div>
                </div>

                {/* Floating Tech Cards */}
                <div 
                  className="absolute -top-8 -left-8 p-4 rounded-2xl shadow-xl backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: colorPalette['section-bg-1'] + 'F0',
                    borderColor: colorPalette.border
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6" style={{ color: colorPalette.brand }} />
                    <div>
                      <div className="font-bold text-sm">Real-time</div>
                      <div className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                        Data Processing
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -bottom-8 -right-8 p-4 rounded-2xl shadow-xl backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: colorPalette.accent + 'F0',
                    borderColor: colorPalette.border
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-white" />
                    <div>
                      <div className="font-bold text-sm text-white">AI Powered</div>
                      <div className="text-xs text-white/80">
                        Machine Learning
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div 
                  className="absolute top-1/2 -left-12 transform -translate-y-1/2 p-3 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: colorPalette['section-bg-3'] + 'E6' }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: colorPalette.brand }}>
                      99.9%
                    </div>
                    <div className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                      Uptime
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute top-20 -right-12 p-3 rounded-xl shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: colorPalette.highlight + 'E6' }}
                >
                  <div className="text-center">
                    <div className="text-lg font-black text-white">
                      &lt;10ms
                    </div>
                    <div className="text-xs text-white/80">
                      Latency
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tech Indicators */}
          <div className="flex justify-center gap-12 pt-16 border-t" style={{ borderColor: colorPalette.border }}>
            <div className="text-center">
              <div className="text-3xl font-black">10M+</div>
              <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                API Calls Daily
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">150+</div>
              <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                Countries Served
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">5000+</div>
              <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                Enterprise Clients
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};