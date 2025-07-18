import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Settings, Users, BarChart3, Coins, User, UserCog, Save, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileSettings from '@/components/ProfileSettings';
import AccountSettings from '@/components/AccountSettings';
import SavedPalettes from '@/components/SavedPalettes';
import Usage from '@/components/Usage';

const menuItems = [
  {
    title: "Go to Studio",
    url: "/studio",
    icon: Palette,
    id: "studio"
  },
  {
    title: "Saved Palettes",
    url: "#",
    icon: Save,
    id: "palettes"
  },
  {
    title: "Usage",
    url: "#",
    icon: TrendingUp,
    id: "usage"
  },
  {
    title: "Profile Settings",
    url: "#",
    icon: User,
    id: "profile"
  },
  {
    title: "Account Settings",
    url: "#",
    icon: UserCog,
    id: "account"
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    id: "settings"
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
    id: "users"
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
    id: "analytics"
  },
  {
    title: "Coin Credits",
    url: "#",
    icon: Coins,
    id: "credits"
  },
];

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

function DashboardSidebar({ activeItem, onItemClick }: DashboardSidebarProps) {
  return (
    <Sidebar className="w-60">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.id === "studio" ? (
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => onItemClick(item.id)}
                        className={`flex items-center gap-2 w-full text-left ${
                          activeItem === item.id ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const DashboardContent = ({ activeItem }: { activeItem: string }) => {
  switch (activeItem) {
    case 'palettes':
      return <SavedPalettes />;
    case 'usage':
      return <Usage />;
    case 'profile':
      return <ProfileSettings />;
    case 'account':
      return <AccountSettings />;
    case 'settings':
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">General Settings</h2>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <p className="text-muted-foreground">General settings content coming soon...</p>
          </div>
        </div>
      );
    case 'users':
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <p className="text-muted-foreground">User management content coming soon...</p>
          </div>
        </div>
      );
    case 'analytics':
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Analytics</h2>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <p className="text-muted-foreground">Analytics content coming soon...</p>
          </div>
        </div>
      );
    case 'credits':
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Coin Credits</h2>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <p className="text-muted-foreground">Coin credits content coming soon...</p>
          </div>
        </div>
      );
    default:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <p className="text-muted-foreground">View your app statistics</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">Latest user interactions</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">System Health</h3>
              <p className="text-muted-foreground">Monitor system status</p>
            </div>
          </div>
        </div>
      );
  }
};

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const getPageTitle = () => {
    const item = menuItems.find(item => item.id === activeItem);
    return item ? item.title : 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar activeItem={activeItem} onItemClick={handleItemClick} />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">{getPageTitle()}</h1>
          </header>
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <DashboardContent activeItem={activeItem} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;