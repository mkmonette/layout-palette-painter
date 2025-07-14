import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Laptop, Headphones, Watch, ShoppingCart, Star, Zap } from 'lucide-react';
import { ColorPalette } from '@/types/template';

interface EcommerceTechStoreTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceTechStoreTemplate: React.FC<EcommerceTechStoreTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ borderColor: colorPalette.border }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold flex items-center" style={{ color: colorPalette.brand }}>
              <Zap className="h-6 w-6 mr-2" />
              TechVault
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Smartphones</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Laptops</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Audio</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Wearables</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <span style={{ color: colorPalette['text-primary'] }}>Support</span>
            </Button>
            <Button 
              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colorPalette.accent, color: colorPalette['button-text'] }}>
                <Zap className="h-4 w-4 mr-2" />
                Latest Release
              </div>
              <h2 className="text-5xl font-bold leading-tight" style={{ color: colorPalette['text-primary'] }}>
                Next-Gen
                <br />
                <span style={{ color: colorPalette.brand }}>Technology</span>
              </h2>
              <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
                Discover the latest smartphones, laptops, and gadgets from top brands. Experience cutting-edge technology with unbeatable prices.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>50K+</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>1000+</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>24/7</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Support</p>
                </div>
              </div>
              <Button 
                size="lg"
                style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
              >
                Shop Latest Devices
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" 
                  alt="Latest smartphone"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg" style={{ backgroundColor: colorPalette.highlight, color: colorPalette['button-text'] }}>
                <p className="text-sm font-medium">From $699</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: colorPalette['text-primary'] }}>
            Shop by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Smartphones", icon: Smartphone, count: "150+ models" },
              { name: "Laptops", icon: Laptop, count: "80+ models" },
              { name: "Audio", icon: Headphones, count: "200+ products" },
              { name: "Wearables", icon: Watch, count: "50+ devices" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer p-6 rounded-xl border hover:shadow-lg transition-all" style={{ backgroundColor: colorPalette['section-bg-1'], borderColor: colorPalette.border }}>
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
                    <category.icon className="h-8 w-8" style={{ color: colorPalette.brand }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: colorPalette['text-primary'] }}>{category.name}</h4>
                    <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>{category.count}</p>
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
            <h3 className="text-3xl font-bold mb-4" style={{ color: colorPalette['text-primary'] }}>
              Trending Tech
            </h3>
            <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
              Most popular products this month
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "iPhone 15 Pro", price: "$999", rating: 4.9, image: "photo-1592750475338-74b7b21085ab", badge: "Best Seller" },
              { name: "MacBook Air M2", price: "$1199", rating: 4.8, image: "photo-1517336714731-489689fd1ca8", badge: "New" },
              { name: "AirPods Pro", price: "$249", rating: 4.7, image: "photo-1606220945770-b5b6c2c55bf1", badge: "Popular" },
              { name: "Apple Watch", price: "$399", rating: 4.9, image: "photo-1579586337278-3f436f25d4d6", badge: "Featured" }
            ].map((product, index) => (
              <div key={index} className="group border rounded-xl overflow-hidden hover:shadow-lg transition-shadow" style={{ borderColor: colorPalette.border, backgroundColor: colorPalette['section-bg-1'] }}>
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=300&h=300&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 text-xs rounded" style={{ backgroundColor: colorPalette.highlight, color: colorPalette['button-text'] }}>
                    {product.badge}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold" style={{ color: colorPalette['text-primary'] }}>{product.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" style={{ color: colorPalette.highlight }} />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold" style={{ color: colorPalette.brand }}>{product.price}</span>
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
          <Zap className="h-12 w-12 mx-auto mb-6" style={{ color: colorPalette.brand }} />
          <h3 className="text-3xl font-bold mb-4" style={{ color: colorPalette['text-primary'] }}>
            Stay Ahead of Tech Trends
          </h3>
          <p className="text-lg mb-8" style={{ color: colorPalette['text-secondary'] }}>
            Get notified about new product launches, exclusive deals, and tech insights
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
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceTechStoreTemplate;