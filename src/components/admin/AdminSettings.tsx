import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Mail, 
  Shield, 
  Database,
  Webhook,
  Key,
  Bell,
  Globe,
  Save,
  Wand2,
  Clock
} from 'lucide-react';
import { AdminSettings as AdminSettingsType } from '@/types/generator';
import { getAdminSettings, saveAdminSettings } from '@/utils/autoGenerator';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  
  // AutoGenerator Settings
  const [autoGenSettings, setAutoGenSettings] = useState<AdminSettingsType>({
    maxPalettesPerBatch: 10,
    retentionDays: 30,
  });

  useEffect(() => {
    const settings = getAdminSettings();
    setAutoGenSettings(settings);
  }, []);

  const handleSaveAutoGenSettings = () => {
    saveAdminSettings(autoGenSettings);
    toast({
      title: "AutoGenerator Settings Saved",
      description: "Settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AutoGenerator Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AutoGenerator Settings
          </CardTitle>
          <CardDescription>
            Configure how the AutoGenerator feature behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPalettes">Max Palettes per Batch</Label>
              <Input
                id="maxPalettes"
                type="number"
                min="1"
                max="50"
                value={autoGenSettings.maxPalettesPerBatch}
                onChange={(e) => setAutoGenSettings(prev => ({
                  ...prev,
                  maxPalettesPerBatch: parseInt(e.target.value) || 10
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of palettes to generate in a single batch (1-50)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retentionDays" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Retention Period (Days)
              </Label>
              <Input
                id="retentionDays"
                type="number"
                min="1"
                max="365"
                value={autoGenSettings.retentionDays}
                onChange={(e) => setAutoGenSettings(prev => ({
                  ...prev,
                  retentionDays: parseInt(e.target.value) || 30
                }))}
              />
              <p className="text-xs text-muted-foreground">
                How long to keep palette history (1-365 days)
              </p>
            </div>
          </div>
          
          <Button onClick={handleSaveAutoGenSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save AutoGenerator Settings
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure general system preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="My App" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@example.com" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Enable to temporarily disable user access
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <div className="text-sm text-muted-foreground">
                  Allow new users to register
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
          <CardDescription>Configure email delivery and templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Send email notifications to users
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security and authentication options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <div className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <div className="text-sm text-muted-foreground">
                  Auto-logout inactive users after 30 minutes
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>IP Whitelist</Label>
                <div className="text-sm text-muted-foreground">
                  Restrict admin access to specific IP addresses
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            API & Integrations
          </CardTitle>
          <CardDescription>Manage API keys and third-party integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input id="api-key" type="password" defaultValue="sk_test_..." />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input placeholder="https://your-app.com/webhook" />
          </div>
          
          <div className="flex justify-end">
            <Button>Test Webhook</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button size="lg">Save All Changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;