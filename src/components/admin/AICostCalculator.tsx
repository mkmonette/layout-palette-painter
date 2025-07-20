import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign } from 'lucide-react';

interface ModelPricing {
  [key: string]: number;
}

const AICostCalculator: React.FC = () => {
  const [generations, setGenerations] = useState<number>(1000);
  const [markupPercentage, setMarkupPercentage] = useState<number>(100);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  
  // Model pricing - can be easily replaced with API fetch later
  const [modelPricing, setModelPricing] = useState<ModelPricing>({
    'gpt-4o': 0.01,
    'gpt-4': 0.008,
    'gpt-3.5-turbo': 0.003,
    'claude-3-opus': 0.012,
    'claude-3-sonnet': 0.006,
  });

  const [currentPrice, setCurrentPrice] = useState<number>(modelPricing[selectedModel]);

  // Update current price when model changes
  useEffect(() => {
    setCurrentPrice(modelPricing[selectedModel] || 0);
  }, [selectedModel, modelPricing]);

  // Update model pricing when current price is edited
  const handlePriceChange = (newPrice: number) => {
    setCurrentPrice(newPrice);
    setModelPricing(prev => ({
      ...prev,
      [selectedModel]: newPrice
    }));
  };

  // Calculations
  const baseCost = generations * currentPrice;
  const markupAmount = baseCost * (markupPercentage / 100);
  const totalCost = baseCost + markupAmount;

  const formatCurrency = (amount: number) => `$${amount.toFixed(4)}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            AI Color Generation Cost Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generations">Number of Generations</Label>
              <Input
                id="generations"
                type="number"
                value={generations}
                onChange={(e) => setGenerations(Number(e.target.value) || 0)}
                placeholder="1000"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="markup">Markup Percentage (%)</Label>
              <Input
                id="markup"
                type="number"
                value={markupPercentage}
                onChange={(e) => setMarkupPercentage(Number(e.target.value) || 0)}
                placeholder="100"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(modelPricing).map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Generation (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.0001"
                value={currentPrice}
                onChange={(e) => handlePriceChange(Number(e.target.value) || 0)}
                placeholder="0.0100"
                min="0"
              />
            </div>
          </div>

          {/* Results Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-4 w-4" />
                Cost Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Base Cost</Label>
                  <div className="text-2xl font-bold">{formatCurrency(baseCost)}</div>
                  <div className="text-xs text-muted-foreground">
                    {generations.toLocaleString()} × {formatCurrency(currentPrice)}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Markup Amount</Label>
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(markupAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {markupPercentage}% of base cost
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Total Cost with Markup</Label>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCost)}</div>
                  <div className="text-xs text-muted-foreground">
                    Base + Markup
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Cost per Generation</Label>
                  <div className="font-medium">{formatCurrency(currentPrice)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cost with Markup</Label>
                  <div className="font-medium">{formatCurrency(currentPrice * (1 + markupPercentage / 100))}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Revenue per 1000</Label>
                  <div className="font-medium">{formatCurrency(1000 * currentPrice * (1 + markupPercentage / 100))}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Profit Margin</Label>
                  <div className="font-medium">{markupPercentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICostCalculator;