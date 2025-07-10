
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '12 FREE templates',
        'Basic color generation',
        'Standard color moods',
        'Live preview',
        'Export color codes'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'PRO',
      price: '$9',
      period: 'per month',
      description: 'For professional designers',
      features: [
        'All FREE features',
        '50+ PRO templates',
        'Advanced AI generation',
        'Premium color moods',
        'Custom brand colors',
        'Priority support',
        'Export to Figma/Sketch'
      ],
      cta: 'Upgrade to PRO',
      popular: true
    },
    {
      name: 'ENTERPRISE',
      price: '$29',
      period: 'per month',
      description: 'For teams and agencies',
      features: [
        'All PRO features',
        'Team collaboration',
        'Brand guideline generator',
        'API access',
        'Custom templates',
        'White-label option',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'PRO' && <Crown className="h-4 w-4 mr-2" />}
                  {plan.name === 'FREE' && <Zap className="h-4 w-4 mr-2" />}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
