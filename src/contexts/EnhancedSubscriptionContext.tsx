import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, UserSubscription, AVAILABLE_FEATURES } from '@/types/subscription';

interface EnhancedSubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  userSubscription: UserSubscription | null;
  plans: SubscriptionPlan[];
  hasFeatureAccess: (featureId: string) => boolean;
  getFeatureLimit: (featureId: string) => number;
  getUsageRemaining: (featureId: string) => number;
  updatePlans: (plans: SubscriptionPlan[]) => void;
  setCurrentPlan: (plan: SubscriptionPlan | null) => void;
}

const EnhancedSubscriptionContext = createContext<EnhancedSubscriptionContextType | undefined>(undefined);

export const useEnhancedSubscription = () => {
  const context = useContext(EnhancedSubscriptionContext);
  if (!context) {
    throw new Error('useEnhancedSubscription must be used within an EnhancedSubscriptionProvider');
  }
  return context;
};

interface EnhancedSubscriptionProviderProps {
  children: React.ReactNode;
}

// Default subscription plans
const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Basic features for getting started',
    features: {
      pro_templates: false,
      saved_palettes: 3,
      downloads_per_day: 3,
      branded_reports: false,
      auto_generator: false,
      custom_color_schemes: false,
      color_mood_options: false,
      dark_mode: false
    },
    status: 'active',
    subscribers: 1250,
    revenue: 0
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    description: 'Advanced features for professionals',
    features: {
      pro_templates: true,
      saved_palettes: 50,
      downloads_per_day: -1, // -1 means unlimited
      branded_reports: true,
      auto_generator: true,
      custom_color_schemes: true,
      color_mood_options: true,
      dark_mode: true
    },
    status: 'active',
    subscribers: 567,
    revenue: 5664.33
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    interval: 'month',
    description: 'Everything in Pro plus priority support',
    features: {
      pro_templates: true,
      saved_palettes: -1, // unlimited
      downloads_per_day: -1, // unlimited
      branded_reports: true,
      auto_generator: true,
      custom_color_schemes: true,
      color_mood_options: true,
      dark_mode: true
    },
    status: 'active',
    subscribers: 89,
    revenue: 2669.11
  }
];

export const EnhancedSubscriptionProvider: React.FC<EnhancedSubscriptionProviderProps> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(DEFAULT_PLANS[0]); // Default to free plan
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);

  // Load plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('subscription_plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        // Update current plan if it exists in saved plans
        if (currentPlan) {
          const updatedCurrentPlan = parsedPlans.find((p: SubscriptionPlan) => p.id === currentPlan.id);
          if (updatedCurrentPlan) {
            setCurrentPlan(updatedCurrentPlan);
          }
        }
      } catch (error) {
        console.error('Error loading saved plans:', error);
      }
    }
  }, []);

  const hasFeatureAccess = (featureId: string): boolean => {
    if (!currentPlan) return false;
    const featureValue = currentPlan.features[featureId];
    return featureValue === true;
  };

  const getFeatureLimit = (featureId: string): number => {
    if (!currentPlan) return 0;
    const featureValue = currentPlan.features[featureId];
    if (typeof featureValue === 'number') {
      return featureValue === -1 ? Infinity : featureValue;
    }
    return 0;
  };

  const getUsageRemaining = (featureId: string): number => {
    const limit = getFeatureLimit(featureId);
    if (limit === Infinity) return Infinity;
    
    const currentUsage = userSubscription?.usage[featureId] || 0;
    return Math.max(0, limit - currentUsage);
  };

  const updatePlans = (newPlans: SubscriptionPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('subscription_plans', JSON.stringify(newPlans));
  };

  return (
    <EnhancedSubscriptionContext.Provider value={{
      currentPlan,
      userSubscription,
      plans,
      hasFeatureAccess,
      getFeatureLimit,
      getUsageRemaining,
      updatePlans,
      setCurrentPlan
    }}>
      {children}
    </EnhancedSubscriptionContext.Provider>
  );
};