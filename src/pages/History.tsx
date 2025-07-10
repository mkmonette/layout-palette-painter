import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Calendar,
  Palette,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';
import { GeneratedPalette } from '@/types/generator';
import { getFilteredPaletteHistory, getAdminSettings, clearPaletteHistory } from '@/utils/autoGenerator';
import { useToast } from '@/hooks/use-toast';

const History = () => {
  const [palettes, setPalettes] = useState<GeneratedPalette[]>([]);
  const [filteredPalettes, setFilteredPalettes] = useState<GeneratedPalette[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortPalettes();
  }, [palettes, searchTerm, templateFilter, sortBy]);

  const loadHistory = () => {
    const settings = getAdminSettings();
    const history = getFilteredPaletteHistory(settings.retentionDays);
    setPalettes(history);
  };

  const filterAndSortPalettes = () => {
    let filtered = [...palettes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        palette =>
          palette.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          palette.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          palette.colors.some(color => color.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Template filter
    if (templateFilter !== 'all') {
      filtered = filtered.filter(palette => palette.templateId === templateFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'template':
          return a.templateName.localeCompare(b.templateName);
        default:
          return 0;
      }
    });

    setFilteredPalettes(filtered);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all palette history? This action cannot be undone.')) {
      clearPaletteHistory();
      setPalettes([]);
      toast({
        title: "History Cleared",
        description: "All palette history has been removed.",
      });
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(palettes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `palette-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: "Palette history has been downloaded as JSON.",
    });
  };

  const uniqueTemplates = Array.from(new Set(palettes.map(p => p.templateId)));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <HistoryIcon className="h-8 w-8 text-primary" />
              Palette History
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage all generated color palettes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadHistory}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportHistory} disabled={palettes.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="destructive" onClick={handleClearHistory} disabled={palettes.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{palettes.length}</p>
                  <p className="text-sm text-muted-foreground">Total Palettes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{uniqueTemplates.length}</p>
                  <p className="text-sm text-muted-foreground">Templates Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{filteredPalettes.length}</p>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search by template, ID, or color..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={templateFilter} onValueChange={setTemplateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All templates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    {uniqueTemplates.map(templateId => {
                      const palette = palettes.find(p => p.templateId === templateId);
                      return (
                        <SelectItem key={templateId} value={templateId}>
                          {palette?.templateName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="template">Template Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredPalettes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Palettes Found</h3>
              <p className="text-muted-foreground">
                {palettes.length === 0 
                  ? "No palettes have been generated yet. Use the AutoGenerator to create some!"
                  : "No palettes match your current filters. Try adjusting your search criteria."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Palette History ({filteredPalettes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPalettes.map((palette) => (
                  <div key={palette.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {palette.templateName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(palette.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-8 rounded border cursor-pointer group relative"
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/20 rounded flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs font-mono">{color}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        ID: {palette.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(palette.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;