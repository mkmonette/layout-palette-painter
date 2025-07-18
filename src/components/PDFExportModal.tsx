import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Download, Star, Zap } from 'lucide-react';
import { ColorPalette } from '@/types/template';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBasicExport: () => void;
  onProfessionalExport: () => void;
  isPro: boolean;
  colorPalette: ColorPalette;
  templateName: string;
}

const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  onBasicExport,
  onProfessionalExport,
  isPro
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Color Palette
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* Basic PDF Report */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Basic PDF Report</h3>
              <Badge variant="secondary">Free</Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Color palette overview
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                HEX & RGB color codes
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Template preview
              </div>
            </div>

            <Button 
              onClick={onBasicExport}
              className="w-full" 
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Basic Report
            </Button>
          </div>

          {/* Professional PDF Report */}
          <div className="border rounded-lg p-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Professional PDF Report
              </h3>
              <Badge variant="default" className="bg-blue-600">
                <Zap className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Everything in Basic
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                A4 landscape layout
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Professional cover page
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Accessibility & contrast analysis
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                WCAG compliance report
              </div>
            </div>

            <Button 
              onClick={onProfessionalExport}
              className="w-full" 
              disabled={!isPro}
              variant={isPro ? "default" : "secondary"}
            >
              <Download className="h-4 w-4 mr-2" />
              {isPro ? "Download Professional Report" : "Upgrade to Pro"}
            </Button>
            
            {!isPro && (
              <p className="text-xs text-center text-muted-foreground">
                Upgrade to Pro to unlock professional PDF reports
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFExportModal;