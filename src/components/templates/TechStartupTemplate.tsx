
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Code, Database, Cloud, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface TechStartupTemplateProps {
  colorPalette: ColorPalette;
}

const TechStartupTemplate: React.FC<TechStartupTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Glassmorphism background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          background: `radial-gradient(circle at 20% 50%, ${colorPalette.brand}, transparent 50%), radial-gradient(circle at 80% 20%, ${colorPalette.highlight}, transparent 50%), radial-gradient(circle at 40% 80%, ${colorPalette.accent}, transparent 50%)`
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-6 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r" style={{ background: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.highlight})` }}>
              <Code className="w-6 h-6" style={{ color: colorPalette["button-text"] }} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colorPalette["text-primary"]}, ${colorPalette.brand})` }}>
              TechFlow
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Platform', 'Solutions', 'Developers', 'Pricing'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <Button className="bg-gradient-to-r shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.highlight})`, color: colorPalette["button-text"] }}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 mb-8">
            <Shield className="w-4 h-4" style={{ color: colorPalette.accent }} />
            <span className="text-sm font-medium" style={{ color: colorPalette["text-primary"] }}>
              Enterprise-grade security included
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span style={{ color: colorPalette["text-primary"] }}>Build the</span>
            <br />
            <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.highlight}, ${colorPalette.accent})` }}>
              future
            </span>
          </h1>
          
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: colorPalette["text-secondary"] }}>
            The most advanced development platform for modern teams. Deploy, scale, and monitor your applications with unprecedented ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg"
              className="px-10 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3"
              style={{ background: `linear-gradient(135deg, ${colorPalette["button-primary"]}, ${colorPalette.highlight})`, color: colorPalette["button-text"] }}
            >
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-10 py-5 text-lg font-semibold rounded-2xl backdrop-blur-md bg-white/5 border-2 hover:bg-white/10 transition-all duration-300"
              style={{ borderColor: colorPalette.accent, color: colorPalette.accent }}
            >
              View Demo
            </Button>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Database, title: 'Database as Code', desc: 'Version-controlled schemas' },
              { icon: Cloud, title: 'Auto Scaling', desc: 'Handles any traffic spike' },
              { icon: Shield, title: 'Zero Trust Security', desc: 'Built-in compliance' }
            ].map((feature, index) => (
              <div key={index} className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <feature.icon className="w-12 h-12 mx-auto mb-4" style={{ color: colorPalette.accent }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: colorPalette["text-primary"] }}>
                  {feature.title}
                </h3>
                <p style={{ color: colorPalette["text-secondary"] }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechStartupTemplate;
