import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Settings, Users, BarChart3, Coins } from 'lucide-react';
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

const menuItems = [
  {
    title: "Go to Studio",
    url: "/studio",
    icon: Palette,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Coin Credits",
    url: "#",
    icon: Coins,
  },
];

function DashboardSidebar() {
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
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
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

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
          </header>
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;