import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';

export const useFeatureAccess = () => {
  const { 
    currentPlan, 
    hasFeatureAccess, 
    getFeatureLimit, 
    getUsageRemaining 
  } = useEnhancedSubscription();

  return {
    // Pro Templates
    canAccessProTemplates: hasFeatureAccess('pro_templates'),
    
    // Saved Palettes
    maxSavedPalettes: getFeatureLimit('saved_palettes'),
    remainingSavedPalettes: getUsageRemaining('saved_palettes'),
    canSaveMorePalettes: getUsageRemaining('saved_palettes') > 0,
    
    // Downloads
    maxDownloadsPerDay: getFeatureLimit('downloads_per_day'),
    remainingDownloads: getUsageRemaining('downloads_per_day'),
    canDownload: getUsageRemaining('downloads_per_day') > 0,
    
    // Branded Reports
    canAccessBrandedReports: hasFeatureAccess('branded_reports'),
    
    // Auto Generator
    canAccessAutoGenerator: hasFeatureAccess('auto_generator'),
    
    // AI Generations
    maxAIGenerationsPerMonth: getFeatureLimit('ai_generations_per_month'),
    remainingAIGenerations: getUsageRemaining('ai_generations_per_month'),
    canUseAIGeneration: hasFeatureAccess('auto_generator') && getUsageRemaining('ai_generations_per_month') > 0,
    
    // Custom Color Schemes
    canAccessColorSchemes: hasFeatureAccess('custom_color_schemes'),
    
    // Color Mood Options
    canAccessColorMood: hasFeatureAccess('color_mood_options'),
    
    // Dark Mode (separated for dashboard vs templates)
    canAccessTemplateDarkMode: hasFeatureAccess('template_dark_mode'),
    
    // Current plan info
    currentPlan,
    isPro: currentPlan?.id !== 'free',
    planName: currentPlan?.name || 'Free'
  };
};