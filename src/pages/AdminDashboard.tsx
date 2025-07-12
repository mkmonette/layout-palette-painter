
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
import ColorRolePreview from '@/components/admin/ColorRolePreview';
import MiniTemplatePreview from '@/components/admin/MiniTemplatePreview';
import PresetManager from '@/components/admin/PresetManager';
import AutoGenerator from '@/components/AutoGenerator';
import PromptControlPanel from '@/components/admin/PromptControlPanel';
import PaletteGenerator from '@/components/admin/PaletteGenerator';
import SavedPalettesManager from '@/components/admin/SavedPalettesManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { logoutUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock current palette - in real implementation this would come from state management
  const [currentPalette, setCurrentPalette] = useState({
    brand: '#3366FF',
    accent: '#FF6B35',
    highlight: '#4ECDC4',
    'button-primary': '#3366FF',
    'button-secondary': '#6C757D',
    'button-text': '#FFFFFF',
    'button-secondary-text': '#FFFFFF',
    'text-primary': '#000000',
    'text-secondary': '#6C757D',
    'section-bg-1': '#FFFFFF',
    'section-bg-2': '#F8F9FA',
    'section-bg-3': '#E9ECEF',
    border: '#DEE2E6',
    'input-bg': '#FFFFFF',
    'input-text': '#000000'
  });

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleApplyPreset = (palette: any) => {
    setCurrentPalette(palette);
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
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subscriptions">Plans</TabsTrigger>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
            <TabsTrigger value="color-preview">Colors</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
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

          <TabsContent value="ai-settings">
            <Tabs defaultValue="openai" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="ai-limits">AI Limits</TabsTrigger>
                <TabsTrigger value="usage-logs">Usage Logs</TabsTrigger>
                <TabsTrigger value="prompt-control">Prompt Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="openai">
                <OpenAISettings />
              </TabsContent>
              
              <TabsContent value="ai-limits">
                <AIGenerationSettings />
              </TabsContent>
              
              <TabsContent value="usage-logs">
                <OpenAIUsageLogs />
              </TabsContent>
              
              <TabsContent value="prompt-control">
                <PromptControlPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="color-preview">
            <ColorRolePreview />
          </TabsContent>

          <TabsContent value="presets">
            <Tabs defaultValue="generator" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator">Palette Generator</TabsTrigger>
                <TabsTrigger value="presets">Save & Load Presets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator">
                <PaletteGenerator 
                  currentPalette={currentPalette}
                  onApplyPreset={handleApplyPreset}
                />
              </TabsContent>
              
              <TabsContent value="presets">
                <SavedPalettesManager 
                  currentPalette={currentPalette}
                  onApplyPreset={handleApplyPreset}
                />
              </TabsContent>
            </Tabs>
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
