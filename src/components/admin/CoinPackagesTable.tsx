import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Gift,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CoinPackage | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    coins: '',
    price: '',
    bonus: ''
  });

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

  const openCreateModal = () => {
    setFormData({ coins: '', price: '', bonus: '' });
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: CoinPackage) => {
    setFormData({
      coins: pkg.coins.toString(),
      price: pkg.price.toString(),
      bonus: pkg.bonus?.toString() || ''
    });
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const coins = parseInt(formData.coins);
    const price = parseFloat(formData.price);
    const bonus = formData.bonus ? parseInt(formData.bonus) : undefined;

    if (!coins || !price || coins <= 0 || price <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid coins and price values.",
        variant: "destructive"
      });
      return;
    }

    const newPackage: CoinPackage = {
      id: editingPackage?.id || Date.now().toString(),
      coins,
      price,
      bonus
    };

    let updatedPackages;
    if (editingPackage) {
      updatedPackages = coinPackages.map(pkg => 
        pkg.id === editingPackage.id ? newPackage : pkg
      );
    } else {
      updatedPackages = [...coinPackages, newPackage];
    }

    setCoinPackages(updatedPackages);
    saveCoinPackages(updatedPackages);
    setIsModalOpen(false);
    
    toast({
      title: editingPackage ? "Package updated" : "Package created",
      description: `Coin package ${editingPackage ? 'updated' : 'created'} successfully.`
    });
  };

  const handleDelete = (id: string) => {
    const updatedPackages = coinPackages.filter(pkg => pkg.id !== id);
    setCoinPackages(updatedPackages);
    saveCoinPackages(updatedPackages);
    
    toast({
      title: "Package deleted",
      description: "Coin package deleted successfully."
    });
  };

  const handleBulkDelete = () => {
    const updatedPackages = coinPackages.filter(pkg => !selectedPackages.includes(pkg.id));
    setCoinPackages(updatedPackages);
    saveCoinPackages(updatedPackages);
    setSelectedPackages([]);
    
    toast({
      title: "Packages deleted",
      description: `${selectedPackages.length} packages deleted successfully.`
    });
  };

  const saveCoinPackages = (packages: CoinPackage[]) => {
    const savedSettings = localStorage.getItem('coin_credit_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.coinPackages = packages;
    localStorage.setItem('coin_credit_settings', JSON.stringify(settings));
  };

  const togglePackageSelection = (id: string) => {
    setSelectedPackages(prev => 
      prev.includes(id) 
        ? prev.filter(pkgId => pkgId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedPackages(
      selectedPackages.length === coinPackages.length 
        ? [] 
        : coinPackages.map(pkg => pkg.id)
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Coin Packages</CardTitle>
                <CardDescription>
                  Manage coin packages available for purchase
                </CardDescription>
              </div>
            </div>
            <Button onClick={openCreateModal} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coin Package
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedPackages.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedPackages.length} selected
              </span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                className="gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete Selected
              </Button>
            </div>
          )}

          {coinPackages.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Coin Packages</h3>
              <p className="text-muted-foreground mb-4">
                Create your first coin package to get started.
              </p>
              <Button onClick={openCreateModal} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Coin Package
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedPackages.length === coinPackages.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Coins</TableHead>
                    <TableHead>Price ($)</TableHead>
                    <TableHead>Bonus Coins (Optional)</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coinPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPackages.includes(pkg.id)}
                          onCheckedChange={() => togglePackageSelection(pkg.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{pkg.coins.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">{pkg.price.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pkg.bonus ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Gift className="h-4 w-4" />
                            <span className="font-medium">+{pkg.bonus.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(pkg)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(pkg.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Coin Package' : 'Create Coin Package'}
            </DialogTitle>
            <DialogDescription>
              {editingPackage 
                ? 'Update the coin package details below.'
                : 'Enter the details for your new coin package.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coins">Coins</Label>
              <Input
                id="coins"
                type="number"
                placeholder="Enter number of coins"
                value={formData.coins}
                onChange={(e) => setFormData(prev => ({ ...prev, coins: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter price in USD"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bonus">Bonus Coins (Optional)</Label>
              <Input
                id="bonus"
                type="number"
                placeholder="Enter bonus coins (optional)"
                value={formData.bonus}
                onChange={(e) => setFormData(prev => ({ ...prev, bonus: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoinPackagesTable;