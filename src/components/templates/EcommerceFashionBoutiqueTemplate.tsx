import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import EcommerceFooter from './EcommerceFooter';

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
              { name: "Silk Midi Dress", price: "$189", originalPrice: "$249", rating: 4.8, image: "photo-1595777457583-95e059d581b8", isNew: true },
              { name: "Cashmere Sweater", price: "$149", originalPrice: "$199", rating: 4.9, image: "photo-1583743089695-4b816a340f82", isNew: false },
              { name: "Leather Handbag", price: "$299", originalPrice: "$399", rating: 4.7, image: "photo-1548036328-c9fa89d128fa", isNew: false },
              { name: "Pearl Earrings", price: "$89", originalPrice: "$119", rating: 5.0, image: "photo-1515562141207-7a88fb7ce338", isNew: true }
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1">
                  <div className="w-full h-full bg-gradient-to-br relative"
                       style={{ background: `linear-gradient(135deg, ${colorPalette['section-bg-2']}, ${colorPalette['section-bg-1']})` }}>
                    <img 
                      src={`https://images.unsplash.com/${product.image}?w=400&h=533&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  
                  {/* Elegant gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Elegant badges */}
                  <div className="absolute top-4 left-4 space-y-3">
                    {product.isNew && (
                      <div className="px-3 py-2 text-xs font-medium rounded-full backdrop-blur-md border" 
                           style={{ backgroundColor: `${colorPalette.highlight}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                        ✨ New Arrival
                      </div>
                    )}
                    <div className="px-3 py-2 text-xs font-medium rounded-full backdrop-blur-md border" 
                         style={{ backgroundColor: `${colorPalette.accent}90`, color: colorPalette['button-text'], borderColor: colorPalette['button-text'] }}>
                      {Math.round(((parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))) / parseFloat(product.originalPrice.slice(1))) * 100)}% OFF
                    </div>
                  </div>
                  
                  {/* Sophisticated action buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="flex flex-col space-y-3">
                      <button className="p-3 rounded-full backdrop-blur-lg border shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <Heart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                      <button className="p-3 rounded-full backdrop-blur-lg border shadow-xl hover:scale-125 transition-all duration-300" 
                              style={{ backgroundColor: `${colorPalette['section-bg-1']}95`, borderColor: colorPalette.border }}>
                        <ShoppingCart className="h-5 w-5" style={{ color: colorPalette['text-primary'] }} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick shop overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      className="w-full font-serif font-medium backdrop-blur-lg border shadow-xl hover:scale-105 transition-all duration-300"
                      style={{ 
                        backgroundColor: `${colorPalette['button-primary']}95`,
                        color: colorPalette['button-text'],
                        borderColor: colorPalette['button-text']
                      }}
                    >
                      Quick Shop
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-serif text-xl leading-snug group-hover:text-opacity-80 transition-colors" style={{ color: colorPalette['text-primary'] }}>
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current transition-transform hover:scale-125" 
                              style={{ color: i < Math.floor(product.rating) ? colorPalette.highlight : colorPalette.border }} />
                      ))}
                      <span className="text-sm font-medium ml-2" style={{ color: colorPalette['text-secondary'] }}>
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-serif font-semibold" style={{ color: colorPalette.brand }}>
                          {product.price}
                        </span>
                        <span className="text-lg line-through opacity-60" style={{ color: colorPalette['text-secondary'] }}>
                          {product.originalPrice}
                        </span>
                      </div>
                      <div className="text-sm font-medium italic" style={{ color: colorPalette.highlight }}>
                        Save ${(parseFloat(product.originalPrice.slice(1)) - parseFloat(product.price.slice(1))).toFixed(0)}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="font-serif font-medium hover:scale-110 transition-all duration-300 shadow-lg border-2"
                      style={{ 
                        backgroundColor: colorPalette['button-secondary'], 
                        color: colorPalette['button-secondary-text'],
                        borderColor: colorPalette['button-secondary']
                      }}
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

      {/* Custom Fashion Boutique Footer */}
      <footer className="relative overflow-hidden" style={{ backgroundColor: colorPalette['section-bg-2'] }}>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{ 
            backgroundImage: `repeating-linear-gradient(45deg, ${colorPalette['text-primary']} 0px, ${colorPalette['text-primary']} 1px, transparent 1px, transparent 20px)` 
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">
          {/* Elegant Header */}
          <div className="text-center mb-12">
            <h3 className="font-serif text-4xl mb-4" style={{ color: colorPalette['text-primary'] }}>
              Boutique Chic
            </h3>
            <div className="w-24 h-px mx-auto mb-4" style={{ backgroundColor: colorPalette.accent }}></div>
            <p className="text-lg italic" style={{ color: colorPalette['text-secondary'] }}>
              Where elegance meets contemporary style
            </p>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Collections */}
            <div className="text-center">
              <h4 className="font-serif text-xl mb-6" style={{ color: colorPalette['text-primary'] }}>
                Collections
              </h4>
              <ul className="space-y-3">
                {['Evening Wear', 'Casual Chic', 'Accessories', 'Seasonal'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:italic transition-all" style={{ color: colorPalette['text-secondary'] }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="text-center">
              <h4 className="font-serif text-xl mb-6" style={{ color: colorPalette['text-primary'] }}>
                Services
              </h4>
              <ul className="space-y-3">
                {['Personal Styling', 'Alterations', 'Gift Concierge', 'VIP Experience'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:italic transition-all" style={{ color: colorPalette['text-secondary'] }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center">
              <h4 className="font-serif text-xl mb-6" style={{ color: colorPalette['text-primary'] }}>
                Connect
              </h4>
              <div className="space-y-4">
                <p style={{ color: colorPalette['text-secondary'] }}>
                  +1 (555) 123-CHIC
                </p>
                <p style={{ color: colorPalette['text-secondary'] }}>
                  hello@boutiquechic.com
                </p>
                <div className="flex justify-center space-x-4 mt-6">
                  {['Pinterest', 'Instagram', 'Facebook'].map((social) => (
                    <div key={social} className="group">
                      <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all group-hover:scale-110" 
                           style={{ borderColor: colorPalette.accent, backgroundColor: 'transparent' }}>
                        <span className="text-xs font-medium" style={{ color: colorPalette.accent }}>
                          {social[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t pt-8 text-center" style={{ borderColor: colorPalette.border }}>
            <p className="mb-4" style={{ color: colorPalette['text-secondary'] }}>
              © 2024 Boutique Chic • Crafted with love for fashion enthusiasts
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Privacy', 'Terms', 'Size Guide', 'Returns'].map((link) => (
                <a key={link} href="#" className="text-sm underline hover:no-underline" 
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

export default EcommerceFashionBoutiqueTemplate;