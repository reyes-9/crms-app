import { DashboardContext } from '@/contexts/DashboardContext';
import { DashboardContextValue } from '@/types/dashboard';
import { useContext } from 'react';

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return ctx;
}
