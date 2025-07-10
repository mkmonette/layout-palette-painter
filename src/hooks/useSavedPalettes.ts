
import { useState, useEffect } from 'react';
import { ColorPalette } from '@/types/template';

interface SavedPalette extends ColorPalette {
  id: string;
  name: string;
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

  const getSavedCount = () => savedPalettes.length;
  const canSaveMore = () => savedPalettes.length < MAX_PALETTES;
  const getRemainingSlots = () => MAX_PALETTES - savedPalettes.length;

  return {
    savedPalettes,
    getSavedCount,
    canSaveMore,
    getRemainingSlots,
    MAX_PALETTES,
    loadSavedPalettes
  };
};
