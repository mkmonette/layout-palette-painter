import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Save, 
  Sparkles, 
  Palette, 
  Clock, 
  Calendar,
  Infinity,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';

interface QuotaInfo {
  used: number;
  limit: number | null; // null means unlimited
  resetDate?: string;
  resetPeriod?: string; // "monthly", "weekly", etc.
}

interface UsageData {
  pdfDownloads: QuotaInfo;
  savedPalettes: QuotaInfo;
  aiGenerations: QuotaInfo;
  totalGenerated: number;
  lastActivity: string;
  accountCreated: string;
}

const Usage = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual data fetching
  useEffect(() => {
    const fetchUsageData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: UsageData = {
        pdfDownloads: {
          used: 3,
          limit: 10,
          resetPeriod: "monthly",
          resetDate: "2024-02-01T00:00:00Z"
        },
        savedPalettes: {
          used: 8,
          limit: 50,
          resetPeriod: "monthly",
          resetDate: "2024-02-01T00:00:00Z"
        },
        aiGenerations: {
          used: 15,
          limit: null, // Unlimited for this user
          resetPeriod: "monthly"
        },
        totalGenerated: 247,
        lastActivity: '2024-01-18T16:45:00Z',
        accountCreated: '2023-08-15T09:00:00Z'
      };
      
      setUsageData(mockData);
      setIsLoading(false);
    };

    fetchUsageData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const getResetText = (quota: QuotaInfo) => {
    if (!quota.resetPeriod) return null;
    
    if (quota.resetDate) {
      const resetDate = new Date(quota.resetDate);
      const now = new Date();
      const daysUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilReset <= 0) {
        return `Resets ${quota.resetPeriod}`;
      } else if (daysUntilReset === 1) {
        return "Resets tomorrow";
      } else if (daysUntilReset <= 7) {
        return `Resets in ${daysUntilReset} days`;
      } else {
        return `Renews on ${formatDate(quota.resetDate)}`;
      }
    }
    
    return `Resets ${quota.resetPeriod}`;
  };

  const getProgressValue = (quota: QuotaInfo) => {
    if (quota.limit === null || quota.limit === 0) return 0;
    return (quota.used / quota.limit) * 100;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'destructive';
    if (percentage >= 70) return 'warning';
    return 'default';
  };

  const QuotaCard = ({ 
    title, 
    quota, 
    icon: Icon, 
    description 
  }: { 
    title: string; 
    quota: QuotaInfo; 
    icon: React.ElementType; 
    description: string;
  }) => {
    const isUnlimited = quota.limit === null;
    const progressValue = getProgressValue(quota);
    const resetText = getResetText(quota);

    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover-scale">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isUnlimited ? 'bg-green-500/10' : 
                progressValue >= 90 ? 'bg-red-500/10' : 
                progressValue >= 70 ? 'bg-yellow-500/10' : 
                'bg-blue-500/10'
              }`}>
                <Icon className={`w-5 h-5 ${
                  isUnlimited ? 'text-green-500' : 
                  progressValue >= 90 ? 'text-red-500' : 
                  progressValue >= 70 ? 'text-yellow-500' : 
                  'text-blue-500'
                }`} />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
              </div>
            </div>
            {isUnlimited && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                <Infinity className="w-3 h-3 mr-1" />
                Unlimited
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Usage Display */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {quota.used}
                {!isUnlimited && (
                  <span className="text-lg font-normal text-muted-foreground ml-1">
                    of {quota.limit}
                  </span>
                )}
              </span>
              {!isUnlimited && (
                <span className="text-sm text-muted-foreground">
                  {quota.limit! - quota.used} remaining
                </span>
              )}
            </div>

            {/* Progress Bar (only for limited quotas) */}
            {!isUnlimited && (
              <div className="space-y-2">
                <Progress 
                  value={progressValue} 
                  className={`h-2 ${
                    progressValue >= 90 ? '[&>div]:bg-red-500' : 
                    progressValue >= 70 ? '[&>div]:bg-yellow-500' : 
                    '[&>div]:bg-blue-500'
                  }`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progressValue)}% used</span>
                  {resetText && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      {resetText}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Reset info for unlimited quotas */}
            {isUnlimited && resetText && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                {resetText}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Usage & Quotas</h2>
          <p className="text-muted-foreground">Track your usage and available quotas.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Usage & Quotas</h2>
          <p className="text-muted-foreground">Track your usage and available quotas.</p>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Usage data unavailable</h3>
            <p className="text-muted-foreground">
              We're unable to load your usage information at the moment. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage & Quotas</h2>
        <p className="text-muted-foreground">
          Track your usage and available quotas across different features.
        </p>
      </div>

      {/* Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuotaCard
          title="PDF Downloads"
          quota={usageData.pdfDownloads}
          icon={Download}
          description="Monthly download limit"
        />
        
        <QuotaCard
          title="Saved Palettes"
          quota={usageData.savedPalettes}
          icon={Save}
          description="Total palette storage"
        />
        
        <QuotaCard
          title="AI Generations"
          quota={usageData.aiGenerations}
          icon={Sparkles}
          description="AI-powered color creation"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Total Palettes Generated</span>
              <span className="text-lg font-semibold">{usageData.totalGenerated}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Last Activity</span>
              <div className="text-right">
                <p className="text-sm font-medium">{getTimeAgo(usageData.lastActivity)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(usageData.lastActivity)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Usage Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Downloads per Day</span>
                <span className="text-sm font-medium">
                  {Math.round(usageData.pdfDownloads.used / 30)} / day
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Save Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((usageData.savedPalettes.used / usageData.totalGenerated) * 100)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Age</span>
                <span className="text-sm font-medium">
                  {Math.floor((new Date().getTime() - new Date(usageData.accountCreated).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usage;