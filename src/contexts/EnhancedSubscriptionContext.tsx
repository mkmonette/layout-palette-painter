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
  // Test override features (dev only)
  testPlanOverride: SubscriptionPlan | null;
  setTestPlanOverride: (plan: SubscriptionPlan) => void;
  clearTestPlanOverride: () => void;
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
      custom_color_schemes: true,
      color_mood_options: true,
      template_dark_mode: true
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
        template_dark_mode: true,
        ai_generations_per_month: 100
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
        template_dark_mode: true,
        ai_generations_per_month: 100
      },
    status: 'active',
    subscribers: 89,
    revenue: 2669.11
  }
];

export const EnhancedSubscriptionProvider: React.FC<EnhancedSubscriptionProviderProps> = ({ children }) => {
  const [basePlan, setBasePlan] = useState<SubscriptionPlan | null>(DEFAULT_PLANS[0]); // Default to free plan
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  
  // Test override state (dev only)
  const [testPlanOverride, setTestPlanOverrideState] = useState<SubscriptionPlan | null>(() => {
    if (process.env.NODE_ENV === 'production') return null;
    const saved = sessionStorage.getItem('test_plan_override');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Current plan is override if in dev mode, otherwise base plan
  const currentPlan = process.env.NODE_ENV !== 'production' && testPlanOverride ? testPlanOverride : basePlan;

  // Load plans from localStorage on mount
  useEffect(() => {
    // Clear outdated localStorage plans to force use of updated defaults
    const migrationKey = 'template_dark_mode_migration';
    const hasRunMigration = localStorage.getItem(migrationKey);
    
    if (!hasRunMigration) {
      console.log('🚨 Running template dark mode migration - clearing old plans');
      localStorage.removeItem('subscription_plans');
      localStorage.setItem(migrationKey, 'true');
    }
    
    const savedPlans = localStorage.getItem('subscription_plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        // Update base plan if it exists in saved plans
        if (basePlan) {
          const updatedBasePlan = parsedPlans.find((p: SubscriptionPlan) => p.id === basePlan.id);
          if (updatedBasePlan) {
            setBasePlan(updatedBasePlan);
          }
        }
      } catch (error) {
        console.error('Error loading saved plans:', error);
      }
    } else {
      // If no saved plans, ensure we use default plans
      console.log('🔄 No saved plans found, using defaults with updated features');
      setPlans(DEFAULT_PLANS);
      setBasePlan(DEFAULT_PLANS[0]);
    }
  }, []);

  // Test override functions (dev only)
  const setTestPlanOverride = (plan: SubscriptionPlan) => {
    if (process.env.NODE_ENV === 'production') return;
    setTestPlanOverrideState(plan);
    sessionStorage.setItem('test_plan_override', JSON.stringify(plan));
  };

  const clearTestPlanOverride = () => {
    if (process.env.NODE_ENV === 'production') return;
    setTestPlanOverrideState(null);
    sessionStorage.removeItem('test_plan_override');
  };

  const setCurrentPlan = (plan: SubscriptionPlan | null) => {
    setBasePlan(plan);
  };

  const hasFeatureAccess = (featureId: string): boolean => {
    if (!currentPlan) {
      console.log('🔍 hasFeatureAccess: No current plan');
      return false;
    }
    const featureValue = currentPlan.features[featureId];
    console.log(`🔍 hasFeatureAccess: ${featureId} = ${featureValue} (plan: ${currentPlan.name})`);
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
    
    // Update current base plan if it exists in the new plans
    if (basePlan) {
      const updatedBasePlan = newPlans.find(p => p.id === basePlan.id);
      if (updatedBasePlan) {
        console.log(`🔄 Updating current plan features:`, updatedBasePlan.features);
        setBasePlan(updatedBasePlan);
      }
    }
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
      setCurrentPlan,
      testPlanOverride,
      setTestPlanOverride,
      clearTestPlanOverride
    }}>
      {children}
    </EnhancedSubscriptionContext.Provider>
  );
};