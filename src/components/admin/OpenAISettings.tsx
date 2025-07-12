import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Eye, EyeOff, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initializeOpenAI, isOpenAIInitialized } from '@/utils/openaiService';

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

const OpenAISettings: React.FC = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [environment, setEnvironment] = useState('production');
  const [isEnabled, setIsEnabled] = useState(false);
  const [enforceHighContrast, setEnforceHighContrast] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState(
    'Generate a balanced color palette with good contrast ratios. Ensure text colors are readable against their backgrounds and follow WCAG AA guidelines.'
  );
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(defaultPromptTemplates);
  const [newPromptLabel, setNewPromptLabel] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [maxTokens, setMaxTokens] = useState([500]);
  const [temperature, setTemperature] = useState([0.7]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedSettings = localStorage.getItem('openai_admin_settings');
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsEnabled(isOpenAIInitialized());
    }
    
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        setEnvironment(settings.environment || 'production');
        setDefaultPrompt(settings.defaultPrompt || defaultPrompt);
        setPromptTemplates(settings.promptTemplates || defaultPromptTemplates);
        setMaxTokens([settings.maxTokens || 500]);
        setTemperature([settings.temperature || 0.7]);
        setIsEnabled(settings.isEnabled || false);
        setEnforceHighContrast(settings.enforceHighContrast || false);
      } catch (error) {
        console.error('Error loading OpenAI settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      environment,
      defaultPrompt,
      promptTemplates,
      maxTokens: maxTokens[0],
      temperature: temperature[0],
      isEnabled,
      enforceHighContrast
    };

    localStorage.setItem('openai_admin_settings', JSON.stringify(settings));
    
    if (apiKey && apiKey.startsWith('sk-')) {
      localStorage.setItem('openai_api_key', apiKey);
      if (isEnabled) {
        initializeOpenAI(apiKey);
      }
    }

    toast({
      title: "Settings Saved",
      description: "OpenAI configuration has been updated successfully.",
    });
  };

  const testConnection = async () => {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('none');

    try {
      initializeOpenAI(apiKey);
      // Test with a simple request
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (testResponse.ok) {
        setConnectionStatus('success');
        toast({
          title: "Connection Successful",
          description: "OpenAI API connection established successfully.",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Failed to connect to OpenAI API. Please check your API key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
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
          <h2 className="text-2xl font-bold">OpenAI Configuration</h2>
          <p className="text-muted-foreground">Manage OpenAI integration settings for AI-powered color generation</p>
        </div>
        <Badge variant={isEnabled ? "default" : "secondary"}>
          {isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      <Accordion type="multiple" defaultValue={["key-management", "prompt-control"]} className="space-y-4">
        {/* OpenAI Key Management */}
        <AccordionItem value="key-management">
          <AccordionTrigger>OpenAI Key Management</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Configuration</CardTitle>
                <CardDescription>
                  Configure your OpenAI API key and environment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={testConnection} 
                    disabled={isTestingConnection || !apiKey}
                    className="flex-1"
                  >
                    {isTestingConnection ? (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <>
                        {connectionStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-600" />}
                        {connectionStatus === 'error' && <XCircle className="h-4 w-4 mr-2 text-red-600" />}
                      </>
                    )}
                    {isTestingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Prompt Control Panel */}
        <AccordionItem value="prompt-control">
          <AccordionTrigger>Prompt Control Panel</AccordionTrigger>
          <AccordionContent>
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

                  <div className="space-y-3">
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
          </AccordionContent>
        </AccordionItem>

        {/* Options & Toggles */}
        <AccordionItem value="options">
          <AccordionTrigger>Options & Settings</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generation Settings</CardTitle>
                <CardDescription>
                  Configure OpenAI generation parameters and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable OpenAI Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow AI-powered color palette generation
                    </p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Tokens: {maxTokens[0]}</Label>
                    <Slider
                      value={maxTokens}
                      onValueChange={setMaxTokens}
                      max={1000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum tokens for AI responses (100-1000)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {temperature[0]}</Label>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls randomness in AI responses (0.0-1.0)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default OpenAISettings;