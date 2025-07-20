import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Star, TrendingUp, Gift } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  savings?: string;
}

const CoinCheckout = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [coinSettings, setCoinSettings] = useState({
    small: { coins: 50, price: 4.99 },
    medium: { coins: 150, price: 12.99 },
    large: { coins: 300, price: 24.99 }
  });

  // Load coin settings from localStorage (admin settings)
  useEffect(() => {
    const savedSettings = localStorage.getItem('coin_credit_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.coinPurchasePackages) {
          setCoinSettings(parsed.coinPurchasePackages);
        }
      } catch (error) {
        console.error('Error loading coin settings:', error);
      }
    }
  }, []);

  const coinPackages: CoinPackage[] = [
    {
      id: 'starter',
      name: 'Starter Pack',
      coins: coinSettings.small.coins,
      price: coinSettings.small.price,
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      coins: coinSettings.medium.coins,
      price: coinSettings.medium.price,
      bonus: Math.floor(coinSettings.medium.coins * 0.1),
      popular: true,
      savings: '15%'
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      coins: coinSettings.large.coins,
      price: coinSettings.large.price,
      bonus: Math.floor(coinSettings.large.coins * 0.2),
      savings: '25%'
    }
  ];

  const handlePackageSelect = (coinPackage: CoinPackage) => {
    setSelectedPackage(coinPackage);
    setIsCheckoutOpen(true);
  };

  const getPackageIcon = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'starter pack':
        return <Coins className="h-6 w-6 text-yellow-500" />;
      case 'popular pack':
        return <Star className="h-6 w-6 text-purple-500" />;
      case 'premium pack':
        return <TrendingUp className="h-6 w-6 text-orange-500" />;
      default:
        return <Coins className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getPackageGradient = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'starter pack':
        return 'from-yellow-500/10 to-yellow-600/10 border-yellow-200';
      case 'popular pack':
        return 'from-purple-500/10 to-purple-600/10 border-purple-200';
      case 'premium pack':
        return 'from-orange-500/10 to-orange-600/10 border-orange-200';
      default:
        return 'from-gray-500/10 to-gray-600/10 border-gray-200';
    }
  };

  const getCoinValue = (price: number, coins: number) => {
    return (price / coins).toFixed(3);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Coins</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Buy coins to unlock premium features and generate AI colors.
          Coins never expire and can be used for AI-powered features.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 max-w-lg mx-auto mt-4">
          <p className="text-sm text-orange-700">
            ⚠️ <strong>Note:</strong> Coins cannot be used to purchase subscription plans. Use secure payment methods for subscriptions.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {coinPackages.map((coinPackage) => (
          <Card 
            key={coinPackage.id} 
            className={`relative transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              coinPackage.popular 
                ? `bg-gradient-to-b ${getPackageGradient(coinPackage.name)} ring-2 ring-purple-500` 
                : ''
            }`}
          >
            {coinPackage.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            {coinPackage.savings && (
              <Badge className="absolute -top-2 right-4 bg-green-500">
                Save {coinPackage.savings}
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {getPackageIcon(coinPackage.name)}
              </div>
              <CardTitle className="text-xl">{coinPackage.name}</CardTitle>
              
              <div className="pt-4">
                <div className="text-4xl font-bold">
                  {coinPackage.coins + (coinPackage.bonus || 0)}
                  <span className="text-lg text-muted-foreground ml-1">coins</span>
                </div>
                <div className="text-2xl font-semibold text-primary mt-2">
                  ${coinPackage.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${getCoinValue(coinPackage.price, coinPackage.coins)} per coin
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Base coins:</span>
                  <span className="font-medium">{coinPackage.coins}</span>
                </div>
                {coinPackage.bonus && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Bonus coins:
                    </span>
                    <span className="font-medium">+{coinPackage.bonus}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total coins:</span>
                    <span className="text-primary">
                      {coinPackage.coins + (coinPackage.bonus || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => handlePackageSelect(coinPackage)}
                  variant={coinPackage.popular ? "default" : "outline"}
                  className="w-full"
                >
                  Purchase for ${coinPackage.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coin Usage Information */}
      <Card className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/10 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-yellow-500" />
              <h3 className="text-xl font-semibold">How to Use Your Coins</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">AI Color Generation</div>
                <div className="text-muted-foreground">2 coins per generation</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Image Color Extraction</div>
                <div className="text-muted-foreground">1 coin per image</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Advanced Features</div>
                <div className="text-muted-foreground">Varies by feature</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              Coins never expire and can be used for any premium feature on the platform
            </div>
          </div>
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        coinPackage={selectedPackage ? {
          coins: selectedPackage.coins + (selectedPackage.bonus || 0),
          price: selectedPackage.price,
          name: selectedPackage.name
        } : null}
        type="coins"
      />
    </div>
  );
};

export default CoinCheckout;