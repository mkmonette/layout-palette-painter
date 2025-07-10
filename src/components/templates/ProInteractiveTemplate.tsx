import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProInteractiveTemplateProps {
  colorPalette: ColorPalette;
}

const ProInteractiveTemplate: React.FC<ProInteractiveTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Header */}
      <nav className="p-4" style={{ backgroundColor: colors.navBackground }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: colors.navTextActive }}>
            Interactive Experience
          </h1>
          <div className="flex space-x-6">
            {['Features', 'Demo', 'Pricing', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#"
                className="transition-colors hover:opacity-80"
                style={{ color: colors.navText }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
          Interactive Solutions
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
          Engage your audience with cutting-edge interactive experiences
        </p>
        
        <div className="flex justify-center space-x-4 mb-12">
          <button 
            className="px-8 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: colors.buttonPrimary, color: colors.buttonText }}
          >
            Start Interactive Demo
          </button>
          <button 
            className="px-8 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: colors.buttonSecondary, color: colors.buttonText }}
          >
            View Examples
          </button>
        </div>

        {/* Interactive Demo Area */}
        <div 
          className="max-w-4xl mx-auto p-8 rounded-2xl"
          style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderAccent}` }}
        >
          <h3 className="text-2xl font-semibold mb-6" style={{ color: colors.textPrimary }}>
            Live Interactive Demo
          </h3>
          <div 
            className="h-96 rounded-lg flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${colors.dataPoint1}20, ${colors.dataPoint2}20, ${colors.dataPoint3}20)`
            }}
          >
            <div className="text-center">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: colors.brandPrimary }}
              >
                <span className="text-2xl" style={{ color: colors.buttonText }}>▶</span>
              </div>
              <span style={{ color: colors.textPrimary }}>Interactive Content Area</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: colors.textPrimary }}>
            Advanced Features
          </h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: 'Real-time Interaction', desc: 'Live user engagement' },
              { title: 'Dynamic Content', desc: 'Adaptive experiences' },
              { title: 'Analytics Dashboard', desc: 'Detailed insights' }
            ].map((feature) => (
              <div 
                key={feature.title}
                className="p-6 rounded-lg text-center transition-transform hover:scale-105"
                style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
              >
                <h4 className="text-xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  {feature.title}
                </h4>
                <p style={{ color: colors.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProInteractiveTemplate;