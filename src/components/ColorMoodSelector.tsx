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
      brand: '#00C896',
      accent: '#44A08D',
      "button-primary": '#00C896',
      "button-text": '#FFFFFF',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#00C896',
      "text-primary": '#2C3E50',
      "text-secondary": '#7F8C8D',
      "section-bg-1": '#F8FFFD',
      "section-bg-2": '#ECFDF5',
      "section-bg-3": '#F3F4F6',
      border: '#E5E7EB',
      highlight: '#4ECDC4',
      "input-bg": '#FFFFFF',
      "input-text": '#2C3E50'
    }
  },
  {
    id: 'happy',
    name: 'Happy',
    category: 'Light & Bright',
    icon: '😊',
    description: 'Cheerful and uplifting vibes',
    palette: {
      brand: '#FFD93D',
      accent: '#4D96FF',
      "button-primary": '#FFD93D',
      "button-text": '#2C3E50',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#FFD93D',
      "text-primary": '#2C3E50',
      "text-secondary": '#7F8C8D',
      "section-bg-1": '#FFFEF7',
      "section-bg-2": '#FEF3C7',
      "section-bg-3": '#F3F4F6',
      border: '#E5E7EB',
      highlight: '#6BCF7F',
      "input-bg": '#FFFFFF',
      "input-text": '#2C3E50'
    }
  },
  {
    id: 'playful',
    name: 'Playful',
    category: 'Light & Bright',
    icon: '🎨',
    description: 'Fun and vibrant colors',
    palette: {
      brand: '#FF6B6B',
      accent: '#45B7D1',
      "button-primary": '#FF6B6B',
      "button-text": '#FFFFFF',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#FF6B6B',
      "text-primary": '#2C3E50',
      "text-secondary": '#7F8C8D',
      "section-bg-1": '#FFF8F8',
      "section-bg-2": '#FEF2F2',
      "section-bg-3": '#F3F4F6',
      border: '#E5E7EB',
      highlight: '#4ECDC4',
      "input-bg": '#FFFFFF',
      "input-text": '#2C3E50'
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
      brand: '#D4AF37',
      accent: '#C0C0C0',
      "button-primary": '#D4AF37',
      "button-text": '#1A1A1A',
      "button-secondary": '#374151',
      "button-secondary-text": '#D4AF37',
      "text-primary": '#FFFFFF',
      "text-secondary": '#CCCCCC',
      "section-bg-1": '#1A1A1A',
      "section-bg-2": '#2D2D2D',
      "section-bg-3": '#404040',
      border: '#4B5563',
      highlight: '#E5E5E5',
      "input-bg": '#2D2D2D',
      "input-text": '#FFFFFF'
    }
  },
  {
    id: 'mystic',
    name: 'Mystic',
    category: 'Dark & Moody',
    icon: '🔮',
    description: 'Mysterious and enchanting',
    palette: {
      brand: '#9B59B6',
      accent: '#E74C3C',
      "button-primary": '#9B59B6',
      "button-text": '#FFFFFF',
      "button-secondary": '#4B5563',
      "button-secondary-text": '#9B59B6',
      "text-primary": '#ECF0F1',
      "text-secondary": '#BDC3C7',
      "section-bg-1": '#2C3E50',
      "section-bg-2": '#34495E',
      "section-bg-3": '#4B6584',
      border: '#5D6D7E',
      highlight: '#8E44AD',
      "input-bg": '#34495E',
      "input-text": '#ECF0F1'
    }
  },
  {
    id: 'gothic',
    name: 'Gothic',
    category: 'Dark & Moody',
    icon: '🏰',
    description: 'Dark and dramatic atmosphere',
    palette: {
      brand: '#8B0000',
      accent: '#DC143C',
      "button-primary": '#8B0000',
      "button-text": '#FFFFFF',
      "button-secondary": '#374151',
      "button-secondary-text": '#8B0000',
      "text-primary": '#F5F5F5',
      "text-secondary": '#A9A9A9',
      "section-bg-1": '#0D0D0D',
      "section-bg-2": '#1A1A1A',
      "section-bg-3": '#2D2D2D',
      border: '#4B5563',
      highlight: '#4B0000',
      "input-bg": '#1A1A1A',
      "input-text": '#F5F5F5'
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
      brand: '#8B4513',
      accent: '#CD853F',
      "button-primary": '#8B4513',
      "button-text": '#FFFFFF',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#8B4513',
      "text-primary": '#2F4F4F',
      "text-secondary": '#696969',
      "section-bg-1": '#F5F5DC',
      "section-bg-2": '#FAF0E6',
      "section-bg-3": '#F0E68C',
      border: '#D2B48C',
      highlight: '#A0522D',
      "input-bg": '#FFFFFF',
      "input-text": '#2F4F4F'
    }
  },
  {
    id: 'tropical',
    name: 'Tropical',
    category: 'Natural & Organic',
    icon: '🌺',
    description: 'Vibrant tropical paradise',
    palette: {
      brand: '#FF6347',
      accent: '#FFD700',
      "button-primary": '#FF6347',
      "button-text": '#FFFFFF',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#FF6347',
      "text-primary": '#2F4F4F',
      "text-secondary": '#708090',
      "section-bg-1": '#F0FFFF',
      "section-bg-2": '#E0FFFF',
      "section-bg-3": '#F0F8FF',
      border: '#87CEEB',
      highlight: '#32CD32',
      "input-bg": '#FFFFFF',
      "input-text": '#2F4F4F'
    }
  },
  {
    id: 'coastal',
    name: 'Coastal',
    category: 'Natural & Organic',
    icon: '🌊',
    description: 'Ocean-inspired blues',
    palette: {
      brand: '#006994',
      accent: '#20B2AA',
      "button-primary": '#006994',
      "button-text": '#FFFFFF',
      "button-secondary": '#F3F4F6',
      "button-secondary-text": '#006994',
      "text-primary": '#2F4F4F',
      "text-secondary": '#708090',
      "section-bg-1": '#F0F8FF',
      "section-bg-2": '#E6F3FF',
      "section-bg-3": '#B0E0E6',
      border: '#87CEEB',
      highlight: '#4682B4',
      "input-bg": '#FFFFFF',
      "input-text": '#2F4F4F'
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
      brand: '#6C757D',
      accent: '#495057',
      "button-primary": '#6C757D',
      "button-text": '#FFFFFF',
      "button-secondary": '#F8F9FA',
      "button-secondary-text": '#6C757D',
      "text-primary": '#212529',
      "text-secondary": '#6C757D',
      "section-bg-1": '#FFFFFF',
      "section-bg-2": '#F8F9FA',
      "section-bg-3": '#E9ECEF',
      border: '#DEE2E6',
      highlight: '#ADB5BD',
      "input-bg": '#FFFFFF',
      "input-text": '#212529'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'Minimal & Professional',
    icon: '🏢',
    description: 'Professional business colors',
    palette: {
      brand: '#0056B3',
      accent: '#17A2B8',
      "button-primary": '#0056B3',
      "button-text": '#FFFFFF',
      "button-secondary": '#F8F9FA',
      "button-secondary-text": '#0056B3',
      "text-primary": '#212529',
      "text-secondary": '#6C757D',
      "section-bg-1": '#FFFFFF',
      "section-bg-2": '#F8F9FA',
      "section-bg-3": '#E9ECEF',
      border: '#DEE2E6',
      highlight: '#6C757D',
      "input-bg": '#FFFFFF',
      "input-text": '#212529'
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    category: 'Minimal & Professional',
    icon: '💻',
    description: 'Modern tech-inspired',
    palette: {
      brand: '#007BFF',
      accent: '#28A745',
      "button-primary": '#007BFF',
      "button-text": '#FFFFFF',
      "button-secondary": '#F8F9FA',
      "button-secondary-text": '#007BFF',
      "text-primary": '#212529',
      "text-secondary": '#6C757D',
      "section-bg-1": '#F8F9FA',
      "section-bg-2": '#E9ECEF',
      "section-bg-3": '#DEE2E6',
      border: '#CED4DA',
      highlight: '#6C757D',
      "input-bg": '#FFFFFF',
      "input-text": '#212529'
    }
  }
  // Add more moods for other categories...
];

interface ColorMoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodSelect: (palette: ColorPalette, moodId?: string) => void;
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
    onMoodSelect(mood.palette, mood.id);
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
    const colors = [palette.brand, palette["button-primary"], palette.accent, palette["section-bg-1"], palette["text-primary"]];
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