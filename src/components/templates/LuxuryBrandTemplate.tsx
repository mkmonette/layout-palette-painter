import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Crown, Star, Gem, Award } from 'lucide-react';

interface LuxuryBrandTemplateProps {
  colorPalette: ColorPalette;
}

export const LuxuryBrandTemplate: React.FC<LuxuryBrandTemplateProps> = ({ 
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
          <div className="text-xl font-light tracking-widest flex items-center gap-2" style={{ color: colorPalette.brand }}>
            <Crown className="w-6 h-6" />
            LUXE
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Collections', 'Heritage', 'Atelier', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="hover:opacity-80 transition-opacity font-light tracking-wide uppercase"
                style={{ color: colorPalette["text-primary"] }}
              >
                {item}
              </a>
            ))}
          </nav>
          <Button
            size="sm"
            className="hidden md:block px-6 py-2 font-light tracking-wider uppercase rounded-none"
            style={{
              backgroundColor: colorPalette['button-primary'],
              color: colorPalette['button-text'],
            }}
          >
            Private Access
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${colorPalette['section-bg-1']} 0%, ${colorPalette['section-bg-2']} 100%)`,
          color: colorPalette['text-primary']
        }}
      >
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${colorPalette.accent} 2px, transparent 2px), radial-gradient(circle at 80% 50%, ${colorPalette.brand} 1px, transparent 1px)`,
              backgroundSize: '120px 120px, 80px 80px'
            }}
          >
          </div>
        </div>

        {/* Luxury Accents */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full border opacity-20" 
             style={{ borderColor: colorPalette.accent }}></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full border opacity-10" 
             style={{ borderColor: colorPalette.brand }}></div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center space-y-8 mb-20">
              
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2" 
                   style={{ 
                     borderColor: colorPalette.accent,
                     backgroundColor: colorPalette['section-bg-3'] + '30'
                   }}>
                <Crown className="w-5 h-5" style={{ color: colorPalette.accent }} />
                <span className="text-lg font-light tracking-widest uppercase">Est. 1985</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light leading-none tracking-wider">
                  LUXURY
                  <br />
                  <span 
                    className="font-thin bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent})`
                    }}
                  >
                    REDEFINED
                  </span>
                </h1>
              </div>

              {/* Elegant Subheadline */}
              <p 
                className="text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide"
                style={{ color: colorPalette['text-secondary'] }}
              >
                Experience the pinnacle of sophistication with our meticulously crafted collection. 
                Where timeless elegance meets contemporary excellence.
              </p>
            </div>

            {/* Hero Image Section */}
            <div className="grid lg:grid-cols-5 gap-8 items-center mb-16">
              
              {/* Left Side - Elegant Stats */}
              <div className="lg:col-span-1 space-y-8">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-4"
                    style={{ borderColor: colorPalette.accent }}
                  >
                    <Star className="w-8 h-8" style={{ color: colorPalette.accent }} />
                  </div>
                  <div className="text-3xl font-light">38</div>
                  <div className="text-sm tracking-wide uppercase" style={{ color: colorPalette['text-secondary'] }}>
                    Years Heritage
                  </div>
                </div>

                <div className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-4"
                    style={{ borderColor: colorPalette.brand }}
                  >
                    <Award className="w-8 h-8" style={{ color: colorPalette.brand }} />
                  </div>
                  <div className="text-3xl font-light">127</div>
                  <div className="text-sm tracking-wide uppercase" style={{ color: colorPalette['text-secondary'] }}>
                    Global Awards
                  </div>
                </div>
              </div>

              {/* Center - Main Hero Image */}
              <div className="lg:col-span-3 relative">
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{ backgroundColor: colorPalette['section-bg-3'] }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury product showcase in elegant setting"
                    className="w-full h-[600px] object-cover"
                  />
                  
                  {/* Luxury Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"
                  ></div>

                  {/* Floating Luxury Element */}
                  <div 
                    className="absolute top-6 right-6 p-4 rounded-xl backdrop-blur-sm border"
                    style={{ 
                      backgroundColor: colorPalette['section-bg-1'] + 'E6',
                      borderColor: colorPalette.border
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Gem className="w-5 h-5" style={{ color: colorPalette.accent }} />
                      <span className="text-sm font-light">Limited Edition</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Testimonial */}
              <div className="lg:col-span-1 space-y-6">
                <div 
                  className="p-6 rounded-xl border"
                  style={{ 
                    backgroundColor: colorPalette['section-bg-3'] + '50',
                    borderColor: colorPalette.border
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 fill-current" 
                          style={{ color: colorPalette.accent }} 
                        />
                      ))}
                    </div>
                    <p className="text-sm font-light leading-relaxed text-center">
                      "Unparalleled craftsmanship and attention to detail. 
                      Every piece tells a story of excellence."
                    </p>
                    <div className="text-center">
                      <div className="text-sm font-light">Helena Morrison</div>
                      <div className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                        Luxury Connoisseur
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="px-12 py-5 text-lg font-light tracking-wider uppercase rounded-none shadow-xl hover:shadow-2xl transition-all duration-500"
                  style={{
                    backgroundColor: colorPalette['button-primary'],
                    color: colorPalette['button-text'],
                    border: 'none'
                  }}
                >
                  Explore Collection
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-12 py-5 text-lg font-light tracking-wider uppercase rounded-none border-2 transition-all duration-500"
                  style={{
                    borderColor: colorPalette.accent,
                    color: colorPalette['text-primary'],
                    backgroundColor: 'transparent'
                  }}
                >
                  Private Viewing
                </Button>
              </div>

              {/* Luxury Credentials */}
              <div className="flex justify-center gap-16 pt-12 border-t" style={{ borderColor: colorPalette.border }}>
                <div className="text-center">
                  <div className="text-2xl font-light">Handcrafted</div>
                  <div className="text-sm tracking-wide" style={{ color: colorPalette['text-secondary'] }}>
                    Excellence
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light">Lifetime</div>
                  <div className="text-sm tracking-wide" style={{ color: colorPalette['text-secondary'] }}>
                    Warranty
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light">Exclusive</div>
                  <div className="text-sm tracking-wide" style={{ color: colorPalette['text-secondary'] }}>
                    Members
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