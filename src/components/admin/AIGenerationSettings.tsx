import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Brain, Users, RotateCcw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

interface AISettings {
  enabled: boolean;
}

interface UserUsage {
  userId: string;
  username: string;
  plan: string;
  used: number;
  limit: number;
  resetDate: string;
}

const AIGenerationSettings = () => {
  const [settings, setSettings] = useState<AISettings>({
    enabled: true
  });
  
  const [userUsage] = useState<UserUsage[]>([
    {
      userId: '1',
      username: 'john@example.com',
      plan: 'PRO',
      used: 23,
      limit: 50,
      resetDate: '2024-02-01'
    },
    {
      userId: '2',
      username: 'sarah@example.com',
      plan: 'PRO Annual',
      used: 8,
      limit: 50,
      resetDate: '2024-02-01'
    },
    {
      userId: '3',
      username: 'mike@example.com',
      plan: 'PRO',
      used: 50,
      limit: 50,
      resetDate: '2024-02-01'
    }
  ]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('ai_generation_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('ai_generation_settings', JSON.stringify(settings));
    toast.success('AI generation settings saved successfully');
  };

  const handleResetAllUsage = () => {
    // In a real app, this would make an API call
    toast.success('All user AI usage has been reset');
  };

  const handleResetUserUsage = (userId: string, username: string) => {
    // In a real app, this would make an API call
    toast.success(`AI usage reset for ${username}`);
  };

  return (
    <div className="space-y-6">
      {/* AI Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            AI Generation Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable AI Generation</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI-powered color generation for eligible users. Limits are configured per subscription plan.
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> AI generation limits are configured in the "Plans" tab under each subscription plan's features. 
              This setting only controls whether AI generation is globally enabled or disabled.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            AI Usage Management
          </CardTitle>
          <Button 
            onClick={handleResetAllUsage}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Usage
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reset Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userUsage.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.used}/{user.limit}
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(user.used / user.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.used >= user.limit ? (
                        <Badge variant="destructive">Limit Reached</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.resetDate}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetUserUsage(user.userId, user.username)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Generation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Total Generations This Month</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">23</div>
              <div className="text-sm text-muted-foreground">Active PRO Users</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">6.8</div>
              <div className="text-sm text-muted-foreground">Avg Generations per User</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Users at Limit</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGenerationSettings;