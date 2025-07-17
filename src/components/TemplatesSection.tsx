import React, { useState, useEffect } from 'react';
import { Plus, Upload, Edit2, Trash2, Play, MoreHorizontal, RefreshCw, Calendar, Badge as BadgeIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useToast } from '@/hooks/use-toast';
import TemplateSelector from '@/components/TemplateSelector';
import { ColorPalette } from '@/utils/colorGenerator';
import { TemplateType, CustomTemplate } from '@/types/template';

interface TemplatesSectionProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  colorPalette: ColorPalette;
}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  selectedTemplate,
  onTemplateChange,
  colorPalette
}) => {
  const { isPro } = useFeatureAccess();
  const { toast } = useToast();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isProUpsellModalOpen, setIsProUpsellModalOpen] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    setCustomTemplates(savedTemplates);
  }, []);

  const fetchFigmaThumbnail = async (fileKey: string, token?: string) => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers["X-Figma-Token"] = token;
      }

      const thumbnailResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}/thumbnail`, {
        headers
      });

      if (thumbnailResponse.ok) {
        const thumbnailData = await thumbnailResponse.json();
        return thumbnailData.thumbnail || '/placeholder.svg';
      }
    } catch (error) {
      console.warn('Failed to fetch Figma thumbnail:', error);
    }
    return '/placeholder.svg';
  };

  const handleFigmaImport = async (fileKey: string, token?: string) => {
    try {
      toast({
        title: "Import Started",
        description: "Your Figma design is being processed. This may take a few moments.",
      });

      // Make request to Figma API
      const headers: HeadersInit = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["X-Figma-Token"] = token;
      }

      const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. Please check your token or make the file public.");
        } else if (response.status === 404) {
          throw new Error("File not found. Please check the file key or URL.");
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Parse design info
      const fileName = data.name || `Figma Design ${customTemplates.length + 1}`;
      
      // Validate that it's a design file
      if (!data.document || !data.document.children) {
        throw new Error("This doesn't appear to be a valid UI design file.");
      }

      // Fetch thumbnail
      const thumbnailUrl = await fetchFigmaThumbnail(fileKey, token);

      // Create new template
      const newTemplate: CustomTemplate = {
        id: `custom-${Date.now()}`,
        name: fileName,
        preview: thumbnailUrl,
        thumbnail: thumbnailUrl,
        figmaFileKey: fileKey,
        createdAt: new Date().toISOString(),
        version: 1,
        layoutData: data.document // Store the layout data
      };

      // Store in localStorage (since no Supabase integration)
      const existingTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const updatedTemplates = [...existingTemplates, newTemplate];
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
      
      // Update state
      setCustomTemplates(prev => [...prev, newTemplate]);
      setIsImportModalOpen(false);
      setFigmaUrl('');
      setFigmaToken('');
      
      toast({
        title: "Import Successful",
        description: `"${fileName}" has been imported as a custom template.`,
      });
      
    } catch (error) {
      console.error('Figma import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import Figma design. Please check your URL and token.",
        variant: "destructive"
      });
    }
  };

  const handleImportSubmit = () => {
    if (!figmaUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Figma file URL or file key.",
        variant: "destructive"
      });
      return;
    }
    
    // Extract file key from URL if it's a full URL
    const fileKey = figmaUrl.includes('figma.com') 
      ? figmaUrl.split('/file/')[1]?.split('/')[0] || figmaUrl
      : figmaUrl;
    
    handleFigmaImport(fileKey, figmaToken);
  };

  const handleRenameTemplate = (templateId: string, newName: string) => {
    const updatedTemplates = customTemplates.map(template => 
      template.id === templateId 
        ? { ...template, name: newName }
        : template
    );
    
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
    setEditingTemplate(null);
    setEditingName('');
    toast({
      title: "Template Renamed",
      description: "Template name has been updated successfully.",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(template => template.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
    toast({
      title: "Template Deleted",
      description: "Custom template has been removed.",
    });
  };

  const startEditing = (template: CustomTemplate) => {
    setEditingTemplate(template.id);
    setEditingName(template.name);
  };

  const handleApplyCustomTemplate = (template: CustomTemplate) => {
    if (!isPro) {
      setIsProUpsellModalOpen(true);
      return;
    }

    try {
      // Apply the custom template
      onTemplateChange(template.id);
      
      // Show success message
      toast({
        title: "Custom Template Applied!",
        description: `Now using "${template.name}" template. Colors will regenerate based on your design.`,
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "There was an error applying this template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async (template: CustomTemplate) => {
    if (!isPro) {
      setIsProUpsellModalOpen(true);
      return;
    }

    try {
      toast({
        title: "Updating Template",
        description: "Fetching latest version from Figma...",
      });

      // Re-fetch from Figma with same file key
      await handleFigmaImport(template.figmaFileKey, figmaToken);
      
      // Remove old version and update with new one
      const updatedTemplates = customTemplates.map(t => 
        t.id === template.id 
          ? { ...t, version: t.version + 1, updatedAt: new Date().toISOString() }
          : t
      );
      
      setCustomTemplates(updatedTemplates);
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));

      toast({
        title: "Template Updated",
        description: `"${template.name}" has been updated to the latest version.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update template from Figma.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="default" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">🟦 Default</TabsTrigger>
          <TabsTrigger value="custom">🟩 Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose from our built-in professional templates.
          </p>
          <TemplateSelector 
            selectedTemplate={selectedTemplate} 
            onTemplateChange={onTemplateChange} 
            colorPalette={colorPalette} 
          />
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          {/* Import Button */}
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => isPro ? setIsImportModalOpen(true) : undefined}
                  disabled={!isPro}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Import from Figma
                </Button>
              </TooltipTrigger>
              {!isPro && (
                <TooltipContent>
                  <p>Custom Templates are only available to Pro users. Upgrade to unlock this feature.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* Custom Templates List */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Your Custom Templates</h4>
            
             {customTemplates.length === 0 ? (
               <div className="text-center py-12 px-4">
                 <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                   <Upload className="h-10 w-10 text-primary/60" />
                 </div>
                 <h3 className="text-lg font-medium mb-2">Bring Your Designs to Life</h3>
                 <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                   Import your Figma designs and watch them transform with intelligent color generation. 
                   Your creativity, enhanced by AI.
                 </p>
                 {!isPro && (
                   <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mt-6 max-w-sm mx-auto">
                     <p className="text-sm font-medium text-primary mb-2">✨ Pro Feature</p>
                     <p className="text-xs text-muted-foreground">
                       Upgrade to Pro to import unlimited Figma templates and apply them to your color generator.
                     </p>
                   </div>
                 )}
               </div>
            ) : (
              <div className="grid gap-3">
                 {customTemplates.map((template) => (
                   <Card key={template.id} className="p-4 hover:bg-muted/30 transition-colors">
                     <div className="flex items-start gap-4">
                       {/* Enhanced Thumbnail Preview */}
                       <div className="relative">
                         <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/60 rounded-lg border flex items-center justify-center overflow-hidden">
                           <img 
                             src={template.thumbnail || template.preview} 
                             alt={template.name}
                             className="w-full h-full object-cover rounded-lg"
                             onError={(e) => {
                               const img = e.target as HTMLImageElement;
                               img.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop&crop=center";
                             }}
                           />
                         </div>
                         {/* Version Badge */}
                         <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-5">
                           v{template.version}
                         </Badge>
                       </div>
                       
                       {/* Template Info */}
                       <div className="flex-1 min-w-0">
                         {editingTemplate === template.id ? (
                           <div className="flex items-center gap-2">
                             <Input
                               value={editingName}
                               onChange={(e) => setEditingName(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   handleRenameTemplate(template.id, editingName);
                                 } else if (e.key === 'Escape') {
                                   setEditingTemplate(null);
                                   setEditingName('');
                                 }
                               }}
                               className="h-8 text-sm"
                               autoFocus
                             />
                             <Button
                               size="sm"
                               onClick={() => handleRenameTemplate(template.id, editingName)}
                               className="h-8 px-2"
                             >
                               Save
                             </Button>
                           </div>
                         ) : (
                           <div className="space-y-1">
                             <h5 className="font-medium text-sm truncate">{template.name}</h5>
                             <div className="flex items-center gap-3 text-xs text-muted-foreground">
                               <div className="flex items-center gap-1">
                                 <Calendar className="h-3 w-3" />
                                 <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                               </div>
                               {template.updatedAt && (
                                 <div className="flex items-center gap-1">
                                   <RefreshCw className="h-3 w-3" />
                                   <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                                 </div>
                               )}
                             </div>
                             {/* Optional: Display tags if they exist */}
                             {template.tags && template.tags.length > 0 && (
                               <div className="flex gap-1 flex-wrap mt-2">
                                 {template.tags.map((tag, index) => (
                                   <Badge key={index} variant="outline" className="text-xs px-1 py-0 h-5">
                                     {tag}
                                   </Badge>
                                 ))}
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                       
                       {/* Action Buttons */}
                       <div className="flex items-center gap-1">
                         {/* Primary Apply Button */}
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <Button
                               size="sm"
                               onClick={() => handleApplyCustomTemplate(template)}
                               disabled={!isPro}
                               className={`h-8 px-3 gap-1 ${!isPro ? 'opacity-50' : ''}`}
                               variant={isPro ? "default" : "secondary"}
                             >
                               <Play className="h-3 w-3" />
                               Apply
                             </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                             {isPro ? 'Apply this template to your color generator' : 'Pro feature - Upgrade to apply custom templates'}
                           </TooltipContent>
                         </Tooltip>

                         {/* More Actions Dropdown */}
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                               <MoreHorizontal className="h-3 w-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuItem onClick={() => startEditing(template)}>
                               <Edit2 className="h-3 w-3 mr-2" />
                               Rename Template
                             </DropdownMenuItem>
                             
                             <DropdownMenuItem 
                               onClick={() => handleUpdateTemplate(template)}
                               disabled={!isPro}
                             >
                               <RefreshCw className="h-3 w-3 mr-2" />
                               Update from Figma
                               {!isPro && <Badge variant="secondary" className="ml-auto text-xs">Pro</Badge>}
                             </DropdownMenuItem>
                             
                             <DropdownMenuSeparator />
                             
                             <DropdownMenuItem 
                               onClick={() => handleDeleteTemplate(template.id)}
                               className="text-destructive focus:text-destructive"
                             >
                               <Trash2 className="h-3 w-3 mr-2" />
                               Delete Template
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </div>
                   </Card>
                 ))}
               </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Figma Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Custom Template from Figma</DialogTitle>
            <DialogDescription>
              Paste a public Figma file URL or file key to import your design layout.
              Optionally, include a Figma personal access token to access private files.
              We don't store your token. It's used only once to access your design and then discarded.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="figma-url">Figma File URL or File Key</Label>
              <Input
                id="figma-url"
                placeholder="https://www.figma.com/file/abc123... or abc123"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="figma-token">Figma Personal Access Token (Optional)</Label>
              <Input
                id="figma-token"
                type="password"
                placeholder="figd_..."
                value={figmaToken}
                onChange={(e) => setFigmaToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Required only for private files. Get your token from Figma Settings → Account → Personal Access Tokens.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportSubmit}>
                Import Design
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pro Upsell Modal */}
      <Dialog open={isProUpsellModalOpen} onOpenChange={setIsProUpsellModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              Custom Templates are only available on the Pro Plan. Upgrade to use your own Figma designs in the color generator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Pro Features Include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Import unlimited Figma designs</li>
                <li>• Apply custom templates to color generation</li>
                <li>• Advanced color generation options</li>
                <li>• Priority support</li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsProUpsellModalOpen(false)}>
                Maybe Later
              </Button>
              <Button onClick={() => {
                setIsProUpsellModalOpen(false);
                // Add upgrade navigation logic here if needed
                toast({
                  title: "Upgrade Available",
                  description: "Contact support to upgrade to Pro plan.",
                });
              }}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesSection;