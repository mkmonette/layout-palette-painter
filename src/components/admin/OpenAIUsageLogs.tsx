import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Trash2, Filter, Calendar } from 'lucide-react';
import { getTokenUsageLogs, clearTokenUsageLogs, exportLogsToCSV, TokenUsageLog } from '@/utils/tokenUsageLogger';
import { useToast } from '@/hooks/use-toast';

const OpenAIUsageLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<TokenUsageLog[]>(getTokenUsageLogs());
  const [filterUserId, setFilterUserId] = useState('');
  const [filterGenerationType, setFilterGenerationType] = useState('all');
  const [sortBy, setSortBy] = useState<keyof TokenUsageLog>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs;

    if (filterUserId) {
      filtered = filtered.filter(log => 
        log.user_id.toLowerCase().includes(filterUserId.toLowerCase())
      );
    }

    if (filterGenerationType !== 'all') {
      filtered = filtered.filter(log => log.generation_type === filterGenerationType);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [logs, filterUserId, filterGenerationType, sortBy, sortOrder]);

  const totalStats = useMemo(() => {
    const total = filteredAndSortedLogs.reduce((acc, log) => ({
      tokens: acc.tokens + log.total_tokens,
      cost: acc.cost + (log.estimated_cost || 0),
      requests: acc.requests + 1
    }), { tokens: 0, cost: 0, requests: 0 });

    return total;
  }, [filteredAndSortedLogs]);

  const uniqueGenerationTypes = useMemo(() => {
    return Array.from(new Set(logs.map(log => log.generation_type)));
  }, [logs]);

  const handleSort = (column: keyof TokenUsageLog) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleClearLogs = () => {
    clearTokenUsageLogs();
    setLogs([]);
    toast({
      title: "Logs cleared",
      description: "All OpenAI usage logs have been deleted.",
    });
  };

  const handleExport = () => {
    exportLogsToCSV(filteredAndSortedLogs);
    toast({
      title: "Export started",
      description: "CSV file download will begin shortly.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCost = (cost?: number) => {
    return cost ? `$${cost.toFixed(6)}` : '$0.000000';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.requests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.tokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCost(totalStats.cost)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            OpenAI Usage Logs
          </CardTitle>
          <CardDescription>
            Track and monitor OpenAI API usage across all generations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Filter by User ID..."
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
              />
            </div>
            <Select value={filterGenerationType} onValueChange={setFilterGenerationType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Generation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueGenerationTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleClearLogs} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('user_id')}
                  >
                    User ID {sortBy === 'user_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('generation_type')}
                  >
                    Type {sortBy === 'generation_type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('model')}
                  >
                    Model {sortBy === 'model' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('total_tokens')}
                  >
                    Tokens {sortBy === 'total_tokens' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('estimated_cost')}
                  >
                    Cost {sortBy === 'estimated_cost' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('timestamp')}
                  >
                    Timestamp {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No usage logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.user_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.generation_type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.model}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{log.total_tokens}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.prompt_tokens}p + {log.completion_tokens}c
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatCost(log.estimated_cost)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(log.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAIUsageLogs;