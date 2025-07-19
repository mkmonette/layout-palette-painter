import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Settings, 
  Palette, 
  CreditCard,
  Save,
  RotateCcw,
  Bot,
  Calendar,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoinPackagesTable from './CoinPackagesTable';

interface CoinSettings {
  aiColorGeneration: number;
  freeSubscriptionCost: number;
  proSubscriptionCost: number;
  enterpriseSubscriptionCost: number;
  coinExpirationDays: number;
  enableCoinExpiration: boolean;
}

const CoinCreditSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CoinSettings>({
    aiColorGeneration: 5,
    freeSubscriptionCost: 0,
    proSubscriptionCost: 100,
    enterpriseSubscriptionCost: 300,
    coinExpirationDays: 365,
    enableCoinExpiration: false
  });

  const [tempSettings, setTempSettings] = useState<CoinSettings>(settings);

  const handleSave = () => {
    setSettings(tempSettings);
    localStorage.setItem('coin_credit_settings', JSON.stringify(tempSettings));
    toast({
      title: "Settings Saved",
      description: "Coin credit settings have been updated successfully."
    });
  };

  const handleReset = () => {
    setTempSettings(settings);
    toast({
      title: "Settings Reset",
      description: "Changes have been reverted to last saved values."
    });
  };

  const updateSetting = (path: string, value: number | boolean) => {
    const keys = path.split('.');
    const newSettings = { ...tempSettings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTempSettings(newSettings);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Coins className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Coin Credit System</h2>
          <p className="text-muted-foreground">
            Configure coin costs for subscriptions and AI features. Create unlimited pricing options for coin packages.
          </p>
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Coin Packages
          </TabsTrigger>
          <TabsTrigger value="ai-costs" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Costs
          </TabsTrigger>
          <TabsTrigger value="subscription-costs" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription Costs
          </TabsTrigger>
          <TabsTrigger value="expiration" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Coin Expiration
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-6">
          <CoinPackagesTable />
        </TabsContent>

        <TabsContent value="ai-costs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Feature Costs
              </CardTitle>
              <CardDescription>
                Set how many coins users need to spend for AI-powered features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-generation" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    AI Color Generation
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="ai-generation"
                      type="number"
                      min="1"
                      value={tempSettings.aiColorGeneration}
                      onChange={(e) => updateSetting('aiColorGeneration', parseInt(e.target.value) || 1)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">coins per generation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription-costs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Plan Costs
              </CardTitle>
              <CardDescription>
                Set how many coins users need to spend to purchase subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="free-coins">Free Plan Cost</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="free-coins"
                      type="number"
                      min="0"
                      value={tempSettings.freeSubscriptionCost}
                      onChange={(e) => updateSetting('freeSubscriptionCost', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Badge variant="secondary">coins/month</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pro-coins">Pro Plan Cost</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pro-coins"
                      type="number"
                      min="0"
                      value={tempSettings.proSubscriptionCost}
                      onChange={(e) => updateSetting('proSubscriptionCost', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Badge variant="secondary">coins/month</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-coins">Enterprise Plan Cost</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="enterprise-coins"
                      type="number"
                      min="0"
                      value={tempSettings.enterpriseSubscriptionCost}
                      onChange={(e) => updateSetting('enterpriseSubscriptionCost', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Badge variant="secondary">coins/month</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Coin Expiration Settings
              </CardTitle>
              <CardDescription>
                Configure expiration policies for purchased coins across all packages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Coin Expiration</Label>
                    <div className="text-sm text-muted-foreground">
                      When enabled, all purchased coins will expire after the specified time period
                    </div>
                  </div>
                  <Switch
                    checked={tempSettings.enableCoinExpiration}
                    onCheckedChange={(checked) => updateSetting('enableCoinExpiration', checked ? 1 : 0)}
                  />
                </div>

                {tempSettings.enableCoinExpiration && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="expiration-days" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Expiration Period (Days)
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="expiration-days"
                          type="number"
                          min="1"
                          max="3650"
                          value={tempSettings.coinExpirationDays}
                          onChange={(e) => updateSetting('coinExpirationDays', parseInt(e.target.value) || 365)}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">days after purchase</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Recommended: 365 days (1 year) for most businesses
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Expiration Examples:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between p-2 bg-background rounded border">
                          <span>30 days:</span>
                          <span className="text-muted-foreground">1 month</span>
                        </div>
                        <div className="flex justify-between p-2 bg-background rounded border">
                          <span>90 days:</span>
                          <span className="text-muted-foreground">3 months</span>
                        </div>
                        <div className="flex justify-between p-2 bg-background rounded border">
                          <span>365 days:</span>
                          <span className="text-muted-foreground">1 year</span>
                        </div>
                        <div className="flex justify-between p-2 bg-background rounded border">
                          <span>730 days:</span>
                          <span className="text-muted-foreground">2 years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Expiration Policy applies to all packages
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-200">
                        When expiration is enabled, all coin packages will use the same expiration period. 
                        Coins will expire on a first-in-first-out basis when users make purchases.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">AI Generation</div>
                  <div className="text-muted-foreground">{settings.aiColorGeneration} coins</div>
                </div>
                <div>
                  <div className="font-medium">Free Plan Cost</div>
                  <div className="text-muted-foreground">{settings.freeSubscriptionCost} coins/month</div>
                </div>
                <div>
                  <div className="font-medium">Pro Plan Cost</div>
                  <div className="text-muted-foreground">{settings.proSubscriptionCost} coins/month</div>
                </div>
                <div>
                  <div className="font-medium">Enterprise Plan Cost</div>
                  <div className="text-muted-foreground">{settings.enterpriseSubscriptionCost} coins/month</div>
                </div>
                <div>
                  <div className="font-medium">Coin Expiration</div>
                  <div className="text-muted-foreground">
                    {settings.enableCoinExpiration 
                      ? `${settings.coinExpirationDays} days` 
                      : 'Disabled'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Changes will be applied immediately after saving
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoinCreditSettings;