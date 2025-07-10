
import React from 'react';
import { Palette } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Templates', 'Pricing', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Palette Painter
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Create perfect color palettes for your web projects with AI-powered generation and live preview.
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Palette Painter. All rights reserved.
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            Made with ❤️ for designers and developers worldwide
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
