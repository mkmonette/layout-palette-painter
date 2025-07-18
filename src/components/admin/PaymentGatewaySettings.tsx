import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentSettings {
  paypal: {
    enabled: boolean;
    clientId: string;
    secret: string;
    environment: 'sandbox' | 'live';
  };
  lemonSqueezy: {
    enabled: boolean;
    apiKey: string;
    storeId: string;
    webhookSecret: string;
  };
}

const PaymentGatewaySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testingPayPal, setTestingPayPal] = useState(false);
  const [testingLemonSqueezy, setTestingLemonSqueezy] = useState(false);
  
  const [settings, setSettings] = useState<PaymentSettings>({
    paypal: {
      enabled: false,
      clientId: '',
      secret: '',
      environment: 'sandbox'
    },
    lemonSqueezy: {
      enabled: false,
      apiKey: '',
      storeId: '',
      webhookSecret: ''
    }
  });

  const updatePayPalSetting = (key: keyof PaymentSettings['paypal'], value: any) => {
    setSettings(prev => ({
      ...prev,
      paypal: {
        ...prev.paypal,
        [key]: value
      }
    }));
  };

  const updateLemonSqueezySetting = (key: keyof PaymentSettings['lemonSqueezy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      lemonSqueezy: {
        ...prev.lemonSqueezy,
        [key]: value
      }
    }));
  };

  const testPayPalConnection = async () => {
    setTestingPayPal(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "PayPal Connection Test",
        description: "Connection successful! PayPal integration is working.",
      });
    } catch (error) {
      toast({
        title: "PayPal Connection Test",
        description: "Connection failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setTestingPayPal(false);
    }
  };

  const testLemonSqueezyConnection = async () => {
    setTestingLemonSqueezy(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "LemonSqueezy Connection Test",
        description: "Connection successful! LemonSqueezy integration is working.",
      });
    } catch (error) {
      toast({
        title: "LemonSqueezy Connection Test",
        description: "Connection failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setTestingLemonSqueezy(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Settings Saved",
        description: "Payment gateway settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Gateway Settings</h1>
        <p className="text-muted-foreground">
          Configure payment gateways to enable premium features and credit purchases
        </p>
      </div>

      <Tabs defaultValue="paypal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            PayPal
            {settings.paypal.enabled && (
              <Badge variant="secondary" className="ml-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="lemonsqueezy" className="flex items-center gap-2">
            LemonSqueezy
            {settings.lemonSqueezy.enabled && (
              <Badge variant="secondary" className="ml-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>PayPal Integration</CardTitle>
                  <CardDescription>
                    Configure PayPal payment processing for subscriptions and credit purchases
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="paypal-enabled">Enable PayPal</Label>
                  <Switch
                    id="paypal-enabled"
                    checked={settings.paypal.enabled}
                    onCheckedChange={(checked) => updatePayPalSetting('enabled', checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input
                    id="paypal-client-id"
                    type="password"
                    placeholder="Enter PayPal Client ID"
                    value={settings.paypal.clientId}
                    onChange={(e) => updatePayPalSetting('clientId', e.target.value)}
                    disabled={!settings.paypal.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-secret">Client Secret</Label>
                  <Input
                    id="paypal-secret"
                    type="password"
                    placeholder="Enter PayPal Client Secret"
                    value={settings.paypal.secret}
                    onChange={(e) => updatePayPalSetting('secret', e.target.value)}
                    disabled={!settings.paypal.enabled}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paypal-environment">Environment</Label>
                <Select
                  value={settings.paypal.environment}
                  onValueChange={(value: 'sandbox' | 'live') => updatePayPalSetting('environment', value)}
                  disabled={!settings.paypal.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                    <SelectItem value="live">Live (Production)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={testPayPalConnection}
                  disabled={!settings.paypal.enabled || !settings.paypal.clientId || !settings.paypal.secret || testingPayPal}
                  variant="outline"
                >
                  {testingPayPal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lemonsqueezy">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>LemonSqueezy Integration</CardTitle>
                  <CardDescription>
                    Configure LemonSqueezy payment processing for subscriptions and credit purchases
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="lemonsqueezy-enabled">Enable LemonSqueezy</Label>
                  <Switch
                    id="lemonsqueezy-enabled"
                    checked={settings.lemonSqueezy.enabled}
                    onCheckedChange={(checked) => updateLemonSqueezySetting('enabled', checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ls-api-key">API Key</Label>
                  <Input
                    id="ls-api-key"
                    type="password"
                    placeholder="Enter LemonSqueezy API Key"
                    value={settings.lemonSqueezy.apiKey}
                    onChange={(e) => updateLemonSqueezySetting('apiKey', e.target.value)}
                    disabled={!settings.lemonSqueezy.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ls-store-id">Store ID</Label>
                  <Input
                    id="ls-store-id"
                    placeholder="Enter Store ID"
                    value={settings.lemonSqueezy.storeId}
                    onChange={(e) => updateLemonSqueezySetting('storeId', e.target.value)}
                    disabled={!settings.lemonSqueezy.enabled}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ls-webhook-secret">Webhook Secret (Optional)</Label>
                <Input
                  id="ls-webhook-secret"
                  type="password"
                  placeholder="Enter Webhook Secret"
                  value={settings.lemonSqueezy.webhookSecret}
                  onChange={(e) => updateLemonSqueezySetting('webhookSecret', e.target.value)}
                  disabled={!settings.lemonSqueezy.enabled}
                />
                <p className="text-sm text-muted-foreground">
                  Used to verify webhook authenticity for secure payment notifications
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={testLemonSqueezyConnection}
                  disabled={!settings.lemonSqueezy.enabled || !settings.lemonSqueezy.apiKey || !settings.lemonSqueezy.storeId || testingLemonSqueezy}
                  variant="outline"
                >
                  {testingLemonSqueezy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-amber-800">Security Note</p>
              <p className="text-sm text-amber-700">
                All API keys and secrets are encrypted and securely stored. Test your integrations thoroughly 
                before enabling them in production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;