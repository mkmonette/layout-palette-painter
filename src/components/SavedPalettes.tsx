import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Palette, Eye, Edit, Trash2, Calendar, Search, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import LivePreview from '@/components/LivePreview';
import SimpleFullscreenPreview from '@/components/SimpleFullscreenPreview';
import { TemplateType, ColorPalette } from '@/types/template';

interface SavedPalette extends ColorPalette {
  id: string;
  name: string;
  savedAt: string;
  template: TemplateType;
}

const SavedPalettes = () => {
  const { savedPalettes } = useSavedPalettes();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('savedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [fullscreenPreview, setFullscreenPreview] = useState<{
    isOpen: boolean;
    palette: SavedPalette | null;
  }>({ isOpen: false, palette: null });
  const { toast } = useToast();


  const filteredAndSortedPalettes = savedPalettes
    .filter(palette => {
      return palette.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'savedAt') {
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleViewPalette = (palette: SavedPalette) => {
    setFullscreenPreview({ isOpen: true, palette });
  };

  const handleEditPalette = (palette: SavedPalette) => {
    // Navigate to studio with this palette and template applied
    const paletteData = encodeURIComponent(JSON.stringify({
      palette: palette,
      template: palette.template
    }));
    window.location.href = `/studio?loadPalette=${paletteData}`;
  };

  const handleDeletePalette = (paletteId: string, paletteName: string) => {
    // Remove from localStorage
    const updatedPalettes = savedPalettes.filter(p => p.id !== paletteId);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    
    toast({
      title: "Palette Deleted",
      description: `"${paletteName}" has been removed from your saved palettes.`,
      variant: "destructive"
    });
    
    // Reload saved palettes
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const closeFullscreenPreview = () => {
    setFullscreenPreview({ isOpen: false, palette: null });
  };

  const PaletteCard = ({ palette }: { palette: SavedPalette }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 animate-fade-in">
      <CardContent className="p-4">
        {/* Template Preview */}
        <div className="mb-4 rounded-lg overflow-hidden border shadow-sm bg-white relative">
          <div className="w-full h-32 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 origin-top-left"
              style={{ 
                transform: 'scale(0.25)',
                width: '400%',
                height: '400%'
              }}
            >
              <LivePreview template={palette.template} colorPalette={palette} />
            </div>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex rounded-lg overflow-hidden mb-3 h-12 shadow-sm">
          {[palette.brand, palette.accent, palette["button-primary"], palette["section-bg-1"], palette["text-primary"]].map((color, index) => (
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
            <Badge variant="secondary" className="text-xs">
              {palette.template}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(palette.savedAt)}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 transition-opacity duration-200">
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
          {/* Template Preview */}
          <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden border shadow-sm bg-white relative">
            <div 
              className="absolute top-0 left-0 origin-top-left"
              style={{ 
                transform: 'scale(0.2)',
                width: '500%',
                height: '417%'
              }}
            >
              <LivePreview template={palette.template} colorPalette={palette} />
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex rounded-lg overflow-hidden h-12 w-24 shadow-sm flex-shrink-0">
            {[palette.brand, palette.accent, palette["button-primary"], palette["section-bg-1"], palette["text-primary"]].map((color, index) => (
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
              <Badge variant="secondary" className="text-xs">
                {palette.template}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(palette.savedAt)}
            </div>
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
                  <SelectItem value="savedAt">Date Saved</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Palettes Display */}
      {filteredAndSortedPalettes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Palette className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No palettes match your search' : 'No saved palettes yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start creating and saving color palettes to see them here. Your creative journey begins with the first palette!'
              }
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => window.location.href = '/studio'}>
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

      {/* Fullscreen Preview */}
      {fullscreenPreview.palette && (
        <SimpleFullscreenPreview
          isOpen={fullscreenPreview.isOpen}
          template={fullscreenPreview.palette.template}
          colorPalette={fullscreenPreview.palette}
          onClose={closeFullscreenPreview}
        />
      )}
    </div>
  );
};

export default SavedPalettes;