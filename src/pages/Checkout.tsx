import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Coins, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';
import CoinCheckout from '@/components/CoinCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscriptions');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Upgrade Your Experience</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose between subscription plans for ongoing access or purchase coins for flexible, 
              pay-as-you-go usage. Both options unlock powerful AI features and premium templates.
            </p>
          </div>
        </div>

        {/* Payment Method Toggle */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="coins" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Buy Coins
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Subscription Plans Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">
                <Crown className="h-3 w-3 mr-1" />
                Recurring Plans
              </Badge>
              <h2 className="text-2xl font-semibold">Monthly & Yearly Subscriptions</h2>
              <p className="text-muted-foreground">
                Perfect for regular users who want unlimited access to premium features
              </p>
            </div>
            <SubscriptionCheckout />
          </TabsContent>

          {/* Coin Packages Tab */}
          <TabsContent value="coins" className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">
                <Coins className="h-3 w-3 mr-1" />
                Pay As You Go
              </Badge>
              <h2 className="text-2xl font-semibold">Coin Packages</h2>
              <p className="text-muted-foreground">
                Buy coins once and use them when you need premium features - no recurring charges
              </p>
            </div>
            <CoinCheckout />
          </TabsContent>
        </Tabs>

        {/* Comparison Section */}
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Not Sure Which to Choose?</h3>
            <p className="text-muted-foreground">Here's a quick comparison to help you decide</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-500" />
                  Subscription Plans
                </CardTitle>
                <CardDescription>Best for regular users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Unlimited access during subscription period</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Predictable monthly/yearly costs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Best value for frequent usage</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Automatic feature renewals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ❌ <span>Recurring billing commitment</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-gradient-to-b from-yellow-50 to-yellow-100/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  Coin Packages
                </CardTitle>
                <CardDescription>Best for occasional users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>No recurring charges</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Pay only for what you use</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Coins never expire</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ✅ <span>Perfect for testing features</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  ❌ <span>Higher cost per use than subscriptions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security & Support */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold">Secure & Reliable</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">🔒 Secure Payments</div>
                  <div className="text-muted-foreground">
                    All payments processed through PayPal and LemonSqueezy with bank-level encryption
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">🚫 No Hidden Fees</div>
                  <div className="text-muted-foreground">
                    What you see is what you pay - no surprise charges or hidden costs
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">🤝 24/7 Support</div>
                  <div className="text-muted-foreground">
                    Get help anytime with our dedicated customer support team
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-4">
                Questions about billing? Contact us at support@colorpalettegenerator.com
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;