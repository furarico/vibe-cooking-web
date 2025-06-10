'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { DIContainer, createDIContainer } from './container';

const DIContext = createContext<DIContainer | null>(null);

interface DIProviderProps {
  children: ReactNode;
}

export const DIProvider: React.FC<DIProviderProps> = ({ children }) => {
  const container = useMemo(() => createDIContainer(), []);

  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
};

export const useDI = (): DIContainer => {
  const context = useContext(DIContext);

  if (!context) {
    throw new Error('useDI must be used within DIProvider');
  }

  return context;
};
