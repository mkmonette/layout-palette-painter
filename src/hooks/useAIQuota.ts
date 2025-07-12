import { useState, useEffect } from 'react';
import { useFeatureAccess } from './useFeatureAccess';

interface AIUsageData {
  used: number;
  resetDate: string;
}

export const useAIQuota = () => {
  const { maxAIGenerationsPerMonth, canAccessAutoGenerator, isPro } = useFeatureAccess();
  const [usage, setUsage] = useState<AIUsageData>({ used: 0, resetDate: getNextResetDate() });

  useEffect(() => {
    const savedUsage = localStorage.getItem('ai_generation_usage');
    if (savedUsage) {
      const parsedUsage = JSON.parse(savedUsage);
      const resetDate = new Date(parsedUsage.resetDate);
      
      // Reset if it's past the reset date
      if (new Date() > resetDate) {
        const newUsage = { used: 0, resetDate: getNextResetDate() };
        setUsage(newUsage);
        localStorage.setItem('ai_generation_usage', JSON.stringify(newUsage));
      } else {
        setUsage(parsedUsage);
      }
    }
  }, []);

  const incrementUsage = () => {
    const newUsage = { ...usage, used: usage.used + 1 };
    setUsage(newUsage);
    localStorage.setItem('ai_generation_usage', JSON.stringify(newUsage));
  };

  const resetUsage = () => {
    const newUsage = { used: 0, resetDate: getNextResetDate() };
    setUsage(newUsage);
    localStorage.setItem('ai_generation_usage', JSON.stringify(newUsage));
  };

  const remainingGenerations = Math.max(0, maxAIGenerationsPerMonth - usage.used);
  const canGenerate = isPro && canAccessAutoGenerator && remainingGenerations > 0;

  return {
    maxGenerations: maxAIGenerationsPerMonth,
    usedGenerations: usage.used,
    remainingGenerations,
    canGenerate,
    isPro,
    incrementUsage,
    resetUsage,
    resetDate: usage.resetDate
  };
};

function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}