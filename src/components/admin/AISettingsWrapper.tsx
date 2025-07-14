import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import OpenAISettings from './OpenAISettings';
import AIGenerationSettings from './AIGenerationSettings';
import OpenAIUsageLogs from './OpenAIUsageLogs';
import PromptControlPanel from './PromptControlPanel';

const AISettingsWrapper = () => {
  const [activeAITab, setActiveAITab] = useState('openai');

  const getAITabLabel = (tab: string) => {
    const labels: { [key: string]: string } = {
      'openai': 'OpenAI',
      'ai-limits': 'AI Limits',
      'usage-logs': 'Usage Logs',
      'prompt-control': 'Prompt Control'
    };
    return labels[tab] || 'Select AI Setting';
  };

  return (
    <Tabs value={activeAITab} onValueChange={setActiveAITab} className="space-y-4">
      {/* Desktop Tab Navigation */}
      <TabsList className="hidden md:grid w-full grid-cols-4">
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
        <TabsTrigger value="ai-limits">AI Limits</TabsTrigger>
        <TabsTrigger value="usage-logs">Usage Logs</TabsTrigger>
        <TabsTrigger value="prompt-control">Prompt Control</TabsTrigger>
      </TabsList>

      {/* Mobile Dropdown Navigation */}
      <div className="md:hidden mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-background">
              {getAITabLabel(activeAITab)}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-3rem)] bg-background border shadow-lg z-50" align="start" sideOffset={4}>
            <DropdownMenuItem onClick={() => setActiveAITab('openai')} className="cursor-pointer">
              OpenAI
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveAITab('ai-limits')} className="cursor-pointer">
              AI Limits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveAITab('usage-logs')} className="cursor-pointer">
              Usage Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveAITab('prompt-control')} className="cursor-pointer">
              Prompt Control
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <TabsContent value="openai">
        <OpenAISettings />
      </TabsContent>
      
      <TabsContent value="ai-limits">
        <AIGenerationSettings />
      </TabsContent>
      
      <TabsContent value="usage-logs">
        <OpenAIUsageLogs />
      </TabsContent>
      
      <TabsContent value="prompt-control">
        <PromptControlPanel />
      </TabsContent>
    </Tabs>
  );
};

export default AISettingsWrapper;