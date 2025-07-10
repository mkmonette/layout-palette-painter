
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
  primary: 'Primary Color',
  secondary: 'Secondary Color',
  accent: 'Accent Color',
  background: 'Background',
  text: 'Text Color',
  textLight: 'Light Text'
};

const ColorControls: React.FC<ColorControlsProps> = ({
  colorPalette,
  onColorChange,
  lockedColors = new Set(),
  onToggleLock
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(colorPalette).map(([key, value]) => {
        const isLocked = lockedColors.has(key as keyof ColorPalette);
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                {colorLabels[key as keyof ColorPalette]}
              </Label>
              {onToggleLock && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleLock(key as keyof ColorPalette)}
                  className={`h-6 w-6 p-0 ${isLocked ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title={isLocked ? 'Unlock color' : 'Lock color'}
                >
                  {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className={`w-10 h-10 rounded-lg border-2 shadow-sm flex-shrink-0 ${isLocked ? 'border-orange-300' : 'border-gray-200'}`}
                style={{ backgroundColor: value }}
              />
              <div className="flex-1 space-y-1">
                <Input
                  id={key}
                  type="color"
                  value={value}
                  onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                  className="w-full h-8 border-gray-300 cursor-pointer"
                  disabled={isLocked}
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onColorChange(key as keyof ColorPalette, e.target.value)}
                  className="text-xs font-mono"
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
