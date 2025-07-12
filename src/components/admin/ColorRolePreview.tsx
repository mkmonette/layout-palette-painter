import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Palette, 
  Copy, 
  Check, 
  AlertTriangle, 
  X, 
  Eye,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ColorPalette } from '@/types/template';
import { mapPaletteToRoles } from '@/utils/colorRoleMapper';
import { useToast } from '@/hooks/use-toast';
import chroma from 'chroma-js';

// Mock palette for demonstration - in real use this would come from the current palette
const mockPalette: ColorPalette = {
  brand: '#3366FF',
  accent: '#FF6B35',
  highlight: '#4ECDC4',
  'button-primary': '#3366FF',
  'button-secondary': '#6C757D',
  'button-text': '#FFFFFF',
  'button-secondary-text': '#FFFFFF',
  'text-primary': '#000000',
  'text-secondary': '#6C757D',
  'section-bg-1': '#FFFFFF',
  'section-bg-2': '#F8F9FA',
  'section-bg-3': '#E9ECEF',
  border: '#DEE2E6',
  'input-bg': '#FFFFFF',
  'input-text': '#000000'
};

interface ColorSwatchProps {
  role: string;
  bgColor: string;
  textColor: string;
  contrastRatio: number;
  onCopy: (color: string) => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  role, 
  bgColor, 
  textColor, 
  contrastRatio, 
  onCopy 
}) => {
  const getContrastIcon = (ratio: number) => {
    if (ratio >= 4.5) return <Check className="h-3 w-3 text-green-500" />;
    if (ratio >= 3.0) return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    return <X className="h-3 w-3 text-red-500" />;
  };

  const getContrastBadge = (ratio: number) => {
    if (ratio >= 4.5) return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">WCAG AA</Badge>;
    if (ratio >= 3.0) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Caution</Badge>;
    return <Badge variant="destructive" className="text-xs">Fail</Badge>;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Color Preview */}
      <div 
        className="h-16 flex items-center justify-center text-sm font-medium cursor-pointer transition-all hover:shadow-inner"
        style={{ backgroundColor: bgColor, color: textColor }}
        onClick={() => onCopy(bgColor)}
        title="Click to copy background color"
      >
        Aa Bb Cc Sample Text
      </div>
      
      {/* Info Section */}
      <div className="p-3 bg-background border-t">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono text-muted-foreground truncate">
            {role}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onCopy(bgColor)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2">
          <div>BG: {bgColor}</div>
          <div>Text: {textColor}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {getContrastIcon(contrastRatio)}
            <span className="text-xs font-mono">
              {contrastRatio.toFixed(1)}:1
            </span>
          </div>
          {getContrastBadge(contrastRatio)}
        </div>
      </div>
    </div>
  );
};

interface ColorCategoryProps {
  title: string;
  roles: Array<{ role: string; bgColor: string; textColor: string }>;
  onCopy: (color: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const ColorCategory: React.FC<ColorCategoryProps> = ({ 
  title, 
  roles, 
  onCopy, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div className="border rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{roles.length}</Badge>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(({ role, bgColor, textColor }) => {
            const contrastRatio = chroma.contrast(bgColor, textColor);
            return (
              <ColorSwatch
                key={role}
                role={role}
                bgColor={bgColor}
                textColor={textColor}
                contrastRatio={contrastRatio}
                onCopy={onCopy}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const ColorRolePreview: React.FC = () => {
  const { toast } = useToast();
  const [showLowContrastOnly, setShowLowContrastOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    brand: true,
    buttons: true,
    backgrounds: true,
    forms: true,
    borders: true
  });

  // Get mapped roles
  const mappedRoles = mapPaletteToRoles(mockPalette);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Color copied!",
      description: `${color} copied to clipboard`,
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Organize roles by category
  const categories = [
    {
      id: 'brand',
      title: 'Brand Colors',
      roles: [
        { role: 'brand', bgColor: mappedRoles.brand, textColor: mappedRoles.onBrand || '#000000' },
        { role: 'accent', bgColor: mappedRoles.accent, textColor: mappedRoles.onAccent || '#000000' },
        { role: 'highlight', bgColor: mappedRoles.highlight, textColor: mappedRoles.onHighlight || '#000000' }
      ]
    },
    {
      id: 'buttons',
      title: 'Button Colors',
      roles: [
        { role: 'button-primary', bgColor: mappedRoles['button-primary'], textColor: mappedRoles.onPrimary || mappedRoles['button-text'] || '#000000' },
        { role: 'button-secondary', bgColor: mappedRoles['button-secondary'], textColor: mappedRoles.onSecondary || mappedRoles['button-secondary-text'] || '#000000' }
      ]
    },
    {
      id: 'backgrounds',
      title: 'Background Sections',
      roles: [
        { role: 'section-bg-1', bgColor: mappedRoles['section-bg-1'], textColor: mappedRoles.onBg1 || mappedRoles['text-primary'] || '#000000' },
        { role: 'section-bg-2', bgColor: mappedRoles['section-bg-2'], textColor: mappedRoles.onBg2 || mappedRoles['text-secondary'] || '#000000' },
        ...(mappedRoles['section-bg-3'] ? [{ role: 'section-bg-3', bgColor: mappedRoles['section-bg-3'], textColor: mappedRoles.onBg3 || '#000000' }] : [])
      ]
    },
    {
      id: 'forms',
      title: 'Form Elements',
      roles: [
        { role: 'input-bg', bgColor: mappedRoles['input-bg'], textColor: mappedRoles.onInput || mappedRoles['input-text'] || '#000000' }
      ]
    },
    {
      id: 'borders',
      title: 'Border Elements',
      roles: [
        { role: 'border', bgColor: mappedRoles.border, textColor: '#000000' }
      ]
    }
  ];

  // Filter categories based on contrast if needed
  const filteredCategories = showLowContrastOnly 
    ? categories.map(category => ({
        ...category,
        roles: category.roles.filter(({ bgColor, textColor }) => {
          const contrast = chroma.contrast(bgColor, textColor);
          return contrast < 4.5;
        })
      })).filter(category => category.roles.length > 0)
    : categories;

  const totalLowContrastRoles = categories.reduce((total, category) => {
    return total + category.roles.filter(({ bgColor, textColor }) => {
      const contrast = chroma.contrast(bgColor, textColor);
      return contrast < 4.5;
    }).length;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Role Preview
        </CardTitle>
        <CardDescription>
          Visual preview of all color roles with contrast analysis. Click any swatch to copy the background color.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="low-contrast-filter"
              checked={showLowContrastOnly}
              onCheckedChange={setShowLowContrastOnly}
            />
            <Label htmlFor="low-contrast-filter" className="text-sm">
              Show only low contrast roles
            </Label>
            {totalLowContrastRoles > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalLowContrastRoles} issues
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>WCAG AA requires 4.5:1 contrast</span>
          </div>
        </div>

        {/* Color Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <ColorCategory
              key={category.id}
              title={category.title}
              roles={category.roles}
              onCopy={handleCopy}
              isExpanded={expandedCategories[category.id]}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>

        {showLowContrastOnly && filteredCategories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>No low contrast issues found!</p>
            <p className="text-xs">All color roles meet WCAG AA guidelines.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorRolePreview;