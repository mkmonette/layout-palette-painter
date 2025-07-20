interface UpgradeEvent {
  id: string;
  userId: string;
  timestamp: string;
  fromPlan: string;
  toPlan: string;
  paymentMethod: 'gateway' | 'coins';
  remainingDaysAtUpgrade: number;
  bonusCoinsAwarded: number;
  bonusRuleUsed?: string;
  wasEarlyUpgrade: boolean; // upgraded before 50% of billing period
  upgradeValue: number; // estimated plan value difference
}

interface UpgradeAnalytics {
  totalUpgrades: number;
  earlyUpgrades: number;
  gatewayUpgrades: number;
  coinUpgrades: number;
  totalBonusCoinsAwarded: number;
  averageBonusCoinsPerUpgrade: number;
  planUpgradeMatrix: Record<string, Record<string, number>>;
  popularUpgradePaths: Array<{
    from: string;
    to: string;
    count: number;
    percentage: number;
  }>;
  monthlyUpgradeStats: Array<{
    month: string;
    upgrades: number;
    bonusCoins: number;
    earlyUpgrades: number;
  }>;
  bonusEffectiveness: {
    earlyUpgradeRate: number;
    averageDaysRemaining: number;
    bonusConversionRate: number;
  };
}

// Store upgrade event
export const trackUpgradeEvent = (
  userId: string,
  fromPlan: string,
  toPlan: string,
  paymentMethod: 'gateway' | 'coins',
  remainingDays: number,
  bonusCoinsAwarded: number,
  bonusRuleId?: string
): void => {
  try {
    const events = getUpgradeEvents();
    
    // Calculate if this was an early upgrade (before 50% of billing period)
    const wasEarlyUpgrade = remainingDays > 15; // Assuming 30-day billing cycle
    
    // Estimate upgrade value (simplified pricing)
    const planValues = { free: 0, pro: 9, enterprise: 29 };
    const upgradeValue = (planValues[toPlan as keyof typeof planValues] || 0) - 
                        (planValues[fromPlan as keyof typeof planValues] || 0);
    
    const event: UpgradeEvent = {
      id: `upgrade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      timestamp: new Date().toISOString(),
      fromPlan,
      toPlan,
      paymentMethod,
      remainingDaysAtUpgrade: remainingDays,
      bonusCoinsAwarded,
      bonusRuleUsed: bonusRuleId,
      wasEarlyUpgrade,
      upgradeValue
    };
    
    events.push(event);
    
    // Keep only last 1000 events to avoid localStorage bloat
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('upgrade_analytics_events', JSON.stringify(events));
    
    console.log('Upgrade event tracked:', event);
  } catch (error) {
    console.error('Error tracking upgrade event:', error);
  }
};

// Get all upgrade events
export const getUpgradeEvents = (): UpgradeEvent[] => {
  try {
    const events = localStorage.getItem('upgrade_analytics_events');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error loading upgrade events:', error);
    return [];
  }
};

// Calculate comprehensive analytics
export const calculateUpgradeAnalytics = (dateRange?: { from: Date; to: Date }): UpgradeAnalytics => {
  const events = getUpgradeEvents();
  
  // Filter by date range if provided
  const filteredEvents = dateRange 
    ? events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= dateRange.from && eventDate <= dateRange.to;
      })
    : events;
  
  // Basic counts
  const totalUpgrades = filteredEvents.length;
  const earlyUpgrades = filteredEvents.filter(e => e.wasEarlyUpgrade).length;
  const gatewayUpgrades = filteredEvents.filter(e => e.paymentMethod === 'gateway').length;
  const coinUpgrades = filteredEvents.filter(e => e.paymentMethod === 'coins').length;
  
  // Bonus coin statistics
  const totalBonusCoinsAwarded = filteredEvents.reduce((sum, e) => sum + e.bonusCoinsAwarded, 0);
  const averageBonusCoinsPerUpgrade = totalUpgrades > 0 ? totalBonusCoinsAwarded / totalUpgrades : 0;
  
  // Plan upgrade matrix
  const planUpgradeMatrix: Record<string, Record<string, number>> = {};
  filteredEvents.forEach(event => {
    if (!planUpgradeMatrix[event.fromPlan]) {
      planUpgradeMatrix[event.fromPlan] = {};
    }
    if (!planUpgradeMatrix[event.fromPlan][event.toPlan]) {
      planUpgradeMatrix[event.fromPlan][event.toPlan] = 0;
    }
    planUpgradeMatrix[event.fromPlan][event.toPlan]++;
  });
  
  // Popular upgrade paths
  const upgradePathCounts: Record<string, number> = {};
  filteredEvents.forEach(event => {
    const path = `${event.fromPlan}->${event.toPlan}`;
    upgradePathCounts[path] = (upgradePathCounts[path] || 0) + 1;
  });
  
  const popularUpgradePaths = Object.entries(upgradePathCounts)
    .map(([path, count]) => {
      const [from, to] = path.split('->');
      return {
        from,
        to,
        count,
        percentage: totalUpgrades > 0 ? (count / totalUpgrades) * 100 : 0
      };
    })
    .sort((a, b) => b.count - a.count);
  
  // Monthly statistics
  const monthlyStats: Record<string, { upgrades: number; bonusCoins: number; earlyUpgrades: number }> = {};
  filteredEvents.forEach(event => {
    const month = new Date(event.timestamp).toISOString().slice(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = { upgrades: 0, bonusCoins: 0, earlyUpgrades: 0 };
    }
    monthlyStats[month].upgrades++;
    monthlyStats[month].bonusCoins += event.bonusCoinsAwarded;
    if (event.wasEarlyUpgrade) {
      monthlyStats[month].earlyUpgrades++;
    }
  });
  
  const monthlyUpgradeStats = Object.entries(monthlyStats)
    .map(([month, stats]) => ({ month, ...stats }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Bonus effectiveness metrics
  const bonusEligibleUpgrades = filteredEvents.filter(e => e.paymentMethod === 'gateway');
  const earlyUpgradeRate = totalUpgrades > 0 ? (earlyUpgrades / totalUpgrades) * 100 : 0;
  const averageDaysRemaining = bonusEligibleUpgrades.length > 0 
    ? bonusEligibleUpgrades.reduce((sum, e) => sum + e.remainingDaysAtUpgrade, 0) / bonusEligibleUpgrades.length 
    : 0;
  const bonusConversionRate = bonusEligibleUpgrades.length > 0 
    ? (bonusEligibleUpgrades.filter(e => e.bonusCoinsAwarded > 0).length / bonusEligibleUpgrades.length) * 100
    : 0;
  
  return {
    totalUpgrades,
    earlyUpgrades,
    gatewayUpgrades,
    coinUpgrades,
    totalBonusCoinsAwarded,
    averageBonusCoinsPerUpgrade,
    planUpgradeMatrix,
    popularUpgradePaths,
    monthlyUpgradeStats,
    bonusEffectiveness: {
      earlyUpgradeRate,
      averageDaysRemaining,
      bonusConversionRate
    }
  };
};

// Get specific metrics
export const getEarlyUpgradeStats = () => {
  const events = getUpgradeEvents();
  const earlyUpgrades = events.filter(e => e.wasEarlyUpgrade);
  
  return {
    total: earlyUpgrades.length,
    percentage: events.length > 0 ? (earlyUpgrades.length / events.length) * 100 : 0,
    averageBonusCoins: earlyUpgrades.length > 0 
      ? earlyUpgrades.reduce((sum, e) => sum + e.bonusCoinsAwarded, 0) / earlyUpgrades.length
      : 0,
    averageDaysRemaining: earlyUpgrades.length > 0
      ? earlyUpgrades.reduce((sum, e) => sum + e.remainingDaysAtUpgrade, 0) / earlyUpgrades.length
      : 0
  };
};

export const getMostPopularUpgradePath = () => {
  const analytics = calculateUpgradeAnalytics();
  return analytics.popularUpgradePaths[0] || null;
};

export const getBonusCoinsDistribution = () => {
  const events = getUpgradeEvents();
  const bonusEvents = events.filter(e => e.bonusCoinsAwarded > 0);
  
  const distribution: Record<string, number> = {
    '0': events.filter(e => e.bonusCoinsAwarded === 0).length,
    '1-25': bonusEvents.filter(e => e.bonusCoinsAwarded >= 1 && e.bonusCoinsAwarded <= 25).length,
    '26-50': bonusEvents.filter(e => e.bonusCoinsAwarded >= 26 && e.bonusCoinsAwarded <= 50).length,
    '51-100': bonusEvents.filter(e => e.bonusCoinsAwarded >= 51 && e.bonusCoinsAwarded <= 100).length,
    '100+': bonusEvents.filter(e => e.bonusCoinsAwarded > 100).length,
  };
  
  return distribution;
};

// Generate demo analytics data for testing
export const generateDemoAnalyticsData = () => {
  const demoEvents: UpgradeEvent[] = [];
  const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
  const plans = ['free', 'pro', 'enterprise'];
  
  // Generate 50 random upgrade events over the last 6 months
  for (let i = 0; i < 50; i++) {
    const userId = users[Math.floor(Math.random() * users.length)];
    const fromPlanIndex = Math.floor(Math.random() * 2); // free or pro
    const fromPlan = plans[fromPlanIndex];
    const toPlan = plans[fromPlanIndex + 1]; // upgrade to next tier
    
    const paymentMethod = Math.random() > 0.3 ? 'gateway' : 'coins'; // 70% gateway
    const remainingDays = Math.floor(Math.random() * 28) + 1; // 1-28 days
    const wasEarlyUpgrade = remainingDays > 15;
    
    // Calculate bonus coins based on remaining days
    let bonusCoinsAwarded = 0;
    if (paymentMethod === 'gateway') {
      const coinsPerDay = fromPlan === 'free' ? 3 : 5;
      const maxBonus = fromPlan === 'free' ? 100 : 200;
      bonusCoinsAwarded = Math.min(remainingDays * coinsPerDay, maxBonus);
    }
    
    const timestamp = new Date(Date.now() - Math.random() * 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const event: UpgradeEvent = {
      id: `demo_${i}`,
      userId,
      timestamp,
      fromPlan,
      toPlan,
      paymentMethod,
      remainingDaysAtUpgrade: remainingDays,
      bonusCoinsAwarded,
      bonusRuleUsed: paymentMethod === 'gateway' ? `rule_${fromPlan}_${toPlan}` : undefined,
      wasEarlyUpgrade,
      upgradeValue: fromPlan === 'free' ? 9 : 20
    };
    
    demoEvents.push(event);
  }
  
  localStorage.setItem('upgrade_analytics_events', JSON.stringify(demoEvents));
  console.log('Generated demo analytics data:', demoEvents.length, 'events');
};

// Clear analytics data
export const clearAnalyticsData = () => {
  localStorage.removeItem('upgrade_analytics_events');
  console.log('Analytics data cleared');
};
