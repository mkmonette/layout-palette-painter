
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Globe, Users, ArrowRight } from 'lucide-react';

interface StartupLandingTemplateProps {
  colorPalette: ColorPalette;
}

const StartupLandingTemplate: React.FC<StartupLandingTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 py-4 backdrop-blur-md border-b" style={{ backgroundColor: colorPalette["section-bg-1"] + 'F0', borderColor: colorPalette["text-secondary"] + '20' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colorPalette.brand }}>
              <Zap className="w-5 h-5" style={{ color: colorPalette["button-text"] }} />
            </div>
            <span className="text-xl font-bold" style={{ color: colorPalette["text-primary"] }}>StartupLab</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            {['Product', 'Pricing', 'Resources', 'Company'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" style={{ color: colorPalette["text-primary"] }}>
              Sign In
            </Button>
            <Button style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}>
              Try Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: colorPalette.accent + '20' }}>
            <TrendingUp className="w-4 h-4" style={{ color: colorPalette.accent }} />
            <span className="text-sm font-medium" style={{ color: colorPalette.accent }}>
              Join 50,000+ startups already growing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span style={{ color: colorPalette["text-primary"] }}>Scale your</span>
            <br />
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${colorPalette.brand}, ${colorPalette.highlight})` }}
            >
              startup faster
            </span>
          </h1>
          
          <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: colorPalette["text-secondary"] }}>
            The all-in-one platform for startups to build, launch, and scale their products. 
            From idea to IPO, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-medium rounded-lg border-2 hover:scale-105 transition-all duration-300"
              style={{ borderColor: colorPalette["button-secondary-text"], color: colorPalette["button-secondary-text"] }}
            >
              Book a Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, label: '50K+ Users', desc: 'Active startups' },
              { icon: Globe, label: '120+ Countries', desc: 'Global reach' },
              { icon: TrendingUp, label: '$2B+ Raised', desc: 'By our customers' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: colorPalette.accent }} />
                <div className="text-2xl font-bold mb-1" style={{ color: colorPalette["text-primary"] }}>
                  {stat.label}
                </div>
                <div className="text-sm" style={{ color: colorPalette["text-secondary"] }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartupLandingTemplate;
