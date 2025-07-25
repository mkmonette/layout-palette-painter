import React, { useState, useEffect } from 'react';
import { Bell, X, Filter, Check, Clock, AlertTriangle, Info, AlertCircle, ExternalLink, Settings, Shield, CreditCard, Users, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Notification {
  id: string;
  type: 'security' | 'payment' | 'user' | 'system' | 'workflow';
  subtype: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
}

const STORAGE_KEY = 'admin_notifications';
const PREFERENCES_KEY = 'notification_preferences';
const FILTER_KEY = 'notification_last_filter';

// Notification preferences interface
export interface NotificationPreferences {
  showSecurity: boolean;
  showPayment: boolean;
  showUser: boolean;
  showSystem: boolean;
  showWorkflow: boolean;
}

// Default preferences
const defaultPreferences: NotificationPreferences = {
  showSecurity: true,
  showPayment: true,
  showUser: true,
  showSystem: true,
  showWorkflow: true
};

// Test data
const generateTestNotifications = (): Notification[] => [
  {
    id: 'notif_001',
    type: 'security',
    subtype: 'failed_login',
    title: 'Failed Login Attempt',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'warning',
    read: false
  },
  {
    id: 'notif_002',
    type: 'security',
    subtype: 'new_device',
    title: 'New Login from Unknown Device',
    message: 'Admin login detected from new device in San Francisco, CA',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    severity: 'info',
    read: false
  },
  {
    id: 'notif_003',
    type: 'payment',
    subtype: 'payment_failed',
    title: 'Payment Failure',
    message: 'Payment failed for user john.doe@email.com - insufficient funds',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    severity: 'critical',
    read: true
  },
  {
    id: 'notif_004',
    type: 'user',
    subtype: 'subscription_canceled',
    title: 'Subscription Canceled',
    message: 'Pro subscription canceled by user@example.com',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    severity: 'warning',
    read: false
  },
  {
    id: 'notif_005',
    type: 'user',
    subtype: 'new_registration',
    title: 'New User Registered',
    message: 'New user alice.smith@email.com signed up for Pro plan',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    severity: 'info',
    read: true
  },
  {
    id: 'notif_006',
    type: 'system',
    subtype: 'system_error',
    title: 'System Error Occurred',
    message: 'Database connection timeout in color generation service',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    severity: 'critical',
    read: false
  }
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive/20';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
  }
};

// Real-time trigger function for notifications
export const triggerNotification = ({ title, message, type, severity, subtype = '' }: {
  title: string;
  message: string;
  type: 'security' | 'payment' | 'user' | 'system' | 'workflow';
  severity: 'info' | 'warning' | 'critical';
  subtype?: string;
}) => {
  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newNotif: Notification = {
    id: 'notif_' + Date.now(),
    title,
    message,
    type,
    subtype,
    severity,
    timestamp: new Date().toISOString(),
    read: false
  };
  notifications.unshift(newNotif);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  
  // Trigger storage event to update other components
  window.dispatchEvent(new Event('storage'));
  
  // Show toast notification
  showToast(newNotif);
  
  return newNotif;
};

// Toast notification function
const showToast = (notification: Notification) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right-2 ${
    notification.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
    notification.severity === 'warning' ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100' :
    'bg-primary text-primary-foreground'
  }`;
  
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="mt-1">
        ${notification.severity === 'critical' ? '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' :
          notification.severity === 'warning' ? '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' :
          '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'}
      </div>
      <div class="flex-1">
        <div class="font-medium text-sm">${notification.title}</div>
        <div class="text-sm opacity-90 mt-1">${notification.message}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
};

// Test notification samples
export const testNotificationSamples = [
  { title: "Payment Failed", message: "User abc@example.com had a payment issue", type: "payment" as const, severity: "warning" as const, subtype: "payment_failed" },
  { title: "Failed Login", message: "5 failed attempts detected from IP 192.168.1.50", type: "security" as const, severity: "critical" as const, subtype: "failed_login" },
  { title: "New Registration", message: "New user signed up for Pro plan", type: "user" as const, severity: "info" as const, subtype: "new_registration" },
  { title: "System Alert", message: "High CPU usage detected on server", type: "system" as const, severity: "warning" as const, subtype: "high_usage" },
  { title: "Subscription Upgrade", message: "User upgraded to premium plan", type: "user" as const, severity: "info" as const, subtype: "plan_upgrade" }
];

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

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [activeTab, setActiveTab] = useState('notifications');

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error parsing notifications from localStorage:', error);
        // Initialize with test data if parsing fails
        const testData = generateTestNotifications();
        setNotifications(testData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));
      }
    } else {
      // Initialize with test data
      const testData = generateTestNotifications();
      setNotifications(testData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));
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

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
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
    setIsOpen(false);
  };

  // Mark single notification as read
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
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

  // Get unread count (respecting preferences)
  const unreadCount = notifications.filter(n => !n.read && (
    (n.type === 'security' && preferences.showSecurity) ||
    (n.type === 'payment' && preferences.showPayment) ||
    (n.type === 'user' && preferences.showUser) ||
    (n.type === 'system' && preferences.showSystem) ||
    (n.type === 'workflow' && preferences.showWorkflow)
  )).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative" 
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Notification Center</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="text-xs">
                <Bell className="h-4 w-4 mr-1" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="text-xs">
                <Settings className="h-4 w-4 mr-1" />
                Preferences
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="mt-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
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
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="w-full"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications found</p>
                  <p className="text-xs mt-1">
                    {selectedType !== 'all' 
                      ? `No ${selectedType} notifications to display`
                      : 'All caught up!'
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <Card 
                      className={`border-0 rounded-none cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.read ? 'bg-muted/30 border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getSeverityIcon(notification.severity)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs capitalize ${getSeverityColor(notification.severity)}`}
                              >
                                {notification.severity}
                              </Badge>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < filteredNotifications.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0">
            <div className="p-4 space-y-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Notification Types</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Control which types of notifications you want to see
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <div>
                      <Label htmlFor="security" className="text-sm font-medium">Security</Label>
                      <p className="text-xs text-muted-foreground">Login attempts, security alerts</p>
                    </div>
                  </div>
                  <Switch
                    id="security"
                    checked={preferences.showSecurity}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, showSecurity: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    <div>
                      <Label htmlFor="payment" className="text-sm font-medium">Payment</Label>
                      <p className="text-xs text-muted-foreground">Payment issues, transaction alerts</p>
                    </div>
                  </div>
                  <Switch
                    id="payment"
                    checked={preferences.showPayment}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, showPayment: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <Label htmlFor="user" className="text-sm font-medium">User Activity</Label>
                      <p className="text-xs text-muted-foreground">Registrations, subscriptions</p>
                    </div>
                  </div>
                  <Switch
                    id="user"
                    checked={preferences.showUser}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, showUser: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label htmlFor="system" className="text-sm font-medium">System</Label>
                      <p className="text-xs text-muted-foreground">System errors, maintenance</p>
                    </div>
                  </div>
                  <Switch
                    id="system"
                    checked={preferences.showSystem}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, showSystem: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-purple-500" />
                    <div>
                      <Label htmlFor="workflow" className="text-sm font-medium">Workflow</Label>
                      <p className="text-xs text-muted-foreground">Process updates, automation</p>
                    </div>
                  </div>
                  <Switch
                    id="workflow"
                    checked={preferences.showWorkflow}
                    onCheckedChange={(checked) => 
                      updatePreferences({ ...preferences, showWorkflow: checked })
                    }
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Preferences are saved automatically and applied to future notifications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
      
      {/* Notification Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getSeverityIcon(selectedNotification.severity)}
              {selectedNotification?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Message</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNotification.message}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Type</h4>
                  <Badge variant="outline" className="capitalize">
                    {selectedNotification.type}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Severity</h4>
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${getSeverityColor(selectedNotification.severity)}`}
                  >
                    {selectedNotification.severity}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Timestamp</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedNotification.timestamp).toLocaleString()}
                </p>
              </div>
              
              {(selectedNotification.type === 'payment' || selectedNotification.type === 'security') && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDetailsModal(false);
                      // Navigate to appropriate section based on type
                      if (selectedNotification.type === 'payment') {
                        window.location.hash = '#transactions';
                      } else if (selectedNotification.type === 'security') {
                        window.location.hash = '#security-logs';
                      }
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View {selectedNotification.type === 'payment' ? 'Transactions' : 'Security Logs'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Popover>
  );
};

export default NotificationCenter;