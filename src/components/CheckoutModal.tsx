import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard, Coins, Crown, Star, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/subscription';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: SubscriptionPlan | null;
  coinPackage?: {
    coins: number;
    price: number;
    name: string;
  } | null;
  coinAddons?: {
    id: string;
    name: string;
    coins: number;
    price: number;
    bonus?: number;
  }[];
  type: 'subscription' | 'coins';
}

interface PaymentGateway {
  id: 'paypal' | 'lemonsqueezy';
  name: string;
  description: string;
  enabled: boolean;
  logo?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  coinPackage,
  coinAddons = [],
  type
}) => {
  const { toast } = useToast();
  const [selectedGateway, setSelectedGateway] = useState<'paypal' | 'lemonsqueezy'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock payment gateway settings - in real app, this would come from your admin settings
  const paymentGateways: PaymentGateway[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay securely with PayPal',
      enabled: true
    },
    {
      id: 'lemonsqueezy',
      name: 'LemonSqueezy',
      description: 'Fast and secure payment processing',
      enabled: true
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      if (type === 'subscription' && selectedPlan) {
        const totalCoinAddons = coinAddons.reduce((sum, addon) => sum + addon.coins + (addon.bonus || 0), 0);
        const baseMessage = `Welcome to ${selectedPlan.name}! Your subscription is now active.`;
        const coinMessage = totalCoinAddons > 0 ? ` Plus ${totalCoinAddons} coins have been added to your account.` : '';
        
        toast({
          title: "Subscription Activated!",
          description: baseMessage + coinMessage,
        });
      } else if (type === 'coins' && coinPackage) {
        toast({
          title: "Coins Purchased!",
          description: `${coinPackage.coins} coins have been added to your account.`,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'pro':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'enterprise':
        return <Zap className="h-5 w-5 text-orange-500" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getFeatureList = (features: Record<string, boolean | number>) => {
    // Define the order of features to display
    const featureOrder = [
      'pro_templates',
      'saved_palettes', 
      'ai_generations_per_month',
      'downloads_per_day',
      'image_website_generations_per_month',
      'custom_color_schemes',
      'color_mood_options',
      'color_presets',
      'dark_mode',
      'decorative_settings',
      'auto_generator',
      'branded_reports'
    ];

    return featureOrder
      .filter(key => features[key] !== false && features[key] !== undefined)
      .map(key => {
        const value = features[key];
        let featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Custom display names for specific features
        if (key === 'ai_generations_per_month') {
          featureName = 'AI Colors per Month';
        } else if (key === 'image_website_generations_per_month') {
          featureName = 'Image/Website Generations per Month';
        } else if (key === 'pro_templates') {
          featureName = 'Access to PRO Templates';
        } else if (key === 'color_presets') {
          featureName = 'Color Presets';
        } else if (key === 'decorative_settings') {
          featureName = 'Decorative Settings';
        }
        
        if (typeof value === 'number') {
          return value === -1 ? `Unlimited ${featureName}` : `${value} ${featureName}`;
        }
        return featureName;
      });
  };

  const getTotalPrice = () => {
    let total = 0;
    if (type === 'subscription' && selectedPlan) {
      total += selectedPlan.price;
    } else if (type === 'coins' && coinPackage) {
      total += coinPackage.price;
    }
    total += coinAddons.reduce((sum, addon) => sum + addon.price, 0);
    return total;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'subscription' ? <Crown className="h-5 w-5" /> : <Coins className="h-5 w-5" />}
            {type === 'subscription' ? 'Complete Your Subscription' : 'Purchase Coins'}
          </DialogTitle>
          <DialogDescription>
            {type === 'subscription' 
              ? 'Choose your payment method to activate your subscription'
              : 'Choose your payment method to purchase coins'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {type === 'subscription' && selectedPlan && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPlanIcon(selectedPlan.name)}
                    <div>
                      <div className="font-semibold">{selectedPlan.name} Plan</div>
                      <div className="text-sm text-muted-foreground">
                        Billed {selectedPlan.interval}ly
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${selectedPlan.price.toFixed(2)}/{selectedPlan.interval}
                    </div>
                  </div>
                </div>
              )}

              {type === 'coins' && coinPackage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold">{coinPackage.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coinPackage.coins} coins
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${coinPackage.price.toFixed(2)}</div>
                  </div>
                </div>
              )}

              {/* Coin Add-ons */}
              {coinAddons.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      Coin Add-ons
                    </div>
                    <div className="space-y-2">
                      {coinAddons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{addon.name}</span>
                            <span className="text-muted-foreground ml-2">
                              ({addon.coins + (addon.bonus || 0)} coins)
                            </span>
                          </div>
                          <span className="font-medium">+${addon.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              {/* Plan Features (for subscription) */}
              {type === 'subscription' && selectedPlan && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {getFeatureList(selectedPlan.features).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedGateway} onValueChange={(value: 'paypal' | 'lemonsqueezy') => setSelectedGateway(value)}>
                <div className="space-y-3">
                  {paymentGateways.filter(gateway => gateway.enabled).map((gateway) => (
                    <div key={gateway.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={gateway.id} id={gateway.id} />
                      <Label htmlFor={gateway.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{gateway.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {gateway.description}
                              </div>
                            </div>
                          </div>
                          {selectedGateway === gateway.id && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Processing */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ${getTotalPrice().toFixed(2)}
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-xs text-muted-foreground text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              🔒 Secure payment processing
            </div>
            Your payment information is encrypted and secure. We never store your payment details.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;