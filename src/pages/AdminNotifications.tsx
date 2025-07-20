import React, { useState, useEffect, useRef } from 'react';
import { Bell, ArrowLeft, Filter, Check, Shield, CreditCard, Users, Settings, Workflow, ExternalLink, Grid, List, Download, FileSpreadsheet } from 'lucide-react';
import XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Notification, NotificationPreferences } from '@/components/admin/NotificationCenter';

const STORAGE_KEY = 'admin_notifications';
const PREFERENCES_KEY = 'notification_preferences';
const FILTER_KEY = 'notification_last_filter';
const VIEW_MODE_KEY = 'notification_view_mode';

// Default preferences
const defaultPreferences: NotificationPreferences = {
  showSecurity: true,
  showPayment: true,
  showUser: true,
  showSystem: true,
  showWorkflow: true
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return '🔴';
    case 'warning':
      return '🟡';
    case 'info':
    default:
      return '🔵';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive/20 text-destructive-foreground';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100';
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffInDays}d ago`;
  }
};

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [activeTab, setActiveTab] = useState('notifications');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const unreadRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error parsing notifications from localStorage:', error);
        setNotifications([]);
      }
    }

    // Load preferences
    const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (storedPrefs) {
      try {
        const parsedPrefs = JSON.parse(storedPrefs);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }

    // Load last filter
    const lastFilter = localStorage.getItem(FILTER_KEY);
    if (lastFilter) {
      setSelectedType(lastFilter);
    }

    // Load last view mode
    const lastViewMode = localStorage.getItem(VIEW_MODE_KEY);
    if (lastViewMode && (lastViewMode === 'card' || lastViewMode === 'table')) {
      setViewMode(lastViewMode);
    }
  }, []);

  // Listen for storage events (for real-time updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (error) {
          console.error('Error parsing notifications from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter notifications when type or preferences change
  useEffect(() => {
    let filtered = notifications;

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Apply preferences filter
    filtered = filtered.filter(notification => {
      switch (notification.type) {
        case 'security':
          return preferences.showSecurity;
        case 'payment':
          return preferences.showPayment;
        case 'user':
          return preferences.showUser;
        case 'system':
          return preferences.showSystem;
        case 'workflow':
          return preferences.showWorkflow;
        default:
          return true;
      }
    });

    setFilteredNotifications(filtered);
  }, [notifications, selectedType, preferences]);

  // Save filter selection to localStorage
  useEffect(() => {
    localStorage.setItem(FILTER_KEY, selectedType);
  }, [selectedType]);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  // Scroll to latest unread notification
  useEffect(() => {
    const unreadNotifications = filteredNotifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      const latestUnread = unreadNotifications[0];
      const element = unreadRefs.current[latestUnread.id];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [filteredNotifications]);

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  // Handle notification click - mark as read and show details
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const updated = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    
    // Set selected notification and show modal
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  // Update preferences
  const updatePreferences = (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
  };

  // Handle notification action based on type
  const handleNotificationAction = (notification: Notification) => {
    if (notification.type === 'payment') {
      navigate('/admin', { state: { activeTab: 'transactions' } });
    } else if (notification.type === 'security') {
      navigate('/admin', { state: { activeTab: 'users' } });
    }
    setShowDetailsModal(false);
  };

  // Get unread count (respecting preferences)
  const unreadCount = notifications.filter(n => !n.read && (
    (n.type === 'security' && preferences.showSecurity) ||
    (n.type === 'payment' && preferences.showPayment) ||
    (n.type === 'user' && preferences.showUser) ||
    (n.type === 'system' && preferences.showSystem) ||
    (n.type === 'workflow' && preferences.showWorkflow)
  )).length;

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredNotifications.map(notification => ({
      Type: notification.type,
      Severity: notification.severity,
      Title: notification.title,
      Message: notification.message,
      Timestamp: new Date(notification.timestamp).toLocaleString(),
      'Read Status': notification.read ? 'Read' : 'Unread'
    }));

    const csvContent = [
      // Header
      Object.keys(csvData[0] || {}).join(','),
      // Data rows
      ...csvData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `notifications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const excelData = filteredNotifications.map(notification => ({
      Type: notification.type,
      Severity: notification.severity,
      Title: notification.title,
      Message: notification.message,
      Timestamp: new Date(notification.timestamp).toLocaleString(),
      'Read Status': notification.read ? 'Read' : 'Unread'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notifications');
    XLSX.writeFile(workbook, `notifications-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6 px-2">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <div className="flex-1" />
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">Controls</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Filter */}
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="security">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Security
                        </div>
                      </SelectItem>
                      <SelectItem value="payment">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                      <SelectItem value="workflow">
                        <div className="flex items-center gap-2">
                          <Workflow className="h-4 w-4" />
                          Workflow
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
                      <Button
                        variant={viewMode === 'card' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('card')}
                        className="h-8 px-3"
                      >
                        <Grid className="h-4 w-4 mr-1" />
                        Cards
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className="h-8 px-3"
                      >
                        <List className="h-4 w-4 mr-1" />
                        Table
                      </Button>
                    </div>

                    {/* Export Buttons */}
                    {filteredNotifications.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportToCSV}
                          className="h-8"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportToExcel}
                          className="h-8"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications found for the selected filter.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : viewMode === 'table' ? (
                // Table View
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Type</TableHead>
                          <TableHead className="w-[120px]">Severity</TableHead>
                          <TableHead className="w-[180px]">Timestamp</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotifications.map((notification) => (
                          <TableRow
                            key={notification.id}
                            className={`cursor-pointer hover:bg-muted/50 ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {notification.type === 'security' && <Shield className="h-4 w-4" />}
                                {notification.type === 'payment' && <CreditCard className="h-4 w-4" />}
                                {notification.type === 'user' && <Users className="h-4 w-4" />}
                                {notification.type === 'system' && <Settings className="h-4 w-4" />}
                                {notification.type === 'workflow' && <Workflow className="h-4 w-4" />}
                                <span className="capitalize text-sm">{notification.type}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getSeverityIcon(notification.severity)}</span>
                                <Badge 
                                  variant={notification.severity === 'critical' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{notification.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {notification.read ? (
                                <Badge variant="outline" className="text-xs">
                                  Read
                                </Badge>
                              ) : (
                                <Badge variant="default" className="text-xs">
                                  Unread
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                // Card View - Group notifications by type
                (() => {
                  const grouped = filteredNotifications.reduce((acc, notification) => {
                    if (!acc[notification.type]) {
                      acc[notification.type] = [];
                    }
                    acc[notification.type].push(notification);
                    return acc;
                  }, {} as Record<string, Notification[]>);

                  const typeIcons = {
                    security: Shield,
                    payment: CreditCard,
                    user: Users,
                    system: Settings,
                    workflow: Workflow
                  };

                  return Object.entries(grouped).map(([type, typeNotifications]) => {
                    const unreadCount = typeNotifications.filter(n => !n.read).length;
                    const Icon = typeIcons[type as keyof typeof typeIcons] || Bell;

                    return (
                      <div key={type} className="space-y-3">
                        {/* Group Header with Badge */}
                        <div className="flex items-center gap-3 px-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold capitalize">
                            {type}
                          </h2>
                          {unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="h-6 px-2 bg-destructive text-destructive-foreground"
                            >
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>

                        {/* Notifications in this group */}
                        <div className="space-y-2 ml-8">
                          {typeNotifications.map((notification) => (
                            <Card
                              key={notification.id}
                              ref={(el) => {
                                if (!notification.read) {
                                  unreadRefs.current[notification.id] = el;
                                }
                              }}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                !notification.read 
                                  ? 'ring-2 ring-primary/20 bg-primary/5' 
                                  : 'hover:bg-muted/50'
                              } ${getSeverityColor(notification.severity)}`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="text-xl">
                                    {getSeverityIcon(notification.severity)}
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h3 className="font-medium text-base">
                                          {notification.title}
                                        </h3>
                                      </div>
                                      
                                      <div className="text-right space-y-1">
                                        <Badge 
                                          variant={notification.severity === 'critical' ? 'destructive' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                          {formatTime(notification.timestamp)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                      {notification.message}
                                    </p>
                                    
                                    {!notification.read && (
                                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        Unread
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="security-notifications">Security Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Failed logins, new device alerts, security warnings
                      </p>
                    </div>
                    <Switch
                      id="security-notifications"
                      checked={preferences.showSecurity}
                      onCheckedChange={(checked) =>
                        updatePreferences({ ...preferences, showSecurity: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-notifications">Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Payment failures, subscription changes, billing alerts
                      </p>
                    </div>
                    <Switch
                      id="payment-notifications"
                      checked={preferences.showPayment}
                      onCheckedChange={(checked) =>
                        updatePreferences({ ...preferences, showPayment: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="user-notifications">User Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        New registrations, subscription changes, user actions
                      </p>
                    </div>
                    <Switch
                      id="user-notifications"
                      checked={preferences.showUser}
                      onCheckedChange={(checked) =>
                        updatePreferences({ ...preferences, showUser: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-notifications">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        System errors, maintenance, performance issues
                      </p>
                    </div>
                    <Switch
                      id="system-notifications"
                      checked={preferences.showSystem}
                      onCheckedChange={(checked) =>
                        updatePreferences({ ...preferences, showSystem: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="workflow-notifications">Workflow Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Automated processes, background tasks, workflow updates
                      </p>
                    </div>
                    <Switch
                      id="workflow-notifications"
                      checked={preferences.showWorkflow}
                      onCheckedChange={(checked) =>
                        updatePreferences({ ...preferences, showWorkflow: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedNotification && getSeverityIcon(selectedNotification.severity)}</span>
              {selectedNotification?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="outline">
                  {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                </Badge>
                <Badge 
                  variant={selectedNotification.severity === 'critical' ? 'destructive' : 'secondary'}
                >
                  {selectedNotification.severity.charAt(0).toUpperCase() + selectedNotification.severity.slice(1)}
                </Badge>
              </div>
              
              <p className="text-muted-foreground">
                {selectedNotification.message}
              </p>
              
              <div className="text-sm text-muted-foreground">
                <strong>Time:</strong> {new Date(selectedNotification.timestamp).toLocaleString()}
              </div>
              
              {(selectedNotification.type === 'payment' || selectedNotification.type === 'security') && (
                <Button
                  onClick={() => handleNotificationAction(selectedNotification)}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View {selectedNotification.type === 'payment' ? 'Transactions' : 'Security Logs'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotifications;