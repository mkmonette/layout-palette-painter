
import React from 'react';
import { TemplateType, ColorPalette } from '@/types/template';
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
import { Crown } from 'lucide-react';

interface LivePreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
}

const LivePreview: React.FC<LivePreviewProps> = ({ template, colorPalette }) => {
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
      // Placeholder for other PRO templates
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
        return <ModernHeroTemplate {...templateProps} />;
    }
  };

  return <>{renderTemplate()}</>;
};

export default LivePreview;
