
import React from 'react';
import { TemplateType, ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import TemplateBackground from '@/components/TemplateBackground';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';
import { Save, Check } from 'lucide-react';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
import TemplateWrapper from '@/components/TemplateWrapper';
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
import { Crown } from 'lucide-react';

interface LivePreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
  showSaveButton?: boolean;
  backgroundSettings?: BackgroundSettings;
}

const LivePreview: React.FC<LivePreviewProps> = ({ template, colorPalette, showSaveButton = false, backgroundSettings }) => {
  const { canSaveMore, savePalette } = useSavedPalettes();
  const { toast } = useToast();
  const handleSave = () => {
    const success = savePalette(colorPalette, template);
    if (success) {
      toast({
        title: "Palette Saved",
        description: "Your color palette has been saved successfully.",
      });
    } else {
      toast({
        title: "Save Limit Reached",
        description: "You've reached the maximum number of saved palettes (10).",
        variant: "destructive"
      });
    }
  };

  const renderTemplate = () => {
    const templateProps = { colorPalette };

    let templateComponent;
    switch (template) {
      case 'modern-hero':
        templateComponent = <ModernHeroTemplate {...templateProps} />;
        break;
      case 'minimal-header':
        templateComponent = <MinimalHeaderTemplate {...templateProps} />;
        break;
      case 'bold-landing':
        templateComponent = <BoldLandingTemplate {...templateProps} />;
        break;
      case 'creative-portfolio':
        templateComponent = <CreativePortfolioTemplate {...templateProps} />;
        break;
      case 'gradient-hero':
        templateComponent = <GradientHeroTemplate {...templateProps} />;
        break;
      case 'split-screen':
        templateComponent = <SplitScreenTemplate {...templateProps} />;
        break;
      case 'magazine-style':
        templateComponent = <MagazineStyleTemplate {...templateProps} />;
        break;
      case 'startup-landing':
        templateComponent = <StartupLandingTemplate {...templateProps} />;
        break;
      case 'tech-startup':
        templateComponent = <TechStartupTemplate {...templateProps} />;
        break;
      case 'creative-agency':
        templateComponent = <CreativeAgencyTemplate {...templateProps} />;
        break;
      case 'saas-product':
        templateComponent = <SaasProductTemplate {...templateProps} />;
        break;
      case 'ecommerce-landing':
        templateComponent = <EcommerceLandingTemplate {...templateProps} />;
        break;
      case 'ecommerce-product-showcase':
        templateComponent = <EcommerceProductShowcaseTemplate {...templateProps} />;
        break;
      case 'ecommerce-minimal-store':
        templateComponent = <EcommerceMinimalStoreTemplate {...templateProps} />;
        break;
      case 'ecommerce-fashion-boutique':
        templateComponent = <EcommerceFashionBoutiqueTemplate {...templateProps} />;
        break;
      case 'ecommerce-tech-store':
        templateComponent = <EcommerceTechStoreTemplate {...templateProps} />;
        break;
      case 'ecommerce-marketplace':
        templateComponent = <EcommerceMarketplaceTemplate {...templateProps} />;
        break;
      case 'pro-cosmetics':
        templateComponent = <ProCosmeticsTemplate palette={colorPalette} />;
        break;
      case 'advanced-hero':
        templateComponent = <AdvancedHeroTemplate colorPalette={colorPalette} />;
        break;
      case 'modern-executive':
        templateComponent = <ModernExecutiveTemplate colorPalette={colorPalette} />;
        break;
      case 'creative-showcase':
        templateComponent = <CreativeShowcaseTemplate colorPalette={colorPalette} />;
        break;
      case 'tech-innovation':
        templateComponent = <TechInnovationTemplate colorPalette={colorPalette} />;
        break;
      case 'luxury-brand':
        templateComponent = <LuxuryBrandTemplate colorPalette={colorPalette} />;
        break;
      case 'startup-vision':
        templateComponent = <StartupVisionTemplate colorPalette={colorPalette} />;
        break;
      case 'professional-hero':
        templateComponent = <ProfessionalHeroTemplate colorPalette={colorPalette} isDarkMode={false} backgroundSettings={backgroundSettings} />;
        break;
      default:
        templateComponent = <ModernHeroTemplate {...templateProps} />;
    }

    return (
      <TemplateWrapper 
        colorPalette={colorPalette}
        backgroundSettings={backgroundSettings}
      >
        {templateComponent}
      </TemplateWrapper>
    );
  };

  return (
    <div className="relative">
      {renderTemplate()}
      {showSaveButton && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleSave}
            disabled={!canSaveMore()}
            size="sm"
            className="bg-white/90 text-gray-800 hover:bg-white border shadow-lg"
            title={canSaveMore() ? "Save this palette" : "Save limit reached (10 max)"}
          >
            {canSaveMore() ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Limit Reached
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
