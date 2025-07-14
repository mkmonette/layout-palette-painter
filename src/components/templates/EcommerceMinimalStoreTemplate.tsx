import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { ColorPalette } from '@/types/template';

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
              { name: "Ceramic Vase", price: "$89", image: "photo-1578662996442-48f60103fc96" },
              { name: "Oak Chair", price: "$299", image: "photo-1506439773649-6e0eb8cfb237" },
              { name: "Table Lamp", price: "$149", image: "photo-1507003211169-0a1dd7228f2d" },
              { name: "Throw Pillow", price: "$45", image: "photo-1555041469-a586c61ea9bc" }
            ].map((product, index) => (
              <div key={index} className="group">
                <div className="aspect-square overflow-hidden mb-4">
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=300&h=300&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-light" style={{ color: colorPalette['text-primary'] }}>{product.name}</h4>
                  <p className="text-sm" style={{ color: colorPalette.brand }}>{product.price}</p>
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
    </div>
  );
};

export default EcommerceMinimalStoreTemplate;