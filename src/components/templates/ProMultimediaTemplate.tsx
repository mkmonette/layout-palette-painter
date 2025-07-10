import React from 'react';
import { ColorPalette } from '@/types/template';
import { useColorRoles } from '@/utils/colorRoleMapper';

interface ProMultimediaTemplateProps {
  colorPalette: ColorPalette;
}

const ProMultimediaTemplate: React.FC<ProMultimediaTemplateProps> = ({ colorPalette }) => {
  const colors = useColorRoles(colorPalette);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      {/* Header */}
      <header className="p-6" style={{ backgroundColor: colors.surfaceCard, borderBottom: `1px solid ${colors.borderMuted}` }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            PRO Multimedia Studio
          </h1>
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: colors.buttonPrimary, color: colors.buttonText }}
            >
              Upload Media
            </button>
            <button 
              className="px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: colors.buttonSecondary, color: colors.buttonText }}
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen" style={{ backgroundColor: colors.surfaceCard, borderRight: `1px solid ${colors.borderMuted}` }}>
          <div className="p-4">
            <h3 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>Media Library</h3>
            <div className="space-y-2">
              {['Images', 'Videos', 'Audio', 'Documents', 'Projects'].map((category) => (
                <div 
                  key={category}
                  className="p-3 rounded cursor-pointer transition-colors hover:opacity-80"
                  style={{ backgroundColor: colors.backgroundSecondary, color: colors.textSecondary }}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Media Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="aspect-square rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.backgroundSecondary, border: `1px solid ${colors.borderMuted}` }}
              >
                <span style={{ color: colors.textMuted }}>Media {i + 1}</span>
              </div>
            ))}
          </div>

          {/* Editor Panel */}
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: colors.surfaceCard, border: `1px solid ${colors.borderMuted}` }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Advanced Editor
            </h3>
            <div 
              className="h-80 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <span style={{ color: colors.textSecondary }}>Professional Editing Suite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProMultimediaTemplate;