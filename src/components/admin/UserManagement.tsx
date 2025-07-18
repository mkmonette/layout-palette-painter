
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Ban, 
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit user functionality
  };

  const handleSuspendUser = (userId: number) => {
    console.log('Suspend user:', userId);
    // TODO: Implement suspend user functionality
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
    // TODO: Implement delete user functionality
  };

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      subscription: "Pro",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      coins: 1250
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      status: "active",
      subscription: "Basic",
      joinDate: "2024-02-10",
      lastActive: "1 day ago",
      coins: 850
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "suspended",
      subscription: "None",
      joinDate: "2024-01-05",
      lastActive: "1 week ago",
      coins: 0
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      status: "active",
      subscription: "Enterprise",
      joinDate: "2023-12-20",
      lastActive: "5 minutes ago",
      coins: 3500
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'Pro':
        return <Badge className="bg-blue-100 text-blue-800">Pro</Badge>;
      case 'Basic':
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>;
      case 'Enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Bulk Email
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {user.coins.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
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
    </div>
  );
};

export default UserManagement;
