
import React, { createContext, useContext, useState } from 'react';

interface SubscriptionContextType {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [isPro, setIsPro] = useState(false); // Default to free tier

  return (
    <SubscriptionContext.Provider value={{ isPro, setIsPro }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
