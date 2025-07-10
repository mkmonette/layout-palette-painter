import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProPremiumTemplateProps {
  colorPalette: ColorPalette;
}

const ProPremiumTemplate: React.FC<ProPremiumTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Premium Header */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${colors.brandPrimary}, ${colors.brandAccent})`
          }}
        />
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.textInverse }}>
            Premium Experience
          </h1>
          <p className="text-xl" style={{ color: colors.textInverse, opacity: 0.9 }}>
            Luxury meets functionality
          </p>
          <div className="mt-8">
            <button 
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ 
                backgroundColor: colors.textInverse,
                color: colors.brandPrimary,
                boxShadow: `0 10px 30px ${colors.brandPrimary}40`
              }}
            >
              Explore Premium Features
            </button>
          </div>
        </div>
      </header>

      {/* Premium Content */}
      <div className="p-8">
        {/* Luxury Showcase */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-2 gap-8">
            <div 
              className="p-8 rounded-2xl"
              style={{ 
                backgroundColor: colors.surfaceCard,
                border: `2px solid ${colors.borderAccent}`,
                boxShadow: `0 20px 40px ${colors.brandPrimary}20`
              }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Exclusive Access
              </h3>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                Unlock premium features designed for the most demanding users
              </p>
              <div 
                className="h-48 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.dataPoint1}30, ${colors.dataPoint3}30)`
                }}
              >
                <span style={{ color: colors.brandPrimary }}>Premium Content Preview</span>
              </div>
            </div>

            <div 
              className="p-8 rounded-2xl"
              style={{ 
                backgroundColor: colors.surfaceCard,
                border: `2px solid ${colors.borderAccent}`,
                boxShadow: `0 20px 40px ${colors.brandSecondary}20`
              }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Advanced Analytics
              </h3>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                Deep insights with premium reporting capabilities
              </p>
              <div 
                className="h-48 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.dataPoint2}30, ${colors.dataPoint4}30)`
                }}
              >
                <span style={{ color: colors.brandSecondary }}>Advanced Analytics Suite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.textPrimary }}>
            Premium Features
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { 
                title: 'White Glove Service', 
                desc: 'Dedicated premium support team',
                icon: '👑'
              },
              { 
                title: 'Custom Integrations', 
                desc: 'Tailored solutions for your workflow',
                icon: '🔧'
              },
              { 
                title: 'Priority Processing', 
                desc: 'Lightning-fast performance guarantee',
                icon: '⚡'
              },
              { 
                title: 'Advanced Security', 
                desc: 'Enterprise-grade protection',
                icon: '🛡️'
              },
              { 
                title: 'Unlimited Access', 
                desc: 'No restrictions on usage',
                icon: '∞'
              },
              { 
                title: 'Exclusive Updates', 
                desc: 'First access to new features',
                icon: '🚀'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-xl text-center transition-all hover:scale-105"
                style={{ 
                  backgroundColor: colors.surfaceCard,
                  border: `1px solid ${colors.borderAccent}`,
                  boxShadow: `0 10px 25px ${colors.brandPrimary}15`
                }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  {feature.title}
                </h4>
                <p style={{ color: colors.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPremiumTemplate;