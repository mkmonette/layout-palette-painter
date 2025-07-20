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
  Clock,
  Gift,
  TrendingUp,
  ArrowRightLeft,
  Calculator,
  Plus,
  Trash2,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CoinPackagesTable from './CoinPackagesTable';
import UpgradeTestPanel from './UpgradeTestPanel';

interface UpgradeBonus {
  id: string;
  fromPlan: string;
  toPlan: string;
  coinsPerDay: number;
  minDaysRequired: number;
  maxBonusCoins: number;
  enabled: boolean;
}

interface CoinSettings {
  aiColorGeneration: number;
  freeSubscriptionCost: number;
  proSubscriptionCost: number;
  enterpriseSubscriptionCost: number;
  coinExpirationDays: number;
  enableCoinExpiration: boolean;
  upgradeBonuses: UpgradeBonus[];
}

const CoinCreditSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CoinSettings>({
    aiColorGeneration: 5,
    freeSubscriptionCost: 0,
    proSubscriptionCost: 100,
    enterpriseSubscriptionCost: 300,
    coinExpirationDays: 365,
    enableCoinExpiration: false,
    upgradeBonuses: [
      {
        id: '1',
        fromPlan: 'free',
        toPlan: 'pro',
        coinsPerDay: 3,
        minDaysRequired: 7,
        maxBonusCoins: 100,
        enabled: true
      },
      {
        id: '2',
        fromPlan: 'pro',
        toPlan: 'enterprise',
        coinsPerDay: 5,
        minDaysRequired: 5,
        maxBonusCoins: 200,
        enabled: true
      }
    ]
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
        <TabsList className="grid w-full grid-cols-6">
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
          <TabsTrigger value="upgrade-rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Upgrade Rewards
          </TabsTrigger>
          <TabsTrigger value="test-panel" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test Panel
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-6">
          <CoinPackagesTable 
            coinSettings={{
              aiColorGeneration: tempSettings.aiColorGeneration,
              freeSubscriptionCost: tempSettings.freeSubscriptionCost,
              proSubscriptionCost: tempSettings.proSubscriptionCost,
              enterpriseSubscriptionCost: tempSettings.enterpriseSubscriptionCost,
              coinExpirationDays: tempSettings.coinExpirationDays,
              enableCoinExpiration: tempSettings.enableCoinExpiration
            }} 
            onSettingsChange={(newSettings) => {
              setTempSettings({
                ...tempSettings,
                ...newSettings
              });
            }}
          />
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
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Subscription Plan Costs - DISABLED
              </CardTitle>
              <CardDescription className="text-orange-600">
                Coin-based subscription purchases have been disabled. All subscription purchases now use secure payment gateways only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-100 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">
                  ⚠️ Coin-based subscription purchases are no longer available. Users can only purchase subscriptions through PayPal, LemonSqueezy, or other secure payment methods.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upgrade-rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                Subscription Upgrade Bonus
              </CardTitle>
              <CardDescription>
                Configure bonus coins awarded when users upgrade their subscription via secure payment gateways
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Upgrade Bonuses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Current Upgrade Bonuses</h4>
                  <Button size="sm" onClick={() => {
                    const newBonus: UpgradeBonus = {
                      id: Date.now().toString(),
                      fromPlan: 'free',
                      toPlan: 'pro',
                      coinsPerDay: 2,
                      minDaysRequired: 1,
                      maxBonusCoins: 50,
                      enabled: true
                    };
                    setTempSettings({
                      ...tempSettings,
                      upgradeBonuses: [...tempSettings.upgradeBonuses, newBonus]
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bonus Rule
                  </Button>
                </div>

                {tempSettings.upgradeBonuses.map((bonus, index) => (
                  <Card key={bonus.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                        <div className="space-y-2">
                          <Label className="text-xs">From Plan</Label>
                          <Select 
                            value={bonus.fromPlan} 
                            onValueChange={(value) => {
                              const updated = [...tempSettings.upgradeBonuses];
                              updated[index] = { ...bonus, fromPlan: value };
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">To Plan</Label>
                          <Select 
                            value={bonus.toPlan} 
                            onValueChange={(value) => {
                              const updated = [...tempSettings.upgradeBonuses];
                              updated[index] = { ...bonus, toPlan: value };
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Coins/Day</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bonus.coinsPerDay}
                            onChange={(e) => {
                              const updated = [...tempSettings.upgradeBonuses];
                              updated[index] = { ...bonus, coinsPerDay: parseInt(e.target.value) || 0 };
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Max Bonus</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bonus.maxBonusCoins}
                            onChange={(e) => {
                              const updated = [...tempSettings.upgradeBonuses];
                              updated[index] = { ...bonus, maxBonusCoins: parseInt(e.target.value) || 0 };
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                            className="h-8"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={bonus.enabled}
                            onCheckedChange={(checked) => {
                              const updated = [...tempSettings.upgradeBonuses];
                              updated[index] = { ...bonus, enabled: checked };
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const updated = tempSettings.upgradeBonuses.filter((_, i) => i !== index);
                              setTempSettings({ ...tempSettings, upgradeBonuses: updated });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Preview Calculation */}
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Bonus Calculation Preview</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-green-700">15 days remaining:</span>
                            <div className="font-mono">
                              {Math.min(15 * bonus.coinsPerDay, bonus.maxBonusCoins)} coins
                            </div>
                          </div>
                          <div>
                            <span className="text-green-700">30 days remaining:</span>
                            <div className="font-mono">
                              {Math.min(30 * bonus.coinsPerDay, bonus.maxBonusCoins)} coins
                            </div>
                          </div>
                          <div>
                            <span className="text-green-700">Max possible:</span>
                            <div className="font-mono">{bonus.maxBonusCoins} coins</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          <ArrowRightLeft className="h-3 w-3 inline mr-1" />
                          {bonus.fromPlan} → {bonus.toPlan} upgrade via payment gateway only
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {tempSettings.upgradeBonuses.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No upgrade bonuses configured</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add bonus rules to reward users for upgrading their subscriptions
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Information Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  How Upgrade Bonuses Work
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Bonuses are only applied when users upgrade via secure payment gateways</li>
                  <li>• Calculation: remaining_days × coins_per_day (capped at max bonus)</li>
                  <li>• Remaining days = time left in current billing period</li>
                  <li>• Coins are automatically added to the user's account after successful upgrade</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-panel" className="mt-6">
          <UpgradeTestPanel />
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
                  <div className="font-medium text-orange-600">Subscription Costs</div>
                  <div className="text-orange-500 text-sm">Disabled - Secure payments only</div>
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