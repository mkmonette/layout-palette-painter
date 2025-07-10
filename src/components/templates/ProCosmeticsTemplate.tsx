import React from 'react';
import { Button } from '../ui/button';
import { Star, ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { useColorRoles } from '../../utils/colorRoleMapper';
import { ColorPalette } from '../../types/template';

interface ProCosmeticsTemplateProps {
  palette: ColorPalette;
}

export const ProCosmeticsTemplate: React.FC<ProCosmeticsTemplateProps> = ({ palette }) => {
  const colors = useColorRoles(palette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: colors.backgroundPrimary, borderColor: colors.borderMuted }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: colors.brandPrimary }}>
                blushé
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {['SHOP', 'ABOUT', 'ROUTINE', 'BLOG', 'CONTACT'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                  style={{ color: colors.textPrimary }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colors.textPrimary }} />
              <User className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colors.textPrimary }} />
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: colors.textPrimary }} />
              <Menu className="w-5 h-5 md:hidden cursor-pointer" style={{ color: colors.textPrimary }} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.textPrimary }}>
                  Discover Your
                  <br />
                  <span style={{ color: colors.brandPrimary }}>Natural Glow</span>
                </h2>
                <p className="text-lg opacity-80 max-w-md" style={{ color: colors.textSecondary }}>
                  Premium skincare and beauty products crafted with natural ingredients for radiant, healthy skin that glows from within.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.buttonPrimary }}
                >
                  SHOP NOW
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 font-medium rounded-lg transition-all hover:opacity-80"
                  style={{ 
                    color: colors.textPrimary, 
                    borderColor: colors.borderPrimary,
                    backgroundColor: 'transparent'
                  }}
                >
                  LEARN MORE
                </Button>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: colors.brandPrimary }}>150+</div>
                  <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: colors.brandPrimary }}>50+</div>
                  <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: colors.brandPrimary }}>1000+</div>
                  <div className="text-sm opacity-70" style={{ color: colors.textSecondary }}>Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Beautiful woman with cosmetic product"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Product Card */}
              <div 
                className="absolute -bottom-8 -left-8 p-6 rounded-2xl shadow-xl backdrop-blur-sm"
                style={{ backgroundColor: colors.surfaceCard }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                    alt="Skincare serum"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: colors.textPrimary }}>Vitamin C Serum</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" style={{ color: colors.brandAccent }} />
                      ))}
                    </div>
                    <p className="text-lg font-bold" style={{ color: colors.brandPrimary }}>$49.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.backgroundSecondary }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
               {
                 icon: '🚚',
                 title: 'FREE SHIPPING WORLDWIDE',
                 description: 'Complimentary shipping on all orders over $75. Fast, secure delivery to your doorstep.'
               },
               {
                 icon: '✨',
                 title: 'CLEAN & SUSTAINABLE',
                 description: 'Ethically sourced, cruelty-free formulations with natural and organic ingredients.'
               },
               {
                 icon: '💳',
                 title: 'SECURE CHECKOUT',
                 description: 'Safe and encrypted payment processing with multiple payment options available.'
               }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl" style={{ backgroundColor: colors.surfaceCard }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  {feature.title}
                </h3>
                <p className="opacity-70" style={{ color: colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Bestselling Essentials
            </h2>
            <p className="text-lg opacity-80" style={{ color: colors.textSecondary }}>
              Customer favorites that deliver visible results and luxurious experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
               {
                 name: 'Radiance Renewal Moisturizer',
                 price: '$68.00',
                 image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
               },
               {
                 name: 'Brightening Vitamin C Serum',
                 price: '$85.00',
                 image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
               },
               {
                 name: 'Silk Repair Lip Treatment',
                 price: '$32.00',
                 image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
               }
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" style={{ color: colors.brandAccent }} />
                    ))}
                  </div>
                  <p className="text-xl font-bold" style={{ color: colors.brandPrimary }}>
                    {product.price}
                  </p>
                  <Button 
                    className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.buttonPrimary }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.backgroundAccent }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Join Our Beauty Community
          </h2>
          <p className="text-lg mb-8 opacity-80" style={{ color: colors.textSecondary }}>
            Unlock exclusive skincare secrets, early access to new products, and personalized beauty tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderMuted,
                color: colors.textPrimary
              }}
            />
            <Button 
              className="px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.buttonPrimary }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ backgroundColor: colors.backgroundPrimary, borderColor: colors.borderMuted }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.brandPrimary }}>
                blushé
              </h3>
              <p className="opacity-70 mb-4" style={{ color: colors.textSecondary }}>
                Elevate your skincare ritual with luxurious, science-backed formulations
              </p>
            </div>
            
            {[
              {
                title: 'Shop',
                links: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance']
              },
              {
                title: 'Support',
                links: ['Contact Us', 'FAQ', 'Shipping', 'Returns']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Press', 'Blog']
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="opacity-70 hover:opacity-100 transition-opacity"
                        style={{ color: colors.textSecondary }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: colors.borderMuted }}>
            <p className="opacity-70" style={{ color: colors.textSecondary }}>
              © 2024 blushé. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};