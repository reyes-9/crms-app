// ─── API Response ────────────────────────────────────────────────────────────

export interface OrderStatusCounts {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface StaleOrder {
  id: number;
  description: string;
  status: string;
  price: number;
  customerName: string;
  daysSinceUpdate: number;
}

export interface RecentCustomer {
  id: number;
  name: string;
  company: string;
  status: string;
}

export interface DashboardSummary {
  // KPI cards
  openOrders: number;
  openOrdersDelta: number;
  pipelineValue: number;
  closeRate: number;
  closeRateDelta: number;
  avgOrderSize: number;

  // Leads
  newLeadsThisWeek: number;
  convertedLeads: number;
  totalLeads: number;

  // Orders by status
  ordersByStatus: OrderStatusCounts;

  // Stale orders
  staleOrders: StaleOrder[];

  // Recent customers
  recentCustomers: RecentCustomer[];
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KpiCardData {
  label: string;
  value: string;
  trend: TrendDirection;
  trendLabel: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface DashboardContextValue {
  summary: DashboardSummary | null;
  kpiCards: KpiCardData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}