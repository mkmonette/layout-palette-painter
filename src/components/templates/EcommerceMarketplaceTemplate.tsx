import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, ShoppingCart, Store, Users, TrendingUp, Heart, Eye } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import EcommerceFooter from './EcommerceFooter';

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
              { name: "Wireless Earbuds", price: "$79", originalPrice: "$99", seller: "TechStore", rating: 4.5, reviews: 1234, image: "photo-1572569511254-d8f925fe2cbb", freeShipping: true },
              { name: "Smart Watch", price: "$199", originalPrice: "$249", seller: "GadgetHub", rating: 4.7, reviews: 856, image: "photo-1523275335684-37898b6baf30", freeShipping: true },
              { name: "Laptop Backpack", price: "$45", originalPrice: "$65", seller: "BagWorld", rating: 4.3, reviews: 567, image: "photo-1553062407-98eeb64c6a62", freeShipping: false },
              { name: "Coffee Maker", price: "$129", originalPrice: "$159", seller: "HomeEssentials", rating: 4.6, reviews: 342, image: "photo-1559056199-641a0ac8b55e", freeShipping: true },
              { name: "Running Shoes", price: "$89", originalPrice: "$119", seller: "SportGear", rating: 4.8, reviews: 923, image: "photo-1542291026-7eec264c27ff", freeShipping: true }
            ].map((product, index) => (
              <div key={index} className="group border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer" 
                   style={{ borderColor: colorPalette.border, backgroundColor: colorPalette['section-bg-1'] }}>
                <div className="aspect-square overflow-hidden relative bg-gradient-to-br"
                     style={{ background: `linear-gradient(135deg, ${colorPalette['section-bg-2']}, ${colorPalette['section-bg-1']})` }}>
                  <img 
                    src={`https://images.unsplash.com/${product.image}?w=320&h=320&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-800 ease-out"
                  />
                  
                  {/* Marketplace-style discount badge */}
                  <div className="absolute top-3 left-3 px-3 py-2 text-xs font-bold rounded-lg backdrop-blur-lg border-2 shadow-xl" 
                       style={{ backgroundColor: `${colorPalette.highlight}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                    🏷️ {Math.round(((parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))) / parseFloat(product.originalPrice.slice(1))) * 100)}% OFF
                  </div>
                  
                  {/* Free shipping badge */}
                  {product.freeShipping && (
                    <div className="absolute top-3 right-3 px-3 py-2 text-xs font-bold rounded-lg backdrop-blur-lg border-2 shadow-xl" 
                         style={{ backgroundColor: `${colorPalette.accent}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                      🚚 Free Ship
                    </div>
                  )}
                  
                  {/* Marketplace action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button className="p-4 rounded-xl backdrop-blur-lg border-2 shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <Heart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                      <button className="p-4 rounded-xl backdrop-blur-lg border-2 shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <Eye className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                      <button className="p-4 rounded-xl backdrop-blur-lg border-2 shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: colorPalette['button-primary'], color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <h4 className="font-bold text-lg leading-snug group-hover:text-opacity-80 transition-colors" style={{ color: colorPalette['text-primary'] }}>
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold" style={{ color: colorPalette.brand }}>
                        {product.price}
                      </span>
                      <span className="text-sm line-through opacity-60" style={{ color: colorPalette['text-secondary'] }}>
                        {product.originalPrice}
                      </span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: colorPalette.highlight }}>
                      Save ${(parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))).toFixed(0)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium opacity-75" style={{ color: colorPalette['text-secondary'] }}>
                        by {product.seller}
                      </span>
                      <div className="w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: colorPalette['text-secondary'] }}></div>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colorPalette.accent, color: colorPalette['button-text'] }}>
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current transition-transform hover:scale-125" 
                                style={{ color: i < Math.floor(product.rating) ? colorPalette.highlight : colorPalette.border }} />
                        ))}
                      </div>
                      <span className="text-sm font-bold" style={{ color: colorPalette['text-secondary'] }}>
                        {product.rating}
                      </span>
                      <span className="text-xs opacity-75" style={{ color: colorPalette['text-secondary'] }}>
                        ({product.reviews} reviews)
                      </span>
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

      {/* Custom Marketplace Footer */}
      <footer className="pt-16 pb-8" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Marketplace Header */}
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-2" style={{ color: colorPalette['text-primary'] }}>
              MarketHub
            </h3>
            <p className="text-lg" style={{ color: colorPalette['text-secondary'] }}>
              Connect • Discover • Trade
            </p>
          </div>

          {/* Five Column Marketplace Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {/* For Buyers */}
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: colorPalette['text-primary'], borderColor: colorPalette.accent }}>
                For Buyers
              </h4>
              <ul className="space-y-2 text-sm">
                {['Browse Products', 'Price Comparison', 'Buyer Protection', 'Payment Options'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center hover:translate-x-1 transition-transform" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: colorPalette.accent }}></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Sellers */}
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: colorPalette['text-primary'], borderColor: colorPalette.accent }}>
                For Sellers
              </h4>
              <ul className="space-y-2 text-sm">
                {['Start Selling', 'Seller Tools', 'Analytics', 'Marketplace Fees'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center hover:translate-x-1 transition-transform" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: colorPalette.accent }}></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: colorPalette['text-primary'], borderColor: colorPalette.accent }}>
                Categories
              </h4>
              <ul className="space-y-2 text-sm">
                {['Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center hover:translate-x-1 transition-transform" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: colorPalette.accent }}></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: colorPalette['text-primary'], borderColor: colorPalette.accent }}>
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                {['Help Center', 'Contact Us', 'Dispute Resolution', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center hover:translate-x-1 transition-transform" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: colorPalette.accent }}></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b" style={{ color: colorPalette['text-primary'], borderColor: colorPalette.accent }}>
                About
              </h4>
              <ul className="space-y-2 text-sm">
                {['Our Story', 'Press', 'Careers', 'Investors'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center hover:translate-x-1 transition-transform" 
                       style={{ color: colorPalette['text-secondary'] }}>
                      <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: colorPalette.accent }}></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 py-8 border-t border-b" 
               style={{ borderColor: colorPalette.border }}>
            {[
              { label: 'Active Sellers', value: '1M+' },
              { label: 'Products Listed', value: '50M+' },
              { label: 'Countries', value: '190+' },
              { label: 'Daily Transactions', value: '100K+' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colorPalette.accent }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <p style={{ color: colorPalette['text-secondary'] }}>
                © 2024 MarketHub Inc. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map((link) => (
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

export default EcommerceMarketplaceTemplate;