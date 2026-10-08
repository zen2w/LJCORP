'use client';

import React, { ReactNode } from 'react';
import { EMSProvider } from './context/EMSContext';
import { ToastContainer } from './components/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EMSProvider>
      <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      <ToastContainer />
    </EMSProvider>
  );
}

