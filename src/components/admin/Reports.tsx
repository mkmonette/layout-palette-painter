import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Download,
  Calendar as CalendarIcon,
  Users,
  Palette,
  FileImage,
  TrendingUp,
  Search,
  Filter,
  AlertCircle,
  MessageSquare,
  BarChart3,
  PieChart,
  FileText,
  Mail
} from 'lucide-react';

export function Reports() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [userLookupEmail, setUserLookupEmail] = useState('');

  // Mock data - replace with real data fetching
  const monthlyStats = {
    newUsers: 1250,
    palettesGenerated: 8450,
    pdfExports: 3200,
    pngExports: 1850,
    avgPalettesPerUser: 6.8,
    topMoods: ['Energetic', 'Calm', 'Bold', 'Minimalist'],
    topTemplates: ['Modern Clean', 'Creative Agency', 'Startup Landing']
  };

  const featureUsage = [
    { feature: 'Auto Generate', usage: 4200, percentage: 35 },
    { feature: 'AI Colors', usage: 3600, percentage: 30 },
    { feature: 'Manual Generation', usage: 2400, percentage: 20 },
    { feature: 'Studio Settings', usage: 1800, percentage: 15 }
  ];

  const savedPalettes = [
    { id: 1, name: 'Ocean Breeze', saves: 156, hexCodes: ['#0077BE', '#7FB069', '#FFFFFF'] },
    { id: 2, name: 'Sunset Vibes', saves: 142, hexCodes: ['#FF6B35', '#F7931E', '#FFD23F'] },
    { id: 3, name: 'Forest Calm', saves: 98, hexCodes: ['#2D5016', '#7FB069', '#C7D59F'] }
  ];

  const exportActivity = [
    { date: '2024-01-15', pdfCount: 125, pngCount: 78, template: 'Modern Clean' },
    { date: '2024-01-14', pdfCount: 98, pngCount: 65, template: 'Creative Agency' },
    { date: '2024-01-13', pdfCount: 156, pngCount: 89, template: 'Startup Landing' }
  ];

  const errorLogs = [
    { id: 1, type: 'Export Failed', message: 'PDF generation timeout', timestamp: '2024-01-15 14:30', severity: 'high' },
    { id: 2, type: 'API Error', message: 'OpenAI rate limit exceeded', timestamp: '2024-01-15 12:15', severity: 'medium' }
  ];

  const feedback = [
    { id: 1, user: 'user@example.com', message: 'Love the new AI feature!', timestamp: '2024-01-15 10:30', rating: 5 },
    { id: 2, user: 'designer@studio.com', message: 'Export is sometimes slow', timestamp: '2024-01-14 16:45', rating: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download All Reports
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Schedule Email Summary
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="palettes">Saved Palettes</TabsTrigger>
          <TabsTrigger value="exports">Export Activity</TabsTrigger>
          <TabsTrigger value="filters">Custom Filters</TabsTrigger>
          <TabsTrigger value="lookup">User Lookup</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.newUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Palettes Generated</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.palettesGenerated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PDF Exports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.pdfExports.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PNG Exports</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.pngExports.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Moods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyStats.topMoods.map((mood, index) => (
                    <div key={mood} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{mood}</span>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Used Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyStats.topTemplates.map((template, index) => (
                    <div key={template} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{template}</span>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Monthly Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Feature Usage Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsage.map((item) => (
                  <div key={item.feature} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.feature}</span>
                      <span className="text-muted-foreground">{item.usage.toLocaleString()} uses ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Feature Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="palettes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Saved Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Palette Name</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Saves</TableHead>
                    <TableHead>Top Colors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedPalettes.map((palette) => (
                    <TableRow key={palette.id}>
                      <TableCell className="font-medium">{palette.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {palette.hexCodes.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{palette.saves}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {palette.hexCodes.map((color, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>PDF Exports</TableHead>
                    <TableHead>PNG Exports</TableHead>
                    <TableHead>Most Exported Template</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.pdfCount}</TableCell>
                      <TableCell>{activity.pngCount}</TableCell>
                      <TableCell>{activity.template}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Custom Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Plan Type</Label>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="User ID, email, mood, or hex..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lookup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Report Lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter user ID or email..."
                  value={userLookupEmail}
                  onChange={(e) => setUserLookupEmail(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Lookup
                </Button>
              </div>

              {userLookupEmail && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Palettes Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">47</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Time in Studio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12h 34m</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Last Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">2024-01-15 14:30</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Exports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">23</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorLogs.map((error) => (
                    <div key={error.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={error.severity === 'high' ? 'destructive' : 'secondary'}>
                          {error.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{error.timestamp}</span>
                      </div>
                      <p className="text-sm">{error.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  User Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.user}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm">{item.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}