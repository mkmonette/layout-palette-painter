import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { initializeOpenAI, isOpenAIInitialized } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';

interface OpenAIKeyInputProps {
  onKeySet?: () => void;
}

const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      initializeOpenAI(apiKey);
      localStorage.setItem('openai_api_key', apiKey);
      
      toast({
        title: "API Key Set",
        description: "OpenAI integration is now active",
      });
      
      onKeySet?.();
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to initialize OpenAI. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if key is already set
  if (isOpenAIInitialized()) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Key className="h-4 w-4" />
            <span className="text-sm font-medium">OpenAI integration active</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Key className="h-4 w-4" />
          Enable AI-Powered Color Generation
        </CardTitle>
        <CardDescription className="text-xs">
          Add your OpenAI API key to unlock intelligent color palette generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
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
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={handleSetKey}
            disabled={isLoading}
            size="sm"
            className="flex-1"
          >
            {isLoading ? 'Setting up...' : 'Enable AI Generation'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-600">
          Your API key is stored locally and never shared. Get one from OpenAI's platform.
        </p>
      </CardContent>
    </Card>
  );
};

export default OpenAIKeyInput;