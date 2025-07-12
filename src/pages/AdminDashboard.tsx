
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Download
} from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import FeatureManagement from '@/components/admin/FeatureManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import OpenAISettings from '@/components/admin/OpenAISettings';
import AIGenerationSettings from '@/components/admin/AIGenerationSettings';
import OpenAIUsageLogs from '@/components/admin/OpenAIUsageLogs';
import AutoGenerator from '@/components/AutoGenerator';
import { logoutUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/history')}
              variant="outline" 
              size="sm"
            >
              History
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subscriptions">Plans</TabsTrigger>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="ai-limits">AI Limits</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="usage-logs">Usage Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <FeatureManagement />
          </TabsContent>

          <TabsContent value="generator">
            <AutoGenerator />
          </TabsContent>

          <TabsContent value="ai-limits">
            <AIGenerationSettings />
          </TabsContent>

          <TabsContent value="openai">
            <OpenAISettings />
          </TabsContent>

          <TabsContent value="usage-logs">
            <OpenAIUsageLogs />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
