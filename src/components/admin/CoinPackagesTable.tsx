import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Edit, 
  Trash2, 
  Plus,
  DollarSign,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  bonus?: number;
}

const CoinPackagesTable = () => {
  const { toast } = useToast();
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);

  // Load coin packages from localStorage
  useEffect(() => {
    loadCoinPackages();
  }, []);

  const loadCoinPackages = () => {
    const savedSettings = localStorage.getItem('coin_credit_settings');
    console.log('Loading coin settings:', savedSettings); // Debug log
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        console.log('Parsed settings:', parsed); // Debug log
        if (parsed.coinPackages && Array.isArray(parsed.coinPackages)) {
          setCoinPackages(parsed.coinPackages);
          console.log('Loaded coin packages:', parsed.coinPackages); // Debug log
        } else {
          console.log('No coinPackages found in settings, using defaults'); // Debug log
          setDefaultPackages();
        }
      } catch (error) {
        console.error('Error loading coin settings:', error);
        setDefaultPackages();
      }
    } else {
      console.log('No saved settings found, using defaults'); // Debug log
      setDefaultPackages();
    }
  };

  const setDefaultPackages = () => {
    const defaultPackages = [
      { id: '1', coins: 100, price: 4 },
      { id: '2', coins: 200, price: 8 },
      { id: '3', coins: 500, price: 18, bonus: 50 },
      { id: '4', coins: 1000, price: 35, bonus: 150 },
      { id: '5', coins: 2000, price: 65, bonus: 400 }
    ];
    setCoinPackages(defaultPackages);
    console.log('Set default packages:', defaultPackages); // Debug log
  };

  const calculateValue = (pkg: CoinPackage) => {
    const totalCoins = pkg.coins + (pkg.bonus || 0);
    return (pkg.price / totalCoins).toFixed(4);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPopularityBadge = (index: number) => {
    if (index === 0) return { label: 'Starter', color: 'bg-blue-500' };
    if (index === 1) return { label: 'Popular', color: 'bg-green-500' };
    if (index === 2) return { label: 'Best Value', color: 'bg-purple-500' };
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Coin Packages Overview</CardTitle>
              <CardDescription>
                Current coin packages available for purchase ({coinPackages.length} packages)
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadCoinPackages}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {coinPackages.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Coin Packages</h3>
            <p className="text-muted-foreground mb-4">
              No coin packages have been created yet. Create your first package to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Base Coins</TableHead>
                  <TableHead>Bonus Coins</TableHead>
                  <TableHead>Total Coins</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value per Coin</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coinPackages.map((pkg, index) => {
                  const totalCoins = pkg.coins + (pkg.bonus || 0);
                  const popularity = getPopularityBadge(index);
                  
                  return (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Coins className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium">Package {index + 1}</div>
                            {popularity && (
                              <Badge 
                                className={`text-white text-xs ${popularity.color}`}
                              >
                                {popularity.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{pkg.coins.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pkg.bonus ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Gift className="h-3 w-3" />
                            <span className="font-medium">+{pkg.bonus.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-primary" />
                          <span className="font-bold text-primary">
                            {totalCoins.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span className="font-semibold">
                            {formatCurrency(pkg.price)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">
                          ${calculateValue(pkg)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Stats */}
        {coinPackages.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Coins className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Packages</div>
                    <div className="text-lg font-bold">{coinPackages.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Price Range</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(Math.min(...coinPackages.map(p => p.price)))} - {formatCurrency(Math.max(...coinPackages.map(p => p.price)))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Coins className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Coin Range</div>
                    <div className="text-lg font-bold">
                      {Math.min(...coinPackages.map(p => p.coins + (p.bonus || 0))).toLocaleString()} - {Math.max(...coinPackages.map(p => p.coins + (p.bonus || 0))).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Gift className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">With Bonus</div>
                    <div className="text-lg font-bold">
                      {coinPackages.filter(p => p.bonus && p.bonus > 0).length} packages
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinPackagesTable;