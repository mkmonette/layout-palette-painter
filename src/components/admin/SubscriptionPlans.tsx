
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash, 
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

const SubscriptionPlans = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 9.99,
      interval: "month",
      features: ["5 Projects", "Basic Support", "1GB Storage"],
      subscribers: 234,
      status: "active",
      revenue: 2339.66
    },
    {
      id: 2,
      name: "Pro",
      price: 29.99,
      interval: "month",
      features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"],
      subscribers: 567,
      status: "active",
      revenue: 17004.33
    },
    {
      id: 3,
      name: "Enterprise",
      price: 99.99,
      interval: "month",
      features: ["Everything in Pro", "Custom Integrations", "Unlimited Storage", "24/7 Support"],
      subscribers: 89,
      status: "active",
      revenue: 8899.11
    },
    {
      id: 4,
      name: "Legacy Plan",
      price: 19.99,
      interval: "month",
      features: ["Deprecated Features"],
      subscribers: 12,
      status: "deprecated",
      revenue: 239.88
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'deprecated':
        return <Badge className="bg-yellow-100 text-yellow-800">Deprecated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const CreatePlanModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
          <DialogDescription>
            Add a new subscription plan for your users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Plan name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input id="price" type="number" placeholder="9.99" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="features" className="text-right">
              Features
            </Label>
            <Input id="features" placeholder="Feature 1, Feature 2" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setIsCreateModalOpen(false)}>
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              {plans.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.reduce((sum, plan) => sum + plan.subscribers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${plans.reduce((sum, plan) => sum + plan.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Manage your subscription plans and pricing</CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
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
                        {plan.features.slice(0, 2).join(', ')}
                        {plan.features.length > 2 && '...'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${plan.price}/{plan.interval}</TableCell>
                  <TableCell>{plan.subscribers}</TableCell>
                  <TableCell>${plan.revenue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
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

      <CreatePlanModal />
    </div>
  );
};

export default SubscriptionPlans;
