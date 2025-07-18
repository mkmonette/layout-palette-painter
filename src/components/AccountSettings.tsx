import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, ExternalLink, Crown, Shield, Trash2, Github, Chrome, Unlink, Link } from 'lucide-react';

interface SubscriptionInfo {
  plan: string;
  status: string;
  nextBilling?: string;
  amount?: string;
}

interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
  connectedAt: string;
  icon: React.ElementType;
}

const AccountSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    plan: 'Free',
    status: 'Active'
  });
  
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      provider: 'Google',
      email: 'john.doe@gmail.com',
      connectedAt: '2024-01-15',
      icon: Chrome
    },
    {
      id: '2',
      provider: 'GitHub',
      email: 'john.doe@users.noreply.github.com',
      connectedAt: '2024-01-10',
      icon: Github
    }
  ]);

  const { toast } = useToast();

  const handleUpgradePlan = async () => {
    setIsLoading(true);
    try {
      // Navigate to checkout page
      window.location.href = '/checkout';
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Unable to navigate to checkout page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with Stripe customer portal
      toast({
        title: "Stripe Integration Required",
        description: "Please set up Stripe integration to access billing portal.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectAccount = async (accountId: string, provider: string) => {
    try {
      // Simulate disconnecting account
      setConnectedAccounts(prev => prev.filter(account => account.id !== accountId));
      toast({
        title: "Account Disconnected",
        description: `Successfully disconnected your ${provider} account.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to disconnect ${provider} account.`,
        variant: "destructive"
      });
    }
  };

  const handleConnectAccount = (provider: string) => {
    // Simulate connecting a new account
    toast({
      title: "Connect Account",
      description: `Redirecting to ${provider} for authentication...`,
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate account deletion process
      toast({
        title: "Account Deletion Request",
        description: "Account deletion request has been submitted. You will receive an email with further instructions.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process account deletion request.",
        variant: "destructive"
      });
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
      case 'premium':
        return 'default';
      case 'enterprise':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
      case 'premium':
        return Crown;
      case 'enterprise':
        return Shield;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and account preferences.
        </p>
      </div>

      {/* Subscription Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Subscription Plan
            {(() => {
              const PlanIcon = getPlanIcon(subscriptionInfo.plan);
              return PlanIcon ? <PlanIcon className="w-5 h-5" /> : null;
            })()}
          </CardTitle>
          <CardDescription>
            Manage your current subscription and billing preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Current Plan:</span>
                <Badge variant={getPlanBadgeVariant(subscriptionInfo.plan)}>
                  {subscriptionInfo.plan}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Status: {subscriptionInfo.status}
              </p>
              {subscriptionInfo.nextBilling && (
                <p className="text-sm text-muted-foreground">
                  Next billing: {subscriptionInfo.nextBilling}
                </p>
              )}
              {subscriptionInfo.amount && (
                <p className="text-sm text-muted-foreground">
                  Amount: {subscriptionInfo.amount}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {subscriptionInfo.plan === 'Free' ? (
                <Button onClick={handleUpgradePlan} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleUpgradePlan} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Change Plan'
                  )}
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Plan Features */}
          <div className="space-y-2">
            <h4 className="font-medium">Plan Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {subscriptionInfo.plan === 'Free' ? (
                <>
                  <li>• Basic color generation</li>
                  <li>• 5 templates included</li>
                  <li>• Standard support</li>
                </>
              ) : subscriptionInfo.plan === 'Pro' ? (
                <>
                  <li>• Advanced color generation</li>
                  <li>• 20+ premium templates</li>
                  <li>• Priority support</li>
                  <li>• Export capabilities</li>
                </>
              ) : (
                <>
                  <li>• All Pro features</li>
                  <li>• Unlimited templates</li>
                  <li>• Team collaboration</li>
                  <li>• API access</li>
                  <li>• White-label options</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing history.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionInfo.plan === 'Free' ? (
            <div className="text-center py-6">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No billing information on file</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to a paid plan to add payment methods
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/28</p>
                  </div>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleManageBilling}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Billing
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your linked external accounts and services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedAccounts.length > 0 ? (
            <div className="space-y-3">
              {connectedAccounts.map((account) => {
                const IconComponent = account.icon;
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{account.provider}</p>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Connected on {new Date(account.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.id, account.provider)}
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Link className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No connected accounts</p>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Connect New Account</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnectAccount('Google')}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnectAccount('GitHub')}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all of your data from our servers including:
                    <br />
                    <br />
                    • All your saved color palettes
                    <br />
                    • Custom templates and designs
                    <br />
                    • Subscription and billing information
                    <br />
                    • Connected account links
                    <br />
                    <br />
                    Please type <strong>DELETE</strong> to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;