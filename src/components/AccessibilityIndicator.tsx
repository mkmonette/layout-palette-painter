import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateAccessibilityReport, AccessibilityReport } from '@/utils/accessibilityChecker';
import { ColorPalette } from '@/utils/colorGenerator';

interface AccessibilityIndicatorProps {
  palette: ColorPalette;
  isVisible: boolean;
}

const AccessibilityIndicator: React.FC<AccessibilityIndicatorProps> = ({ palette, isVisible }) => {
  if (!isVisible) return null;

  const report = generateAccessibilityReport(palette);

  const getContrastIcon = (ratio: number, isAccessible: boolean) => {
    if (isAccessible) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getContrastBadge = (level: 'AA' | 'AAA' | 'FAIL') => {
    const variants = {
      AA: 'bg-green-100 text-green-800',
      AAA: 'bg-emerald-100 text-emerald-800',
      FAIL: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={variants[level]}>
        {level === 'FAIL' ? 'FAIL' : `WCAG ${level}`}
      </Badge>
    );
  };

  const contrastPairs = [
    { name: 'Text on Background', result: report.textOnBackground },
    { name: 'Secondary Text on Background', result: report.textSecondaryOnBackground },
    { name: 'Text on Brand', result: report.textOnBrand },
    { name: 'Text on Highlight', result: report.textOnHighlight },
    { name: 'Text on Accent', result: report.textOnAccent }
  ];

  return (
    <Card className="mt-4 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {report.overallAccessible ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          Accessibility Report
          {report.overallAccessible ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Contrast Safe</Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">❌ Low Contrast</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {contrastPairs.map((pair, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getContrastIcon(pair.result.ratio, pair.result.isAccessible)}
                <span className="text-gray-700">{pair.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-600">
                  {pair.result.ratio}:1
                </span>
                {getContrastBadge(pair.result.level)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            WCAG 2.1 requires minimum 4.5:1 contrast for normal text, 3:1 for large text.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityIndicator;