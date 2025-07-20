import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Calendar,
  RefreshCw,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  Target,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  calculateUpgradeAnalytics,
  getEarlyUpgradeStats,
  getMostPopularUpgradePath,
  getBonusCoinsDistribution,
  generateDemoAnalyticsData,
  clearAnalyticsData,
  getUpgradeEvents
} from '@/utils/upgradeAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const UpgradeAnalyticsDashboard = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [earlyUpgradeStats, setEarlyUpgradeStats] = useState<any>(null);
  const [bonusDistribution, setBonusDistribution] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshAnalytics = () => {
    setLoading(true);
    try {
      const analyticsData = calculateUpgradeAnalytics();
      const earlyStats = getEarlyUpgradeStats();
      const bonusData = getBonusCoinsDistribution();
      
      setAnalytics(analyticsData);
      setEarlyUpgradeStats(earlyStats);
      setBonusDistribution(bonusData);
      
      toast({
        title: "Analytics Refreshed",
        description: `Loaded data for ${analyticsData.totalUpgrades} upgrades`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDemo = () => {
    generateDemoAnalyticsData();
    refreshAnalytics();
    toast({
      title: "Demo Data Generated",
      description: "Created 50 sample upgrade events for testing",
    });
  };

  const handleClearData = () => {
    clearAnalyticsData();
    refreshAnalytics();
    toast({
      title: "Data Cleared",
      description: "All analytics data has been removed",
    });
  };

  const exportData = () => {
    const events = getUpgradeEvents();
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `upgrade-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    refreshAnalytics();
  }, []);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const upgradePathData = analytics.popularUpgradePaths.map((path: any) => ({
    name: `${path.from} → ${path.to}`,
    value: path.count,
    percentage: path.percentage.toFixed(1)
  }));

  const monthlyData = analytics.monthlyUpgradeStats.map((month: any) => ({
    month: month.month,
    upgrades: month.upgrades,
    bonusCoins: month.bonusCoins,
    earlyUpgrades: month.earlyUpgrades
  }));

  const bonusDistributionData = Object.entries(bonusDistribution).map(([range, count]) => ({
    range,
    count: count as number
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Upgrade Analytics</h2>
          <p className="text-muted-foreground">Track subscription upgrades and bonus coin effectiveness</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateDemo} variant="outline" size="sm">
            Generate Demo Data
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={refreshAnalytics} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleClearData} variant="destructive" size="sm">
            Clear Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Upgrades</p>
                <p className="text-2xl font-bold">{analytics.totalUpgrades}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Early Upgrades</p>
                <p className="text-2xl font-bold">{earlyUpgradeStats.total}</p>
                <p className="text-xs text-green-600">
                  {earlyUpgradeStats.percentage.toFixed(1)}% of total
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bonus Coins</p>
                <p className="text-2xl font-bold">{analytics.totalBonusCoinsAwarded.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">
                  Avg: {analytics.averageBonusCoinsPerUpgrade.toFixed(1)} per upgrade
                </p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gateway vs Coins</p>
                <p className="text-2xl font-bold">{analytics.gatewayUpgrades}/{analytics.coinUpgrades}</p>
                <p className="text-xs text-purple-600">
                  {analytics.totalUpgrades > 0 ? ((analytics.gatewayUpgrades / analytics.totalUpgrades) * 100).toFixed(1) : 0}% gateway
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="paths">Upgrade Paths</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Popular Upgrade Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Most Popular Upgrade Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={upgradePathData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bonus Coins Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Bonus Coins Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bonusDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, count }) => `${range}: ${count}`}
                    >
                      {bonusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bonus Effectiveness Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Bonus Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.bonusEffectiveness.earlyUpgradeRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Early Upgrade Rate</div>
                  <div className="text-xs text-green-600 mt-1">
                    Users upgrading with 15+ days remaining
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.bonusEffectiveness.averageDaysRemaining.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Days Remaining</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Average days left when upgrading
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.bonusEffectiveness.bonusConversionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Bonus Conversion Rate</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Gateway upgrades receiving bonuses
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Upgrade Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="upgrades" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Total Upgrades"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earlyUpgrades" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Early Upgrades"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonus Coins Awarded Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bonusCoins" 
                    stroke="#ffc658" 
                    strokeWidth={3}
                    name="Bonus Coins"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Path Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.planUpgradeMatrix).map(([fromPlan, toPlanCounts]) => (
                    <div key={fromPlan} className="border rounded-lg p-3">
                      <div className="font-medium mb-2 capitalize">From {fromPlan}:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(toPlanCounts as Record<string, number>).map(([toPlan, count]) => (
                          <div key={toPlan} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" />
                              <span className="capitalize">{toPlan}</span>
                            </div>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Upgrade Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.popularUpgradePaths.slice(0, 8).map((path: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{path.from} → {path.to}</div>
                          <div className="text-sm text-muted-foreground">
                            {path.percentage.toFixed(1)}% of all upgrades
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{path.count}</div>
                        <div className="text-xs text-muted-foreground">upgrades</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Early Upgrade Impact</CardTitle>
                <CardDescription>
                  Analysis of users who upgraded before 50% of their billing period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{earlyUpgradeStats.total}</div>
                      <div className="text-sm text-muted-foreground">Early Upgrades</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {earlyUpgradeStats.averageBonusCoins.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Bonus Coins</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Key Insights:</div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• {earlyUpgradeStats.percentage.toFixed(1)}% of users upgrade early when bonus is available</li>
                      <li>• Average {earlyUpgradeStats.averageDaysRemaining.toFixed(1)} days remaining at upgrade</li>
                      <li>• Early upgraders receive {earlyUpgradeStats.averageBonusCoins.toFixed(0)} bonus coins on average</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bonus Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.bonusEffectiveness.earlyUpgradeRate < 30 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="font-medium text-orange-800">Low Early Upgrade Rate</div>
                      <div className="text-sm text-orange-700 mt-1">
                        Consider increasing bonus coins per day to encourage earlier upgrades
                      </div>
                    </div>
                  )}
                  
                  {analytics.averageBonusCoinsPerUpgrade < 20 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium text-blue-800">Low Average Bonus</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Average bonus coins are low. Consider reviewing bonus rules
                      </div>
                    </div>
                  )}
                  
                  {analytics.bonusEffectiveness.bonusConversionRate > 80 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800">High Conversion Rate!</div>
                      <div className="text-sm text-green-700 mt-1">
                        Excellent bonus system performance - most gateway upgrades receive bonuses
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-800">Recommendations:</div>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li>• Most popular path: {analytics.popularUpgradePaths[0]?.from} → {analytics.popularUpgradePaths[0]?.to}</li>
                      <li>• Focus bonus optimization on high-traffic upgrade paths</li>
                      <li>• Monitor early upgrade trends for bonus effectiveness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpgradeAnalyticsDashboard;