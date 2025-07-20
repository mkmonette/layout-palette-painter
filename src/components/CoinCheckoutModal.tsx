import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, Star, TrendingUp, Gift, X } from 'lucide-react';
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

interface CoinCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoinCheckoutModal = ({ isOpen, onClose }: CoinCheckoutModalProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);

  // Load coin packages from localStorage
  useEffect(() => {
    const loadCoinPackages = () => {
      const savedSettings = localStorage.getItem('coin_credit_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.coinPackages && Array.isArray(parsed.coinPackages)) {
            const packages = parsed.coinPackages.map((pkg: any, index: number) => ({
              id: pkg.id || `package-${index}`,
              name: getPackageName(pkg.coins),
              coins: pkg.coins,
              price: pkg.price,
              bonus: pkg.bonus || 0,
              popular: index === 1, // Make second package popular
              savings: getSavingsPercentage(pkg.coins, pkg.price)
            }));
            setCoinPackages(packages);
          } else {
            setDefaultPackages();
          }
        } catch (error) {
          console.error('Error loading coin packages:', error);
          setDefaultPackages();
        }
      } else {
        setDefaultPackages();
      }
    };

    if (isOpen) {
      loadCoinPackages();
    }
  }, [isOpen]);

  const setDefaultPackages = () => {
    const defaultPackages: CoinPackage[] = [
      {
        id: 'starter',
        name: 'Starter Pack',
        coins: 100,
        price: 4.99,
      },
      {
        id: 'popular',
        name: 'Popular Pack',
        coins: 250,
        price: 9.99,
        bonus: 25,
        popular: true,
        savings: '15%'
      },
      {
        id: 'premium',
        name: 'Premium Pack',
        coins: 500,
        price: 18.99,
        bonus: 100,
        savings: '25%'
      }
    ];
    setCoinPackages(defaultPackages);
  };

  const getPackageName = (coins: number) => {
    if (coins <= 150) return 'Starter Pack';
    if (coins <= 300) return 'Popular Pack';
    if (coins <= 600) return 'Pro Pack';
    return 'Premium Pack';
  };

  const getSavingsPercentage = (coins: number, price: number) => {
    const baseRate = 0.05; // $0.05 per coin
    const currentRate = price / coins;
    const savings = ((baseRate - currentRate) / baseRate) * 100;
    return savings > 0 ? `${Math.round(savings)}%` : undefined;
  };

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
      case 'pro pack':
        return <TrendingUp className="h-6 w-6 text-blue-500" />;
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
      case 'pro pack':
        return 'from-blue-500/10 to-blue-600/10 border-blue-200';
      case 'premium pack':
        return 'from-orange-500/10 to-orange-600/10 border-orange-200';
      default:
        return 'from-gray-500/10 to-gray-600/10 border-gray-200';
    }
  };

  const getCoinValue = (price: number, coins: number) => {
    return (price / coins).toFixed(3);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setSelectedPackage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Coins className="h-6 w-6 text-yellow-500" />
              Purchase Coins
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Buy coins to unlock premium features and generate AI colors.
                  Coins never expire and can be used for AI-powered features.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-orange-700">
                    ⚠️ <strong>Note:</strong> Coins cannot be used to purchase subscription plans.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                      <CardTitle className="text-lg">{coinPackage.name}</CardTitle>
                      
                      <div className="pt-2">
                        <div className="text-3xl font-bold">
                          {coinPackage.coins + (coinPackage.bonus || 0)}
                          <span className="text-sm text-muted-foreground ml-1">coins</span>
                        </div>
                        <div className="text-xl font-semibold text-primary mt-2">
                          ${coinPackage.price}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${getCoinValue(coinPackage.price, coinPackage.coins)} per coin
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Base coins:</span>
                          <span className="font-medium">{coinPackage.coins}</span>
                        </div>
                        {coinPackage.bonus && coinPackage.bonus > 0 && (
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

                      <div className="pt-2">
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
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <h3 className="text-lg font-semibold">How to Use Your Coins</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">AI Color Generation</div>
                        <div className="text-muted-foreground">1-5 coins per generation</div>
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedPackage(null);
        }}
        coinPackage={selectedPackage ? {
          coins: selectedPackage.coins + (selectedPackage.bonus || 0),
          price: selectedPackage.price,
          name: selectedPackage.name
        } : null}
        type="coins"
      />
    </>
  );
};

export default CoinCheckoutModal;