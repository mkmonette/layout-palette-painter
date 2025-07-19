import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Coins, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  History,
  Wallet,
  Timer
} from 'lucide-react';
import { format, addDays, isAfter, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import CoinCheckoutModal from './CoinCheckoutModal';

interface CoinPurchase {
  id: string;
  packageName: string;
  coinsAmount: number;
  bonusCoins: number;
  totalCoins: number;
  purchasePrice: number;
  purchaseDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'used';
  remainingCoins: number;
}

interface CoinSettings {
  coinExpirationDays: number;
  enableCoinExpiration: boolean;
}

const CoinCredits = () => {
  const { toast } = useToast();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [coinPurchases, setCoinPurchases] = useState<CoinPurchase[]>([]);
  const [coinSettings, setCoinSettings] = useState<CoinSettings>({
    coinExpirationDays: 365,
    enableCoinExpiration: false
  });
  const [showCoinCheckout, setShowCoinCheckout] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadCoinData();
    loadCoinSettings();
  }, []);

  const loadCoinData = () => {
    // Load current balance
    const savedBalance = localStorage.getItem('user_coin_balance');
    setCurrentBalance(savedBalance ? parseInt(savedBalance, 10) : 100);

    // Load purchase history from localStorage
    const savedPurchases = localStorage.getItem('user_coin_purchases');
    if (savedPurchases) {
      try {
        const purchases = JSON.parse(savedPurchases).map((purchase: any) => ({
          ...purchase,
          purchaseDate: new Date(purchase.purchaseDate),
          expirationDate: new Date(purchase.expirationDate)
        }));
        setCoinPurchases(purchases);
      } catch (error) {
        console.error('Error loading coin purchases:', error);
        // Set demo data if no purchases exist
        setDemoData();
      }
    } else {
      // Set demo data for new users
      setDemoData();
    }
  };

  const loadCoinSettings = () => {
    const savedSettings = localStorage.getItem('coin_credit_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCoinSettings({
          coinExpirationDays: parsed.coinExpirationDays || 365,
          enableCoinExpiration: parsed.enableCoinExpiration || false
        });
      } catch (error) {
        console.error('Error loading coin settings:', error);
      }
    }
  };

  const setDemoData = () => {
    const demoData: CoinPurchase[] = [
      {
        id: '1',
        packageName: 'Starter Pack',
        coinsAmount: 100,
        bonusCoins: 0,
        totalCoins: 100,
        purchasePrice: 4.99,
        purchaseDate: new Date('2024-01-15'),
        expirationDate: addDays(new Date('2024-01-15'), 365),
        status: 'active',
        remainingCoins: 100
      },
      {
        id: '2',
        packageName: 'Pro Pack',
        coinsAmount: 500,
        bonusCoins: 50,
        totalCoins: 550,
        purchasePrice: 18.99,
        purchaseDate: new Date('2024-02-01'),
        expirationDate: addDays(new Date('2024-02-01'), 365),
        status: 'active',
        remainingCoins: 320
      },
      {
        id: '3',
        packageName: 'Premium Pack',
        coinsAmount: 1000,
        bonusCoins: 150,
        totalCoins: 1150,
        purchasePrice: 35.99,
        purchaseDate: new Date('2023-12-10'),
        expirationDate: addDays(new Date('2023-12-10'), 365),
        status: 'expired',
        remainingCoins: 0
      }
    ];
    setCoinPurchases(demoData);
    // Save demo data to localStorage
    localStorage.setItem('user_coin_purchases', JSON.stringify(demoData));
  };

  const getStatusBadge = (purchase: CoinPurchase) => {
    const today = new Date();
    const daysUntilExpiration = differenceInDays(purchase.expirationDate, today);
    
    if (!coinSettings.enableCoinExpiration) {
      return <Badge variant="default">Never Expires</Badge>;
    }
    
    if (purchase.status === 'expired' || isAfter(today, purchase.expirationDate)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (purchase.remainingCoins === 0) {
      return <Badge variant="secondary">Used Up</Badge>;
    }
    
    if (daysUntilExpiration <= 30) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">
        Expires in {daysUntilExpiration} days
      </Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const getTotalActiveCoins = () => {
    return coinPurchases
      .filter(purchase => {
        if (!coinSettings.enableCoinExpiration) return purchase.remainingCoins > 0;
        return purchase.status === 'active' && 
               purchase.remainingCoins > 0 && 
               !isAfter(new Date(), purchase.expirationDate);
      })
      .reduce((total, purchase) => total + purchase.remainingCoins, 0);
  };

  const getExpiringCoins = () => {
    if (!coinSettings.enableCoinExpiration) return 0;
    
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    
    return coinPurchases
      .filter(purchase => 
        purchase.status === 'active' && 
        purchase.remainingCoins > 0 &&
        isAfter(purchase.expirationDate, today) &&
        !isAfter(purchase.expirationDate, thirtyDaysFromNow)
      )
      .reduce((total, purchase) => total + purchase.remainingCoins, 0);
  };

  const getTotalPurchased = () => {
    return coinPurchases.reduce((total, purchase) => total + purchase.totalCoins, 0);
  };

  const getTotalSpent = () => {
    return coinPurchases.reduce((total, purchase) => total + purchase.purchasePrice, 0);
  };

  const handlePurchaseMore = () => {
    setShowCoinCheckout(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coin Credits</h2>
          <p className="text-muted-foreground">
            Manage your coin balance and purchase history
          </p>
        </div>
        <Button onClick={handlePurchaseMore} className="gap-2">
          <Plus className="h-4 w-4" />
          Purchase More Coins
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available coins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coins</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalActiveCoins().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getExpiringCoins().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalPurchased().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${getTotalSpent().toFixed(2)} spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expiration Warning */}
      {coinSettings.enableCoinExpiration && getExpiringCoins() > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Coins Expiring Soon
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 dark:text-orange-200">
              You have {getExpiringCoins().toLocaleString()} coins that will expire in the next 30 days. 
              Use them soon or they will be lost!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Purchase History
          </CardTitle>
          <CardDescription>
            Your complete coin purchase and usage history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Coins</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coinPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No coin purchases yet
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  coinPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{purchase.packageName}</div>
                          {purchase.bonusCoins > 0 && (
                            <div className="text-sm text-green-600">
                              +{purchase.bonusCoins} bonus
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          {purchase.totalCoins.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(purchase.purchaseDate, 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {coinSettings.enableCoinExpiration ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {format(purchase.expirationDate, 'MMM dd, yyyy')}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {purchase.remainingCoins.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {purchase.totalCoins.toLocaleString()}
                            </span>
                          </div>
                          {purchase.totalCoins > 0 && (
                            <Progress 
                              value={(purchase.remainingCoins / purchase.totalCoins) * 100} 
                              className="h-1"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(purchase)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${purchase.purchasePrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Expiration Policy Info */}
      {coinSettings.enableCoinExpiration && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Coin Expiration Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Coins expire {coinSettings.coinExpirationDays} days after purchase date. 
              Expired coins cannot be recovered. Use your coins before they expire to avoid losing them.
            </p>
          </CardContent>
        </Card>
      )}
      
      <CoinCheckoutModal 
        isOpen={showCoinCheckout} 
        onClose={() => setShowCoinCheckout(false)} 
      />
    </div>
  );
};

export default CoinCredits;