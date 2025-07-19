import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Laptop, Headphones, Watch, ShoppingCart, Star, Zap, Heart, Eye } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import EcommerceFooter from './EcommerceFooter';

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
              { name: "iPhone 15 Pro", price: "$999", originalPrice: "$1099", rating: 4.9, image: "photo-1592750475338-74b7b21085ab", badge: "Best Seller", discount: "9%" },
              { name: "MacBook Air M2", price: "$1199", originalPrice: "$1299", rating: 4.8, image: "photo-1517336714731-489689fd1ca8", badge: "New", discount: "8%" },
              { name: "AirPods Pro", price: "$249", originalPrice: "$279", rating: 4.7, image: "photo-1606220945770-b5b6c2c55bf1", badge: "Popular", discount: "11%" },
              { name: "Apple Watch", price: "$399", originalPrice: "$449", rating: 4.9, image: "photo-1579586337278-3f436f25d4d6", badge: "Featured", discount: "11%" }
            ].map((product, index) => (
              <div key={index} className="group border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 cursor-pointer" 
                   style={{ borderColor: colorPalette.border, backgroundColor: colorPalette['section-bg-1'] }}>
                <div className="aspect-square overflow-hidden relative bg-gradient-to-br"
                     style={{ background: `linear-gradient(135deg, ${colorPalette['section-bg-2']}, ${colorPalette['section-bg-1']})` }}>
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=400&h=400&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Tech-style grid overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                       style={{ 
                         backgroundImage: `linear-gradient(${colorPalette.accent} 1px, transparent 1px), linear-gradient(90deg, ${colorPalette.accent} 1px, transparent 1px)`,
                         backgroundSize: '20px 20px'
                       }}></div>
                  
                  {/* Tech badges */}
                  <div className="absolute top-4 left-4 space-y-3">
                    <div className="px-3 py-2 text-xs font-bold rounded-lg backdrop-blur-lg border-2 shadow-xl" 
                         style={{ backgroundColor: `${colorPalette.highlight}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                      ⚡ {product.badge}
                    </div>
                    <div className="px-3 py-2 text-xs font-bold rounded-lg backdrop-blur-lg border-2 shadow-xl" 
                         style={{ backgroundColor: `${colorPalette.accent}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                      -{product.discount} OFF
                    </div>
                  </div>
                  
                  {/* Tech action buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 space-y-3">
                    <button className="p-3 rounded-lg backdrop-blur-lg border-2 shadow-xl hover:scale-125 transition-all duration-300" 
                            style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                      <Heart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                    </button>
                    <button className="p-3 rounded-lg backdrop-blur-lg border-2 shadow-xl hover:scale-125 transition-all duration-300" 
                            style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                      <Eye className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                    </button>
                  </div>
                  
                  {/* Tech quick add button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      className="w-full backdrop-blur-lg border-2 font-bold shadow-xl hover:scale-105 transition-all duration-300"
                      style={{ 
                        backgroundColor: `${colorPalette['button-primary']}95`,
                        color: colorPalette['button-text'],
                        borderColor: colorPalette['button-text']
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      QUICK ADD
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <h4 className="font-bold text-xl leading-tight group-hover:text-opacity-80 transition-colors" style={{ color: colorPalette['text-primary'] }}>
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current transition-transform hover:scale-125" 
                              style={{ color: i < Math.floor(product.rating) ? colorPalette.highlight : colorPalette.border }} />
                      ))}
                      <span className="text-sm font-bold ml-2" style={{ color: colorPalette['text-secondary'] }}>
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold" style={{ color: colorPalette.brand }}>
                          {product.price}
                        </span>
                        <span className="text-lg line-through opacity-60" style={{ color: colorPalette['text-secondary'] }}>
                          {product.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-bold" style={{ color: colorPalette.highlight }}>
                          Save ${(parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))).toFixed(0)}
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colorPalette.accent, color: colorPalette['button-text'] }}>
                          Free shipping
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="hover:scale-110 transition-all duration-300 shadow-lg border-2 font-bold"
                      style={{ 
                        backgroundColor: colorPalette['button-secondary'], 
                        color: colorPalette['button-secondary-text'],
                        borderColor: colorPalette['button-secondary']
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
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

      {/* Custom Tech Store Footer */}
      <footer className="relative" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{ 
            backgroundImage: `linear-gradient(${colorPalette['text-primary']} 1px, transparent 1px), linear-gradient(90deg, ${colorPalette['text-primary']} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
          {/* Tech Header */}
          <div className="flex items-center justify-center mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-l-transparent rounded-full animate-spin mr-3" 
                     style={{ borderColor: colorPalette.accent, borderLeftColor: 'transparent' }}></div>
                <h3 className="text-3xl font-bold tracking-tight" style={{ color: colorPalette['text-primary'] }}>
                  TechVault
                </h3>
                <div className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: colorPalette.accent }}></div>
              </div>
              <p className="font-mono text-sm" style={{ color: colorPalette['text-secondary'] }}>
                // Innovation powered by technology
              </p>
            </div>
          </div>

          {/* Four Column Tech Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Products */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colorPalette.accent }}>
                Products
              </h4>
              <ul className="space-y-2 font-mono text-sm">
                {['> Laptops', '> Smartphones', '> Gaming', '> Accessories'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:translate-x-2 transition-transform inline-block" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colorPalette.accent }}>
                Support
              </h4>
              <ul className="space-y-2 font-mono text-sm">
                {['> Tech Support', '> Warranty', '> Repairs', '> Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:translate-x-2 transition-transform inline-block" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colorPalette.accent }}>
                Company
              </h4>
              <ul className="space-y-2 font-mono text-sm">
                {['> About Us', '> Careers', '> Press', '> Blog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:translate-x-2 transition-transform inline-block" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colorPalette.accent }}>
                Connect
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {['GitHub', 'Discord', 'LinkedIn'].map((platform) => (
                    <div key={platform} className="w-8 h-8 border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" 
                         style={{ borderColor: colorPalette.accent, backgroundColor: 'transparent' }}>
                      <span className="text-xs font-mono" style={{ color: colorPalette.accent }}>
                        {platform[0]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-xs" style={{ color: colorPalette['text-secondary'] }}>
                  support@techvault.com
                </p>
              </div>
            </div>
          </div>

          {/* Tech Bottom Bar */}
          <div className="border-t pt-8" style={{ borderColor: colorPalette.border }}>
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="font-mono text-sm mb-4 lg:mb-0" style={{ color: colorPalette['text-secondary'] }}>
                <span style={{ color: colorPalette.accent }}>$</span> Copyright 2024 TechVault.inc --version 1.0.0
              </div>
              <div className="flex space-x-6 font-mono text-xs">
                {['Privacy', 'Terms', 'Security', 'API'].map((link) => (
                  <a key={link} href="#" className="hover:underline" style={{ color: colorPalette['text-secondary'] }}>
                    /{link.toLowerCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceTechStoreTemplate;