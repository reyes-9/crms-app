import { useUser } from '@/hooks/useUser';
import { dashboardService } from '@/services/dashboardService';
import type {
  DashboardContextValue,
  DashboardSummary,
  KpiCardData,
} from '@/types/dashboard';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 60_000;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function buildKpiCards(summary: DashboardSummary): KpiCardData[] {
  return [
    {
      label: 'Open orders',
      value: String(summary.openOrders),
      trend: summary.openOrdersDelta >= 0 ? 'up' : 'down',
      trendLabel: `${summary.openOrdersDelta >= 0 ? '+' : ''}${summary.openOrdersDelta} this week`,
    },
    {
      label: 'Pipeline value',
      value: formatCurrency(summary.pipelineValue),
      trend: 'neutral',
      trendLabel: 'active orders',
    },
    {
      label: 'Close rate',
      value: `${summary.closeRate.toFixed(1)}%`,
      trend:
        summary.closeRateDelta > 0
          ? 'up'
          : summary.closeRateDelta < 0
            ? 'down'
            : 'neutral',
      trendLabel: `${summary.closeRateDelta >= 0 ? '+' : ''}${summary.closeRateDelta}% vs last month`,
    },
    {
      label: 'Avg order size',
      value: formatCurrency(summary.avgOrderSize),
      trend: 'neutral',
      trendLabel: '30-day avg',
    },
    {
      label: 'New leads',
      value: String(summary.newLeadsThisWeek),
      trend: summary.newLeadsThisWeek > 0 ? 'up' : 'neutral',
      trendLabel: 'this week',
    },
    {
      label: 'Converted leads',
      value: String(summary.convertedLeads),
      trend: summary.convertedLeads > 0 ? 'up' : 'neutral',
      trendLabel: `of ${summary.totalLeads} total`,
    },
  ];
}

// ─── Context ─────────────────────────────────────────────────────────────────

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [kpiCards, setKpiCards] = useState<KpiCardData[]>([]);
  // ✅ Fix: start as true when user exists so skeletons show immediately,
  //         false when no user so the screen doesn't show skeletons on logout
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const res = await dashboardService.getSummary();
      const data: DashboardSummary = res.data;

      setSummary(data);
      setKpiCards(buildKpiCards(data));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      setKpiCards([]);
      setLoading(false);
      setError(null);
      setLastUpdated(null);
      return;
    }

    fetchSummary();

    const intervalId = setInterval(fetchSummary, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [user, fetchSummary]);

  const value: DashboardContextValue = {
    summary,
    kpiCards,
    loading,
    error,
    lastUpdated,
    refetch: fetchSummary,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error('useDashboard must be used inside <DashboardProvider>');
  }

  return ctx;
}
