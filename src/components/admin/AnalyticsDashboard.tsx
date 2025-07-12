import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  Palette,
  Eye,
  Download,
  CreditCard,
  UserPlus,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AnalyticsDashboard: React.FC = () => {
  // Mock analytics data - in real implementation this would come from your analytics service
  const analyticsData = {
    overview: {
      totalUsers: 12847,
      totalUsersGrowth: 23.5,
      activeUsers: 8932,
      activeUsersGrowth: 12.3,
      revenue: 45670,
      revenueGrowth: 18.7,
      conversionRate: 3.2,
      conversionGrowth: -2.1
    },
    engagement: {
      paletteGenerations: 15420,
      paletteGenerationsGrowth: 34.2,
      avgSessionDuration: '4m 32s',
      sessionGrowth: 8.1,
      pageViews: 89342,
      pageViewsGrowth: 15.6,
      downloads: 4521,
      downloadsGrowth: 22.3
    },
    subscription: {
      freeUsers: 9847,
      proUsers: 2145,
      enterpriseUsers: 855,
      churnRate: 2.1,
      mrr: 35420,
      mrrGrowth: 16.8
    },
    features: {
      aiGeneration: 8934,
      templateUsage: 6742,
      exportDownloads: 4521,
      presetSaves: 3210
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    prefix = '', 
    suffix = '' 
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: any;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {growth !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {growth >= 0 ? '+' : ''}{growth}%
            </span>{' '}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive metrics and insights for your color palette platform</p>
      </div>

      {/* Overview Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Overview Metrics
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={analyticsData.overview.totalUsers}
            growth={analyticsData.overview.totalUsersGrowth}
            icon={Users}
          />
          <StatCard
            title="Active Users"
            value={analyticsData.overview.activeUsers}
            growth={analyticsData.overview.activeUsersGrowth}
            icon={Activity}
          />
          <StatCard
            title="Revenue"
            value={analyticsData.overview.revenue}
            growth={analyticsData.overview.revenueGrowth}
            icon={DollarSign}
            prefix="$"
          />
          <StatCard
            title="Conversion Rate"
            value={analyticsData.overview.conversionRate}
            growth={analyticsData.overview.conversionGrowth}
            icon={TrendingUp}
            suffix="%"
          />
        </div>
      </div>

      {/* Engagement Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Engagement Metrics
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Palette Generations"
            value={analyticsData.engagement.paletteGenerations}
            growth={analyticsData.engagement.paletteGenerationsGrowth}
            icon={Palette}
          />
          <StatCard
            title="Avg Session Duration"
            value={analyticsData.engagement.avgSessionDuration}
            growth={analyticsData.engagement.sessionGrowth}
            icon={Clock}
          />
          <StatCard
            title="Page Views"
            value={analyticsData.engagement.pageViews}
            growth={analyticsData.engagement.pageViewsGrowth}
            icon={Eye}
          />
          <StatCard
            title="Downloads"
            value={analyticsData.engagement.downloads}
            growth={analyticsData.engagement.downloadsGrowth}
            icon={Download}
          />
        </div>
      </div>

      {/* Subscription Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Metrics
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Free Users</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{analyticsData.subscription.freeUsers.toLocaleString()}</span>
                  <Badge variant="secondary">Free</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pro Users</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{analyticsData.subscription.proUsers.toLocaleString()}</span>
                  <Badge variant="default">Pro</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enterprise Users</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{analyticsData.subscription.enterpriseUsers.toLocaleString()}</span>
                  <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <StatCard
            title="Monthly Recurring Revenue"
            value={analyticsData.subscription.mrr}
            growth={analyticsData.subscription.mrrGrowth}
            icon={DollarSign}
            prefix="$"
          />

          <StatCard
            title="Churn Rate"
            value={analyticsData.subscription.churnRate}
            icon={UserPlus}
            suffix="%"
          />
        </div>
      </div>

      {/* Feature Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Feature Usage
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="AI Generations"
            value={analyticsData.features.aiGeneration}
            icon={Palette}
          />
          <StatCard
            title="Template Usage"
            value={analyticsData.features.templateUsage}
            icon={Eye}
          />
          <StatCard
            title="Export Downloads"
            value={analyticsData.features.exportDownloads}
            icon={Download}
          />
          <StatCard
            title="Preset Saves"
            value={analyticsData.features.presetSaves}
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity Summary
          </CardTitle>
          <CardDescription>
            Key highlights from the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Top Performing Day</h4>
              <p className="text-sm text-muted-foreground">March 15, 2024</p>
              <p className="text-2xl font-bold">1,247 <span className="text-sm font-normal">palette generations</span></p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Peak Usage Hour</h4>
              <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM UTC</p>
              <p className="text-2xl font-bold">89 <span className="text-sm font-normal">concurrent users</span></p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Most Popular Feature</h4>
              <p className="text-sm text-muted-foreground">AI Color Generation</p>
              <p className="text-2xl font-bold">67% <span className="text-sm font-normal">of all generations</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Health</CardTitle>
          <CardDescription>
            System performance and reliability metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">0.02%</div>
              <div className="text-sm text-muted-foreground">Error Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">95</div>
              <div className="text-sm text-muted-foreground">Performance Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;