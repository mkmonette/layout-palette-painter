import React, { useState } from 'react';
import { TemplateType, ColorPalette, Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Lock } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import ProUpsellModal from '@/components/ProUpsellModal';
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
import ProDashboardTemplate from '@/components/templates/ProDashboardTemplate';
import ProAnalyticsTemplate from '@/components/templates/ProAnalyticsTemplate';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  colorPalette: ColorPalette;
}

const freeTemplates: Template[] = [
  { id: 'modern-hero', name: 'Modern Hero', description: 'Clean hero section with centered content', isPro: false },
  { id: 'minimal-header', name: 'Minimal Header', description: 'Simple header with navigation', isPro: false },
  { id: 'bold-landing', name: 'Bold Landing', description: 'Eye-catching landing page design', isPro: false },
  { id: 'creative-portfolio', name: 'Creative Portfolio', description: 'Artistic portfolio layout', isPro: false },
  { id: 'gradient-hero', name: 'Gradient Hero', description: 'Modern gradient background with floating elements', isPro: false },
  { id: 'split-screen', name: 'Split Screen', description: 'Dynamic split layout with image showcase', isPro: false },
  { id: 'magazine-style', name: 'Magazine Style', description: 'Editorial design with typography focus', isPro: false },
  { id: 'startup-landing', name: 'Startup Landing', description: 'Tech startup focused design', isPro: false },
  { id: 'tech-startup', name: 'Tech Startup', description: 'Modern tech company with glassmorphism', isPro: false },
  { id: 'creative-agency', name: 'Creative Agency', description: 'Bold creative studio design', isPro: false },
  { id: 'saas-product', name: 'SaaS Product', description: 'Clean SaaS landing with features', isPro: false },
  { id: 'ecommerce-landing', name: 'E-commerce Landing', description: 'Product-focused e-commerce design', isPro: false }
];

const proTemplates: Template[] = [
  { id: 'pro-dashboard', name: 'PRO Dashboard', description: 'Advanced admin dashboard with analytics', isPro: true },
  { id: 'pro-analytics', name: 'PRO Analytics', description: 'Comprehensive data visualization suite', isPro: true },
  { id: 'pro-multimedia', name: 'PRO Multimedia', description: 'Rich media showcase with interactions', isPro: true },
  { id: 'pro-interactive', name: 'PRO Interactive', description: 'Dynamic components with animations', isPro: true },
  { id: 'pro-enterprise', name: 'PRO Enterprise', description: 'Corporate-grade business template', isPro: true },
  { id: 'pro-premium', name: 'PRO Premium', description: 'Luxury design with premium features', isPro: true }
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
    case 'pro-dashboard':
      return <ProDashboardTemplate {...previewProps} />;
    case 'pro-analytics':
      return <ProAnalyticsTemplate {...previewProps} />;
    // For now, PRO templates that don't have components yet will show a placeholder
    case 'pro-multimedia':
    case 'pro-interactive':
    case 'pro-enterprise':
    case 'pro-premium':
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">PRO Template</h2>
            <p className="text-gray-600">Advanced design coming soon</p>
          </div>
        </div>
      );
    default:
      return <ModernHeroTemplate {...previewProps} />;
  }
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  colorPalette
}) => {
  const { canAccessProTemplates } = useFeatureAccess();
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean; templateName: string }>({
    isOpen: false,
    templateName: ''
  });

  const handleTemplateClick = (template: Template) => {
    if (template.isPro && !canAccessProTemplates) {
      setUpsellModal({ isOpen: true, templateName: template.name });
      return;
    }
    onTemplateChange(template.id);
  };

  const getFilteredTemplates = () => {
    switch (filter) {
      case 'free':
        return { free: freeTemplates, pro: [] };
      case 'pro':
        return { free: [], pro: proTemplates };
      default:
        return { free: freeTemplates, pro: proTemplates };
    }
  };

  const { free: filteredFree, pro: filteredPro } = getFilteredTemplates();

  const renderTemplateCard = (template: Template) => {
    const isLocked = template.isPro && !canAccessProTemplates;
    const isSelected = selectedTemplate === template.id;

    return (
      <TooltipProvider key={template.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`relative border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                  : isLocked
                  ? 'border-gray-200 opacity-60'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => handleTemplateClick(template)}
            >
              {/* PRO Badge */}
              {template.isPro && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
              
              {/* Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 p-2 rounded-full">
                    <Lock className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              )}

              {/* Template Preview */}
              <div className={`h-32 overflow-hidden bg-white ${isLocked ? 'blur-sm' : ''}`}>
                <div className="transform scale-[0.2] origin-top-left w-[500%] h-[500%] pointer-events-none">
                  {renderTemplatePreview(template.id, colorPalette)}
                </div>
              </div>
              
              {/* Template Info */}
              <div className={`p-3 ${
                isSelected 
                  ? 'bg-blue-50 border-t border-blue-100' 
                  : 'bg-gray-50 border-t border-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium text-sm ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {template.name}
                    </h3>
                    <p className={`text-xs ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {template.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-blue-600">Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          {isLocked && (
            <TooltipContent>
              <p>Unlock this PRO template with a PRO subscription</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const allTemplates = [...filteredFree, ...filteredPro];

  return (
    <>
      {/* Filter Buttons - Now at the top */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Show All
        </Button>
        <Button
          variant={filter === 'free' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('free')}
        >
          FREE Only
        </Button>
        <Button
          variant={filter === 'pro' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pro')}
          className="flex items-center gap-2"
        >
          <Crown className="h-3 w-3" />
          PRO Only
        </Button>
      </div>

      {/* 4 Column Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allTemplates.map(renderTemplateCard)}
      </div>

      {/* PRO Upsell Modal */}
      <ProUpsellModal
        isOpen={upsellModal.isOpen}
        onClose={() => setUpsellModal({ isOpen: false, templateName: '' })}
        templateName={upsellModal.templateName}
      />
    </>
  );
};

export default TemplateSelector;
