export interface FeatureLimit {
  id: string;
  name: string;
  type: 'boolean' | 'number';
  description: string;
  category: 'access' | 'usage';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: Record<string, boolean | number>;
  status: 'active' | 'deprecated' | 'draft';
  subscribers: number;
  revenue: number;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: Date;
  usage: Record<string, number>;
}

export const AVAILABLE_FEATURES: FeatureLimit[] = [
  {
    id: 'pro_templates',
    name: 'Pro Templates',
    type: 'boolean',
    description: 'Access to premium design templates',
    category: 'access'
  },
  {
    id: 'saved_palettes',
    name: 'Saved Palettes',
    type: 'number',
    description: 'Maximum number of color palettes that can be saved',
    category: 'usage'
  },
  {
    id: 'downloads_per_day',
    name: 'Downloads per Day',
    type: 'number',
    description: 'Maximum number of downloads allowed per day',
    category: 'usage'
  },
  {
    id: 'branded_reports',
    name: 'Branded Professional Reports',
    type: 'boolean',
    description: 'Access to professional branded PDF reports',
    category: 'access'
  },
  {
    id: 'auto_generator',
    name: 'Auto Generator',
    type: 'boolean',
    description: 'Access to AI-powered automatic color generation',
    category: 'access'
  },
  {
    id: 'custom_color_schemes',
    name: 'Custom Color Schemes',
    type: 'boolean',
    description: 'Access to advanced color scheme customization',
    category: 'access'
  },
  {
    id: 'color_mood_options',
    name: 'Color Mood Options',
    type: 'boolean',
    description: 'Access to mood-based color selection',
    category: 'access'
  },
  {
    id: 'dark_mode',
    name: 'Dark Mode',
    type: 'boolean',
    description: 'Access to dark theme interface',
    category: 'access'
  },
  {
    id: 'ai_generations_per_month',
    name: 'AI Colors per Month',
    type: 'number',
    description: 'Maximum number of AI-powered color generations per month',
    category: 'usage'
  }
];