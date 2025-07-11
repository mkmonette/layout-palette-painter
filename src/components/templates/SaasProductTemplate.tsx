
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Monitor, BarChart3, Users, Zap, Check, ArrowRight } from 'lucide-react';

interface SaasProductTemplateProps {
  colorPalette: ColorPalette;
}

const SaasProductTemplate: React.FC<SaasProductTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="px-6 py-5 border-b" style={{ backgroundColor: colorPalette["section-bg-1"], borderColor: colorPalette["text-secondary"] + '20' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colorPalette.brand }}>
              <Monitor className="w-6 h-6" style={{ color: colorPalette["button-text"] }} />
            </div>
            <span className="text-2xl font-bold" style={{ color: colorPalette["text-primary"] }}>
              ProductFlow
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Features', 'Pricing', 'Resources', 'Support'].map((item) => (
              <a key={item} href="#" className="font-medium hover:opacity-70 transition-opacity" style={{ color: colorPalette["text-primary"] }}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" style={{ color: colorPalette["text-primary"] }}>
              Login
            </Button>
            <Button style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20" style={{ backgroundColor: colorPalette["section-bg-1"] }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: colorPalette.accent + '20' }}>
              <Zap className="w-4 h-4" style={{ color: colorPalette.accent }} />
              <span className="text-sm font-semibold" style={{ color: colorPalette.accent }}>
                New: AI-Powered Analytics
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span style={{ color: colorPalette["text-primary"] }}>Streamline your</span>
              <br />
              <span style={{ color: colorPalette.brand }}>product workflow</span>
            </h1>
            
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: colorPalette["text-secondary"] }}>
              The complete platform for product teams to plan, build, and launch features faster. 
              Trusted by 10,000+ teams worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                style={{ backgroundColor: colorPalette["button-primary"], color: colorPalette["button-text"] }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2"
                style={{ borderColor: colorPalette["button-secondary-text"], color: colorPalette["button-secondary-text"] }}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into user behavior and feature performance' },
              { icon: Users, title: 'Team Collaboration', desc: 'Real-time collaboration tools for distributed teams' },
              { icon: Zap, title: 'Automated Workflows', desc: 'Streamline repetitive tasks with smart automation' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl hover:shadow-lg transition-all duration-300" style={{ backgroundColor: colorPalette["section-bg-2"], border: `1px solid ${colorPalette["text-secondary"]}20` }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colorPalette.accent + '20' }}>
                  <feature.icon className="w-8 h-8" style={{ color: colorPalette.accent }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: colorPalette["text-primary"] }}>
                  {feature.title}
                </h3>
                <p style={{ color: colorPalette["text-secondary"] }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          
          {/* Social Proof */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-8 mb-8">
              {['Trusted by', '10,000+', 'companies'].map((text, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index === 1 && <Check className="w-5 h-5" style={{ color: colorPalette.accent }} />}
                  <span className={index === 1 ? "text-2xl font-bold" : "text-lg"} style={{ color: index === 1 ? colorPalette.brand : colorPalette["text-secondary"] }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SaasProductTemplate;
