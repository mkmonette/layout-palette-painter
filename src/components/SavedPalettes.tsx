import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Palette, Eye, Edit, Trash2, Calendar, Search, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  dateCreated: string;
  tags?: string[];
  isPublic?: boolean;
}

const SavedPalettes = () => {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState('all');
  const { toast } = useToast();

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const mockPalettes: SavedPalette[] = [
      {
        id: '1',
        name: 'Ocean Breeze',
        colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
        dateCreated: '2024-01-15T10:30:00Z',
        tags: ['blue', 'ocean', 'calm'],
        isPublic: true
      },
      {
        id: '2',
        name: 'Sunset Vibes',
        colors: ['#dc2626', '#ea580c', '#f59e0b', '#fbbf24', '#fef3c7'],
        dateCreated: '2024-01-14T15:45:00Z',
        tags: ['warm', 'sunset', 'orange'],
        isPublic: false
      },
      {
        id: '3',
        name: 'Forest Green',
        colors: ['#14532d', '#166534', '#16a34a', '#22c55e', '#bbf7d0'],
        dateCreated: '2024-01-13T09:15:00Z',
        tags: ['green', 'nature', 'fresh'],
        isPublic: true
      },
      {
        id: '4',
        name: 'Purple Dream',
        colors: ['#581c87', '#7c3aed', '#8b5cf6', '#a78bfa', '#e9d5ff'],
        dateCreated: '2024-01-12T14:20:00Z',
        tags: ['purple', 'dreamy', 'elegant'],
        isPublic: false
      },
      {
        id: '5',
        name: 'Monochrome',
        colors: ['#000000', '#374151', '#6b7280', '#d1d5db', '#ffffff'],
        dateCreated: '2024-01-11T11:00:00Z',
        tags: ['black', 'white', 'minimal'],
        isPublic: true
      }
    ];
    setSavedPalettes(mockPalettes);
  }, []);

  const filteredAndSortedPalettes = savedPalettes
    .filter(palette => {
      const matchesSearch = palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           palette.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && palette.isPublic) ||
                           (filterBy === 'private' && !palette.isPublic);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'dateCreated') {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleViewPalette = (palette: SavedPalette) => {
    toast({
      title: "Viewing Palette",
      description: `Opening "${palette.name}" for preview.`,
    });
  };

  const handleEditPalette = (palette: SavedPalette) => {
    toast({
      title: "Edit Palette",
      description: `Opening "${palette.name}" in the editor.`,
    });
  };

  const handleDeletePalette = (paletteId: string, paletteName: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== paletteId));
    toast({
      title: "Palette Deleted",
      description: `"${paletteName}" has been removed from your saved palettes.`,
      variant: "destructive"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const PaletteCard = ({ palette }: { palette: SavedPalette }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 animate-fade-in">
      <CardContent className="p-4">
        {/* Color Swatches */}
        <div className="flex rounded-lg overflow-hidden mb-3 h-20 shadow-sm">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Palette Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg truncate">{palette.name}</h3>
            {palette.isPublic && (
              <Badge variant="secondary" className="text-xs">
                Public
              </Badge>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(palette.dateCreated)}
          </div>

          {palette.tags && palette.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {palette.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {palette.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{palette.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewPalette(palette)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditPalette(palette)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Palette</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{palette.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeletePalette(palette.id, palette.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PaletteListItem = ({ palette }: { palette: SavedPalette }) => (
    <Card className="group hover:shadow-md transition-all duration-200 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Color Swatches */}
          <div className="flex rounded-lg overflow-hidden h-12 w-24 shadow-sm flex-shrink-0">
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className="flex-1"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Palette Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{palette.name}</h3>
              {palette.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  Public
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(palette.dateCreated)}
            </div>
            {palette.tags && palette.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {palette.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewPalette(palette)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditPalette(palette)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Palette</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{palette.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeletePalette(palette.id, palette.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Saved Palettes</h2>
        <p className="text-muted-foreground">
          Manage and organize your saved color palettes.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search palettes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50">
                  <SelectItem value="dateCreated">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedPalettes.length} of {savedPalettes.length} palettes
            </span>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{savedPalettes.filter(p => p.isPublic).length} public</span>
              <span>{savedPalettes.filter(p => !p.isPublic).length} private</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Palettes Display */}
      {filteredAndSortedPalettes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Palette className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterBy !== 'all' ? 'No palettes match your search' : 'No saved palettes yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Start creating and saving color palettes to see them here. Your creative journey begins with the first palette!'
              }
            </p>
            {!searchTerm && filterBy === 'all' && (
              <Button className="mt-4">
                <Palette className="w-4 h-4 mr-2" />
                Create Your First Palette
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredAndSortedPalettes.map((palette) => (
            viewMode === 'grid' ? (
              <PaletteCard key={palette.id} palette={palette} />
            ) : (
              <PaletteListItem key={palette.id} palette={palette} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPalettes;