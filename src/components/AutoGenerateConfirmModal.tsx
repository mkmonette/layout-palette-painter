import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplateType } from '@/types/template';
import { ColorSchemeType } from '@/components/ColorSchemeSelector';
import { ColorPalette } from '@/utils/colorGenerator';

interface AutoGenerateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: TemplateType;
  selectedScheme: ColorSchemeType;
  selectedMoodId: string | null;
  autogenerateCount: number;
  colorPalette: ColorPalette;
  onGenerate: () => void;
}

const AutoGenerateConfirmModal: React.FC<AutoGenerateConfirmModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  selectedScheme,
  selectedMoodId,
  autogenerateCount,
  colorPalette,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Small delay for UX
    setTimeout(() => {
      onGenerate();
      setIsGenerating(false);
    }, 1000);
  };

  const templateNames: Record<TemplateType, string> = {
    'modern-hero': 'Modern Hero',
    'minimal-header': 'Minimal Header',
    'bold-landing': 'Bold Landing',
    'creative-portfolio': 'Creative Portfolio',
    'gradient-hero': 'Gradient Hero',
    'split-screen': 'Split Screen',
    'magazine-style': 'Magazine Style',
    'startup-landing': 'Startup Landing',
    'tech-startup': 'Tech Startup',
    'creative-agency': 'Creative Agency',
    'saas-product': 'SaaS Product',
    'ecommerce-landing': 'E-commerce Landing',
    'advanced-hero': 'Advanced Hero',
    'creative-showcase': 'Creative Showcase',
    'startup-vision': 'Startup Vision',
    'tech-innovation': 'Tech Innovation',
    'luxury-brand': 'Luxury Brand',
    'modern-executive': 'Modern Executive',
    'pro-cosmetics': 'Pro Cosmetics',
    'ecommerce-fashion-boutique': 'Fashion Boutique',
    'ecommerce-marketplace': 'E-commerce Marketplace',
    'ecommerce-minimal-store': 'Minimal Store',
    'ecommerce-product-showcase': 'Product Showcase',
    'ecommerce-tech-store': 'Tech Store',
    'custom-figma': 'Custom Figma'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate Color Palettes
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {autogenerateCount}
            </div>
            <div className="text-sm text-gray-600">
              Color palettes will be generated for
            </div>
            <div className="font-medium text-gray-900 mt-1">
              {templateNames[selectedTemplate]}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Template:</span>
              <span className="font-medium text-gray-900">{templateNames[selectedTemplate]}</span>
            </div>
            <div className="flex justify-between">
              <span>Color Scheme:</span>
              <span className="font-medium text-gray-900 capitalize">{selectedScheme}</span>
            </div>
            {selectedMoodId && (
              <div className="flex justify-between">
                <span>Mood:</span>
                <span className="font-medium text-gray-900">Applied</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Palettes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutoGenerateConfirmModal;