import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');

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

  // Chart data that changes based on time period
  const getChartData = () => {
    const baseData = {
      daily: [
        { name: 'Mon', users: 1200, revenue: 3400, palettes: 890 },
        { name: 'Tue', users: 1400, revenue: 3800, palettes: 1020 },
        { name: 'Wed', users: 1100, revenue: 3200, palettes: 780 },
        { name: 'Thu', users: 1600, revenue: 4200, palettes: 1150 },
        { name: 'Fri', users: 1800, revenue: 4800, palettes: 1340 },
        { name: 'Sat', users: 900, revenue: 2800, palettes: 650 },
        { name: 'Sun', users: 700, revenue: 2200, palettes: 420 }
      ],
      weekly: [
        { name: 'Week 1', users: 8500, revenue: 24000, palettes: 5200 },
        { name: 'Week 2', users: 9200, revenue: 26500, palettes: 5800 },
        { name: 'Week 3', users: 8800, revenue: 25200, palettes: 5400 },
        { name: 'Week 4', users: 10100, revenue: 28800, palettes: 6300 }
      ],
      monthly: [
        { name: 'Jan', users: 32000, revenue: 98000, palettes: 18500 },
        { name: 'Feb', users: 28000, revenue: 85000, palettes: 16200 },
        { name: 'Mar', users: 35000, revenue: 105000, palettes: 20800 },
        { name: 'Apr', users: 38000, revenue: 115000, palettes: 22400 },
        { name: 'May', users: 42000, revenue: 128000, palettes: 25100 },
        { name: 'Jun', users: 45000, revenue: 135000, palettes: 27300 }
      ],
      yearly: [
        { name: '2021', users: 280000, revenue: 850000, palettes: 165000 },
        { name: '2022', users: 420000, revenue: 1200000, palettes: 245000 },
        { name: '2023', users: 580000, revenue: 1650000, palettes: 340000 },
        { name: '2024', users: 750000, revenue: 2100000, palettes: 425000 }
      ]
    };
    
    return baseData[timePeriod as keyof typeof baseData] || baseData.monthly;
  };

  // Pie chart data for user distribution
  const pieChartData = [
    { name: 'Free Users', value: analyticsData.subscription.freeUsers, color: 'hsl(var(--muted))' },
    { name: 'Pro Users', value: analyticsData.subscription.proUsers, color: 'hsl(var(--primary))' },
    { name: 'Enterprise Users', value: analyticsData.subscription.enterpriseUsers, color: 'hsl(var(--accent))' }
  ];

  // Feature usage bar chart data
  const featureUsageData = [
    { name: 'AI Generation', value: analyticsData.features.aiGeneration },
    { name: 'Templates', value: analyticsData.features.templateUsage },
    { name: 'Exports', value: analyticsData.features.exportDownloads },
    { name: 'Presets', value: analyticsData.features.presetSaves }
  ];

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
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Charts
              </CardTitle>
              <CardDescription>
                Visual representation of key metrics over time
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timePeriod === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimePeriod('daily')}
              >
                Daily
              </Button>
              <Button
                variant={timePeriod === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimePeriod('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={timePeriod === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimePeriod('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={timePeriod === 'yearly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimePeriod('yearly')}
              >
                Yearly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Line Chart - User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="palettes" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Palettes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Feature Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={featureUsageData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--accent))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Engagement Metrics
        </h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
        <div className="space-y-4">
          {/* User Distribution - Full Width */}
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

          {/* MRR and Churn Rate - 2 Columns */}
          <div className="grid gap-4 grid-cols-2">
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
      </div>

      {/* Feature Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Feature Usage
        </h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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