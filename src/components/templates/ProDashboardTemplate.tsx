
import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProDashboardTemplateProps {
  colorPalette: ColorPalette;
}

const ProDashboardTemplate: React.FC<ProDashboardTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen" style={{ backgroundColor: colors.navBackground }}>
          <div className="p-6">
            <h2 className="text-xl font-bold" style={{ color: colors.navTextActive }}>Dashboard</h2>
            <nav className="mt-8 space-y-2">
              {['Analytics', 'Reports', 'Settings', 'Users'].map((item) => (
                <div 
                  key={item} 
                  className="px-4 py-2 rounded cursor-pointer transition-colors hover:opacity-80"
                  style={{ 
                    color: colors.navText
                  }}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8" style={{ color: colors.textPrimary }}>
            PRO Dashboard
          </h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Revenue', value: '$24,500', change: '+12%' },
              { label: 'Users', value: '1,234', change: '+8%' },
              { label: 'Orders', value: '456', change: '+15%' },
              { label: 'Growth', value: '23%', change: '+3%' }
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="p-6 rounded-lg shadow-sm"
                style={{ 
                  backgroundColor: colors.surfaceCard,
                  border: `1px solid ${colors.borderMuted}`
                }}
              >
                <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.label}</div>
                <div className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: colors.stateSuccess }}>{stat.change}</div>
              </div>
            ))}
          </div>
          
          {/* Chart Area */}
          <div 
            className="p-6 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: colors.surfaceCard,
              border: `1px solid ${colors.borderMuted}`
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Analytics Overview</h3>
            <div 
              className="h-64 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <span style={{ color: colors.textSecondary }}>Advanced Chart Component</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboardTemplate;
