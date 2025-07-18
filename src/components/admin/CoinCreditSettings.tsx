import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  Settings, 
  Palette, 
  CreditCard,
  Save,
  RotateCcw,
  Sparkles,
  Bot,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoinPackagesTable from './CoinPackagesTable';

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  bonus?: number;
}

interface CoinSettings {
  aiColorGeneration: number;
  freeSubscriptionCost: number;
  proSubscriptionCost: number;
  enterpriseSubscriptionCost: number;
  coinPackages: CoinPackage[];
}

const CoinCreditSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CoinSettings>({
    aiColorGeneration: 5,
    freeSubscriptionCost: 0,
    proSubscriptionCost: 100,
    enterpriseSubscriptionCost: 300,
    coinPackages: [
      { id: '1', coins: 100, price: 4 },
      { id: '2', coins: 200, price: 8 },
      { id: '3', coins: 500, price: 18, bonus: 50 },
      { id: '4', coins: 1000, price: 35, bonus: 150 },
      { id: '5', coins: 2000, price: 65, bonus: 400 }
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

  const updateSetting = (path: string, value: number) => {
    const keys = path.split('.');
    const newSettings = { ...tempSettings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTempSettings(newSettings);
  };

  const addCoinPackage = () => {
    const newPackage: CoinPackage = {
      id: Date.now().toString(),
      coins: 100,
      price: 4
    };
    setTempSettings({
      ...tempSettings,
      coinPackages: [...tempSettings.coinPackages, newPackage]
    });
  };

  const removeCoinPackage = (id: string) => {
    setTempSettings({
      ...tempSettings,
      coinPackages: tempSettings.coinPackages.filter(pkg => pkg.id !== id)
    });
  };

  const updateCoinPackage = (id: string, field: keyof CoinPackage, value: number) => {
    setTempSettings({
      ...tempSettings,
      coinPackages: tempSettings.coinPackages.map(pkg => 
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    });
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

      {/* Coin Packages Table Overview */}
      <CoinPackagesTable />

      {/* AI Feature Costs */}
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

      {/* Subscription Plan Costs */}
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

      {/* Flexible Coin Purchase Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Coin Purchase Packages
          </CardTitle>
          <CardDescription>
            Create unlimited coin packages with custom quantities and pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {tempSettings.coinPackages.map((pkg, index) => (
              <div key={pkg.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Package {index + 1}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeCoinPackage(pkg.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Coins</Label>
                    <Input
                      type="number"
                      min="1"
                      value={pkg.coins}
                      onChange={(e) => updateCoinPackage(pkg.id, 'coins', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) => updateCoinPackage(pkg.id, 'price', parseFloat(e.target.value) || 0.01)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bonus Coins (Optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={pkg.bonus || ''}
                      placeholder="0"
                      onChange={(e) => updateCoinPackage(pkg.id, 'bonus', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Total: {pkg.coins + (pkg.bonus || 0)} coins for ${pkg.price.toFixed(2)}
                  {pkg.bonus && (
                    <span className="text-green-600 ml-2">
                      (includes {pkg.bonus} bonus coins)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={addCoinPackage} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Package
          </Button>
        </CardContent>
      </Card>

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

      {/* Current Settings Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Current Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
          </div>
          
          <Separator />
          
          <div>
            <div className="font-medium mb-2">Coin Packages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {settings.coinPackages.map((pkg, index) => (
                <div key={pkg.id} className="p-2 bg-muted rounded">
                  <div className="font-medium">
                    {pkg.coins + (pkg.bonus || 0)} coins - ${pkg.price.toFixed(2)}
                  </div>
                  {pkg.bonus && (
                    <div className="text-green-600 text-xs">
                      +{pkg.bonus} bonus
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinCreditSettings;