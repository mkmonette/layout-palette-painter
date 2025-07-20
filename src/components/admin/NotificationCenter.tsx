import React, { useState, useEffect } from 'react';
import { Bell, X, Filter, Check, Clock, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);

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
  }, []);

  // Filter notifications when type changes
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.type === selectedType));
    }
  }, [notifications, selectedType]);

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
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

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
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
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="w-full mt-2"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <div key={notification.id}>
                <Card 
                  className={`border-0 rounded-none cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
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
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(notification.severity)}`}
                          >
                            {notification.severity}
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
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;