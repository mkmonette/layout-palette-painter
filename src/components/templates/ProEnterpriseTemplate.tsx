import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProEnterpriseTemplateProps {
  colorPalette: ColorPalette;
}

const ProEnterpriseTemplate: React.FC<ProEnterpriseTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Header */}
      <header className="p-6" style={{ backgroundColor: colors.surfaceCard, borderBottom: `1px solid ${colors.borderMuted}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Enterprise Suite
            </h1>
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: colors.brandPrimary, color: colors.buttonText }}
            >
              ENTERPRISE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: colors.buttonSecondary, color: colors.buttonText }}
            >
              Settings
            </button>
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: colors.buttonPrimary, color: colors.buttonText }}
            >
              Admin Panel
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '45,231', trend: '+12%' },
            { label: 'Active Sessions', value: '3,847', trend: '+8%' },
            { label: 'Monthly Revenue', value: '$2.4M', trend: '+15%' },
            { label: 'System Uptime', value: '99.9%', trend: '+0.1%' },
            { label: 'Support Tickets', value: '23', trend: '-18%' }
          ].map((metric) => (
            <div 
              key={metric.label}
              className="p-6 rounded-lg"
              style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
            >
              <div className="text-sm" style={{ color: colors.textSecondary }}>{metric.label}</div>
              <div className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{metric.value}</div>
              <div className="text-sm mt-1" style={{ color: colors.stateSuccess }}>{metric.trend}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* System Health */}
          <div 
            className="col-span-2 p-6 rounded-lg"
            style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>
              System Health Monitor
            </h3>
            <div 
              className="h-64 rounded flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.stateSuccess}15, ${colors.stateInfo}15)`
              }}
            >
              <span style={{ color: colors.textPrimary }}>Real-time System Monitoring</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                'Deploy New Version',
                'Scale Resources',
                'Security Audit',
                'Backup Database',
                'Generate Report'
              ].map((action) => (
                <button
                  key={action}
                  className="w-full p-3 text-left rounded transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderSecondary}`
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Security Center */}
          <div 
            className="col-span-3 p-6 rounded-lg"
            style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Enterprise Security Center
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Firewall Status', status: 'Active', color: colors.stateSuccess },
                { label: 'SSL Certificates', status: 'Valid', color: colors.stateSuccess },
                { label: 'Access Control', status: 'Enabled', color: colors.stateSuccess },
                { label: 'Audit Logs', status: 'Current', color: colors.stateInfo }
              ].map((security) => (
                <div 
                  key={security.label}
                  className="p-4 rounded text-center"
                  style={{ backgroundColor: colors.backgroundSecondary }}
                >
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{security.label}</div>
                  <div className="font-semibold mt-1" style={{ color: security.color }}>
                    {security.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProEnterpriseTemplate;