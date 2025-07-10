
import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProAnalyticsTemplateProps {
  colorPalette: ColorPalette;
}

const ProAnalyticsTemplate: React.FC<ProAnalyticsTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.backgroundPrimary }}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Advanced Analytics
        </h1>
        <p className="text-lg" style={{ color: colors.textSecondary }}>
          Comprehensive data insights and reporting
        </p>
      </header>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-8 space-y-6">
          <div 
            className="p-6 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: colors.surfaceCard,
              border: `1px solid ${colors.borderMuted}`
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Real-time Metrics
            </h3>
            <div 
              className="h-80 rounded flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.dataPoint1}15, ${colors.dataPoint3}15)`
              }}
            >
              <span style={{ color: colors.brandPrimary }}>Interactive Chart Visualization</span>
            </div>
          </div>
          
          <div 
            className="p-6 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: colors.surfaceCard,
              border: `1px solid ${colors.borderMuted}`
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Performance Trends
            </h3>
            <div 
              className="h-60 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <span style={{ color: colors.textSecondary }}>Advanced Trend Analysis</span>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="col-span-4 space-y-6">
          <div 
            className="p-6 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: colors.surfaceCard,
              border: `1px solid ${colors.borderMuted}`
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Key Insights
            </h3>
            <div className="space-y-4">
              {[
                { metric: 'Conversion Rate', value: '3.2%', trend: 'up' },
                { metric: 'Bounce Rate', value: '24%', trend: 'down' },
                { metric: 'Session Duration', value: '4:32', trend: 'up' }
              ].map((insight) => (
                <div 
                  key={insight.metric} 
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: `1px solid ${colors.borderMuted}` }}
                >
                  <span style={{ color: colors.textSecondary }}>{insight.metric}</span>
                  <span style={{ color: insight.trend === 'up' ? colors.stateSuccess : colors.stateWarning }}>
                    {insight.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="p-6 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: colors.surfaceCard,
              border: `1px solid ${colors.borderMuted}`
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Export Options
            </h3>
            <div className="space-y-2">
              {['PDF Report', 'Excel Export', 'CSV Data'].map((option) => (
                <button
                  key={option}
                  className="w-full p-3 text-left rounded transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: colors.buttonSecondary,
                    color: colors.buttonText,
                    border: `1px solid ${colors.borderSecondary}`
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProAnalyticsTemplate;
