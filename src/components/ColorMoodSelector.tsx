
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Star, StarOff, Shuffle } from 'lucide-react';
import { ColorPalette } from '@/types/template';

// Color mood definitions with palettes
export interface ColorMood {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  palette: ColorPalette;
}

const colorMoods: ColorMood[] = [
  // Light & Bright
  {
    id: 'fresh',
    name: 'Fresh',
    category: 'Light & Bright',
    icon: '🌿',
    description: 'Clean and refreshing colors',
    palette: {
      primary: '#00C896',
      secondary: '#4ECDC4',
      accent: '#44A08D',
      background: '#F8FFFD',
      text: '#2C3E50',
      textLight: '#7F8C8D'
    }
  },
  {
    id: 'happy',
    name: 'Happy',
    category: 'Light & Bright',
    icon: '😊',
    description: 'Cheerful and uplifting vibes',
    palette: {
      primary: '#FFD93D',
      secondary: '#6BCF7F',
      accent: '#4D96FF',
      background: '#FFFEF7',
      text: '#2C3E50',
      textLight: '#7F8C8D'
    }
  },
  {
    id: 'playful',
    name: 'Playful',
    category: 'Light & Bright',
    icon: '🎨',
    description: 'Fun and vibrant colors',
    palette: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
      background: '#FFF8F8',
      text: '#2C3E50',
      textLight: '#7F8C8D'
    }
  },
  // Dark & Moody
  {
    id: 'elegant',
    name: 'Elegant',
    category: 'Dark & Moody',
    icon: '🖤',
    description: 'Sophisticated dark tones',
    palette: {
      primary: '#D4AF37',
      secondary: '#E5E5E5',
      accent: '#C0C0C0',
      background: '#1A1A1A',
      text: '#FFFFFF',
      textLight: '#CCCCCC'
    }
  },
  {
    id: 'mystic',
    name: 'Mystic',
    category: 'Dark & Moody',
    icon: '🔮',
    description: 'Mysterious and enchanting',
    palette: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#E74C3C',
      background: '#2C3E50',
      text: '#ECF0F1',
      textLight: '#BDC3C7'
    }
  },
  {
    id: 'gothic',
    name: 'Gothic',
    category: 'Dark & Moody',
    icon: '🏰',
    description: 'Dark and dramatic atmosphere',
    palette: {
      primary: '#8B0000',
      secondary: '#4B0000',
      accent: '#DC143C',
      background: '#0D0D0D',
      text: '#F5F5F5',
      textLight: '#A9A9A9'
    }
  },
  // Natural & Organic
  {
    id: 'earthy',
    name: 'Earthy',
    category: 'Natural & Organic',
    icon: '🌍',
    description: 'Warm earth tones',
    palette: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#CD853F',
      background: '#F5F5DC',
      text: '#2F4F4F',
      textLight: '#696969'
    }
  },
  {
    id: 'tropical',
    name: 'Tropical',
    category: 'Natural & Organic',
    icon: '🌺',
    description: 'Vibrant tropical paradise',
    palette: {
      primary: '#FF6347',
      secondary: '#32CD32',
      accent: '#FFD700',
      background: '#F0FFFF',
      text: '#2F4F4F',
      textLight: '#708090'
    }
  },
  {
    id: 'coastal',
    name: 'Coastal',
    category: 'Natural & Organic',
    icon: '🌊',
    description: 'Ocean-inspired blues',
    palette: {
      primary: '#006994',
      secondary: '#4682B4',
      accent: '#20B2AA',
      background: '#F0F8FF',
      text: '#2F4F4F',
      textLight: '#708090'
    }
  },
  // Minimal & Professional
  {
    id: 'neutral',
    name: 'Neutral',
    category: 'Minimal & Professional',
    icon: '⚪',
    description: 'Clean neutral palette',
    palette: {
      primary: '#6C757D',
      secondary: '#ADB5BD',
      accent: '#495057',
      background: '#FFFFFF',
      text: '#212529',
      textLight: '#6C757D'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'Minimal & Professional',
    icon: '🏢',
    description: 'Professional business colors',
    palette: {
      primary: '#0056B3',
      secondary: '#6C757D',
      accent: '#17A2B8',
      background: '#FFFFFF',
      text: '#212529',
      textLight: '#6C757D'
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    category: 'Minimal & Professional',
    icon: '💻',
    description: 'Modern tech-inspired',
    palette: {
      primary: '#007BFF',
      secondary: '#6C757D',
      accent: '#28A745',
      background: '#F8F9FA',
      text: '#212529',
      textLight: '#6C757D'
    }
  }
  // Add more moods for other categories...
];

interface ColorMoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodSelect: (palette: ColorPalette) => void;
  currentPalette: ColorPalette;
}

const ColorMoodSelector: React.FC<ColorMoodSelectorProps> = ({
  isOpen,
  onClose,
  onMoodSelect,
  currentPalette
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const categories = [...new Set(colorMoods.map(mood => mood.category))];

  const filteredMoods = colorMoods.filter(mood => {
    const matchesSearch = mood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mood.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || mood.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMoodSelect = (mood: ColorMood) => {
    onMoodSelect(mood.palette);
    onClose();
  };

  const handleRandomMood = () => {
    const randomMood = colorMoods[Math.floor(Math.random() * colorMoods.length)];
    handleMoodSelect(randomMood);
  };

  const toggleFavorite = (moodId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(moodId)) {
      newFavorites.delete(moodId);
    } else {
      newFavorites.add(moodId);
    }
    setFavorites(newFavorites);
  };

  const renderColorSwatches = (palette: ColorPalette) => {
    const colors = [palette.primary, palette.secondary, palette.accent, palette.background, palette.text];
    return (
      <div className="flex gap-1 mt-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎨 Color Mood
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Controls */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search moods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleRandomMood} variant="outline" className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              Random
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Mood Grid */}
          <ScrollArea className="h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
              {filteredMoods.map(mood => (
                <Card
                  key={mood.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    hoveredMood === mood.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleMoodSelect(mood)}
                  onMouseEnter={() => setHoveredMood(mood.id)}
                  onMouseLeave={() => setHoveredMood(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mood.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{mood.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {mood.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(mood.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {favorites.has(mood.id) ? (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{mood.description}</p>
                  {renderColorSwatches(mood.palette)}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorMoodSelector;
