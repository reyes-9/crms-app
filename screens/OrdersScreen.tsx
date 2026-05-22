import SearchInput from '@/components/SearchInput';
import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ==============================
// UI: STATUS CARD
// Represents summary counters per order status
// ==============================
type StatusCardProps = {
  type: OrderStatusType;
  count: number;
};

// ==============================
// DOMAIN: ORDER STATUS UNION TYPE
// Must match backend + UI mapping keys
// ==============================
type OrderStatusType =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ==============================
// UI FILTER TYPES
// Used for sorting/filter logic (not display labels)
// ==============================
// type OrderFilter = 'dateAsc' | 'dateDesc' | 'priceAsc' | 'priceDesc' | 'status';

// ==============================
// ORDER DATA MODEL
// Represents a single order record in UI
// ==============================
type Order = {
  id: number;
  description: string;
  price: number;
  status: OrderStatusType;
  created_at: string;
  updated_at?: string;
};

export const OrdersScreen = () => {
  // ==============================
  // FILTER LABELS (UI ONLY)
  // These are display strings shown in filter chips
  // ==============================
  const filters = [
    'All Orders',
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ] as const;

  type FilterLabel = (typeof filters)[number];

  // ==============================
  // UI COLOR MAP FOR FILTER DOTS
  // Purely visual indicator for each filter chip
  // ==============================
  const statusDotColors: Record<FilterLabel, string> = {
    'All Orders': '#0F172A',
    Pending: '#C2410C',
    Confirmed: '#1D4ED8',
    Processing: '#5B21B6',
    Shipped: '#0E7490',
    Delivered: '#047857',
    Cancelled: '#991B1B',
  };

  // ==============================
  // STATUS CARD COMPONENT
  // Displays count + label + icon per status type
  // ==============================
  const StatusCard = ({ type, count }: StatusCardProps) => {
    const status = orderStatuses[type] || orderStatuses.all;

    // Special layout for "All Orders" card (centered full width)
    const isAllOrders = type === 'all';

    return (
      <View
        style={[
          styles.summaryContainer,
          isAllOrders && styles.totalSummaryContainer,
        ]}
      >
        {/* Status icon with background tint */}
        <View style={[styles.iconWrapper, { backgroundColor: status.bg }]}>
          <Feather name={status.icon as any} size={14} color={status.color} />
        </View>

        {/* Count + label text block */}
        <View
          style={[styles.textWrapper, isAllOrders && styles.totalTextWrapper]}
        >
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.labelText}>{status.label}</Text>
        </View>
      </View>
    );
  };

  // ==============================
  // SEARCH HANDLER (placeholder)
  // Intended for API or local filtering
  // ==============================
  async function handleSearch(query: string) {
    if (!query.trim()) {
      return;
    }
  }

  // ==============================
  // MOCK DATA (replace with API later)
  // ==============================
  const orders: Order[] = [
    {
      id: 1,
      description: '50x Office Chairs',
      price: 12500,
      status: 'pending',
      created_at: '2026-05-21T08:30:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 2,
      description: 'Laptop procurement batch',
      price: 78500,
      status: 'confirmed',
      created_at: '2026-05-21T09:00:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 3,
      description: 'Warehouse inventory sync',
      price: 18400,
      status: 'processing',
      created_at: '2026-05-21T09:45:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 4,
      description: 'Courier dispatch - Metro Manila',
      price: 6200,
      status: 'shipped',
      created_at: '2026-05-21T10:15:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 5,
      description: 'Delivered printer units',
      price: 45200,
      status: 'delivered',
      created_at: '2026-05-21T11:00:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 6,
      description: 'Cancelled bulk monitor order',
      price: 38900,
      status: 'cancelled',
      created_at: '2026-05-21T11:30:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 7,
      description: 'Office desk restock',
      price: 14300,
      status: 'pending',
      created_at: '2026-05-21T12:00:00',
      updated_at: '2026-05-21T08:30:00',
    },
    {
      id: 8,
      description: 'Networking equipment setup',
      price: 56700,
      status: 'processing',
      created_at: '2026-05-21T13:20:00',
      updated_at: '2026-05-21T08:30:00',
    },
  ];

  // ==============================
  // UI STATE: ACTIVE FILTER
  // Controls which filter chip is selected
  // ==============================
  const [selectedFilter, setSelectedFilter] =
    useState<FilterLabel>('All Orders');

  // Holds the currently displayed orders after filtering
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);

  // Initialize list once on mount
  useEffect(() => {
    setSortedOrders(orders);
  }, []);

  // ==============================
  // FILTER → STATUS CONVERSION MAP
  // Translates UI label into backend-compatible status
  // ==============================
  const getStatusFromFilter = (filter: FilterLabel): OrderStatusType | null => {
    const filterToStatus: Record<FilterLabel, OrderStatusType | null> = {
      'All Orders': null,
      Pending: 'pending',
      Confirmed: 'confirmed',
      Processing: 'processing',
      Shipped: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
    };

    return filterToStatus[filter];
  };

  // ==============================
  // FILTER LOGIC
  // Updates visible orders based on selected status filter
  // ==============================
  const filterAndSortOrders = (filterType: FilterLabel) => {
    let filtered = [...orders];

    const statusKey = getStatusFromFilter(filterType);

    // If null → "All Orders" → no filtering applied
    if (statusKey) {
      filtered = filtered.filter((order) => order.status === statusKey);
    }

    setSortedOrders(filtered);
  };

  // ==============================
  // STATUS CONFIGURATION MAP
  // Controls UI styling per status (color, icon, label)
  // ==============================
  const orderStatuses = {
    all: {
      label: 'All Orders',
      bg: '#F8FAFC',
      color: '#0F172A',
      icon: 'shopping-bag',
    },
    pending: {
      label: 'Pending',
      bg: '#FFF7ED',
      color: '#C2410C',
      icon: 'package',
    },
    confirmed: {
      label: 'Confirmed',
      bg: '#EFF6FF',
      color: '#1D4ED8',
      icon: 'check-circle',
    },
    processing: {
      label: 'Processing',
      bg: '#F5F3FF',
      color: '#5B21B6',
      icon: 'refresh-cw',
    },
    shipped: {
      label: 'Shipped',
      bg: '#ECFEFF',
      color: '#0E7490',
      icon: 'truck',
    },
    delivered: {
      label: 'Delivered',
      bg: '#ECFDF5',
      color: '#047857',
      icon: 'check-circle',
    },
    cancelled: {
      label: 'Cancelled',
      bg: '#FEF2F2',
      color: '#991B1B',
      icon: 'x-circle',
    },
  };

  // ==============================
  // DERIVED DATA: STATUS COUNTS
  // Builds a frequency map of orders per status
  // ==============================
  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Total number of orders across all statuses
  const totalCount = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <ScrollView style={{ margin: 10 }}>
      {/* SUMMARY DASHBOARD */}
      <View style={styles.summarySection}>
        <StatusCard type="all" count={totalCount} />

        <View style={styles.statusGrid}>
          <StatusCard type="pending" count={statusCounts.pending} />
          <StatusCard type="confirmed" count={statusCounts.confirmed} />
          <StatusCard type="processing" count={statusCounts.processing} />
          <StatusCard type="shipped" count={statusCounts.shipped} />
          <StatusCard type="delivered" count={statusCounts.delivered} />
          <StatusCard type="cancelled" count={statusCounts.cancelled} />
        </View>
      </View>

      {/* SEARCH INPUT */}
      <SearchInput onSearch={handleSearch} />

      {/* FILTER CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => {
                  setSelectedFilter(filter);
                  filterAndSortOrders(filter);
                }}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                {/* Colored indicator dot per filter */}
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusDotColors[filter] || '#2563EB' },
                  ]}
                />

                {/* Filter label */}
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* ORDER LIST */}
      <View style={styles.ordersContainer}>
        {sortedOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* LEFT: icon + basic info */}
            <View style={styles.orderLeft}>
              <View
                style={[
                  styles.orderIconWrapper,
                  {
                    backgroundColor:
                      orderStatuses[order.status as keyof typeof orderStatuses]
                        ?.bg || '#F3F4F6',
                  },
                ]}
              >
                <Feather
                  name={
                    (orderStatuses[order.status as keyof typeof orderStatuses]
                      ?.icon || 'shopping-bag') as any
                  }
                  size={18}
                  color={
                    orderStatuses[order.status as keyof typeof orderStatuses]
                      ?.color || '#374151'
                  }
                />
              </View>

              <View style={styles.orderContent}>
                <Text style={styles.orderNumber}>
                  #{String(order.id).padStart(5, '0')}
                </Text>

                <View style={styles.orderMetaRow}>
                  <Feather name="calendar" size={13} color="#9CA3AF" />

                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* CENTER: status badge + price */}
            <View style={styles.orderCenter}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      orderStatuses[order.status as keyof typeof orderStatuses]
                        ?.bg || '#F3F4F6',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        orderStatuses[
                          order.status as keyof typeof orderStatuses
                        ]?.color || '#374151',
                    },
                  ]}
                >
                  {
                    orderStatuses[order.status as keyof typeof orderStatuses]
                      ?.label
                  }
                </Text>
              </View>

              <Text style={styles.orderPrice}>
                ₱{order.price.toLocaleString()}
              </Text>
            </View>

            {/* RIGHT: action menu */}
            <View style={styles.orderRight}>
              <TouchableOpacity>
                <Feather name="more-vertical" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  summarySection: {
    gap: 12,
    marginBottom: theme.spacing.lg,
    paddingBottom: 14,
  },

  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  summaryContainer: {
    width: '31.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.offWhite,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  totalSummaryContainer: {
    width: '100%',
    margin: 'auto',
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  totalTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
  },

  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textWrapper: {
    marginLeft: 8,
    flex: 1,
  },

  countText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },

  labelText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  filterChipTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  ordersContainer: {
    gap: 12,
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  orderIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderContent: {
    marginLeft: 14,
  },

  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },

  orderCenter: {
    flex: 1,
    alignItems: 'center',
  },

  orderRight: {
    alignItems: 'flex-end',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  orderPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
});
