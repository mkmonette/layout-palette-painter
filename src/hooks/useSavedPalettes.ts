
import { useState, useEffect } from 'react';
import { ColorPalette, TemplateType } from '@/types/template';

interface SavedPalette extends ColorPalette {
  id: string;
  name: string;
  template: TemplateType;
  savedAt: string;
}

export const useSavedPalettes = () => {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const MAX_PALETTES = 10;

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

  const savePalette = (palette: ColorPalette, template: TemplateType, name: string) => {
    if (savedPalettes.length >= MAX_PALETTES) {
      return false;
    }

    const newPalette: SavedPalette = {
      ...palette,
      id: Date.now().toString(),
      name: name.trim(),
      template,
      savedAt: new Date().toISOString()
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    return true;
  };

  const getSavedCount = () => savedPalettes.length;
  const canSaveMore = () => savedPalettes.length < MAX_PALETTES;
  const getRemainingSlots = () => MAX_PALETTES - savedPalettes.length;

  return {
    savedPalettes,
    getSavedCount,
    canSaveMore,
    getRemainingSlots,
    MAX_PALETTES,
    loadSavedPalettes,
    savePalette
  };
};
