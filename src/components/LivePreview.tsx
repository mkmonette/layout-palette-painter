
import React from 'react';
import { TemplateType, ColorPalette } from '@/types/template';
import { Button } from '@/components/ui/button';
import TemplateBackground from '@/components/TemplateBackground';
import type { BackgroundSettings } from '@/components/BackgroundCustomizer';
import { Save, Check } from 'lucide-react';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { useToast } from '@/hooks/use-toast';
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
import ProMultimediaTemplate from '@/components/templates/ProMultimediaTemplate';
import ProInteractiveTemplate from '@/components/templates/ProInteractiveTemplate';
import ProEnterpriseTemplate from '@/components/templates/ProEnterpriseTemplate';
import ProPremiumTemplate from '@/components/templates/ProPremiumTemplate';
import ProOrganicFoodTemplate from '@/components/templates/ProOrganicFoodTemplate';
import { ProCosmeticsTemplate } from '@/components/templates/ProCosmeticsTemplate';
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

    switch (template) {
      case 'modern-hero':
        return <ModernHeroTemplate {...templateProps} />;
      case 'minimal-header':
        return <MinimalHeaderTemplate {...templateProps} />;
      case 'bold-landing':
        return <BoldLandingTemplate {...templateProps} />;
      case 'creative-portfolio':
        return <CreativePortfolioTemplate {...templateProps} />;
      case 'gradient-hero':
        return <GradientHeroTemplate {...templateProps} />;
      case 'split-screen':
        return <SplitScreenTemplate {...templateProps} />;
      case 'magazine-style':
        return <MagazineStyleTemplate {...templateProps} />;
      case 'startup-landing':
        return <StartupLandingTemplate {...templateProps} />;
      case 'tech-startup':
        return <TechStartupTemplate {...templateProps} />;
      case 'creative-agency':
        return <CreativeAgencyTemplate {...templateProps} />;
      case 'saas-product':
        return <SaasProductTemplate {...templateProps} />;
      case 'ecommerce-landing':
        return <EcommerceLandingTemplate {...templateProps} />;
      case 'pro-dashboard':
        return <ProDashboardTemplate {...templateProps} />;
      case 'pro-analytics':
        return <ProAnalyticsTemplate {...templateProps} />;
      case 'pro-multimedia':
        return <ProMultimediaTemplate {...templateProps} />;
      case 'pro-interactive':
        return <ProInteractiveTemplate {...templateProps} />;
      case 'pro-enterprise':
        return <ProEnterpriseTemplate {...templateProps} />;
      case 'pro-premium':
        return <ProPremiumTemplate {...templateProps} />;
      case 'pro-organic-food':
        return <ProOrganicFoodTemplate {...templateProps} />;
      case 'pro-cosmetics':
        return <ProCosmeticsTemplate palette={colorPalette} />;
      default:
        return <ModernHeroTemplate {...templateProps} />;
    }
  };

  return (
    <div className="relative">
      <div 
        className="template-background"
        style={{
          '--section-bg-1': colorPalette['section-bg-1'],
          '--section-bg-2': colorPalette['section-bg-2'], 
          '--section-bg-3': colorPalette['section-bg-3'],
          '--highlight': colorPalette.highlight,
          '--accent': colorPalette.accent,
          '--brand': colorPalette.brand,
        } as React.CSSProperties}
      >
        <TemplateBackground 
          settings={backgroundSettings || { enabled: false, style: 'wavy-layers', waveHeight: 50, blobSize: 50, meshIntensity: 50, patternScale: 50, opacity: 0.3 }}
          colorPalette={colorPalette}
        >
          {renderTemplate()}
        </TemplateBackground>
      </div>
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
