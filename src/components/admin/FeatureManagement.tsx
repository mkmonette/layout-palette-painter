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
import { SubscriptionPlan, AVAILABLE_FEATURES, FeatureLimit } from '@/types/subscription';

interface FeatureListProps {
  features: FeatureLimit[];
  onUpdateFeature: (featureId: string, value: number | boolean) => void;
  onNumberInputChange: (featureId: string, inputValue: string) => void;
}

interface FeatureItemProps {
  feature: FeatureLimit;
  initialValue: number | boolean;
  onUpdateFeature: (featureId: string, value: number | boolean) => void;
  onNumberInputChange: (featureId: string, inputValue: string) => void;
}

const FeatureManagement = () => {
  const { plans, updatePlans } = useEnhancedSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan>>({});
  
  // Separate state for features to prevent modal re-renders
  const [editingFeatures, setEditingFeatures] = useState<Record<string, boolean | number>>({});

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({...plan});
    setEditingFeatures(plan.features || {});
    setIsEditModalOpen(true);
  };

  const handleCreatePlan = () => {
    const initialFeatures = Object.fromEntries(
      AVAILABLE_FEATURES.map(feature => [
        feature.id, 
        feature.type === 'boolean' ? false : 0
      ])
    );
    
    setEditingPlan({
      name: '',
      price: 0,
      interval: 'month',
      description: '',
      status: 'draft'
    });
    setEditingFeatures(initialFeatures);
    setIsCreateModalOpen(true);
  };

  const savePlan = React.useCallback(() => {
    console.log('💾 savePlan called - start');
    
    if (!editingPlan.name) {
      console.log('💾 savePlan - no name, returning');
      return;
    }
    
    console.log('💾 savePlan - editingPlan:', editingPlan);
    console.log('💾 savePlan - editingFeatures:', editingFeatures);
    
    // Create the new plan object first
    const newPlan: SubscriptionPlan = {
      id: editingPlan.id || `plan_${Date.now()}`,
      name: editingPlan.name,
      price: editingPlan.price || 0,
      interval: editingPlan.interval || 'month',
      description: editingPlan.description || '',
      features: { ...editingFeatures }, // Clone to avoid reference issues
      status: editingPlan.status || 'draft',
      subscribers: editingPlan.subscribers || 0,
      revenue: editingPlan.revenue || 0
    };

    console.log('💾 savePlan - newPlan created:', newPlan);

    const updatedPlans = editingPlan.id 
      ? plans.map(p => p.id === editingPlan.id ? newPlan : p)
      : [...plans, newPlan];
    
    console.log('💾 savePlan - about to update plans and close modal');
    
    // Close modal immediately to prevent re-renders
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    
    // Then update the data in the background
    setTimeout(() => {
      updatePlans(updatedPlans);
      setEditingPlan({});
      setEditingFeatures({});
      console.log('💾 savePlan - background updates completed');
    }, 0);
    
    console.log('💾 savePlan - modal closed, background updates queued');
  }, [editingPlan, editingFeatures, plans, updatePlans]);

  const deletePlan = (planId: string) => {
    const updatedPlans = plans.filter(p => p.id !== planId);
    updatePlans(updatedPlans);
  };

  const updateFeature = React.useCallback((featureId: string, value: boolean | number) => {
    console.log('🔄 updateFeature called:', featureId, value);
    setEditingFeatures(prev => {
      console.log('📝 setEditingFeatures - prev:', prev);
      const newFeatures = {
        ...prev,
        [featureId]: value
      };
      console.log('📝 setEditingFeatures - new:', newFeatures);
      return newFeatures;
    });
  }, []);

  const handleNumberInputChange = React.useCallback((featureId: string, inputValue: string) => {
    console.log('⌨️ handleNumberInputChange called:', featureId, inputValue);
    // Allow empty string during editing
    if (inputValue === '') {
      updateFeature(featureId, 0);
      return;
    }
    
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      updateFeature(featureId, numValue);
    }
  }, [updateFeature]);

  // Completely stable features reference - no dependencies
  const stableFeatures = React.useMemo(() => AVAILABLE_FEATURES, []);
  
  // Create a ref to hold current feature values without triggering re-renders
  const featuresRef = React.useRef<Record<string, boolean | number>>(editingFeatures);
  React.useEffect(() => {
    featuresRef.current = editingFeatures;
  }, [editingFeatures]);

  console.log('🎭 Main component render - isEditModalOpen:', isEditModalOpen, 'editingPlan.name:', editingPlan.name);

  const getFeatureDisplayValue = (plan: SubscriptionPlan, featureId: string) => {
    const value = plan.features[featureId];
    const feature = AVAILABLE_FEATURES.find(f => f.id === featureId);
    
    if (feature?.type === 'boolean') {
      return value ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-red-600" />;
    } else {
      return value === -1 ? <Infinity className="h-4 w-4 text-blue-600" /> : value;
    }
  };

  // Memoized feature list component - NO dependencies on feature values
  const FeatureList = React.memo<FeatureListProps>(({ features, onUpdateFeature, onNumberInputChange }) => {
    console.log('📋 FeatureList render');
    return (
      <div className="space-y-4">
        {features.map((feature) => (
          <FeatureItem 
            key={feature.id}
            feature={feature}
            initialValue={featuresRef.current[feature.id]}
            onUpdateFeature={onUpdateFeature}
            onNumberInputChange={onNumberInputChange}
          />
        ))}
      </div>
    );
  });

  // Individual feature item with completely isolated state
  const FeatureItem = React.memo<FeatureItemProps>(({ feature, initialValue, onUpdateFeature, onNumberInputChange }) => {
    // Internal state that's completely isolated
    const [currentValue, setCurrentValue] = React.useState(initialValue);
    const [localInputValue, setLocalInputValue] = React.useState(
      initialValue === -1 ? '' : String(initialValue || 0)
    );
    
    // Only sync from parent on initial mount or when explicitly needed
    React.useEffect(() => {
      setCurrentValue(initialValue);
      setLocalInputValue(initialValue === -1 ? '' : String(initialValue || 0));
    }, [feature.id]); // Only depend on feature.id, not initialValue
    
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setLocalInputValue(inputValue); // Update local state immediately
      
      // Parse and update internal value
      if (inputValue === '') {
        setCurrentValue(0);
      } else {
        const numValue = parseInt(inputValue);
        if (!isNaN(numValue) && numValue >= 0) {
          setCurrentValue(numValue);
        }
      }
    }, []);
    
    const handleInputBlur = React.useCallback(() => {
      // Only update parent state on blur
      if (localInputValue === '') {
        onUpdateFeature(feature.id, 0);
        setLocalInputValue('0');
        setCurrentValue(0);
      } else {
        onUpdateFeature(feature.id, currentValue);
      }
    }, [localInputValue, currentValue, feature.id, onUpdateFeature]);
    
    const handleToggleInfinite = React.useCallback(() => {
      const newValue = currentValue === -1 ? 0 : -1;
      setCurrentValue(newValue);
      setLocalInputValue(newValue === -1 ? '' : String(newValue));
      onUpdateFeature(feature.id, newValue);
    }, [currentValue, feature.id, onUpdateFeature]);
    
    console.log('🎯 FeatureItem render:', feature.id, currentValue, 'localValue:', localInputValue);
    
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
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
              checked={currentValue === true}
              onCheckedChange={(checked) => {
                setCurrentValue(checked);
                onUpdateFeature(feature.id, checked);
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={localInputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="0"
                className="w-20"
              />
              <Button
                type="button"
                size="sm"
                variant={currentValue === -1 ? "default" : "outline"}
                onClick={handleToggleInfinite}
              >
                <Infinity className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  });

  const EditPlanModal = React.memo(() => {
    console.log('🎬 EditPlanModal render - isOpen:', isEditModalOpen);
    
    if (!isEditModalOpen) {
      console.log('🎬 EditPlanModal - not open, returning null');
      return null;
    }
    
    return (
      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          console.log('🎬 Dialog onOpenChange:', open);
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Configure plan details and feature access limits.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
          }} className="grid gap-6 py-4">
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
              <FeatureList 
                features={stableFeatures}
                onUpdateFeature={updateFeature}
                onNumberInputChange={handleNumberInputChange}
              />
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              console.log('❌ Cancel clicked');
              React.startTransition(() => {
                setIsEditModalOpen(false);
                setEditingPlan({});
                setEditingFeatures({});
              });
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={(e) => {
              e.preventDefault();
              console.log('💾 Save clicked');
              savePlan();
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

  const CreatePlanModal = React.memo(() => {
    const currentFeatures = editingPlan.features || {};
    
    if (!isCreateModalOpen) return null;
    
    return (
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Configure plan details and feature access limits.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
          }} className="grid gap-6 py-4">
            {/* Basic Plan Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-name">Plan Name</Label>
                <Input 
                  id="create-name"
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Pro, Enterprise"
                />
              </div>
              <div>
                <Label htmlFor="create-price">Price</Label>
                <Input 
                  id="create-price"
                  type="number"
                  value={editingPlan.price || 0}
                  onChange={(e) => setEditingPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="9.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-interval">Billing Interval</Label>
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
                <Label htmlFor="create-status">Status</Label>
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
              <Label htmlFor="create-description">Description</Label>
              <Textarea 
                id="create-description"
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
                  <div key={`create-${feature.id}`} className="flex items-center justify-between p-4 border rounded-lg">
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
                          checked={currentFeatures[feature.id] === true}
                          onCheckedChange={(checked) => updateFeature(feature.id, checked)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={currentFeatures[feature.id] === -1 ? '' : String(currentFeatures[feature.id] || 0)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleNumberInputChange(feature.id, e.target.value);
                            }}
                            onBlur={(e) => {
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
                            variant={currentFeatures[feature.id] === -1 ? "default" : "outline"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateFeature(feature.id, currentFeatures[feature.id] === -1 ? 0 : -1);
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
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              console.log('❌ Create Cancel clicked');
              React.startTransition(() => {
                setIsCreateModalOpen(false);
                setEditingPlan({});
                setEditingFeatures({});
              });
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={(e) => {
              e.preventDefault();
              console.log('💾 Create Save clicked');
              savePlan();
            }}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

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
                <TableHead>AI Colors</TableHead>
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

      <EditPlanModal />
      <CreatePlanModal />
    </div>
  );
};

export default FeatureManagement;