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
import { ProCosmeticsTemplate } from '@/components/templates/ProCosmeticsTemplate';
import { AdvancedHeroTemplate } from '@/components/templates/AdvancedHeroTemplate';
import { ModernExecutiveTemplate } from '@/components/templates/ModernExecutiveTemplate';
import { CreativeShowcaseTemplate } from '@/components/templates/CreativeShowcaseTemplate';
import { TechInnovationTemplate } from '@/components/templates/TechInnovationTemplate';
import { LuxuryBrandTemplate } from '@/components/templates/LuxuryBrandTemplate';
import { StartupVisionTemplate } from '@/components/templates/StartupVisionTemplate';
import { ProfessionalHeroTemplate } from '@/components/templates/ProfessionalHeroTemplate';
import EcommerceProductShowcaseTemplate from '@/components/templates/EcommerceProductShowcaseTemplate';
import EcommerceMinimalStoreTemplate from '@/components/templates/EcommerceMinimalStoreTemplate';
import EcommerceFashionBoutiqueTemplate from '@/components/templates/EcommerceFashionBoutiqueTemplate';
import EcommerceTechStoreTemplate from '@/components/templates/EcommerceTechStoreTemplate';
import EcommerceMarketplaceTemplate from '@/components/templates/EcommerceMarketplaceTemplate';
interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  colorPalette: ColorPalette;
}
const freeTemplates: Template[] = [{
  id: 'modern-hero',
  name: 'Modern Hero',
  description: 'Clean hero section with centered content',
  isPro: false
}, {
  id: 'minimal-header',
  name: 'Minimal Header',
  description: 'Simple header with navigation',
  isPro: false
}, {
  id: 'bold-landing',
  name: 'Bold Landing',
  description: 'Eye-catching landing page design',
  isPro: false
}, {
  id: 'creative-portfolio',
  name: 'Creative Portfolio',
  description: 'Artistic portfolio layout',
  isPro: false
}, {
  id: 'gradient-hero',
  name: 'Gradient Hero',
  description: 'Modern gradient background with floating elements',
  isPro: false
}, {
  id: 'split-screen',
  name: 'Split Screen',
  description: 'Dynamic split layout with image showcase',
  isPro: false
}, {
  id: 'magazine-style',
  name: 'Magazine Style',
  description: 'Editorial design with typography focus',
  isPro: false
}, {
  id: 'startup-landing',
  name: 'Startup Landing',
  description: 'Tech startup focused design',
  isPro: false
}, {
  id: 'tech-startup',
  name: 'Tech Startup',
  description: 'Modern tech company with glassmorphism',
  isPro: false
}, {
  id: 'creative-agency',
  name: 'Creative Agency',
  description: 'Bold creative studio design',
  isPro: false
}, {
  id: 'saas-product',
  name: 'SaaS Product',
  description: 'Clean SaaS landing with features',
  isPro: false
}, {
  id: 'ecommerce-landing',
  name: 'E-commerce Landing',
  description: 'Product-focused e-commerce design',
  isPro: false
}, {
  id: 'ecommerce-product-showcase',
  name: 'Product Showcase',
  description: 'Feature products with detailed views',
  isPro: false
}, {
  id: 'ecommerce-minimal-store',
  name: 'Minimal Store',
  description: 'Clean, minimal e-commerce design',
  isPro: false
}, {
  id: 'ecommerce-fashion-boutique',
  name: 'Fashion Boutique',
  description: 'Elegant fashion store template',
  isPro: false
}, {
  id: 'ecommerce-tech-store',
  name: 'Tech Store',
  description: 'Electronics and gadgets store',
  isPro: false
}, {
  id: 'ecommerce-marketplace',
  name: 'Marketplace',
  description: 'Multi-vendor marketplace design',
  isPro: false
}];
const proTemplates: Template[] = [
  { id: 'pro-cosmetics', name: 'Pro Cosmetics', description: 'Premium beauty and cosmetics template with elegant product showcase', isPro: true },
  { id: 'advanced-hero', name: 'Advanced Hero', description: 'Sophisticated header design with premium typography and visual elements', isPro: true },
  { id: 'modern-executive', name: 'Modern Executive', description: 'Professional business template with strategic design and authority', isPro: true },
  { id: 'creative-showcase', name: 'Creative Showcase', description: 'Dynamic creative template with artistic layouts and bold visuals', isPro: true },
  { id: 'tech-innovation', name: 'Tech Innovation', description: 'Cutting-edge technology template with futuristic design elements', isPro: true },
  { id: 'luxury-brand', name: 'Luxury Brand', description: 'Premium luxury template with sophisticated elegance and refinement', isPro: true },
  { id: 'startup-vision', name: 'Startup Vision', description: 'Dynamic startup template with growth-focused design and innovation', isPro: true },
  { id: 'professional-hero', name: 'Professional Hero', description: 'Professional business hero section with consultant image and gradient background', isPro: true },
];
const renderTemplatePreview = (templateId: TemplateType, colorPalette: ColorPalette) => {
  const previewProps = {
    colorPalette
  };
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
    case 'ecommerce-product-showcase':
      return <EcommerceProductShowcaseTemplate {...previewProps} />;
    case 'ecommerce-minimal-store':
      return <EcommerceMinimalStoreTemplate {...previewProps} />;
    case 'ecommerce-fashion-boutique':
      return <EcommerceFashionBoutiqueTemplate {...previewProps} />;
    case 'ecommerce-tech-store':
      return <EcommerceTechStoreTemplate {...previewProps} />;
    case 'ecommerce-marketplace':
      return <EcommerceMarketplaceTemplate {...previewProps} />;
    case 'pro-cosmetics':
      return <ProCosmeticsTemplate palette={colorPalette} />;
      case 'advanced-hero':
        return <AdvancedHeroTemplate colorPalette={colorPalette} />;
      case 'modern-executive':
        return <ModernExecutiveTemplate colorPalette={colorPalette} />;
      case 'creative-showcase':
        return <CreativeShowcaseTemplate colorPalette={colorPalette} />;
      case 'tech-innovation':
        return <TechInnovationTemplate colorPalette={colorPalette} />;
      case 'luxury-brand':
        return <LuxuryBrandTemplate colorPalette={colorPalette} />;
      case 'startup-vision':
        return <StartupVisionTemplate colorPalette={colorPalette} />;
      case 'professional-hero':
        return <ProfessionalHeroTemplate colorPalette={colorPalette} isDarkMode={false} />;
    default:
      return <ModernHeroTemplate {...previewProps} />;
  }
};
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  colorPalette
}) => {
  const {
    isPro
  } = useFeatureAccess();
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [upsellModal, setUpsellModal] = useState<{
    isOpen: boolean;
    templateName: string;
  }>({
    isOpen: false,
    templateName: ''
  });
  const handleTemplateClick = (template: Template) => {
    if (template.isPro && !isPro) {
      setUpsellModal({
        isOpen: true,
        templateName: template.name
      });
      return;
    }
    onTemplateChange(template.id);
  };
  const getFilteredTemplates = () => {
    switch (filter) {
      case 'free':
        return {
          free: freeTemplates,
          pro: []
        };
      case 'pro':
        return {
          free: [],
          pro: proTemplates
        };
      default:
        return {
          free: freeTemplates,
          pro: proTemplates
        };
    }
  };
  const {
    free: filteredFree,
    pro: filteredPro
  } = getFilteredTemplates();
  const renderTemplateCard = (template: Template) => {
    const isLocked = template.isPro && !isPro;
    const isSelected = selectedTemplate === template.id;
    return <TooltipProvider key={template.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`relative border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' : isLocked ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`} onClick={() => handleTemplateClick(template)}>
              {/* PRO Badge */}
              {template.isPro && <Badge variant="secondary" className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>}
              
              {/* Lock Overlay */}
              {isLocked && <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 p-2 rounded-full">
                    <Lock className="h-6 w-6 text-gray-600" />
                  </div>
                </div>}

              {/* Template Preview */}
              <div className={`h-32 overflow-hidden bg-white ${isLocked ? 'blur-sm' : ''}`}>
                <div className="transform scale-[0.2] origin-top-left w-[500%] h-[500%] pointer-events-none">
                  {renderTemplatePreview(template.id, colorPalette)}
                </div>
              </div>
              
              {/* Template Info */}
              <div className={`p-3 ${isSelected ? 'bg-blue-50 border-t border-blue-100' : 'bg-gray-50 border-t border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    
                  </div>
                  {isSelected && <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-blue-600">Selected</span>
                    </div>}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          {isLocked && <TooltipContent>
              <p>Unlock this PRO template with a PRO subscription</p>
            </TooltipContent>}
        </Tooltip>
      </TooltipProvider>;
  };
  const allTemplates = [...filteredFree, ...filteredPro];
  return <>
      {/* Filter Buttons - Now at the top */}
      <div className="flex gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          Show All
        </Button>
        <Button variant={filter === 'free' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('free')} className="text-xs">
          FREE Only
        </Button>
        <Button variant={filter === 'pro' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('pro')} className="flex items-center gap-2">
          <Crown className="h-3 w-3" />
          PRO Only
        </Button>
      </div>

      {/* 2 Column Template Grid */}
      <div className="grid grid-cols-2 gap-2">
        {allTemplates.map(renderTemplateCard)}
      </div>

      {/* PRO Upsell Modal */}
      <ProUpsellModal isOpen={upsellModal.isOpen} onClose={() => setUpsellModal({
      isOpen: false,
      templateName: ''
    })} templateName={upsellModal.templateName} />
    </>;
};
export default TemplateSelector;