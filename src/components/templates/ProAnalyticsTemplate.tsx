
import React from 'react';
import { ColorPalette } from '@/types/template';

interface ProAnalyticsTemplateProps {
  colorPalette: ColorPalette;
}

const ProAnalyticsTemplate: React.FC<ProAnalyticsTemplateProps> = ({ colorPalette }) => {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colorPalette.background }}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: colorPalette.text }}>
          Advanced Analytics
        </h1>
        <p className="text-lg" style={{ color: colorPalette.textLight }}>
          Comprehensive data insights and reporting
        </p>
      </header>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.text }}>
              Real-time Metrics
            </h3>
            <div className="h-80 bg-gradient-to-r from-blue-50 to-purple-50 rounded flex items-center justify-center">
              <span style={{ color: colorPalette.primary }}>Interactive Chart Visualization</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-4" style={{ color: colorPalette.text }}>
              Performance Trends
            </h3>
            <div className="h-60 bg-gray-50 rounded flex items-center justify-center">
              <span style={{ color: colorPalette.textLight }}>Advanced Trend Analysis</span>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colorPalette.text }}>
              Key Insights
            </h3>
            <div className="space-y-4">
              {['Conversion Rate: 3.2%', 'Bounce Rate: 24%', 'Session Duration: 4:32'].map((insight) => (
                <div key={insight} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span style={{ color: colorPalette.textLight }}>{insight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colorPalette.text }}>
              Export Options
            </h3>
            <div className="space-y-2">
              {['PDF Report', 'Excel Export', 'CSV Data'].map((option) => (
                <button
                  key={option}
                  className="w-full p-3 text-left rounded border hover:bg-gray-50"
                  style={{ color: colorPalette.text }}
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
