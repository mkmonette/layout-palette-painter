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
  Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoinSettings {
  aiColorGeneration: number;
  freeSubscriptionCoins: number;
  proSubscriptionCoins: number;
  enterpriseSubscriptionCoins: number;
  coinPurchasePackages: {
    small: { coins: number; price: number };
    medium: { coins: number; price: number };
    large: { coins: number; price: number };
  };
}

const CoinCreditSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CoinSettings>({
    aiColorGeneration: 5,
    freeSubscriptionCoins: 10,
    proSubscriptionCoins: 100,
    enterpriseSubscriptionCoins: 500,
    coinPurchasePackages: {
      small: { coins: 50, price: 4.99 },
      medium: { coins: 150, price: 12.99 },
      large: { coins: 300, price: 24.99 }
    }
  });

  const [tempSettings, setTempSettings] = useState<CoinSettings>(settings);

  const handleSave = () => {
    setSettings(tempSettings);
    // In a real app, this would save to the backend
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Coins className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Coin Credit System</h2>
          <p className="text-muted-foreground">
            Configure coin costs and subscription rewards
          </p>
        </div>
      </div>

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

      {/* Subscription Plan Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Plan Rewards
          </CardTitle>
          <CardDescription>
            Set how many coins users receive when purchasing subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="free-coins">Free Plan</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="free-coins"
                  type="number"
                  min="0"
                  value={tempSettings.freeSubscriptionCoins}
                  onChange={(e) => updateSetting('freeSubscriptionCoins', parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <Badge variant="secondary">coins/month</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro-coins">Pro Plan</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pro-coins"
                  type="number"
                  min="0"
                  value={tempSettings.proSubscriptionCoins}
                  onChange={(e) => updateSetting('proSubscriptionCoins', parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <Badge variant="secondary">coins/month</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enterprise-coins">Enterprise Plan</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="enterprise-coins"
                  type="number"
                  min="0"
                  value={tempSettings.enterpriseSubscriptionCoins}
                  onChange={(e) => updateSetting('enterpriseSubscriptionCoins', parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <Badge variant="secondary">coins/month</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coin Purchase Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Coin Purchase Packages
          </CardTitle>
          <CardDescription>
            Configure coin packages that users can purchase directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Small Package */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-medium">Small Package</h4>
              <div className="space-y-2">
                <Label htmlFor="small-coins">Coins</Label>
                <Input
                  id="small-coins"
                  type="number"
                  min="1"
                  value={tempSettings.coinPurchasePackages.small.coins}
                  onChange={(e) => updateSetting('coinPurchasePackages.small.coins', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="small-price">Price ($)</Label>
                <Input
                  id="small-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={tempSettings.coinPurchasePackages.small.price}
                  onChange={(e) => updateSetting('coinPurchasePackages.small.price', parseFloat(e.target.value) || 0.01)}
                />
              </div>
            </div>

            {/* Medium Package */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-medium">Medium Package</h4>
              <div className="space-y-2">
                <Label htmlFor="medium-coins">Coins</Label>
                <Input
                  id="medium-coins"
                  type="number"
                  min="1"
                  value={tempSettings.coinPurchasePackages.medium.coins}
                  onChange={(e) => updateSetting('coinPurchasePackages.medium.coins', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium-price">Price ($)</Label>
                <Input
                  id="medium-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={tempSettings.coinPurchasePackages.medium.price}
                  onChange={(e) => updateSetting('coinPurchasePackages.medium.price', parseFloat(e.target.value) || 0.01)}
                />
              </div>
            </div>

            {/* Large Package */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-medium">Large Package</h4>
              <div className="space-y-2">
                <Label htmlFor="large-coins">Coins</Label>
                <Input
                  id="large-coins"
                  type="number"
                  min="1"
                  value={tempSettings.coinPurchasePackages.large.coins}
                  onChange={(e) => updateSetting('coinPurchasePackages.large.coins', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="large-price">Price ($)</Label>
                <Input
                  id="large-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={tempSettings.coinPurchasePackages.large.price}
                  onChange={(e) => updateSetting('coinPurchasePackages.large.price', parseFloat(e.target.value) || 0.01)}
                />
              </div>
            </div>
          </div>
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
              <div className="font-medium">Free Plan</div>
              <div className="text-muted-foreground">{settings.freeSubscriptionCoins} coins/month</div>
            </div>
            <div>
              <div className="font-medium">Pro Plan</div>
              <div className="text-muted-foreground">{settings.proSubscriptionCoins} coins/month</div>
            </div>
            <div>
              <div className="font-medium">Enterprise Plan</div>
              <div className="text-muted-foreground">{settings.enterpriseSubscriptionCoins} coins/month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinCreditSettings;