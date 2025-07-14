import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, ShoppingCart, Store, Users, TrendingUp } from 'lucide-react';
import { ColorPalette } from '@/types/template';

interface EcommerceMarketplaceTemplateProps {
  colorPalette: ColorPalette;
}

const EcommerceMarketplaceTemplate: React.FC<EcommerceMarketplaceTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colorPalette['section-bg-1'] }}>
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ borderColor: colorPalette.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: colorPalette.brand }}>
              MarketHub
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Store className="h-4 w-4 mr-2" style={{ color: colorPalette['text-primary'] }} />
                <span style={{ color: colorPalette['text-primary'] }}>Sell on MarketHub</span>
              </Button>
              <Button 
                size="sm"
                style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (5)
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colorPalette['text-secondary'] }} />
              <input 
                type="text" 
                placeholder="Search millions of products..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border"
                style={{ 
                  backgroundColor: colorPalette['input-bg'], 
                  color: colorPalette['input-text'],
                  borderColor: colorPalette.border 
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" style={{ color: colorPalette['text-secondary'] }} />
              <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Deliver to 10001</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: colorPalette['text-primary'] }}>
                Discover Everything
                <br />
                <span style={{ color: colorPalette.brand }}>You Need</span>
              </h2>
              <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
                Shop from millions of products across thousands of brands and sellers. Find the best deals, read reviews, and get fast delivery.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>10M+</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>50K+</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Sellers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colorPalette.brand }}>1M+</p>
                  <p className="text-sm" style={{ color: colorPalette['text-secondary'] }}>Reviews</p>
                </div>
              </div>
              <Button 
                size="lg"
                style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
              >
                Start Shopping
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop" 
                    alt="Electronics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop" 
                    alt="Fashion"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" 
                    alt="Home & Garden"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop" 
                    alt="Sports"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: colorPalette['text-primary'] }}>
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Electronics", image: "photo-1498049794561-7780e7231661" },
              { name: "Fashion", image: "photo-1445205170230-053b83016050" },
              { name: "Home & Garden", image: "photo-1555041469-a586c61ea9bc" },
              { name: "Sports", image: "photo-1571019613454-1cb2f99b2d8b" },
              { name: "Books", image: "photo-1481627834876-b7833e8f5570" },
              { name: "Toys", image: "photo-1558060370-d644479cb6f7" }
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-3 mx-auto w-20 h-20">
                  <img 
                    src={`https://images.unsplash.com/${category.image}?w=150&h=150&fit=crop`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium" style={{ color: colorPalette['text-primary'] }}>{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" style={{ color: colorPalette.brand }} />
              <h3 className="text-3xl font-bold" style={{ color: colorPalette['text-primary'] }}>
                Trending Now
              </h3>
            </div>
            <Button variant="outline" style={{ borderColor: colorPalette.border, color: colorPalette['text-primary'] }}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Wireless Earbuds", price: "$79", seller: "TechStore", rating: 4.5, image: "photo-1572569511254-d8f925fe2cbb" },
              { name: "Smart Watch", price: "$199", seller: "GadgetHub", rating: 4.7, image: "photo-1523275335684-37898b6baf30" },
              { name: "Laptop Backpack", price: "$45", seller: "BagWorld", rating: 4.3, image: "photo-1553062407-98eeb64c6a62" },
              { name: "Coffee Maker", price: "$129", seller: "HomeEssentials", rating: 4.6, image: "photo-1559056199-641a0ac8b55e" },
              { name: "Running Shoes", price: "$89", seller: "SportGear", rating: 4.8, image: "photo-1542291026-7eec264c27ff" }
            ].map((product, index) => (
              <div key={index} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow" style={{ borderColor: colorPalette.border, backgroundColor: colorPalette['section-bg-1'] }}>
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=250&h=250&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-medium text-sm" style={{ color: colorPalette['text-primary'] }}>{product.name}</h4>
                  <p className="text-lg font-bold" style={{ color: colorPalette.brand }}>{product.price}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: colorPalette['text-secondary'] }}>by {product.seller}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" style={{ color: colorPalette.highlight }} />
                      <span style={{ color: colorPalette['text-secondary'] }}>{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Spotlight */}
      <section className="px-6 py-16" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Users className="h-6 w-6" style={{ color: colorPalette.brand }} />
            <h3 className="text-3xl font-bold" style={{ color: colorPalette['text-primary'] }}>
              Join Our Marketplace
            </h3>
          </div>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: colorPalette['text-secondary'] }}>
            Start selling to millions of customers worldwide. Set up your store in minutes and reach new markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'] }}
            >
              Start Selling
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              style={{ borderColor: colorPalette.border, color: colorPalette['text-primary'] }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceMarketplaceTemplate;