export interface TokenUsageLog {
  id: string;
  user_id: string;
  generation_type: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  timestamp: string;
  model: string;
  estimated_cost?: number;
}

// Simple cost estimation based on OpenAI pricing (approximate)
const getEstimatedCost = (model: string, promptTokens: number, completionTokens: number): number => {
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4.1-2025-04-14': { input: 0.000015, output: 0.00006 }, // $15/$60 per 1M tokens
    'gpt-4o': { input: 0.000005, output: 0.000015 }, // $5/$15 per 1M tokens
    'gpt-4.1-mini-2025-04-14': { input: 0.00000015, output: 0.0000006 }, // $0.15/$0.60 per 1M tokens
  };

  const rates = pricing[model] || pricing['gpt-4.1-2025-04-14'];
  return (promptTokens * rates.input) + (completionTokens * rates.output);
};

export const logTokenUsage = (
  userId: string,
  generationType: string,
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  },
  model: string
): void => {
  const log: TokenUsageLog = {
    id: crypto.randomUUID(),
    user_id: userId,
    generation_type: generationType,
    prompt_tokens: usage.prompt_tokens,
    completion_tokens: usage.completion_tokens,
    total_tokens: usage.total_tokens,
    timestamp: new Date().toISOString(),
    model,
    estimated_cost: getEstimatedCost(model, usage.prompt_tokens, usage.completion_tokens)
  };

  // Store in localStorage (in a real app, this would go to a database)
  const existingLogs = getTokenUsageLogs();
  const updatedLogs = [log, ...existingLogs];
  localStorage.setItem('token_usage_logs', JSON.stringify(updatedLogs));
};

export const getTokenUsageLogs = (): TokenUsageLog[] => {
  try {
    const logs = localStorage.getItem('token_usage_logs');
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

export const clearTokenUsageLogs = (): void => {
  localStorage.removeItem('token_usage_logs');
};

export const exportLogsToCSV = (logs: TokenUsageLog[]): void => {
  const headers = [
    'ID', 'User ID', 'Generation Type', 'Prompt Tokens', 
    'Completion Tokens', 'Total Tokens', 'Timestamp', 'Model', 'Estimated Cost'
  ];
  
  const csvContent = [
    headers.join(','),
    ...logs.map(log => [
      log.id,
      log.user_id,
      log.generation_type,
      log.prompt_tokens,
      log.completion_tokens,
      log.total_tokens,
      log.timestamp,
      log.model,
      log.estimated_cost?.toFixed(6) || '0'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `openai-usage-logs-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};