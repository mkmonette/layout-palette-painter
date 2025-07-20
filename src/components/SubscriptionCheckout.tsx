import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Sparkles } from 'lucide-react';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import CheckoutModal from './CheckoutModal';
import { SubscriptionPlan } from '@/types/subscription';

// Coin-based purchases removed - subscriptions now use secure payment gateways only

const SubscriptionCheckout = () => {
  const { plans, currentPlan } = useEnhancedSubscription();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  // Coin-based subscription purchases removed

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  // Coin-based functionality removed

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Star className="h-6 w-6 text-blue-500" />;
      case 'pro':
        return <Crown className="h-6 w-6 text-purple-500" />;
      case 'enterprise':
        return <Zap className="h-6 w-6 text-orange-500" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'from-blue-500/10 to-blue-600/10 border-blue-200';
      case 'pro':
        return 'from-purple-500/10 to-purple-600/10 border-purple-200';
      case 'enterprise':
        return 'from-orange-500/10 to-orange-600/10 border-orange-200';
      default:
        return 'from-gray-500/10 to-gray-600/10 border-gray-200';
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
      'theme_tone_light',
      'theme_tone_light_midtone', 
      'theme_tone_midtone',
      'theme_tone_dark_midtone',
      'theme_tone_dark',
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
        } else if (key === 'theme_tone_light') {
          featureName = 'Light Theme';
        } else if (key === 'theme_tone_light_midtone') {
          featureName = 'Light-Midtone Theme';
        } else if (key === 'theme_tone_midtone') {
          featureName = 'Midtone Theme';
        } else if (key === 'theme_tone_dark_midtone') {
          featureName = 'Dark-Midtone Theme';
        } else if (key === 'theme_tone_dark') {
          featureName = 'Dark Theme';
        }
        
        if (typeof value === 'number') {
          return value === -1 ? `Unlimited ${featureName}` : `${value} ${featureName}`;
        }
        return featureName;
      });
  };

  const isCurrentPlan = (plan: SubscriptionPlan) => {
    return currentPlan?.id === plan.id;
  };

  const isUpgrade = (plan: SubscriptionPlan) => {
    if (!currentPlan) return plan.id !== 'free';
    const planOrder = { 'free': 0, 'pro': 1, 'enterprise': 2 };
    return planOrder[plan.id as keyof typeof planOrder] > planOrder[currentPlan.id as keyof typeof planOrder];
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features and take your color palette generation to the next level.
          All subscription purchases are made via secure payment gateways.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-lg mx-auto">
          <p className="text-sm text-blue-700">
            💳 <strong>Secure Payments Only:</strong> All subscription purchases are processed through secure payment gateways. Coins are not accepted for plans.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.filter(plan => plan.status === 'active').map((plan) => {
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isCurrentPlan(plan) 
                  ? `bg-gradient-to-b ${getPlanGradient(plan.name)} ring-2 ring-primary` 
                  : 'hover:scale-105'
              }`}
            >
              {isCurrentPlan(plan) && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                  Current Plan
                </Badge>
              )}
              
              {plan.name.toLowerCase() === 'pro' && (
                <Badge className="absolute -top-2 right-4 bg-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                <div className="pt-4">
                  <div className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      per {plan.interval}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {getFeatureList(plan.features).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {isCurrentPlan(plan) ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePlanSelect(plan)}
                      variant={isUpgrade(plan) ? "default" : "outline"}
                      className="w-full"
                    >
                      {plan.price === 0 ? 'Downgrade to Free' : 
                       isUpgrade(plan) ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Benefits */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">All Plans Include</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm justify-items-center">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No long-term contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
        }}
        selectedPlan={selectedPlan}
        coinAddons={[]}
        type="subscription"
      />
    </div>
  );
};

export default SubscriptionCheckout;