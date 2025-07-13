import React from 'react';
import { Button } from '@/components/ui/button';
import { ColorPalette } from '@/types/template';
import { ArrowRight, Play, Award, Users, Star } from 'lucide-react';

interface AdvancedHeroTemplateProps {
  colorPalette: ColorPalette;
  isDarkMode?: boolean;
}

export const AdvancedHeroTemplate: React.FC<AdvancedHeroTemplateProps> = ({ 
  colorPalette, 
  isDarkMode = false 
}) => {
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const overlayClass = isDarkMode ? 'bg-black/40' : 'bg-white/85';

  return (
    <div className={`relative min-h-screen ${bgClass} overflow-hidden`}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}22, ${colorPalette.accent}22)`
        }}
      />
      <div className={`absolute inset-0 ${overlayClass} backdrop-blur-sm`} />
      
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Content Section */}
        <div className="flex-1 flex items-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-2xl space-y-8">
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm font-medium opacity-80">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" style={{ color: colorPalette.accent }} />
                <span style={{ color: colorPalette['text-primary'] }}>4.9 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" style={{ color: colorPalette.accent }} />
                <span style={{ color: colorPalette['text-primary'] }}>50k+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" style={{ color: colorPalette.accent }} />
                <span style={{ color: colorPalette['text-primary'] }}>Award Winning</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 
                className="text-5xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight"
                style={{ color: colorPalette['text-primary'] }}
              >
                Transform Your
                <span 
                  className="block bg-gradient-to-r from-current to-current bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${colorPalette.brand}, ${colorPalette.accent})`
                  }}
                >
                  Digital Future
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p 
              className="text-xl lg:text-2xl leading-relaxed font-light max-w-xl"
              style={{ color: colorPalette['text-secondary'] }}
            >
              Unleash the power of cutting-edge technology with our revolutionary platform. 
              Experience seamless integration, unmatched performance, and limitless possibilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="group relative px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: colorPalette['button-primary'],
                  color: colorPalette['button-text'],
                  border: `2px solid ${colorPalette['button-primary']}`
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  color: colorPalette['button-secondary-text'],
                  borderColor: colorPalette['button-secondary']
                }}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap gap-6 pt-8 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colorPalette.accent }}
                />
                <span style={{ color: colorPalette['text-secondary'] }}>
                  No credit card required
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colorPalette.accent }}
                />
                <span style={{ color: colorPalette['text-secondary'] }}>
                  14-day free trial
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colorPalette.accent }}
                />
                <span style={{ color: colorPalette['text-secondary'] }}>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Image Section */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="relative">
            {/* Main Hero Image Container */}
            <div 
              className="relative w-96 h-96 xl:w-[500px] xl:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
              style={{
                background: `linear-gradient(135deg, ${colorPalette.brand}20, ${colorPalette.accent}20)`
              }}
            >
              {/* Placeholder for hero image */}
              <div 
                className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colorPalette['section-bg-1']}, ${colorPalette['section-bg-2']})`
                }}
              >
                <div className="text-center space-y-4 p-8">
                  <div 
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colorPalette.brand }}
                  >
                    <Award 
                      className="w-12 h-12"
                      style={{ color: colorPalette['button-text'] }}
                    />
                  </div>
                  <h3 
                    className="text-2xl font-bold"
                    style={{ color: colorPalette['text-primary'] }}
                  >
                    Hero Image
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: colorPalette['text-secondary'] }}
                  >
                    Replace with your product showcase
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div 
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colorPalette.accent }}
            >
              <Star 
                className="w-8 h-8"
                style={{ color: colorPalette['button-text'] }}
              />
            </div>
            
            <div 
              className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colorPalette.highlight }}
            >
              <Users 
                className="w-6 h-6"
                style={{ color: colorPalette['button-text'] }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-current to-transparent opacity-10"
        style={{ color: colorPalette['section-bg-3'] }}
      />
    </div>
  );
};