import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash, 
  Settings,
  Lock,
  Unlock,
  Infinity
} from 'lucide-react';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import { SubscriptionPlan, AVAILABLE_FEATURES } from '@/types/subscription';

const FeatureManagement = () => {
  const { plans, updatePlans } = useEnhancedSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan>>({});

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({...plan});
    setIsEditModalOpen(true);
  };

  const handleCreatePlan = () => {
    setEditingPlan({
      name: '',
      price: 0,
      interval: 'month',
      description: '',
      features: Object.fromEntries(
        AVAILABLE_FEATURES.map(feature => [
          feature.id, 
          feature.type === 'boolean' ? false : 0
        ])
      ),
      status: 'draft'
    });
    setIsCreateModalOpen(true);
  };

  const savePlan = () => {
    if (!editingPlan.name) return;
    
    const newPlan: SubscriptionPlan = {
      id: editingPlan.id || `plan_${Date.now()}`,
      name: editingPlan.name,
      price: editingPlan.price || 0,
      interval: editingPlan.interval || 'month',
      description: editingPlan.description || '',
      features: editingPlan.features || {},
      status: editingPlan.status || 'draft',
      subscribers: editingPlan.subscribers || 0,
      revenue: editingPlan.revenue || 0
    };

    const updatedPlans = editingPlan.id 
      ? plans.map(p => p.id === editingPlan.id ? newPlan : p)
      : [...plans, newPlan];
    
    updatePlans(updatedPlans);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setEditingPlan({});
  };

  const deletePlan = (planId: string) => {
    const updatedPlans = plans.filter(p => p.id !== planId);
    updatePlans(updatedPlans);
  };

  const updateFeature = (featureId: string, value: boolean | number) => {
    setEditingPlan(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: value
      }
    }));
  };

  const handleNumberInputChange = (featureId: string, inputValue: string) => {
    // Allow empty string during editing
    if (inputValue === '') {
      updateFeature(featureId, 0);
      return;
    }
    
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      updateFeature(featureId, numValue);
    }
  };

  const getFeatureDisplayValue = (plan: SubscriptionPlan, featureId: string) => {
    const value = plan.features[featureId];
    const feature = AVAILABLE_FEATURES.find(f => f.id === featureId);
    
    if (feature?.type === 'boolean') {
      return value ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-red-600" />;
    } else {
      return value === -1 ? <Infinity className="h-4 w-4 text-blue-600" /> : value;
    }
  };

  const PlanEditModal = ({ isCreate = false }) => (
    <Dialog open={isCreate ? isCreateModalOpen : isEditModalOpen} onOpenChange={isCreate ? setIsCreateModalOpen : setIsEditModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create New Plan' : 'Edit Subscription Plan'}</DialogTitle>
          <DialogDescription>
            Configure plan details and feature access limits.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Plan Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input 
                id="name"
                value={editingPlan.name || ''}
                onChange={(e) => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Pro, Enterprise"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price"
                type="number"
                value={editingPlan.price || 0}
                onChange={(e) => setEditingPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="9.99"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interval">Billing Interval</Label>
              <Select 
                value={editingPlan.interval} 
                onValueChange={(value: 'month' | 'year') => setEditingPlan(prev => ({ ...prev, interval: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editingPlan.status} 
                onValueChange={(value: 'active' | 'deprecated' | 'draft') => setEditingPlan(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={editingPlan.description || ''}
              onChange={(e) => setEditingPlan(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the plan"
            />
          </div>

          {/* Feature Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Feature Configuration</h3>
            <div className="space-y-4">
              {AVAILABLE_FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {feature.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.type === 'boolean' ? (
                      <Switch
                        checked={editingPlan.features?.[feature.id] === true}
                        onCheckedChange={(checked) => updateFeature(feature.id, checked)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={editingPlan.features?.[feature.id] === -1 ? '' : String(editingPlan.features?.[feature.id] || 0)}
                          onChange={(e) => handleNumberInputChange(feature.id, e.target.value)}
                          onBlur={(e) => {
                            // Ensure we have a valid number on blur
                            if (e.target.value === '') {
                              updateFeature(feature.id, 0);
                            }
                          }}
                          placeholder="0"
                          className="w-20"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant={editingPlan.features?.[feature.id] === -1 ? "default" : "outline"}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFeature(feature.id, editingPlan.features?.[feature.id] === -1 ? 0 : -1);
                          }}
                        >
                          <Infinity className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setIsEditModalOpen(false);
            setIsCreateModalOpen(false);
            setEditingPlan({});
          }}>
            Cancel
          </Button>
          <Button onClick={savePlan}>
            {isCreate ? 'Create Plan' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Plans Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Subscription Plans & Features</CardTitle>
              <CardDescription>
                Manage subscription plans and configure feature access limits
              </CardDescription>
            </div>
            <Button onClick={handleCreatePlan}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Pro Templates</TableHead>
                <TableHead>AI Generations</TableHead>
                <TableHead>Saved Palettes</TableHead>
                <TableHead>Downloads/Day</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {plan.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.subscribers}</TableCell>
                  <TableCell>{getFeatureDisplayValue(plan, 'pro_templates')}</TableCell>
                  <TableCell>{getFeatureDisplayValue(plan, 'ai_generations_per_month')}</TableCell>
                  <TableCell>{getFeatureDisplayValue(plan, 'saved_palettes')}</TableCell>
                  <TableCell>{getFeatureDisplayValue(plan, 'downloads_per_day')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deletePlan(plan.id)}
                        disabled={plan.id === 'free'} // Don't allow deleting free plan
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PlanEditModal isCreate={false} />
      <PlanEditModal isCreate={true} />
    </div>
  );
};

export default FeatureManagement;