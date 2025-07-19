
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette } from 'lucide-react';

export type ColorSchemeType = 
  | 'monochromatic' 
  | 'analogous' 
  | 'complementary' 
  | 'triadic' 
  | 'tetradic'
  | 'random';

interface ColorSchemeSelectorProps {
  selectedScheme: ColorSchemeType;
  onSchemeChange: (scheme: ColorSchemeType) => void;
}

const colorSchemes = [
  {
    id: 'random' as ColorSchemeType,
    name: 'Random',
    description: 'Completely random color combinations',
    preview: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  },
  {
    id: 'monochromatic' as ColorSchemeType,
    name: 'Monochromatic',
    description: 'Various shades of the same color',
    preview: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']
  },
  {
    id: 'analogous' as ColorSchemeType,
    name: 'Analogous',
    description: 'Colors that are next to each other on the color wheel',
    preview: ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316']
  },
  {
    id: 'complementary' as ColorSchemeType,
    name: 'Complementary',
    description: 'Colors that are opposite on the color wheel',
    preview: ['#3B82F6', '#F59E0B', '#FFFFFF', '#1F2937']
  },
  {
    id: 'triadic' as ColorSchemeType,
    name: 'Triadic',
    description: 'Three colors evenly spaced on the color wheel',
    preview: ['#3B82F6', '#10B981', '#EF4444', '#F3F4F6']
  },
  {
    id: 'tetradic' as ColorSchemeType,
    name: 'Tetradic',
    description: 'Four colors forming a rectangle on the color wheel',
    preview: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  }
];

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  selectedScheme,
  onSchemeChange
}) => {
  return (
    <RadioGroup value={selectedScheme} onValueChange={onSchemeChange} className="grid grid-cols-2 gap-2">
      {colorSchemes.map((scheme) => (
        <div
          key={scheme.id}
          className={`w-full border rounded p-1.5 transition-all duration-200 cursor-pointer ${
            selectedScheme === scheme.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
          onClick={() => onSchemeChange(scheme.id)}
        >
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value={scheme.id} id={scheme.id} className="w-3 h-3" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col space-y-1">
                <Label htmlFor={scheme.id} className="text-xs font-medium cursor-pointer">
                  {scheme.name}
                </Label>
                <div className="flex space-x-1">
                  {scheme.preview.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{scheme.description}</p>
            </div>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ColorSchemeSelector;
