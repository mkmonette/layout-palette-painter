
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Star, Truck, Shield, Gift, Heart } from 'lucide-react';

interface EcommerceLandingTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceLandingTemplate: React.FC<EcommerceLandingTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: colorPalette.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colorPalette.brand }}>
              <ShoppingBag className="w-6 h-6" style={{ color: colorPalette["button-text"] }} />
            </div>
            <span className="text-2xl font-bold" style={{ color: colorPalette["text-primary"] }}>
              StyleHub
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            {['Shop', 'Collections', 'Sale', 'About'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" style={{ color: colorPalette["text-secondary"] }} />
            <div className="relative">
              <ShoppingBag className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" style={{ color: colorPalette["text-primary"] }} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: colorPalette.accent, color: colorPalette["button-text"] }}>
                2
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: colorPalette.accent }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: colorPalette["text-secondary"] }}>
                  4.9/5 from 2,000+ reviews
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span style={{ color: colorPalette["text-primary"] }}>Discover your</span>
                <br />
                <span style={{ color: colorPalette.brand }}>perfect style</span>
              </h1>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: colorPalette["text-secondary"] }}>
                Curated fashion for the modern lifestyle. Premium quality, sustainable materials, 
                and timeless designs that make you look and feel amazing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
                >
                  Shop New Collection
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold rounded-full border-2"
                  style={{ borderColor: colorPalette["button-secondary-text"], color: colorPalette["button-secondary-text"] }}
                >
                  View Lookbook
                </Button>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: Shield, text: '30-Day Returns' },
                  { icon: Gift, text: 'Gift Wrapping' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: colorPalette.accent + '20' }}>
                      <feature.icon className="w-5 h-5" style={{ color: colorPalette.accent }} />
                    </div>
                    <span className="font-medium" style={{ color: colorPalette["text-primary"] }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colorPalette.brand + '20' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16" style={{ color: colorPalette.brand }} />
                    </div>
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colorPalette.accent + '20' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12" style={{ color: colorPalette.accent }} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colorPalette.highlight + '20' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="w-12 h-12" style={{ color: colorPalette.highlight }} />
                    </div>
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colorPalette.brand + '30' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-16 h-16" style={{ color: colorPalette.brand }} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sale badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ backgroundColor: colorPalette.accent }}>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: colorPalette["button-text"] }}>SALE</div>
                  <div className="text-xs font-semibold" style={{ color: colorPalette["button-text"] }}>30% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceLandingTemplate;
