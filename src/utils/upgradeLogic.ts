import { trackUpgradeEvent } from './upgradeAnalytics';

interface UpgradeBonus {
  id: string;
  fromPlan: string;
  toPlan: string;
  coinsPerDay: number;
  minDaysRequired: number;
  maxBonusCoins: number;
  enabled: boolean;
}

interface UserSubscription {
  userId: string;
  currentPlan: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  paymentMethod: 'gateway' | 'coins';
  isActive: boolean;
}

interface UserWallet {
  userId: string;
  coinBalance: number;
  transactions: CoinTransaction[];
}

interface CoinTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus' | 'upgrade_bonus';
  amount: number;
  description: string;
  timestamp: string;
  relatedPlan?: string;
}

// Get upgrade bonus settings from admin configuration
export const getUpgradeBonusSettings = (): UpgradeBonus[] => {
  try {
    const settings = localStorage.getItem('coin_credit_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.upgradeBonuses || [];
    }
  } catch (error) {
    console.error('Error loading upgrade bonus settings:', error);
  }
  return [];
};

// Get user subscription data
export const getUserSubscription = (userId: string): UserSubscription | null => {
  try {
    const subscription = localStorage.getItem(`user_subscription_${userId}`);
    return subscription ? JSON.parse(subscription) : null;
  } catch (error) {
    console.error('Error loading user subscription:', error);
    return null;
  }
};

// Update user subscription
export const updateUserSubscription = (subscription: UserSubscription): void => {
  try {
    localStorage.setItem(`user_subscription_${subscription.userId}`, JSON.stringify(subscription));
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
};

// Get user wallet data
export const getUserWallet = (userId: string): UserWallet => {
  try {
    const wallet = localStorage.getItem(`user_wallet_${userId}`);
    if (wallet) {
      return JSON.parse(wallet);
    }
  } catch (error) {
    console.error('Error loading user wallet:', error);
  }
  
  // Return default wallet if not found
  return {
    userId,
    coinBalance: 0,
    transactions: []
  };
};

// Update user wallet
export const updateUserWallet = (wallet: UserWallet): void => {
  try {
    localStorage.setItem(`user_wallet_${wallet.userId}`, JSON.stringify(wallet));
  } catch (error) {
    console.error('Error updating user wallet:', error);
  }
};

// Calculate remaining days in current subscription
export const getRemainingDays = (subscription: UserSubscription): number => {
  if (!subscription || !subscription.isActive) return 0;
  
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const timeDiff = endDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, daysDiff);
};

// Check if upgrade is to a higher tier
export const isUpgrade = (fromPlan: string, toPlan: string): boolean => {
  const planHierarchy: Record<string, number> = {
    'free': 0,
    'pro': 1,
    'enterprise': 2
  };
  
  const fromLevel = planHierarchy[fromPlan.toLowerCase()] ?? -1;
  const toLevel = planHierarchy[toPlan.toLowerCase()] ?? -1;
  
  return toLevel > fromLevel;
};

// Find applicable upgrade bonus rule
export const findUpgradeBonus = (fromPlan: string, toPlan: string): UpgradeBonus | null => {
  const bonusSettings = getUpgradeBonusSettings();
  
  return bonusSettings.find(bonus => 
    bonus.enabled &&
    bonus.fromPlan.toLowerCase() === fromPlan.toLowerCase() &&
    bonus.toPlan.toLowerCase() === toPlan.toLowerCase()
  ) || null;
};

// Calculate bonus coins for upgrade
export const calculateUpgradeBonus = (
  fromPlan: string,
  toPlan: string,
  remainingDays: number
): { bonusCoins: number; bonusRule: UpgradeBonus | null } => {
  const bonusRule = findUpgradeBonus(fromPlan, toPlan);
  
  if (!bonusRule) {
    return { bonusCoins: 0, bonusRule: null };
  }
  
  // Check minimum days requirement
  if (remainingDays < bonusRule.minDaysRequired) {
    return { bonusCoins: 0, bonusRule };
  }
  
  // Calculate bonus: remaining_days × coins_per_day (capped at max)
  const calculatedBonus = remainingDays * bonusRule.coinsPerDay;
  const bonusCoins = Math.min(calculatedBonus, bonusRule.maxBonusCoins);
  
  return { bonusCoins, bonusRule };
};

// Add coins to user wallet
export const addCoinsToWallet = (
  userId: string,
  amount: number,
  description: string,
  type: CoinTransaction['type'] = 'bonus',
  relatedPlan?: string
): boolean => {
  try {
    const wallet = getUserWallet(userId);
    
    const transaction: CoinTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      description,
      timestamp: new Date().toISOString(),
      relatedPlan
    };
    
    wallet.coinBalance += amount;
    wallet.transactions.unshift(transaction); // Add to beginning for recent-first order
    
    // Keep only last 100 transactions to avoid localStorage bloat
    if (wallet.transactions.length > 100) {
      wallet.transactions = wallet.transactions.slice(0, 100);
    }
    
    updateUserWallet(wallet);
    return true;
  } catch (error) {
    console.error('Error adding coins to wallet:', error);
    return false;
  }
};

// Main upgrade processing function
export const processUpgrade = (
  userId: string,
  newPlan: string,
  paymentMethod: 'gateway' | 'coins' = 'gateway'
): {
  success: boolean;
  bonusAwarded: number;
  message: string;
  originalRenewalDate?: string;
} => {
  try {
    const currentSubscription = getUserSubscription(userId);
    
    if (!currentSubscription) {
      return {
        success: false,
        bonusAwarded: 0,
        message: 'No current subscription found'
      };
    }
    
    const fromPlan = currentSubscription.currentPlan;
    const toPlan = newPlan;
    
    // Check if it's actually an upgrade
    if (!isUpgrade(fromPlan, toPlan)) {
      return {
        success: false,
        bonusAwarded: 0,
        message: 'Not an upgrade - no bonus applicable'
      };
    }
    
    // Only process bonuses for gateway payments
    let bonusAwarded = 0;
    let bonusMessage = '';
    let bonusRule: UpgradeBonus | null = null;
    const remainingDays = getRemainingDays(currentSubscription);
    
    if (paymentMethod === 'gateway') {
      const { bonusCoins, bonusRule: rule } = calculateUpgradeBonus(fromPlan, toPlan, remainingDays);
      bonusRule = rule;
      
      if (bonusCoins > 0 && bonusRule) {
        const success = addCoinsToWallet(
          userId,
          bonusCoins,
          `Upgrade bonus: ${fromPlan} → ${toPlan} (${remainingDays} days remaining)`,
          'upgrade_bonus',
          toPlan
        );
        
        if (success) {
          bonusAwarded = bonusCoins;
          bonusMessage = ` + ${bonusCoins} bonus coins awarded!`;
        }
      }
    }
    
    // Update subscription (keep original renewal date if possible)
    const updatedSubscription: UserSubscription = {
      ...currentSubscription,
      currentPlan: toPlan,
      paymentMethod,
      // In real implementation, the payment gateway would provide new dates
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
      // Keep original renewal date pattern if possible
      renewalDate: currentSubscription.renewalDate
    };
    
    updateUserSubscription(updatedSubscription);
    
    // Track analytics event
    trackUpgradeEvent(
      userId,
      fromPlan,
      toPlan,
      paymentMethod,
      remainingDays,
      bonusAwarded,
      bonusRule?.id
    );
    
    return {
      success: true,
      bonusAwarded,
      message: `Successfully upgraded from ${fromPlan} to ${toPlan}${bonusMessage}`,
      originalRenewalDate: currentSubscription.renewalDate
    };
    
  } catch (error) {
    console.error('Error processing upgrade:', error);
    return {
      success: false,
      bonusAwarded: 0,
      message: 'Upgrade processing failed'
    };
  }
};

// Helper function to create a demo user subscription for testing
export const createDemoSubscription = (
  userId: string,
  plan: string = 'pro',
  daysRemaining: number = 15
): UserSubscription => {
  const now = new Date();
  const endDate = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
  const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // Started 15 days ago
  
  const subscription: UserSubscription = {
    userId,
    currentPlan: plan,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    renewalDate: endDate.toISOString(),
    paymentMethod: 'gateway',
    isActive: true
  };
  
  updateUserSubscription(subscription);
  return subscription;
};

// Get upgrade bonus preview for UI
export const getUpgradeBonusPreview = (
  fromPlan: string,
  toPlan: string,
  remainingDays: number
): { bonusCoins: number; rule: UpgradeBonus | null; eligible: boolean } => {
  const { bonusCoins, bonusRule } = calculateUpgradeBonus(fromPlan, toPlan, remainingDays);
  
  return {
    bonusCoins,
    rule: bonusRule,
    eligible: bonusCoins > 0
  };
};
