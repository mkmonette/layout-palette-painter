import { useState, useEffect } from 'react';
import { useFeatureAccess } from './useFeatureAccess';

interface SubscriptionInfo {
  plan: string;
  status: string;
  nextBilling?: string;
  amount?: string;
}

interface BillingInfo {
  paymentMethods: PaymentMethod[];
  hasPaymentMethod: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  plan: 'Free',
  status: 'Active'
};

const DEFAULT_BILLING: BillingInfo = {
  paymentMethods: [],
  hasPaymentMethod: false
};

export const useAccountSettings = () => {
  const { currentPlan, planName } = useFeatureAccess();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>(DEFAULT_SUBSCRIPTION);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(DEFAULT_BILLING);

  useEffect(() => {
    loadAccountData();
  }, [currentPlan]);

  const loadAccountData = () => {
    try {
      // Load subscription info from feature access hook and localStorage
      const savedSubscription = localStorage.getItem('user_subscription');
      
      let subscription = DEFAULT_SUBSCRIPTION;
      if (savedSubscription) {
        subscription = JSON.parse(savedSubscription);
      }

      // Override with current plan from feature access hook
      subscription.plan = planName || 'Free';

      setSubscriptionInfo(subscription);

      // Load billing info
      const savedBilling = localStorage.getItem('user_billing');
      if (savedBilling) {
        setBillingInfo(JSON.parse(savedBilling));
      } else {
        // Set demo data for Pro users
        if (subscription.plan !== 'Free') {
          const demoBilling: BillingInfo = {
            paymentMethods: [
              {
                id: 'pm_demo',
                type: 'card',
                brand: 'visa',
                last4: '4242',
                expiryMonth: 12,
                expiryYear: 2028,
                isDefault: true
              }
            ],
            hasPaymentMethod: true
          };
          setBillingInfo(demoBilling);
          localStorage.setItem('user_billing', JSON.stringify(demoBilling));
        }
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  const updateSubscription = (updates: Partial<SubscriptionInfo>) => {
    const newSubscription = { ...subscriptionInfo, ...updates };
    setSubscriptionInfo(newSubscription);
    localStorage.setItem('user_subscription', JSON.stringify(newSubscription));
  };

  const addPaymentMethod = (paymentMethod: PaymentMethod) => {
    const newBilling = {
      ...billingInfo,
      paymentMethods: [...billingInfo.paymentMethods, paymentMethod],
      hasPaymentMethod: true
    };
    setBillingInfo(newBilling);
    localStorage.setItem('user_billing', JSON.stringify(newBilling));
  };

  const removePaymentMethod = (paymentMethodId: string) => {
    const updatedMethods = billingInfo.paymentMethods.filter(pm => pm.id !== paymentMethodId);
    const newBilling = {
      ...billingInfo,
      paymentMethods: updatedMethods,
      hasPaymentMethod: updatedMethods.length > 0
    };
    setBillingInfo(newBilling);
    localStorage.setItem('user_billing', JSON.stringify(newBilling));
  };

  const setDefaultPaymentMethod = (paymentMethodId: string) => {
    const updatedMethods = billingInfo.paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === paymentMethodId
    }));
    const newBilling = { ...billingInfo, paymentMethods: updatedMethods };
    setBillingInfo(newBilling);
    localStorage.setItem('user_billing', JSON.stringify(newBilling));
  };

  return {
    subscriptionInfo,
    billingInfo,
    updateSubscription,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    loadAccountData
  };
};