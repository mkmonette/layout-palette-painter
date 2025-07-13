import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import { SubscriptionPlan } from '@/types/subscription';
import { TestTube, RotateCcw } from 'lucide-react';

interface TestPlanSwitcherProps {
  className?: string;
}

export const TestPlanSwitcher: React.FC<TestPlanSwitcherProps> = ({ className }) => {
  const { 
    currentPlan, 
    plans, 
    setTestPlanOverride, 
    clearTestPlanOverride, 
    testPlanOverride 
  } = useEnhancedSubscription();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setTestPlanOverride(plan);
    }
  };

  const handleClearOverride = () => {
    clearTestPlanOverride();
  };

  return (
    <Card className={`border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <TestTube className="h-4 w-4" />
          Test Plan Switcher
          <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
            DEV ONLY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-orange-700 dark:text-orange-300">
            Simulate Plan:
          </label>
          <Select value={currentPlan?.id || ''} onValueChange={handlePlanChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select a plan to test" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id} className="text-xs">
                  {plan.name} {plan.price > 0 && `($${plan.price}/${plan.interval})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {testPlanOverride && (
          <div className="space-y-2">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Currently Testing: 
              <Badge variant="secondary" className="ml-1 text-xs">
                {currentPlan?.name} Plan
              </Badge>
            </div>
            <Button
              onClick={handleClearOverride}
              size="sm"
              variant="outline"
              className="h-7 text-xs border-orange-300 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to Default
            </Button>
          </div>
        )}

        <div className="text-xs text-orange-600/70 dark:text-orange-400/70">
          💡 This override is temporary and only affects the UI for testing.
        </div>
      </CardContent>
    </Card>
  );
};