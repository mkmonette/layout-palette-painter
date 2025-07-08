
import React from 'react';
import { TemplateType, ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import ModernHeroTemplate from '@/components/templates/ModernHeroTemplate';
import MinimalHeaderTemplate from '@/components/templates/MinimalHeaderTemplate';
import BoldLandingTemplate from '@/components/templates/BoldLandingTemplate';
import CreativePortfolioTemplate from '@/components/templates/CreativePortfolioTemplate';
import GradientHeroTemplate from '@/components/templates/GradientHeroTemplate';
import SplitScreenTemplate from '@/components/templates/SplitScreenTemplate';
import MagazineStyleTemplate from '@/components/templates/MagazineStyleTemplate';
import StartupLandingTemplate from '@/components/templates/StartupLandingTemplate';
import TechStartupTemplate from '@/components/templates/TechStartupTemplate';
import CreativeAgencyTemplate from '@/components/templates/CreativeAgencyTemplate';
import SaasProductTemplate from '@/components/templates/SaasProductTemplate';
import EcommerceLandingTemplate from '@/components/templates/EcommerceLandingTemplate';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  colorPalette: ColorPalette;
}

const templates = [
  {
    id: 'modern-hero' as TemplateType,
    name: 'Modern Hero',
    description: 'Clean hero section with centered content'
  },
  {
    id: 'minimal-header' as TemplateType,
    name: 'Minimal Header',
    description: 'Simple header with navigation'
  },
  {
    id: 'bold-landing' as TemplateType,
    name: 'Bold Landing',
    description: 'Eye-catching landing page design'
  },
  {
    id: 'creative-portfolio' as TemplateType,
    name: 'Creative Portfolio',
    description: 'Artistic portfolio layout'
  },
  {
    id: 'gradient-hero' as TemplateType,
    name: 'Gradient Hero',
    description: 'Modern gradient background with floating elements'
  },
  {
    id: 'split-screen' as TemplateType,
    name: 'Split Screen',
    description: 'Dynamic split layout with image showcase'
  },
  {
    id: 'magazine-style' as TemplateType,
    name: 'Magazine Style',
    description: 'Editorial design with typography focus'
  },
  {
    id: 'startup-landing' as TemplateType,
    name: 'Startup Landing',
    description: 'Tech startup focused design'
  },
  {
    id: 'tech-startup' as TemplateType,
    name: 'Tech Startup',
    description: 'Modern tech company with glassmorphism'
  },
  {
    id: 'creative-agency' as TemplateType,
    name: 'Creative Agency',
    description: 'Bold creative studio design'
  },
  {
    id: 'saas-product' as TemplateType,
    name: 'SaaS Product',
    description: 'Clean SaaS landing with features'
  },
  {
    id: 'ecommerce-landing' as TemplateType,
    name: 'E-commerce Landing',
    description: 'Product-focused e-commerce design'
  }
];

const renderTemplatePreview = (templateId: TemplateType, colorPalette: ColorPalette) => {
  const previewProps = { colorPalette };
  
  switch (templateId) {
    case 'modern-hero':
      return <ModernHeroTemplate {...previewProps} />;
    case 'minimal-header':
      return <MinimalHeaderTemplate {...previewProps} />;
    case 'bold-landing':
      return <BoldLandingTemplate {...previewProps} />;
    case 'creative-portfolio':
      return <CreativePortfolioTemplate {...previewProps} />;
    case 'gradient-hero':
      return <GradientHeroTemplate {...previewProps} />;
    case 'split-screen':
      return <SplitScreenTemplate {...previewProps} />;
    case 'magazine-style':
      return <MagazineStyleTemplate {...previewProps} />;
    case 'startup-landing':
      return <StartupLandingTemplate {...previewProps} />;
    case 'tech-startup':
      return <TechStartupTemplate {...previewProps} />;
    case 'creative-agency':
      return <CreativeAgencyTemplate {...previewProps} />;
    case 'saas-product':
      return <SaasProductTemplate {...previewProps} />;
    case 'ecommerce-landing':
      return <EcommerceLandingTemplate {...previewProps} />;
    default:
      return <ModernHeroTemplate {...previewProps} />;
  }
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  colorPalette
}) => {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
            selectedTemplate === template.id 
              ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
          onClick={() => onTemplateChange(template.id)}
        >
          {/* Template Preview */}
          <div className="h-32 overflow-hidden bg-white">
            <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
              {renderTemplatePreview(template.id, colorPalette)}
            </div>
          </div>
          
          {/* Template Info */}
          <div className={`p-4 ${
            selectedTemplate === template.id 
              ? 'bg-blue-50 border-t border-blue-100' 
              : 'bg-gray-50 border-t border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${
                  selectedTemplate === template.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {template.name}
                </h3>
                <p className={`text-sm ${
                  selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {template.description}
                </p>
              </div>
              {selectedTemplate === template.id && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-blue-600">Selected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
