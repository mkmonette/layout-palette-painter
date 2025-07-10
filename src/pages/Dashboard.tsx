import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Settings, Eye, Moon, Sun, Maximize, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import TemplateSelector from '@/components/TemplateSelector';
import ColorControls from '@/components/ColorControls';
import ColorSchemeSelector, { ColorSchemeType } from '@/components/ColorSchemeSelector';
import ColorMoodSelector from '@/components/ColorMoodSelector';
import LivePreview from '@/components/LivePreview';
import FullscreenPreview from '@/components/FullscreenPreview';
import { generateColorScheme, ColorPalette } from '@/utils/colorGenerator';
import { TemplateType } from '@/types/template';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import SavedPalettesModal from '@/components/SavedPalettesModal';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import SavePaletteButton from '@/components/SavePaletteButton';

const Dashboard = () => {
  console.log('Dashboard: Component starting to render');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log('Dashboard: Getting current user');
  const currentUser = getCurrentUser();
  console.log('Dashboard: Current user:', currentUser);

  // Early return if no user (should be handled by ProtectedRoute but adding safety)
  if (!currentUser?.isLoggedIn) {
    console.log('Dashboard: No current user found, redirecting to login');
    return null; // Don't navigate here as ProtectedRoute handles it
  }

  console.log('Dashboard: User authenticated, continuing with component setup');

  const { getSavedCount, loadSavedPalettes } = useSavedPalettes();
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeType>('random');
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  console.log('Dashboard: State initialized');

  const handleLogout = () => {
    try {
      logoutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleGenerateColors = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const newPalette = generateColorScheme(selectedScheme, isDarkMode);
        setColorPalette(newPalette);
      } catch (error) {
        console.error('Error generating colors:', error);
        toast({
          title: "Error",
          description: "Failed to generate colors. Please try again.",
          variant: "destructive"
        });
      }
      setIsGenerating(false);
    }, 800);
  };

  const handleColorChange = (colorKey: keyof ColorPalette, color: string) => {
    setColorPalette(prev => ({
      ...prev,
      [colorKey]: color
    }));
  };

  const handleModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    try {
      const newPalette = generateColorScheme(selectedScheme, checked);
      setColorPalette(newPalette);
    } catch (error) {
      console.error('Error toggling mode:', error);
    }
  };

  const handleSchemeChange = (scheme: ColorSchemeType) => {
    setSelectedScheme(scheme);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closeModal = () => setActiveModal(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleMoodSelect = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  const handleSavedPaletteSelect = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  const handleSavedTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  useEffect(() => {
    console.log('Dashboard: Setting up keyboard event listener');
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    console.log('Dashboard: Setting up saved palettes');
    try {
      const updateCount = () => {
        setSavedPalettesCount(getSavedCount());
      };
      
      updateCount();
      
      const handleStorageChange = () => {
        updateCount();
      };
      
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('savedPalettesUpdate', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('savedPalettesUpdate', handleStorageChange);
      };
    } catch (error) {
      console.error('Error setting up saved palettes:', error);
    }
  }, []); // Remove dependencies that cause re-renders

  console.log('Dashboard: About to render, isFullscreen:', isFullscreen);

  if (isFullscreen) {
    console.log('Dashboard: Rendering fullscreen preview');
    return (
      <FullscreenPreview
        template={selectedTemplate}
        colorPalette={colorPalette}
        selectedScheme={selectedScheme}
        isDarkMode={isDarkMode}
        isGenerating={isGenerating}
        onClose={() => setIsFullscreen(false)}
        onGenerateColors={handleGenerateColors}
        onSchemeChange={handleSchemeChange}
        onTemplateChange={setSelectedTemplate}
        onColorChange={handleColorChange}
        onModeToggle={handleModeToggle}
      />
    );
  }

  console.log('Dashboard: Rendering main dashboard');

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Palette Painter
                  </h1>
                  <p className="text-sm text-gray-600">
                    Welcome, {currentUser?.username || 'User'}!
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="capitalize font-medium">
                    {selectedTemplate.replace('-', ' ')}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-700">
                    {selectedScheme.charAt(0).toUpperCase() + selectedScheme.slice(1)}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>Logout</span>
                </Button>
                <Button
                  onClick={handleFullscreenToggle}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Maximize className="h-4 w-4" />
                  <span>Fullscreen</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Live Preview */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <div className="flex items-center space-x-2">
                <SavePaletteButton
                  colorPalette={colorPalette}
                  template={selectedTemplate}
                  onSave={() => setSavedPalettesCount(getSavedCount())}
                  size="sm"
                />
                <Button
                  onClick={handleZoomOut}
                  variant="outline"
                  size="icon"
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  variant="outline"
                  size="icon"
                  disabled={zoomLevel >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleZoomReset}
                  variant="outline"
                  size="icon"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-auto shadow-inner bg-white max-h-[70vh]">
              <div 
                className="min-h-full transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <LivePreview
                  template={selectedTemplate}
                  colorPalette={colorPalette}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg">
          <div className="flex items-center justify-between gap-2 p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerateColors}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Palette className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>

              <Button
                onClick={() => setActiveModal('template')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Template
              </Button>

              <Button
                onClick={() => setActiveModal('scheme')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Scheme
              </Button>

              <Button
                onClick={() => setActiveModal('mood')}
                variant="outline"
                className="flex items-center gap-2"
              >
                🎨
                Color Mood
              </Button>

              <Button
                onClick={() => setActiveModal('saved')}
                variant="outline"
                className="flex items-center gap-2"
              >
                🟡
                Saved ({savedPalettesCount}/10)
              </Button>

              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
                <Sun className="h-4 w-4 text-gray-600" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleModeToggle}
                />
                <Moon className="h-4 w-4 text-gray-600" />
              </div>

              <Button
                onClick={() => setActiveModal('colors')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Colors
              </Button>
            </div>
          </div>
        </div>

        {/* Template Selector Modal */}
        <Dialog open={activeModal === 'template'} onOpenChange={closeModal}>
          <DialogContent className="max-w-6xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Choose Template
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="p-4">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={(newTemplate) => {
                    setSelectedTemplate(newTemplate);
                    closeModal();
                  }}
                  colorPalette={colorPalette}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Color Scheme Modal */}
        <Dialog open={activeModal === 'scheme'} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <ColorSchemeSelector
                  selectedScheme={selectedScheme}
                  onSchemeChange={handleSchemeChange}
                  onGenerateScheme={handleGenerateColors}
                  isGenerating={isGenerating}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Color Mood Modal */}
        <ColorMoodSelector
          isOpen={activeModal === 'mood'}
          onClose={closeModal}
          onMoodSelect={handleMoodSelect}
          currentPalette={colorPalette}
        />

        {/* Customize Colors Modal */}
        <Dialog open={activeModal === 'colors'} onOpenChange={closeModal}>
          <DialogContent className="max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customize Colors
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="p-4">
                <ColorControls
                  colorPalette={colorPalette}
                  onColorChange={handleColorChange}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Saved Palettes Modal */}
        <SavedPalettesModal
          isOpen={activeModal === 'saved'}
          onClose={closeModal}
          currentPalette={colorPalette}
          currentTemplate={selectedTemplate}
          onPaletteSelect={handleSavedPaletteSelect}
          onTemplateSelect={handleSavedTemplateSelect}
        />
      </div>
    );
  } catch (error) {
    console.error('Dashboard render error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Please try refreshing the page or check the console for errors</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
};

export default Dashboard;
