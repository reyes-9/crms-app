import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useDashboard } from '@/contexts/DashboardContext';
import { DS } from '@/theme/design';
import {
  KpiCardData,
  OrderStatusCounts,
  RecentCustomer,
  StaleOrder,
  TrendDirection,
} from '@/types/dashboard';

// ─── Trend config ─────────────────────────────────────────────────────────────

const TREND_CONFIG: Record<TrendDirection, { icon: string; color: string }> = {
  up: { icon: '↑', color: DS.color.success },
  down: { icon: '↓', color: DS.color.danger },
  neutral: { icon: '→', color: DS.color.neutral },
};

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, trend, trendLabel }: KpiCardData) {
  const { icon, color } = TREND_CONFIG[trend];
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={[styles.cardTrend, { color }]}>
        {icon} {trendLabel}
      </Text>
    </View>
  );
}

function KpiCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.skeletonLabel} />
      <View style={styles.skeletonValue} />
      <View style={styles.skeletonTrend} />
    </View>
  );
}

// ─── OrderStatusRow ───────────────────────────────────────────────────────────

const STATUS_CONFIG: {
  key: keyof OrderStatusCounts;
  label: string;
}[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

function OrderStatusRow({ counts }: { counts: OrderStatusCounts }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>ORDERS BY STATUS</Text>
      <View style={styles.statusGrid}>
        {STATUS_CONFIG.map(({ key, label }) => {
          const cfg = DS.color.status[key];
          return (
            <View
              key={key}
              style={[styles.statusChip, { backgroundColor: cfg.bg }]}
            >
              <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
              <View>
                <Text style={[styles.statusChipLabel, { color: cfg.color }]}>
                  {label}
                </Text>
                <Text style={[styles.statusChipValue, { color: cfg.color }]}>
                  {counts[key]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function OrderStatusSkeleton() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>ORDERS BY STATUS</Text>
      <View style={styles.statusGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.statusChipSkeleton} />
        ))}
      </View>
    </View>
  );
}

// ─── RecentCustomers ──────────────────────────────────────────────────────────

function RecentCustomerRow({ customer }: { customer: RecentCustomer }) {
  return (
    <View style={styles.customerRow}>
      <View style={styles.customerAvatar}>
        <Text style={styles.customerAvatarText}>
          {customer.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerCompany}>{customer.company}</Text>
      </View>
      <View
        style={[
          styles.customerStatusBadge,
          {
            backgroundColor:
              customer.status === 'active'
                ? DS.color.successLight
                : DS.color.neutralLight,
          },
        ]}
      >
        <Text
          style={[
            styles.customerStatusText,
            {
              color:
                customer.status === 'active'
                  ? DS.color.success
                  : DS.color.neutral,
            },
          ]}
        >
          {customer.status}
        </Text>
      </View>
    </View>
  );
}

function RecentCustomersSkeleton() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>RECENT CUSTOMERS</Text>
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.customerRowSkeleton} />
      ))}
    </View>
  );
}

// ─── StaleOrders ──────────────────────────────────────────────────────────────

function StaleOrderRow({ order }: { order: StaleOrder }) {
  const cfg =
    DS.color.status[order.status as keyof typeof DS.color.status] ??
    DS.color.status.pending;

  return (
    <View style={styles.staleRow}>
      <View style={styles.staleLeft}>
        <View style={[styles.staleDot, { backgroundColor: cfg.dot }]} />
        <View style={styles.staleInfo}>
          <Text style={styles.staleDescription} numberOfLines={1}>
            {order.description}
          </Text>
          <Text style={styles.staleCustomer}>{order.customerName}</Text>
        </View>
      </View>
      <View style={styles.staleRight}>
        <Text style={styles.stalePrice}>${order.price.toLocaleString()}</Text>
        <View style={styles.staleDaysBadge}>
          <Feather name="clock" size={10} color={DS.color.warning} />
          <Text style={styles.staleDaysText}>{order.daysSinceUpdate}d</Text>
        </View>
      </View>
    </View>
  );
}

function StaleOrdersSkeleton() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>STALE ORDERS</Text>
      <View style={styles.staleList}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.staleRowSkeleton} />
        ))}
      </View>
    </View>
  );
}

// ─── Inner screen (consumes context) ─────────────────────────────────────────

function DashboardContent() {
  const { kpiCards, summary, loading, error, lastUpdated, refetch } =
    useDashboard();
  const tabBarHeight = useBottomTabBarHeight();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (error) return <ErrorScreen error={error} />;

  return (
    <FlatList
      data={loading ? Array.from({ length: 6 }) : kpiCards}
      keyExtractor={(_, i) => i.toString()}
      numColumns={2}
      style={styles.screen}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: tabBarHeight + DS.spacing.xxxl },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          {/* ── PAGE HEADER ──────────────────── */}
          <View style={styles.pageHeader}>
            <View style={styles.titleBlock}>
              <Text style={styles.eyebrow}>CRM</Text>
              <Text style={styles.pageTitle}>Dashboard</Text>
              <Text style={styles.pageSubtitle}>
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Overview of your pipeline and activity'}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Feather name="bar-chart-2" size={18} color={DS.color.primary} />
            </View>
          </View>

          <Text style={styles.sectionLabel}>KPI SUMMARY</Text>
        </View>
      }
      renderItem={({ item, index }) =>
        loading ? <KpiCardSkeleton /> : <KpiCard {...(item as KpiCardData)} />
      }
      ListFooterComponent={
        <View>
          {/* ── ORDERS BY STATUS ─────────────── */}
          {loading ? (
            <OrderStatusSkeleton />
          ) : (
            summary && <OrderStatusRow counts={summary.ordersByStatus} />
          )}

          {/* ── RECENT CUSTOMERS ─────────────── */}
          {loading ? (
            <RecentCustomersSkeleton />
          ) : summary && summary.recentCustomers.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>RECENT CUSTOMERS</Text>
              <View style={styles.customerList}>
                {summary.recentCustomers.map((c) => (
                  <RecentCustomerRow key={c.id} customer={c} />
                ))}
              </View>
            </View>
          ) : null}

          {/* ── STALE ORDERS ─────────────────── */}
          {loading ? (
            <StaleOrdersSkeleton />
          ) : summary && summary.staleOrders.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>STALE ORDERS</Text>
                <View style={styles.staleBadge}>
                  <Text style={styles.staleBadgeText}>
                    {summary.staleOrders.length} need attention
                  </Text>
                </View>
              </View>
              <View style={styles.staleList}>
                {summary.staleOrders.map((o) => (
                  <StaleOrderRow key={o.id} order={o} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      }
      ListEmptyComponent={!loading ? <EmptyState /> : null}
    />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  return <DashboardContent />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState = () => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <Feather name="bar-chart-2" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No data yet</Text>
    <Text style={styles.emptyDesc}>
      Your KPIs will appear here once orders are added.
    </Text>
  </View>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <View style={styles.stateScreen}>
    <Feather name="alert-circle" size={32} color={DS.color.danger} />
    <Text style={[styles.stateText, { color: DS.color.danger }]}>{error}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },
  listContent: {
    padding: DS.spacing.lg,
  },
  listHeader: {
    paddingTop: DS.spacing.xs,
    gap: DS.spacing.md,
    marginBottom: DS.spacing.md,
  },
  columnWrapper: {
    gap: DS.spacing.md,
    marginBottom: DS.spacing.md,
  },

  // PAGE HEADER
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingRight: DS.spacing.md,
  },
  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: 2,
  },
  pageTitle: {
    ...DS.typography.screenTitle,
  },
  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: DS.color.textSecondary,
    lineHeight: 18,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SECTION LABEL
  sectionLabel: {
    ...DS.typography.eyebrow,
    marginTop: DS.spacing.xs,
  },

  // KPI CARD
  card: {
    flex: 1,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...DS.shadow.sm,
  },
  cardLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: DS.color.textMuted,
  },
  cardValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  cardTrend: {
    marginTop: 4,
    fontSize: 12,
    color: DS.color.textMuted,
  },

  // SECTION WRAPPER
  section: {
    gap: DS.spacing.sm,
    marginTop: DS.spacing.lg,
  },

  // ORDER STATUS
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DS.spacing.sm,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: DS.radius.md,
    width: '48%',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: DS.radius.full,
  },
  statusChipLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusChipValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  statusChipSkeleton: {
    width: '48%',
    height: 56,
    backgroundColor: DS.color.borderLight,
    borderRadius: DS.radius.md,
  },

  // RECENT CUSTOMERS
  customerList: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
    paddingHorizontal: DS.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: DS.color.primary,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textPrimary,
  },
  customerCompany: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 1,
  },
  customerStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: DS.radius.full,
  },
  customerStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  customerRowSkeleton: {
    height: 60,
    backgroundColor: DS.color.borderLight,
    borderRadius: DS.radius.md,
    marginBottom: DS.spacing.sm,
  },

  // SKELETONS
  skeletonLabel: {
    height: 11,
    width: '50%',
    backgroundColor: DS.color.borderLight,
    borderRadius: DS.radius.xs,
    marginBottom: DS.spacing.sm,
  },
  skeletonValue: {
    height: 24,
    width: '70%',
    backgroundColor: DS.color.borderLight,
    borderRadius: DS.radius.xs,
    marginBottom: DS.spacing.sm,
  },
  skeletonTrend: {
    height: 11,
    width: '60%',
    backgroundColor: DS.color.borderLight,
    borderRadius: DS.radius.xs,
  },

  // STALE ORDERS
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: DS.spacing.xs,
  },
  staleBadge: {
    backgroundColor: DS.color.warningLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: DS.radius.full,
  },
  staleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.warning,
  },
  staleList: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },
  staleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DS.spacing.md,
    paddingHorizontal: DS.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  staleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    flex: 1,
  },
  staleDot: {
    width: 8,
    height: 8,
    borderRadius: DS.radius.full,
  },
  staleInfo: {
    flex: 1,
  },
  staleDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textPrimary,
  },
  staleCustomer: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 1,
  },
  staleRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stalePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  staleDaysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: DS.color.warningLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: DS.radius.full,
  },
  staleDaysText: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.warning,
  },
  staleRowSkeleton: {
    height: 56,
    backgroundColor: DS.color.borderLight,
    marginBottom: DS.spacing.sm,
    borderRadius: DS.radius.md,
  },

  // EMPTY
  empty: {
    alignItems: 'center',
    paddingVertical: DS.spacing.xxxl,
    gap: DS.spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: DS.radius.xl,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DS.spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: DS.color.textMuted,
    textAlign: 'center',
  },

  // STATE SCREENS
  stateScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DS.color.bg,
    gap: DS.spacing.md,
  },
  stateText: {
    fontSize: 14,
    color: DS.color.textSecondary,
  },
});
