import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Download, Search, Filter, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  userEmail: string;
  userName: string;
  gateway: 'PayPal' | 'LemonSqueezy';
  planName?: string;
  amount: number;
  currency: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  date: Date;
  receiptUrl?: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN_001',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    gateway: 'PayPal',
    planName: 'Pro Monthly',
    amount: 19.99,
    currency: 'USD',
    status: 'Successful',
    date: new Date('2024-01-15'),
    receiptUrl: 'https://example.com/receipt/1'
  },
  {
    id: 'TXN_002',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    gateway: 'LemonSqueezy',
    planName: 'Enterprise Annual',
    amount: 199.99,
    currency: 'USD',
    status: 'Successful',
    date: new Date('2024-01-14'),
  },
  {
    id: 'TXN_003',
    userEmail: 'failed.user@example.com',
    userName: 'Failed User',
    gateway: 'PayPal',
    planName: 'Basic Monthly',
    amount: 9.99,
    currency: 'USD',
    status: 'Failed',
    date: new Date('2024-01-13'),
  },
  {
    id: 'TXN_004',
    userEmail: 'refund.user@example.com',
    userName: 'Refund User',
    gateway: 'LemonSqueezy',
    planName: 'Pro Monthly',
    amount: 19.99,
    currency: 'USD',
    status: 'Refunded',
    date: new Date('2024-01-12'),
  },
  {
    id: 'TXN_005',
    userEmail: 'pending.user@example.com',
    userName: 'Pending User',
    gateway: 'PayPal',
    planName: 'Pro Monthly',
    amount: 19.99,
    currency: 'USD',
    status: 'Pending',
    date: new Date('2024-01-11'),
  }
];

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'Successful':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'Failed':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'Refunded':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const TransactionManagement = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Apply filters
  React.useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    // Gateway filter
    if (gatewayFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.gateway === gatewayFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((transaction) => transaction.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((transaction) => transaction.date <= dateTo);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, gatewayFilter, dateFrom, dateTo, transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const exportCSV = () => {
    const headers = ['Transaction ID', 'User Email', 'User Name', 'Gateway', 'Plan', 'Amount', 'Currency', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.userEmail,
        t.userName,
        t.gateway,
        t.planName || 'N/A',
        t.amount,
        t.currency,
        t.status,
        format(t.date, 'yyyy-MM-dd HH:mm:ss')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.status === 'Successful').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {transactions.filter(t => t.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${transactions
                .filter(t => t.status === 'Successful')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Successful">Successful</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="LemonSqueezy">LemonSqueezy</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.userName}</div>
                        <div className="text-sm text-muted-foreground">{transaction.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.gateway}</Badge>
                    </TableCell>
                    <TableCell>{transaction.planName || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(transaction.date, 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      {transaction.receiptUrl ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={transaction.receiptUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;