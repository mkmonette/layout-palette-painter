
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Zap, Eye, Settings, Crown, Wand2 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Generate perfect color palettes instantly using advanced AI algorithms tailored for web design.'
    },
    {
      icon: Eye,
      title: 'Live Preview',
      description: 'See your colors applied to real templates instantly. No guesswork, just beautiful results.'
    },
    {
      icon: Settings,
      title: 'Full Customization',
      description: 'Fine-tune every color in your palette with our intuitive color picker and controls.'
    },
    {
      icon: Palette,
      title: '50+ Templates',
      description: 'Choose from a wide variety of professional templates for different industries and styles.'
    },
    {
      icon: Wand2,
      title: 'Color Moods',
      description: 'Select from curated color moods like Elegant, Playful, Corporate, and many more.'
    },
    {
      icon: Crown,
      title: 'PRO Features',
      description: 'Unlock advanced templates, premium color schemes, and exclusive design features.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create stunning color palettes for your web projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
