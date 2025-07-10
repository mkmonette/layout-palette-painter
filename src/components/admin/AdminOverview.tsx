
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Download,
  Eye
} from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users
    },
    {
      title: "Active Subscriptions",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: CreditCard
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      change: "+15%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "-2%",
      trend: "down",
      icon: TrendingUp
    }
  ];

  const recentActivity = [
    { user: "John Doe", action: "Upgraded to Pro", time: "2 hours ago" },
    { user: "Sarah Smith", action: "New registration", time: "4 hours ago" },
    { user: "Mike Johnson", action: "Cancelled subscription", time: "6 hours ago" },
    { user: "Emma Wilson", action: "Payment received", time: "8 hours ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export User Data
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Refunds
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Send Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
