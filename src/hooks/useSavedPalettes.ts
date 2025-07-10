
import { useState, useEffect } from 'react';
import { ColorPalette, TemplateType } from '@/types/template';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SavedPalette extends ColorPalette {
  id: string;
  name: string;
  savedAt: string;
  template: TemplateType;
}

export const useSavedPalettes = () => {
  const { isPro } = useSubscription();
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const MAX_PALETTES = isPro ? 50 : 3; // Pro: 50 palettes, Free: 3 palettes

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    try {
      const saved = localStorage.getItem('savedPalettes');
      if (saved) {
        setSavedPalettes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved palettes:', error);
    }
  };

  const getSavedCount = () => savedPalettes.length;
  const canSaveMore = () => savedPalettes.length < MAX_PALETTES;
  const getRemainingSlots = () => MAX_PALETTES - savedPalettes.length;

  const savePalette = (palette: ColorPalette, template: TemplateType, name?: string) => {
    if (!canSaveMore()) return false;

    const paletteId = Date.now().toString();
    const paletteName = name || `Palette ${getSavedCount() + 1}`;
    
    const newPalette: SavedPalette = {
      ...palette,
      id: paletteId,
      name: paletteName,
      template,
      savedAt: new Date().toISOString()
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    return true;
  };

  return {
    savedPalettes,
    getSavedCount,
    canSaveMore,
    getRemainingSlots,
    savePalette,
    MAX_PALETTES,
    loadSavedPalettes
  };
};
