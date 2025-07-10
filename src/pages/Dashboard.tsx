import React, { useState, useEffect } from 'react';
import { Palette, RefreshCw, Eye, Moon, Sun, Maximize, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TemplateType } from '@/types/template';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/utils/auth';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Early return if no user
  if (!currentUser?.isLoggedIn) {
    return null;
  }

  const { getSavedCount } = useSavedPalettes();
  const [savedPalettesCount, setSavedPalettesCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern-hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleLogout = () => {
    try {
      logoutUser();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const adjustZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(50, Math.min(200, prev + delta)));
  };

  const enterFullscreen = () => {
    setIsFullscreen(true);
  };

  useEffect(() => {
    try {
      setSavedPalettesCount(getSavedCount());
    } catch (error) {
      console.error('Error setting up saved palettes:', error);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Fullscreen Preview</h1>
          <Button onClick={() => setIsFullscreen(false)}>Exit Fullscreen</Button>
        </div>
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Template Preview</h2>
          <p>Selected template: {selectedTemplate}</p>
          <p>Zoom level: {zoomLevel}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Color Palette Generator</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
              >
                <Eye className="h-4 w-4 mr-2" />
                Saved Palettes
                {savedPalettesCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {savedPalettesCount}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Controls</h2>
                <div className="flex space-x-2">
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color Mood</h3>
                  <p className="text-sm text-gray-600">Professional</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color Scheme</h3>
                  <p className="text-sm text-gray-600">Monochromatic</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color Controls</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-blue-500 rounded"></div>
                    <div className="h-8 bg-green-500 rounded"></div>
                    <div className="h-8 bg-yellow-500 rounded"></div>
                    <div className="h-8 bg-white border rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates</h2>
              <div className="space-y-2">
                <Button 
                  variant={selectedTemplate === 'modern-hero' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedTemplate('modern-hero')}
                >
                  Modern Hero
                </Button>
                <Button 
                  variant={selectedTemplate === 'minimal-header' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedTemplate('minimal-header')}
                >
                  Minimal Header
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    Save Palette
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adjustZoom(-10)} disabled={zoomLevel <= 50}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoomLevel}%</span>
                  <Button size="sm" variant="outline" onClick={() => adjustZoom(10)} disabled={zoomLevel >= 200}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={enterFullscreen}>
                    <Maximize className="h-4 w-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-8 bg-gray-50" style={{ zoom: `${zoomLevel}%` }}>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedTemplate === 'modern-hero' ? 'Modern Hero Template' : 'Minimal Header Template'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This is a preview of your selected template with the current color palette applied.
                  </p>
                  <div className="flex space-x-2">
                    <div className="h-10 w-20 bg-blue-500 rounded"></div>
                    <div className="h-10 w-20 bg-green-500 rounded"></div>
                    <div className="h-10 w-20 bg-yellow-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;