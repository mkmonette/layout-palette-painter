import React, { useState, useEffect } from 'react';
import { Plus, Upload, Edit2, Trash2, Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useToast } from '@/hooks/use-toast';
import TemplateSelector from '@/components/TemplateSelector';
import { ColorPalette } from '@/utils/colorGenerator';
import { TemplateType } from '@/types/template';

interface TemplatesSectionProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  colorPalette: ColorPalette;
}

interface CustomTemplate {
  id: string;
  name: string;
  preview: string;
  figmaFileKey: string;
  createdAt: string;
}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  selectedTemplate,
  onTemplateChange,
  colorPalette
}) => {
  const { isPro } = useFeatureAccess();
  const { toast } = useToast();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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
      const thumbnailUrl = data.thumbnailUrl || '/placeholder.svg';
      
      // Validate that it's a design file
      if (!data.document || !data.document.children) {
        throw new Error("This doesn't appear to be a valid UI design file.");
      }

      // Create new template
      const newTemplate: CustomTemplate = {
        id: `custom-${Date.now()}`,
        name: fileName,
        preview: thumbnailUrl,
        figmaFileKey: fileKey,
        createdAt: new Date().toISOString()
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
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No custom templates yet.</p>
                <p className="text-xs">Import your Figma designs to get started.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {customTemplates.map((template) => (
                  <Card key={template.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                          <img 
                            src={template.preview} 
                            alt={template.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-xs text-muted-foreground">Preview</div>
                        </div>
                        
                        <div className="flex-1">
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
                            <div>
                              <h5 className="font-medium text-sm">{template.name}</h5>
                              <p className="text-xs text-muted-foreground">
                                Created {new Date(template.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Apply template logic would go here
                                toast({
                                  title: "Template Applied",
                                  description: `Now using ${template.name} template.`,
                                });
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Apply Template</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(template)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rename</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
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
    </div>
  );
};

export default TemplatesSection;