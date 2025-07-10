import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';

const PlanSelector = () => {
  const { plans, currentPlan, setCurrentPlan } = useEnhancedSubscription();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Plan Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          {plans.filter(plan => plan.status === 'active').map((plan) => (
            <Button
              key={plan.id}
              variant={currentPlan?.id === plan.id ? "default" : "outline"}
              onClick={() => setCurrentPlan(plan)}
              className="flex flex-col items-start h-auto p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{plan.name}</span>
                {currentPlan?.id === plan.id && <Badge variant="secondary">Current</Badge>}
              </div>
              <span className="text-sm opacity-70">
                {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSelector;