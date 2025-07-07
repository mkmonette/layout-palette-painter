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

interface LivePreviewProps {
  template: TemplateType;
  colorPalette: ColorPalette;
}

const LivePreview: React.FC<LivePreviewProps> = ({ template, colorPalette }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern-hero':
        return <ModernHeroTemplate colorPalette={colorPalette} />;
      case 'minimal-header':
        return <MinimalHeaderTemplate colorPalette={colorPalette} />;
      case 'bold-landing':
        return <BoldLandingTemplate colorPalette={colorPalette} />;
      case 'creative-portfolio':
        return <CreativePortfolioTemplate colorPalette={colorPalette} />;
      case 'gradient-hero':
        return <GradientHeroTemplate colorPalette={colorPalette} />;
      case 'split-screen':
        return <SplitScreenTemplate colorPalette={colorPalette} />;
      case 'magazine-style':
        return <MagazineStyleTemplate colorPalette={colorPalette} />;
      case 'startup-landing':
        return <StartupLandingTemplate colorPalette={colorPalette} />;
      case 'tech-startup':
        return <TechStartupTemplate colorPalette={colorPalette} />;
      case 'creative-agency':
        return <CreativeAgencyTemplate colorPalette={colorPalette} />;
      case 'saas-product':
        return <SaasProductTemplate colorPalette={colorPalette} />;
      case 'ecommerce-landing':
        return <EcommerceLandingTemplate colorPalette={colorPalette} />;
      default:
        return <ModernHeroTemplate colorPalette={colorPalette} />;
    }
  };

  return (
    <div className="w-full transition-all duration-300">
      {renderTemplate()}
    </div>
  );
};

export default LivePreview;
