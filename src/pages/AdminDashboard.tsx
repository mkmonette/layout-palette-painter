import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings,
  BarChart3,
  Shield,
  Bell,
  Download,
  Menu,
  LogOut,
  History,
  Coins,
  Palette,
  Bot,
  Eye,
  Plug,
  ChevronDown,
  ChevronRight,
  TestTube
} from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import FeatureManagement from '@/components/admin/FeatureManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import OpenAISettings from '@/components/admin/OpenAISettings';
import AIGenerationSettings from '@/components/admin/AIGenerationSettings';
import OpenAIUsageLogs from '@/components/admin/OpenAIUsageLogs';
import ColorRolePreview from '@/components/admin/ColorRolePreview';
import AutoGenerator from '@/components/AutoGenerator';
import PromptControlPanel from '@/components/admin/PromptControlPanel';
import PaletteGenerator from '@/components/admin/PaletteGenerator';
import SavedPalettesManager from '@/components/admin/SavedPalettesManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import CoinCreditSettings from '@/components/admin/CoinCreditSettings';
import PaymentGatewaySettings from '@/components/admin/PaymentGatewaySettings';
import ThemeTesterPanel from '@/components/admin/ThemeTesterPanel';
import ThemeToneSettings from '@/components/admin/ThemeToneSettings';

import { logoutUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

// Sidebar menu items
const menuItems = [
  { id: 'overview', title: 'Overview', icon: BarChart3 },
  { id: 'analytics', title: 'Analytics', icon: TrendingUp },
  { id: 'users', title: 'Users', icon: Users },
  { id: 'subscriptions', title: 'Plans', icon: CreditCard },
  { id: 'coin-credit', title: 'Coin Credit', icon: Coins },
  { id: 'generator', title: 'Generator', icon: Palette },
  { id: 'theme-tester', title: 'Theme Tester', icon: TestTube },
  { id: 'theme-tones', title: 'Theme Tones', icon: Palette },
  { id: 'ai-settings', title: 'AI Settings', icon: Bot },
  { id: 'color-preview', title: 'Colors', icon: Eye },
  { id: 'presets', title: 'Presets', icon: Download },
  { id: 'settings', title: 'Settings', icon: Settings }
];

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIntegrationsOpen(!integrationsOpen)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center">
                    <Plug className="h-4 w-4" />
                    <span>Integrations</span>
                  </div>
                  {integrationsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              {integrationsOpen && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab('payment-gateway')}
                    isActive={activeTab === 'payment-gateway'}
                    className="w-full justify-start ml-6"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Gateway</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/history')}>
                  <History className="h-4 w-4" />
                  <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAITab, setActiveAITab] = useState('openai');
  
  // Palette generation state
  const [currentScheme, setCurrentScheme] = useState('random');
  const [currentMood, setCurrentMood] = useState('');
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  
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

  const handleApplyPreset = (palette: any) => {
    setCurrentPalette(palette);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1" />
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'subscriptions' && <FeatureManagement />}
            {activeTab === 'coin-credit' && <CoinCreditSettings />}
            {activeTab === 'generator' && <AutoGenerator />}
            {activeTab === 'theme-tester' && <ThemeTesterPanel />}
            {activeTab === 'theme-tones' && <ThemeToneSettings />}
            {activeTab === 'color-preview' && <ColorRolePreview />}

            {activeTab === 'ai-settings' && (
              <Tabs value={activeAITab} onValueChange={setActiveAITab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 lg:w-fit">
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
            )}
            
            {activeTab === 'presets' && (
              <Tabs defaultValue="generator" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:w-fit">
                  <TabsTrigger value="generator">Palette Generator</TabsTrigger>
                  <TabsTrigger value="presets">Save & Load Presets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generator">
                  <PaletteGenerator 
                    currentPalette={currentPalette}
                    onApplyPreset={handleApplyPreset}
                    currentScheme={currentScheme}
                    currentMood={currentMood}
                    currentMode={currentMode}
                    onSchemeChange={setCurrentScheme}
                    onMoodChange={setCurrentMood}
                    onModeChange={setCurrentMode}
                  />
                </TabsContent>
                
                <TabsContent value="presets">
                  <SavedPalettesManager 
                    currentPalette={currentPalette}
                    onApplyPreset={handleApplyPreset}
                    currentScheme={currentScheme}
                    currentMood={currentMood}
                    currentMode={currentMode}
                  />
                </TabsContent>
              </Tabs>
            )}

            {activeTab === 'payment-gateway' && <PaymentGatewaySettings />}

            {activeTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;