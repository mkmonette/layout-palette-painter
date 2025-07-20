import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  User, 
  ArrowRight, 
  Coins, 
  Calendar, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  processUpgrade,
  createDemoSubscription,
  getUserSubscription,
  getUserWallet,
  getUpgradeBonusPreview,
  getRemainingDays
} from '@/utils/upgradeLogic';

const UpgradeTestPanel = () => {
  const { toast } = useToast();
  const [testUserId, setTestUserId] = useState('demo_user_123');
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [targetPlan, setTargetPlan] = useState('enterprise');
  const [remainingDays, setRemainingDays] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'coins'>('gateway');
  
  // User data state
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [userWallet, setUserWallet] = useState<any>(null);
  const [bonusPreview, setBonusPreview] = useState<any>(null);

  // Refresh user data
  const refreshUserData = () => {
    const subscription = getUserSubscription(testUserId);
    const wallet = getUserWallet(testUserId);
    setUserSubscription(subscription);
    setUserWallet(wallet);

    if (subscription) {
      const actualRemainingDays = getRemainingDays(subscription);
      const preview = getUpgradeBonusPreview(subscription.currentPlan, targetPlan, actualRemainingDays);
      setBonusPreview(preview);
    }
  };

  // Create demo subscription
  const handleCreateDemo = () => {
    createDemoSubscription(testUserId, currentPlan, remainingDays);
    refreshUserData();
    toast({
      title: "Demo Created",
      description: `Created demo subscription: ${currentPlan} plan with ${remainingDays} days remaining`,
    });
  };

  // Process upgrade
  const handleUpgrade = () => {
    const result = processUpgrade(testUserId, targetPlan, paymentMethod);
    
    if (result.success) {
      toast({
        title: "Upgrade Successful! 🎉",
        description: result.message,
      });
    } else {
      toast({
        title: "Upgrade Failed",
        description: result.message,
        variant: "destructive"
      });
    }
    
    refreshUserData();
  };

  useEffect(() => {
    refreshUserData();
  }, [testUserId, targetPlan]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-500" />
            Upgrade Logic Test Panel
          </CardTitle>
          <CardDescription>
            Test the subscription upgrade and bonus coin logic using localStorage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Test User ID</Label>
              <Input
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Current Plan</Label>
              <Select value={currentPlan} onValueChange={setCurrentPlan}>
                <SelectTrigger>
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
              <Label>Target Plan</Label>
              <Select value={targetPlan} onValueChange={setTargetPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remaining Days</Label>
              <Input
                type="number"
                min="0"
                max="365"
                value={remainingDays}
                onChange={(e) => setRemainingDays(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleCreateDemo} variant="outline">
              <User className="h-4 w-4 mr-2" />
              Create Demo Subscription
            </Button>
            <Button onClick={refreshUserData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current User Status */}
      {userSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Current User Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Current Plan</Label>
                <Badge variant="secondary" className="text-sm">
                  {userSubscription.currentPlan.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Remaining Days</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-mono">{getRemainingDays(userSubscription)} days</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Coin Balance</Label>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-mono">{userWallet?.coinBalance || 0} coins</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bonus Preview */}
      {bonusPreview && userSubscription && (
        <Card className={bonusPreview.eligible ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${bonusPreview.eligible ? 'text-green-600' : 'text-orange-600'}`} />
              Upgrade Bonus Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{userSubscription.currentPlan}</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">{targetPlan}</Badge>
              </div>
              
              {bonusPreview.eligible ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Bonus Eligible</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">No Bonus</span>
                </div>
              )}
            </div>

            {bonusPreview.rule && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Coins/Day</Label>
                  <div className="font-mono">{bonusPreview.rule.coinsPerDay}</div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Remaining Days</Label>
                  <div className="font-mono">{getRemainingDays(userSubscription)}</div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Max Bonus</Label>
                  <div className="font-mono">{bonusPreview.rule.maxBonusCoins}</div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Calculated Bonus</Label>
                  <div className="font-mono font-bold text-green-600">
                    {bonusPreview.bonusCoins} coins
                  </div>
                </div>
              </div>
            )}

            {!bonusPreview.rule && (
              <p className="text-sm text-muted-foreground">
                No bonus rule configured for {userSubscription.currentPlan} → {targetPlan} upgrade
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade Actions */}
      {userSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Process Upgrade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: 'gateway' | 'coins') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gateway">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Gateway (Eligible for bonus)
                    </div>
                  </SelectItem>
                  <SelectItem value="coins">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Coins (No bonus)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <Button 
              onClick={handleUpgrade} 
              className="w-full" 
              size="lg"
              disabled={!userSubscription || userSubscription.currentPlan === targetPlan}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Process Upgrade: {userSubscription.currentPlan} → {targetPlan}
            </Button>

            {paymentMethod === 'gateway' && bonusPreview?.eligible && (
              <p className="text-sm text-green-600 text-center">
                🎉 This upgrade will award {bonusPreview.bonusCoins} bonus coins!
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {userWallet?.transactions && userWallet.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userWallet.transactions.slice(0, 5).map((transaction: any) => (
                <div key={transaction.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === 'upgrade_bonus' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                    <span className={`font-mono ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpgradeTestPanel;