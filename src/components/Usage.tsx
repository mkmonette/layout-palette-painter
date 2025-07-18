import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Save, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Download,
  Share,
  Target,
  Activity
} from 'lucide-react';

interface UsageStats {
  totalPalettesGenerated: number;
  totalPalettesSaved: number;
  lastLogin: string;
  lastActivity: string;
  accountCreated: string;
  monthlyGenerated: number;
  monthlyLimit: number;
  popularColors: Array<{ color: string; count: number }>;
  streakDays: number;
  totalShares: number;
  totalDownloads: number;
  totalViews: number;
}

const Usage = () => {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const fetchUsageStats = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: UsageStats = {
        totalPalettesGenerated: 247,
        totalPalettesSaved: 89,
        lastLogin: '2024-01-18T14:30:00Z',
        lastActivity: '2024-01-18T16:45:00Z',
        accountCreated: '2023-08-15T09:00:00Z',
        monthlyGenerated: 34,
        monthlyLimit: 100,
        popularColors: [
          { color: '#3b82f6', count: 23 },
          { color: '#10b981', count: 19 },
          { color: '#f59e0b', count: 16 },
          { color: '#ef4444', count: 14 },
          { color: '#8b5cf6', count: 12 }
        ],
        streakDays: 7,
        totalShares: 45,
        totalDownloads: 156,
        totalViews: 1247
      };
      
      setUsageStats(mockStats);
      setIsLoading(false);
    };

    fetchUsageStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const calculateAccountAge = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMonths = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffInMonths < 1) return 'Less than a month';
    if (diffInMonths === 1) return '1 month';
    if (diffInMonths < 12) return `${diffInMonths} months`;
    const years = Math.floor(diffInMonths / 12);
    const remainingMonths = diffInMonths % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years} year${years > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Usage Statistics</h2>
          <p className="text-muted-foreground">Track your activity and usage patterns.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!usageStats) return null;

  const monthlyProgress = (usageStats.monthlyGenerated / usageStats.monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Statistics</h2>
        <p className="text-muted-foreground">
          Track your activity and usage patterns across the platform.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Palettes Generated */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Generated</p>
                <p className="text-3xl font-bold">{usageStats.totalPalettesGenerated}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+12%</span>
              <span className="text-sm text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Palettes Saved */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                <p className="text-3xl font-bold">{usageStats.totalPalettesSaved}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Save className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                {Math.round((usageStats.totalPalettesSaved / usageStats.totalPalettesGenerated) * 100)}% save rate
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">{usageStats.streakDays}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                {usageStats.streakDays > 1 ? 'days' : 'day'} in a row
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card className="hover:shadow-lg transition-all duration-200 hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold">{usageStats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Palette views</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Monthly Usage
          </CardTitle>
          <CardDescription>
            Track your monthly palette generation usage and limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Palettes Generated This Month
              </span>
              <Badge variant={monthlyProgress > 80 ? "destructive" : "secondary"}>
                {usageStats.monthlyGenerated} / {usageStats.monthlyLimit}
              </Badge>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(monthlyProgress)}% used</span>
              <span>{usageStats.monthlyLimit - usageStats.monthlyGenerated} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Last Login</span>
              <div className="text-right">
                <p className="text-sm">{getTimeAgo(usageStats.lastLogin)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(usageStats.lastLogin)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Last Activity</span>
              <div className="text-right">
                <p className="text-sm">{getTimeAgo(usageStats.lastActivity)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(usageStats.lastActivity)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Account Age</span>
              <div className="text-right">
                <p className="text-sm">{calculateAccountAge(usageStats.accountCreated)}</p>
                <p className="text-xs text-muted-foreground">
                  Since {formatDate(usageStats.accountCreated)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>How others interact with your palettes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Shares</span>
              </div>
              <span className="text-lg font-semibold">{usageStats.totalShares}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Downloads</span>
              </div>
              <span className="text-lg font-semibold">{usageStats.totalDownloads}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Average Views per Palette</span>
              </div>
              <span className="text-lg font-semibold">
                {Math.round(usageStats.totalViews / usageStats.totalPalettesSaved)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Most Used Colors</CardTitle>
          <CardDescription>Your favorite colors based on usage frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {usageStats.popularColors.map((colorData, index) => (
              <div key={colorData.color} className="text-center space-y-2">
                <div
                  className="w-full h-16 rounded-lg shadow-sm border hover-scale transition-transform duration-200"
                  style={{ backgroundColor: colorData.color }}
                  title={colorData.color}
                />
                <div>
                  <p className="font-mono text-xs">{colorData.color}</p>
                  <p className="text-xs text-muted-foreground">{colorData.count} times</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usage;