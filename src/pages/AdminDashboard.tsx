import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
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
  TestTube,
  FileText,
  Search,
  X
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
import ContentManagement from '@/components/admin/ContentManagement';
import { Reports } from '@/components/admin/Reports';
import TransactionManagement from '@/components/admin/TransactionManagement';
import NotificationCenter, { triggerNotification, testNotificationSamples } from '@/components/admin/NotificationCenter';
import AICostCalculator from '@/components/admin/AICostCalculator';

import { logoutUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

// Grouped menu items for mobile drawer
const menuGroups = [
  {
    title: "Dashboard",
    items: [
      { id: 'overview', title: 'Overview', icon: BarChart3 },
      { id: 'analytics', title: 'Analytics', icon: TrendingUp },
      { id: 'reports', title: 'Reports', icon: FileText },
    ]
  },
  {
    title: "Management",
    items: [
      { id: 'users', title: 'Users', icon: Users },
      { id: 'transactions', title: 'Transactions', icon: CreditCard },
      { id: 'subscriptions', title: 'Plans', icon: CreditCard },
      { id: 'coin-credit', title: 'Coin Credit', icon: Coins },
      { id: 'content', title: 'Content', icon: FileText },
    ]
  },
  {
    title: "Tools",
    items: [
      { id: 'generator', title: 'Generator', icon: Palette },
      { id: 'theme-tester', title: 'Theme Tester', icon: TestTube },
      { id: 'ai-settings', title: 'AI Settings', icon: Bot },
      { id: 'color-preview', title: 'Colors', icon: Eye },
      { id: 'presets', title: 'Presets', icon: Download },
    ]
  },
  {
    title: "Integrations",
    items: [
      { id: 'payment-gateway', title: 'Payment Gateway', icon: CreditCard },
    ]
  }
];

// Flat menu items for desktop sidebar
const menuItems = menuGroups.flatMap(group => group.items).concat([
  { id: 'settings', title: 'Settings', icon: Settings }
]);

// Get page title from menu items
const getPageTitle = (activeTab: string) => {
  const allItems = [...menuItems];
  const item = allItems.find(item => item.id === activeTab);
  return item?.title || 'Admin Dashboard';
};

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
                <SidebarMenuButton onClick={() => navigate('/admin/notifications')}>
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

// Mobile Drawer Navigation Component
interface MobileDrawerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobileDrawerNavigation = ({ activeTab, setActiveTab, isOpen, setIsOpen }: MobileDrawerProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Admin Dashboard
            </DrawerTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <Accordion type="multiple" defaultValue={["Dashboard", "Management", "Tools"]} className="space-y-2">
            {filteredGroups.map((group) => (
              <AccordionItem key={group.title} value={group.title} className="border-none">
                <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline py-3">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-10"
                        onClick={() => handleNavigation(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {/* Settings */}
            <div className="pt-2">
              <Button
                variant={activeTab === 'settings' ? "secondary" : "ghost"}
                className="w-full justify-start h-10"
                onClick={() => handleNavigation('settings')}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </div>
          </Accordion>
        </ScrollArea>

        {/* Sticky Actions at Bottom */}
        <div className="border-t p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => {
              navigate('/history');
              setIsOpen(false);
            }}
          >
            <History className="h-4 w-4 mr-3" />
            History
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => {
              navigate('/admin/notifications');
              setIsOpen(false);
            }}
          >
            <Bell className="h-4 w-4 mr-3" />
            Notifications
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Mobile Tab Dropdown Components
interface MobileTabDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

const MobileTabDropdown = ({ options, value, onValueChange, placeholder }: MobileTabDropdownProps) => (
  <div className="md:hidden mb-6">
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAITab, setActiveAITab] = useState('openai');
  const [activeReportsTab, setActiveReportsTab] = useState('monthly');
  const [activeCoinTab, setActiveCoinTab] = useState('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Test notification function
  const handleTestNotification = () => {
    const randomNotif = testNotificationSamples[Math.floor(Math.random() * testNotificationSamples.length)];
    triggerNotification(randomNotif);
  };
  
  // Palette generation state
  const [currentScheme, setCurrentScheme] = useState('random');
  const [currentMood, setCurrentMood] = useState('');
  const [currentMode, setCurrentMode] = useState<string>('light');
  
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

  // Mobile dropdown options
  const aiTabOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'ai-limits', label: 'AI Limits' },
    { value: 'cost-calculator', label: 'Cost Calculator' },
    { value: 'usage-logs', label: 'Usage Logs' },
    { value: 'prompt-control', label: 'Prompt Control' }
  ];

  const reportsTabOptions = [
    { value: 'monthly', label: 'Monthly Summary' },
    { value: 'features', label: 'Feature Usage' },
    { value: 'palettes', label: 'Saved Palettes' },
    { value: 'exports', label: 'Export Activity' },
    { value: 'filters', label: 'Custom Filters' },
    { value: 'lookup', label: 'User Lookup' },
    { value: 'logs', label: 'Error Logs' }
  ];

  const coinTabOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'packages', label: 'Packages' },
    { value: 'transactions', label: 'Transactions' }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
          <div className="flex h-14 items-center px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold">{getPageTitle(activeTab)}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestNotification}
              >
                <TestTube className="h-4 w-4" />
              </Button>
              <NotificationCenter />
            </div>
          </div>
        </header>

        {/* Mobile Drawer Navigation */}
        <MobileDrawerNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={mobileDrawerOpen}
          setIsOpen={setMobileDrawerOpen}
        />

        {/* Mobile Main Content */}
        <main className="p-4">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          
          {activeTab === 'reports' && (
            <>
              <MobileTabDropdown 
                options={reportsTabOptions}
                value={activeReportsTab}
                onValueChange={setActiveReportsTab}
                placeholder="Select Report Type"
              />
              <Reports />
            </>
          )}
          
          {activeTab === 'transactions' && <TransactionManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'subscriptions' && <FeatureManagement />}
          
          {activeTab === 'coin-credit' && (
            <>
              <MobileTabDropdown 
                options={coinTabOptions}
                value={activeCoinTab}
                onValueChange={setActiveCoinTab}
                placeholder="Select Coin Credit Section"
              />
              <CoinCreditSettings />
            </>
          )}
          
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'generator' && <AutoGenerator />}
          {activeTab === 'theme-tester' && <ThemeTesterPanel />}
          {activeTab === 'color-preview' && <ColorRolePreview />}

          {activeTab === 'ai-settings' && (
            <>
              <MobileTabDropdown 
                options={aiTabOptions}
                value={activeAITab}
                onValueChange={setActiveAITab}
                placeholder="Select AI Setting"
              />
              
              {activeAITab === 'openai' && <OpenAISettings />}
              {activeAITab === 'ai-limits' && <AIGenerationSettings />}
              {activeAITab === 'cost-calculator' && <AICostCalculator />}
              {activeAITab === 'usage-logs' && <OpenAIUsageLogs />}
              {activeAITab === 'prompt-control' && <PromptControlPanel />}
            </>
          )}
          
          {activeTab === 'presets' && (
            <Tabs defaultValue="generator" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator">Generator</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
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
    );
  }

  // Desktop Layout (unchanged)
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
              
              {/* Test Notification Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="mr-3"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Trigger Test Notification
              </Button>
              
              {/* Notification Center */}
              <NotificationCenter />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'transactions' && <TransactionManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'subscriptions' && <FeatureManagement />}
            {activeTab === 'coin-credit' && <CoinCreditSettings />}
            {activeTab === 'content' && <ContentManagement />}
            {activeTab === 'generator' && <AutoGenerator />}
            {activeTab === 'theme-tester' && <ThemeTesterPanel />}
            
            {activeTab === 'color-preview' && <ColorRolePreview />}

            {activeTab === 'ai-settings' && (
              <Tabs value={activeAITab} onValueChange={setActiveAITab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-5 lg:w-fit">
                  <TabsTrigger value="openai">OpenAI</TabsTrigger>
                  <TabsTrigger value="ai-limits">AI Limits</TabsTrigger>
                  <TabsTrigger value="cost-calculator">Cost Calculator</TabsTrigger>
                  <TabsTrigger value="usage-logs">Usage Logs</TabsTrigger>
                  <TabsTrigger value="prompt-control">Prompt Control</TabsTrigger>
                </TabsList>
                
                <TabsContent value="openai">
                  <OpenAISettings />
                </TabsContent>
                
                <TabsContent value="ai-limits">
                  <AIGenerationSettings />
                </TabsContent>
                
                <TabsContent value="cost-calculator">
                  <AICostCalculator />
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