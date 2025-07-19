import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Coins, User, UserCog, Save, BarChart3 } from 'lucide-react';
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
import Overview from '@/components/Overview';
import CoinCredits from '@/components/CoinCredits';

const menuItems = [
  {
    title: "📊 Overview",
    url: "#",
    icon: BarChart3,
    id: "overview"
  },
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
    title: "Coin Credits",
    url: "#",
    icon: Coins,
    id: "credits"
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
    case 'overview':
      return <Overview />;
    case 'palettes':
      return <SavedPalettes />;
    case 'profile':
      return <ProfileSettings />;
    case 'account':
      return <AccountSettings />;
    case 'credits':
      return <CoinCredits />;
    default:
      return <Overview />;
  }
};

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('overview');

  // Listen for custom navigation events from Overview component
  useEffect(() => {
    const handleNavigateToPalettes = () => {
      setActiveItem('palettes');
    };

    window.addEventListener('navigate-to-palettes', handleNavigateToPalettes);
    return () => window.removeEventListener('navigate-to-palettes', handleNavigateToPalettes);
  }, []);

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