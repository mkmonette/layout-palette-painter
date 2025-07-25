
import React from 'react';
import { ColorPalette } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

interface ColorControlsProps {
  colorPalette: ColorPalette;
  onColorChange: (colorKey: keyof ColorPalette, color: string) => void;
  lockedColors?: Set<keyof ColorPalette>;
  onToggleLock?: (colorKey: keyof ColorPalette) => void;
}

const colorLabels = {
  brand: 'Brand (Main Identity)',
  accent: 'Accent (Highlights)', 
  'button-primary': 'Primary Button',
  'button-text': 'Primary Button Text',
  'button-secondary': 'Secondary Button',
  'button-secondary-text': 'Secondary Button Text',
  'text-primary': 'Primary Text',
  'text-secondary': 'Secondary Text',
  'section-bg-1': 'Section Background 1',
  'section-bg-2': 'Section Background 2', 
  'section-bg-3': 'Section Background 3',
  border: 'Borders & Dividers',
  highlight: 'Highlights & Focus',
  'input-bg': 'Input Background',
  'input-text': 'Input Text'
};

const ColorControls: React.FC<ColorControlsProps> = ({
  colorPalette,
  onColorChange,
  lockedColors = new Set(),
  onToggleLock
}) => {
  return (
    <div className="grid grid-cols-2 gap-16">
      {Object.entries(colorPalette).map(([key, value]) => {
        const isLocked = lockedColors.has(key as keyof ColorPalette);
        return (
          <div key={key} className="space-y-2">
            {/* Label and lock icon on one line */}
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-xs font-medium text-gray-700">
                {colorLabels[key as keyof ColorPalette]}
              </Label>
              {onToggleLock && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleLock(key as keyof ColorPalette)}
                  className={`h-4 w-4 p-0 ${isLocked ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title={isLocked ? 'Unlock color' : 'Lock color'}
                >
                  {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
              )}
            </div>
            
            {/* Color picker and color name on the line below */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div 
                  className={`w-10 h-10 rounded-lg border-2 shadow-sm flex-shrink-0 cursor-pointer ${isLocked ? 'border-orange-300' : 'border-gray-200'}`}
                  style={{ backgroundColor: value }}
                  title={`Click to edit ${key.replace(/-/g, ' ')}`}
                />
                <Input
                  id={key}
                  type="color"
                  value={value}
                  onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                  className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLocked}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                  className="text-[11px] font-mono"
                  placeholder="#000000"
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorControls;
