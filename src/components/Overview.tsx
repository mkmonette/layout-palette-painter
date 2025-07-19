import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Save, 
  FileText, 
  BarChart3, 
  Play, 
  BookOpen,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Overview = () => {
  // Mock data - in a real app, this would come from a context or API
  const userStats = {
    totalPalettes: 15,
    basicExports: 10,
    proExports: 5
  };

  const lastSession = {
    template: 'Modern Clean',
    scheme: 'Analogous',
    mood: 'Energetic',
    tone: 'Light-Midtone',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  };

  const tips = [
    "Use midtone-dark tones for better text contrast.",
    "Try Professional PDF export for branding presentations.",
    "Analogous color schemes create harmony and balance.",
    "Warm colors evoke energy and passion in your designs."
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">📊 Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your color palettes.</p>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/studio">
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">🎛️ Open Studio</h3>
                  <p className="text-muted-foreground text-sm">Create and edit color palettes</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card 
          className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 cursor-pointer"
          onClick={() => {
            // Trigger click on saved palettes menu item
            const event = new CustomEvent('navigate-to-palettes');
            window.dispatchEvent(event);
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Save className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">📁 Saved Palettes</h3>
                <p className="text-muted-foreground text-sm">View your saved color palettes</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Save className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved Palettes</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalPalettes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PDF Reports (Basic)</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.basicExports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PDF Reports (Professional)</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.proExports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue Where You Left Off */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">🕘 Continue editing your last palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Template</p>
                  <p className="font-medium">{lastSession.template}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheme</p>
                  <p className="font-medium">{lastSession.scheme}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mood</p>
                  <p className="font-medium">{lastSession.mood}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tone</p>
                  <p className="font-medium">{lastSession.tone}</p>
                </div>
              </div>
              
              {/* Color Preview Strip */}
              <div className="flex gap-1 mb-4">
                {lastSession.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded border border-border/50"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              
              <Link to="/studio">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Resume Editing
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Palettes Redirect */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-muted">
              <Save className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">🎨 View All Saved Palettes</h3>
            <p className="text-muted-foreground text-sm">Browse and manage your complete palette collection</p>
            <Button 
              variant="outline"
              onClick={() => {
                const event = new CustomEvent('navigate-to-palettes');
                window.dispatchEvent(event);
              }}
            >
              View Saved Palettes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips & Tutorials */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">💡 Learning Tips & Tutorials</h3>
              <div className="space-y-2 mb-4">
                {tips.slice(0, 2).map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                📘 View All Tutorials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;