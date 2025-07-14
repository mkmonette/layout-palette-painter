import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { ColorPalette } from '@/types/template';

interface EcommerceFashionBoutiqueTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceFashionBoutiqueTemplate: React.FC<EcommerceFashionBoutiqueTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ borderColor: colorPalette.border }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-serif" style={{ color: colorPalette.brand }}>
              Boutique Chic
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>New In</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Dresses</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Accessories</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Sale</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Heart className="h-5 w-5 cursor-pointer hover:opacity-70" style={{ color: colorPalette['text-primary'] }} />
            <div className="relative">
              <ShoppingCart className="h-5 w-5 cursor-pointer hover:opacity-70" style={{ color: colorPalette['text-primary'] }} />
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: colorPalette.accent, color: colorPalette['button-text'] }}>3</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" style={{ color: colorPalette.highlight }} />
                <span className="text-sm font-medium" style={{ color: colorPalette.accent }}>Spring Collection 2024</span>
              </div>
              <h2 className="text-5xl font-serif leading-tight" style={{ color: colorPalette['text-primary'] }}>
                Elegance
                <br />
                <span style={{ color: colorPalette.brand }}>Redefined</span>
              </h2>
              <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
                Discover our curated collection of sophisticated pieces designed for the modern woman who values style and comfort.
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="lg"
                  style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
                >
                  Shop New Arrivals
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ borderColor: colorPalette.border, color: colorPalette['text-primary'] }}
                >
                  View Lookbook
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop" 
                  alt="Fashion model"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 px-3 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colorPalette.highlight, color: colorPalette['button-text'] }}>
                New
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif text-center mb-12" style={{ color: colorPalette['text-primary'] }}>
            Shop by Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Evening Wear", image: "photo-1594633312681-425c7b97ccd1", items: "12 items" },
              { name: "Casual Chic", image: "photo-1551698618-1dfe5d97d256", items: "28 items" },
              { name: "Office Essentials", image: "photo-1515886657613-9f3515b0c78f", items: "15 items" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-lg overflow-hidden mb-4 relative">
                  <img 
                    src={`https://images.unsplash.com/${category.image}?w=400&h=500&fit=crop`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-xl font-serif mb-1">{category.name}</h4>
                    <p className="text-sm opacity-90">{category.items}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif mb-4" style={{ color: colorPalette['text-primary'] }}>
              Customer Favorites
            </h3>
            <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
              Our most loved pieces, chosen by you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Silk Midi Dress", price: "$189", rating: 4.8, image: "photo-1595777457583-95e059d581b8" },
              { name: "Cashmere Sweater", price: "$149", rating: 4.9, image: "photo-1583743089695-4b816a340f82" },
              { name: "Leather Handbag", price: "$299", rating: 4.7, image: "photo-1548036328-c9fa89d128fa" },
              { name: "Pearl Earrings", price: "$89", rating: 5.0, image: "photo-1515562141207-7a88fb7ce338" }
            ].map((product, index) => (
              <div key={index} className="group">
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 relative">
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=300&h=400&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Heart className="absolute top-3 right-3 h-5 w-5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'white' }} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium" style={{ color: colorPalette['text-primary'] }}>{product.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" style={{ color: colorPalette.highlight }} />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: colorPalette['text-secondary'] }}>({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold" style={{ color: colorPalette.brand }}>{product.price}</span>
                    <Button 
                      size="sm"
                      style={{ backgroundColor: colorPalette['button-secondary'], color: colorPalette['button-secondary-text'] }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-serif mb-4" style={{ color: colorPalette['text-primary'] }}>
            Stay in Style
          </h3>
          <p className="text-lg mb-8" style={{ color: colorPalette['text-secondary'] }}>
            Get first access to new collections and exclusive member offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border"
              style={{ 
                backgroundColor: colorPalette['input-bg'], 
                color: colorPalette['input-text'],
                borderColor: colorPalette.border 
              }}
            />
            <Button 
              size="lg"
              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
            >
              Join Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceFashionBoutiqueTemplate;