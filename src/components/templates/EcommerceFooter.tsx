import React from 'react';
import { Heart, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { ColorPalette } from '@/types/template';

interface EcommerceFooterProps {
  colorPalette: ColorPalette;
  brandName: string;
  theme?: 'standard' | 'minimal' | 'fashion' | 'tech' | 'marketplace';
}

const EcommerceFooter: React.FC<EcommerceFooterProps> = ({ 
  colorPalette, 
  brandName, 
  theme = 'standard' 
}) => {
  const getFooterContent = () => {
    switch (theme) {
      case 'fashion':
        return {
          description: "Curating timeless fashion pieces for the modern woman who values elegance and sophistication.",
          links: {
            'Shop': ['New Arrivals', 'Dresses', 'Accessories', 'Sale', 'Size Guide'],
            'About': ['Our Story', 'Sustainability', 'Careers', 'Press'],
            'Customer Care': ['Contact Us', 'Shipping Info', 'Returns', 'Size Chart', 'FAQ']
          }
        };
      case 'tech':
        return {
          description: "Your trusted destination for cutting-edge technology and innovative gadgets from leading brands worldwide.",
          links: {
            'Products': ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Accessories'],
            'Support': ['Tech Support', 'Warranty', 'Repairs', 'User Guides'],
            'Company': ['About Us', 'Careers', 'Press', 'Investors', 'Partners']
          }
        };
      case 'marketplace':
        return {
          description: "Connecting millions of buyers and sellers worldwide. Discover, shop, and sell everything you need in one place.",
          links: {
            'Buy': ['Browse Categories', 'Daily Deals', 'Gift Cards', 'Mobile App'],
            'Sell': ['Start Selling', 'Seller Hub', 'Fees', 'Policies'],
            'Support': ['Help Center', 'Contact Us', 'Safety', 'Community']
          }
        };
      case 'minimal':
        return {
          description: "Thoughtfully designed products for modern living. Quality craftsmanship meets contemporary style.",
          links: {
            'Shop': ['Furniture', 'Lighting', 'Accessories', 'Collections'],
            'About': ['Our Philosophy', 'Craftsmanship', 'Sustainability'],
            'Service': ['Contact', 'Shipping', 'Returns', 'Care Guide']
          }
        };
      default:
        return {
          description: "Discover amazing products with unbeatable prices and exceptional customer service.",
          links: {
            'Shop': ['New Arrivals', 'Categories', 'Sale', 'Gift Cards'],
            'Customer Service': ['Contact Us', 'Shipping', 'Returns', 'FAQ'],
            'About': ['Our Story', 'Careers', 'Press', 'Investors']
          }
        };
    }
  };

  const content = getFooterContent();

  return (
    <footer style={{ backgroundColor: colorPalette['section-bg-3'] }}>
      {/* Main Footer Content */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="xl:col-span-2 space-y-6">
              <div>
                <h3 className={`text-2xl font-bold ${theme === 'fashion' ? 'font-serif' : theme === 'minimal' ? 'font-light' : ''}`} 
                    style={{ color: colorPalette.brand }}>
                  {brandName}
                </h3>
                <p className="mt-4 text-sm leading-relaxed max-w-md" 
                   style={{ color: colorPalette['text-secondary'] }}>
                  {content.description}
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" style={{ color: colorPalette.accent }} />
                  <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                    123 Commerce Street, New York, NY 10001
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" style={{ color: colorPalette.accent }} />
                  <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" style={{ color: colorPalette.accent }} />
                  <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                    hello@{brandName.toLowerCase().replace(/\s+/g, '')}.com
                  </span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(content.links).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider" 
                    style={{ color: colorPalette['text-primary'] }}>
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" 
                         className="text-sm hover:opacity-80 transition-opacity"
                         style={{ color: colorPalette['text-secondary'] }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t px-6 py-6" 
           style={{ borderColor: colorPalette.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                © 2024 {brandName}. Made with
              </span>
              <Heart className="h-4 w-4 fill-current" style={{ color: colorPalette.accent }} />
              <span className="text-sm" style={{ color: colorPalette['text-secondary'] }}>
                for you
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" 
                        style={{ color: colorPalette['text-secondary'] }} />
              <Twitter className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" 
                       style={{ color: colorPalette['text-secondary'] }} />
              <Instagram className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" 
                         style={{ color: colorPalette['text-secondary'] }} />
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm hover:opacity-80 transition-opacity" 
                 style={{ color: colorPalette['text-secondary'] }}>
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:opacity-80 transition-opacity" 
                 style={{ color: colorPalette['text-secondary'] }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EcommerceFooter;