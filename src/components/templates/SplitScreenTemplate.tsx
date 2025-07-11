
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Rocket, Users } from 'lucide-react';
import { getContrastTextForHSL } from '@/utils/contrastUtils';

interface SplitScreenTemplateProps {
  colorPalette: ColorPalette;
}

const SplitScreenTemplate: React.FC<SplitScreenTemplateProps> = ({ colorPalette }) => {
  // Calculate contrast-safe text colors for each section
  const headerTextColor = getContrastTextForHSL(colorPalette["section-bg-1"]);
  const contentTextColor = getContrastTextForHSL(colorPalette["section-bg-1"]);
  
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 py-4 border-b" style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: headerTextColor + '20' }}>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold" style={{ color: colorPalette.brand }}>
            Velocity
          </div>
          <nav className="hidden md:flex space-x-6">
            {['Product', 'Solutions', 'Resources', 'Company'].map((item) => (
              <a key={item} href="#" className="hover:opacity-70 transition-opacity" style={{ color: headerTextColor }}>
                {item}
              </a>
            ))}
          </nav>
          <Button size="sm" style={{ backgroundColor: colorPalette["button-secondary"], color: colorPalette["button-secondary-text"] }}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Split Screen Content */}
      <div className="grid md:grid-cols-2 min-h-[500px]">
        {/* Left Side - Content */}
        <div className="px-6 py-16 flex items-center" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: contentTextColor }}>
              Ship faster with
              <span className="block" style={{ color: colorPalette.brand }}>modern tools</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: contentTextColor + '80' }}>
              Build, deploy, and scale your applications with confidence. Our platform provides everything you need to go from idea to production.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                { icon: Shield, text: 'Enterprise-grade security' },
                { icon: Rocket, text: 'Lightning-fast deployment' },
                { icon: Users, text: 'Seamless team collaboration' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5" style={{ color: colorPalette.accent }} />
                  <span style={{ color: contentTextColor }}>{feature.text}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
                style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                className="px-6 py-3 rounded-lg font-medium"
                style={{ borderColor: colorPalette["button-secondary-text"], color: colorPalette["button-secondary-text"] }}
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div 
          className="relative flex items-center justify-center"
          style={{ backgroundColor: colorPalette.brand + '10' }}
        >
          <div className="relative">
            <div 
              className="w-64 h-64 rounded-2xl shadow-2xl transform rotate-6"
              style={{ backgroundColor: colorPalette.brand }}
            />
            <div 
              className="absolute -top-8 -right-8 w-32 h-32 rounded-xl shadow-lg transform -rotate-12"
              style={{ backgroundColor: colorPalette.highlight }}
            />
            <div 
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-lg shadow-lg transform rotate-12"
              style={{ backgroundColor: colorPalette.accent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenTemplate;
