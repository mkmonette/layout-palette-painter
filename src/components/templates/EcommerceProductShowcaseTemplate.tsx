import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { ColorPalette } from '@/types/template';

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
              { name: "Smart Watch", price: "$199", image: "photo-1523275335684-37898b6baf30" },
              { name: "Laptop Stand", price: "$89", image: "photo-1527864550417-7fd91fc51a46" },
              { name: "Bluetooth Speaker", price: "$149", image: "photo-1608043152269-423dbba4e7e1" },
              { name: "Phone Case", price: "$29", image: "photo-1556656793-08538906a9f8" }
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=300&h=300&fit=crop`}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold" style={{ color: colorPalette['text-primary'] }}>{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: colorPalette.brand }}>{product.price}</span>
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
    </div>
  );
};

export default EcommerceProductShowcaseTemplate;