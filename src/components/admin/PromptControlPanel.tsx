import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptTemplate {
  id: string;
  label: string;
  prompt: string;
}

const defaultPromptTemplates: PromptTemplate[] = [
  {
    id: 'playful',
    label: 'Playful',
    prompt: 'Generate a vibrant, fun color palette with bright colors that would work well for a playful kids app or gaming interface'
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    prompt: 'Create a clean, minimal color palette with subtle tones and high contrast for text readability, suitable for a professional application'
  },
  {
    id: 'warm',
    label: 'Warm & Cozy',
    prompt: 'Design a warm color palette with earth tones and comfortable colors that create a welcoming, cozy atmosphere'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    prompt: 'Generate a professional corporate color palette with trustworthy blues and grays, suitable for business applications'
  }
];

const PromptControlPanel: React.FC = () => {
  const { toast } = useToast();
  const [defaultPrompt, setDefaultPrompt] = useState(
    'Generate a balanced color palette with good contrast ratios. Ensure text colors are readable against their backgrounds and follow WCAG AA guidelines.'
  );
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(defaultPromptTemplates);
  const [newPromptLabel, setNewPromptLabel] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [enforceHighContrast, setEnforceHighContrast] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('openai_admin_settings');
    
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        setDefaultPrompt(settings.defaultPrompt || defaultPrompt);
        setPromptTemplates(settings.promptTemplates || defaultPromptTemplates);
        setEnforceHighContrast(settings.enforceHighContrast || false);
      } catch (error) {
        console.error('Error loading prompt settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    const existingSettings = localStorage.getItem('openai_admin_settings');
    let settings = {};
    
    if (existingSettings) {
      try {
        settings = JSON.parse(existingSettings);
      } catch (error) {
        console.error('Error parsing existing settings:', error);
      }
    }

    const updatedSettings = {
      ...settings,
      defaultPrompt,
      promptTemplates,
      enforceHighContrast
    };

    localStorage.setItem('openai_admin_settings', JSON.stringify(updatedSettings));

    toast({
      title: "Settings Saved",
      description: "Prompt control settings have been updated successfully.",
    });
  };

  const addPromptTemplate = () => {
    if (!newPromptLabel.trim() || !newPromptText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both label and prompt text.",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      label: newPromptLabel.trim(),
      prompt: newPromptText.trim()
    };

    setPromptTemplates([...promptTemplates, newTemplate]);
    setNewPromptLabel('');
    setNewPromptText('');

    toast({
      title: "Template Added",
      description: "New prompt template has been added successfully.",
    });
  };

  const removePromptTemplate = (id: string) => {
    setPromptTemplates(promptTemplates.filter(template => template.id !== id));
    toast({
      title: "Template Removed",
      description: "Prompt template has been removed.",
    });
  };

  const updatePromptTemplate = (id: string, field: 'label' | 'prompt', value: string) => {
    setPromptTemplates(promptTemplates.map(template => 
      template.id === id ? { ...template, [field]: value } : template
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Control Panel</h2>
          <p className="text-muted-foreground">Manage AI prompts and generation settings</p>
        </div>
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Default Prompt Configuration</CardTitle>
          <CardDescription>
            Set the default prompt used for AI color generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-prompt">Default Prompt</Label>
            <Textarea
              id="default-prompt"
              placeholder="Enter the default prompt for AI color generation..."
              value={defaultPrompt}
              onChange={(e) => setDefaultPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enforce-high-contrast"
              checked={enforceHighContrast}
              onCheckedChange={(checked) => setEnforceHighContrast(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="enforce-high-contrast"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enforce high contrast between text and background colors
              </Label>
              <p className="text-xs text-muted-foreground">
                When checked, automatically adds a high contrast instruction to the AI prompt
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Prompt Templates</h4>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {promptTemplates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={template.label}
                      onChange={(e) => updatePromptTemplate(template.id, 'label', e.target.value)}
                      className="font-medium"
                      placeholder="Template label"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePromptTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={template.prompt}
                    onChange={(e) => updatePromptTemplate(template.id, 'prompt', e.target.value)}
                    placeholder="Prompt text"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
              <h5 className="font-medium">Add New Template</h5>
              <Input
                placeholder="Template label (e.g., 'Dark Mode')"
                value={newPromptLabel}
                onChange={(e) => setNewPromptLabel(e.target.value)}
              />
              <Textarea
                placeholder="Prompt text..."
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                rows={2}
              />
              <Button onClick={addPromptTemplate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptControlPanel;