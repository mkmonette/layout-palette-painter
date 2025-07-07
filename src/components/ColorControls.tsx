
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorControlsProps {
  colorPalette: ColorPalette;
  onColorChange: (colorKey: keyof ColorPalette, color: string) => void;
}

const colorLabels = {
  primary: 'Primary Color',
  secondary: 'Secondary Color',
  accent: 'Accent Color',
  background: 'Background',
  text: 'Text Color',
  textLight: 'Light Text'
};

const ColorControls: React.FC<ColorControlsProps> = ({
  colorPalette,
  onColorChange
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(colorPalette).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium text-gray-700">
            {colorLabels[key as keyof ColorPalette]}
          </Label>
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1 space-y-1">
              <Input
                id={key}
                type="color"
                value={value}
                onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                className="w-full h-8 border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                className="text-xs font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorControls;
