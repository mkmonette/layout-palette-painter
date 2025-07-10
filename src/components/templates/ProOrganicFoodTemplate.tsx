import React from 'react';
import { Search, ShoppingCart, User, Heart, Menu, Phone, Leaf, Star } from 'lucide-react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProOrganicFoodTemplateProps {
  colorPalette: ColorPalette;
}

const ProOrganicFoodTemplate: React.FC<ProOrganicFoodTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Promotional Banner */}
      <div 
        className="py-2 text-center text-sm font-medium"
        style={{ 
          backgroundColor: colors.brandAccent,
          color: colors.textInverse 
        }}
      >
        Get a 20% discount within 30 minutes—today only!
        <button className="ml-4 hover:opacity-75">×</button>
      </div>

      {/* Header */}
      <header 
        className="px-6 py-4 border-b"
        style={{ 
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.borderPrimary
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.brandAccent }}
            >
              <Leaf className="w-6 h-6" style={{ color: colors.textInverse }} />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Apricorna
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.backgroundPrimary,
                  borderColor: colors.borderPrimary,
                  color: colors.textPrimary
                }}
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: colors.textSecondary }}
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textPrimary }}>280 900 3434</span>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" style={{ color: colors.textSecondary }} />
                <span 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ 
                    backgroundColor: colors.brandAccent,
                    color: colors.textInverse 
                  }}
                >
                  1
                </span>
              </div>
              <Heart className="w-6 h-6" style={{ color: colors.textSecondary }} />
              <User className="w-6 h-6" style={{ color: colors.textSecondary }} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav 
        className="px-6 py-3"
        style={{ backgroundColor: colors.brandAccent }}
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-8">
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded font-medium"
            style={{ 
              backgroundColor: colors.backgroundPrimary,
              color: colors.textPrimary 
            }}
          >
            <Menu className="w-4 h-4" />
            <span>ALL CATEGORIES</span>
          </button>
          
          <div className="flex space-x-6">
            {['HOME PAGES', 'SHOP', 'PAGES', 'FEATURES', 'CAMPAIGNS'].map((item) => (
              <button 
                key={item}
                className="text-sm font-medium hover:opacity-75 transition-opacity"
                style={{ color: colors.textInverse }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div 
          className="min-h-[500px] flex items-center"
          style={{ 
            background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSecondary} 100%)` 
          }}
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: colors.brandAccent,
                  color: colors.textInverse 
                }}
              >
                FROM $1.3
              </div>
              
              <h1 
                className="text-4xl lg:text-5xl font-bold leading-tight"
                style={{ color: colors.textPrimary }}
              >
                Experience the Pure Taste of Nature with Our Premium Organic Food Selection
              </h1>
              
              <p 
                className="text-lg leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                Our carefully curated selection ensures that you enjoy the best in health and taste, straight from the farm to your home.
              </p>
              
              <button 
                className="px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: colors.buttonPrimary,
                  color: colors.buttonText 
                }}
              >
                Check Products
              </button>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="relative z-10">
                {/* Large Smoothie Glass */}
                <div 
                  className="w-80 h-96 mx-auto rounded-lg shadow-2xl"
                  style={{ 
                    background: `linear-gradient(180deg, ${colors.brandAccent} 0%, #4a7c59  100%)`,
                    clipPath: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)'
                  }}
                >
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div 
                      className="w-16 h-2 rounded-full"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surfaceCard }}
                  >
                    <Leaf className="w-8 h-8" style={{ color: colors.brandAccent }} />
                  </div>
                </div>

                <div className="absolute -top-4 -right-12">
                  <div 
                    className="w-16 h-16 rounded-full"
                    style={{ backgroundColor: '#ffd700' }}
                  />
                </div>

                <div className="absolute -bottom-8 -left-12">
                  <div 
                    className="w-24 h-24 rounded-full"
                    style={{ backgroundColor: '#ff6b35' }}
                  />
                </div>

                <div className="absolute bottom-0 -right-8">
                  <div 
                    className="w-20 h-20 rounded-full"
                    style={{ backgroundColor: '#4ecdc4' }}
                  />
                </div>
              </div>

              {/* Background Elements */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor: colors.brandAccent,
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div 
          className="py-16"
          style={{ backgroundColor: colors.backgroundSecondary }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Leaf, title: '100% Organic', desc: 'All natural ingredients' },
                { icon: Star, title: 'Premium Quality', desc: 'Hand-picked selection' },
                { icon: Heart, title: 'Health Focused', desc: 'Nutrition guaranteed' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-xl"
                  style={{ backgroundColor: colors.surfaceCard }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: colors.brandAccent }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: colors.textInverse }} />
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: colors.textSecondary }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProOrganicFoodTemplate;