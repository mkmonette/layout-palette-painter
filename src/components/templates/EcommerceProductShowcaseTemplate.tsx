import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import EcommerceFooter from './EcommerceFooter';

interface EcommerceProductShowcaseTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceProductShowcaseTemplate: React.FC<EcommerceProductShowcaseTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ borderColor: colorPalette.border, backgroundColor: colorPalette['section-bg-1'] }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold" style={{ color: colorPalette.brand }}>
              ShopStyle
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>New Arrivals</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Categories</a>
              <a href="#" className="hover:opacity-80" style={{ color: colorPalette['text-primary'] }}>Sale</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart (2)
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Product Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colorPalette.accent, color: colorPalette['button-text'] }}>
              Featured Product
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: colorPalette['text-primary'] }}>
              Premium Wireless Headphones
            </h2>
            <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
              Experience crystal-clear audio with our flagship wireless headphones. Featuring active noise cancellation and 30-hour battery life.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{ color: colorPalette.highlight }} />
                ))}
                <span className="ml-2 text-sm" style={{ color: colorPalette['text-secondary'] }}>4.9 (127 reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold" style={{ color: colorPalette.brand }}>$299</span>
              <span className="text-xl line-through" style={{ color: colorPalette['text-secondary'] }}>$399</span>
              <span className="px-2 py-1 text-sm rounded" style={{ backgroundColor: colorPalette.highlight, color: colorPalette['button-text'] }}>25% OFF</span>
            </div>
            <div className="flex space-x-4">
              <Button 
                size="lg"
                style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                style={{ borderColor: colorPalette.border, color: colorPalette['text-primary'] }}
              >
                <Eye className="h-5 w-5 mr-2" />
                Quick View
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" 
                alt="Premium Wireless Headphones"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4" style={{ color: colorPalette['text-primary'] }}>
              Trending Products
            </h3>
            <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
              Discover our most popular items this month
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Smart Watch", price: "$199", originalPrice: "$249", rating: 4.8, image: "photo-1523275335684-37898b6baf30" },
              { name: "Laptop Stand", price: "$89", originalPrice: "$119", rating: 4.6, image: "photo-1527864550417-7fd91fc51a46" },
              { name: "Bluetooth Speaker", price: "$149", originalPrice: "$199", rating: 4.9, image: "photo-1608043152269-423dbba4e7e1" },
              { name: "Phone Case", price: "$29", originalPrice: "$39", rating: 4.5, image: "photo-1556656793-08538906a9f8" }
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1" 
                   style={{ backgroundColor: colorPalette['section-bg-1'], border: `2px solid ${colorPalette.border}` }}>
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br" 
                       style={{ background: `linear-gradient(135deg, ${colorPalette['section-bg-2']}, ${colorPalette['section-bg-1']})` }}>
                    <img 
                      src={`https://images.unsplash.com/${product.image}?w=400&h=400&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="flex flex-col space-y-3">
                      <button className="p-3 rounded-full backdrop-blur-md border shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <Heart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                      <button className="p-3 rounded-full backdrop-blur-md border shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <Eye className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sale Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border" 
                         style={{ backgroundColor: colorPalette.highlight, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                      🔥 SALE
                    </div>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      className="w-full backdrop-blur-md shadow-xl font-semibold border hover:scale-105 transition-all duration-300"
                      style={{ 
                        backgroundColor: `${colorPalette['button-primary']}90`,
                        color: colorPalette['button-text'],
                        borderColor: colorPalette['button-text']
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Quick Add to Cart
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h4 className="font-bold text-xl leading-tight group-hover:text-opacity-80 transition-colors" style={{ color: colorPalette['text-primary'] }}>
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current transition-transform hover:scale-110" 
                              style={{ color: i < Math.floor(product.rating) ? colorPalette.highlight : colorPalette.border }} />
                      ))}
                      <span className="text-sm ml-2 font-medium" style={{ color: colorPalette['text-secondary'] }}>
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold" style={{ color: colorPalette.brand }}>{product.price}</span>
                        <span className="text-lg line-through opacity-60" style={{ color: colorPalette['text-secondary'] }}>{product.originalPrice}</span>
                      </div>
                      <div className="text-sm font-medium opacity-75" style={{ color: colorPalette.highlight }}>
                        Save ${(parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))).toFixed(0)}
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

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4" style={{ color: colorPalette['text-primary'] }}>
            Stay Updated with Latest Products
          </h3>
          <p className="text-lg mb-8" style={{ color: colorPalette['text-secondary'] }}>
            Subscribe to our newsletter and get 10% off your first order
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

      {/* Custom Product Showcase Footer */}
      <footer className="pt-16 pb-8" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4" style={{ color: colorPalette['text-primary'] }}>
                ShopStyle
              </h3>
              <p className="mb-6 leading-relaxed" style={{ color: colorPalette['text-secondary'] }}>
                Discover the latest trends and premium products with our curated collection. 
                Your style, redefined.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <div key={social} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" 
                       style={{ backgroundColor: colorPalette.accent }}>
                    <span className="text-sm font-bold" style={{ color: colorPalette['button-text'] }}>
                      {social[0].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colorPalette['text-primary'] }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['New Arrivals', 'Best Sellers', 'Sale Items', 'Gift Cards'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:underline transition-colors" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colorPalette['text-primary'] }}>
                Support
              </h4>
              <ul className="space-y-2">
                {['Contact Us', 'Size Guide', 'Returns', 'Track Order'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:underline transition-colors" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center" 
               style={{ borderColor: colorPalette.border }}>
            <p style={{ color: colorPalette['text-secondary'] }}>
              © 2024 ShopStyle. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a key={link} href="#" className="text-sm hover:underline" 
                   style={{ color: colorPalette['text-secondary'] }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceProductShowcaseTemplate;