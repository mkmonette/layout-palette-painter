import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import EcommerceFooter from './EcommerceFooter';

interface EcommerceMinimalStoreTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceMinimalStoreTemplate: React.FC<EcommerceMinimalStoreTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
      {/* Minimal Header */}
      <header className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-light tracking-wide" style={{ color: colorPalette.brand }}>
            MINIMAL
          </h1>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }}>Shop</a>
            <a href="#" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }}>About</a>
            <a href="#" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }}>Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }} />
            <User className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }} />
            <ShoppingBag className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colorPalette['text-primary'] }} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-light leading-tight" style={{ color: colorPalette['text-primary'] }}>
                Curated for
                <br />
                <span style={{ color: colorPalette.brand }}>Modern Living</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: colorPalette['text-secondary'] }}>
                Discover our carefully selected collection of timeless pieces designed to elevate your everyday experience.
              </p>
              <Button 
                size="lg" 
                className="uppercase tracking-wider"
                style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
              >
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=750&fit=crop" 
                  alt="Minimal furniture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-light text-center mb-16" style={{ color: colorPalette['text-primary'] }}>
            Shop by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Furniture", image: "photo-1586023492125-27b2c045efd7" },
              { name: "Lighting", image: "photo-1513506003901-1e6a229e2d15" },
              { name: "Accessories", image: "photo-1524758631624-e2822e304c36" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden mb-6">
                  <img 
                    src={`https://images.unsplash.com/${category.image}?w=400&h=400&fit=crop`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-xl font-light text-center uppercase tracking-wider" style={{ color: colorPalette['text-primary'] }}>
                  {category.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-light text-center mb-16" style={{ color: colorPalette['text-primary'] }}>
            Featured Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Modern Floor Lamp", price: "$249", rating: 4.8, image: "photo-1513506003901-1e6a229e2d15" },
              { name: "Scandinavian Sofa", price: "$899", rating: 4.9, image: "photo-1586023492125-27b2c045efd7" },
              { name: "Pendant Light", price: "$189", rating: 4.7, image: "photo-1524484485831-a92ffc0de03f" },
              { name: "Coffee Table", price: "$379", rating: 4.6, image: "photo-1506439773649-6e0eb8cfb237" }
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden mb-8 relative">
                  <div className="w-full h-full bg-gradient-to-br rounded-none shadow-none group-hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-2"
                       style={{ background: `linear-gradient(135deg, ${colorPalette['section-bg-2']}, ${colorPalette['section-bg-1']})` }}>
                    <img 
                      src={`https://images.unsplash.com/${product.image}?w=500&h=500&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  
                  {/* Minimal overlay on hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                  
                  {/* Floating minimal add button */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      className="w-full font-light tracking-wider border-0 shadow-xl backdrop-blur-lg"
                      style={{ 
                        backgroundColor: `${colorPalette['button-primary']}95`,
                        color: colorPalette['button-text']
                      }}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                  
                  {/* Minimal corner accent */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPalette.highlight }}></div>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <h4 className="font-light text-xl tracking-wide group-hover:tracking-wider transition-all duration-300" style={{ color: colorPalette['text-primary'] }}>
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current transition-transform hover:scale-125" 
                            style={{ color: i < Math.floor(product.rating) ? colorPalette.highlight : colorPalette.border }} />
                    ))}
                    <span className="text-xs ml-3 font-light opacity-70" style={{ color: colorPalette['text-secondary'] }}>
                      ({product.rating})
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-light tracking-wide" style={{ color: colorPalette.brand }}>
                      {product.price}
                    </p>
                    <div className="w-12 h-px mx-auto opacity-30" style={{ backgroundColor: colorPalette.border }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-20" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-light mb-6" style={{ color: colorPalette['text-primary'] }}>
            Stay in Touch
          </h3>
          <p className="text-lg mb-8" style={{ color: colorPalette['text-secondary'] }}>
            Subscribe to receive updates on new arrivals and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 px-6 py-4 border-0 border-b-2 bg-transparent focus:outline-none"
              style={{ 
                borderBottomColor: colorPalette.border,
                color: colorPalette['input-text']
              }}
            />
            <Button 
              className="uppercase tracking-wider"
              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Minimal Footer */}
      <footer className="py-12 px-6" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
        <div className="max-w-4xl mx-auto">
          {/* Centered Layout */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-light tracking-wider mb-3" style={{ color: colorPalette['text-primary'] }}>
              MINIMAL
            </h3>
            <p className="text-sm tracking-wide mb-8" style={{ color: colorPalette['text-secondary'] }}>
              Less is more. Discover simplicity.
            </p>
          </div>

          {/* Single Row Navigation */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {['Shop', 'About', 'Journal', 'Contact', 'Care'].map((item) => (
              <a key={item} href="#" 
                 className="text-sm tracking-wide hover:opacity-60 transition-opacity" 
                 style={{ color: colorPalette['text-primary'] }}>
                {item}
              </a>
            ))}
          </div>

          {/* Minimal Social Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            {['IG', 'FB', 'TW'].map((social) => (
              <div key={social} 
                   className="w-8 h-8 border border-opacity-30 flex items-center justify-center cursor-pointer hover:bg-opacity-10 transition-colors" 
                   style={{ borderColor: colorPalette['text-secondary'], backgroundColor: 'transparent' }}>
                <span className="text-xs" style={{ color: colorPalette['text-secondary'] }}>
                  {social}
                </span>
              </div>
            ))}
          </div>

          {/* Simple Bottom Line */}
          <div className="text-center border-t pt-6" style={{ borderColor: colorPalette.border }}>
            <p className="text-xs tracking-wider" style={{ color: colorPalette['text-secondary'] }}>
              © MMXXIV MINIMAL STORE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceMinimalStoreTemplate;