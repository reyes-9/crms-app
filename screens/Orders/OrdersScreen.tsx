import { ReusableModal } from '@/components/ReusableModal';
import SearchInput from '@/components/SearchInput';
import { useOrder } from '@/hooks/useOrder';
import { DS } from '@/theme/design';
import { RootStackParamList } from '@/types/navigation';
import { OrderDetails, OrderStatusType } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

/* ─── Types ──────────────────────────────────────── */

type FilterLabel =
  | 'All Orders'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

type TransitionResult = {
  isValid: boolean;
  status?: OrderStatusType;
  message?: string;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

/* ─── Constants ──────────────────────────────────── */

const STATUS_FLOW: Partial<Record<OrderStatusType, OrderStatusType>> = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
};

const BUTTON_LABELS: Partial<Record<OrderStatusType, string>> = {
  pending: 'Confirm Order',
  confirmed: 'Start Processing',
  processing: 'Mark as Shipped',
  shipped: 'Mark as Delivered',
};

const FILTER_MAP: Record<FilterLabel, OrderStatusType | null> = {
  'All Orders': null,
  Pending: 'pending',
  Confirmed: 'confirmed',
  Processing: 'processing',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
};

const FILTERS: FilterLabel[] = [
  'All Orders',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_UI = {
  all: {
    label: 'All Orders',
    bg: '#F8FAFC',
    color: '#0F172A',
    dot: '#0F172A',
    icon: 'shopping-bag',
  },
  pending: { ...DS.color.status.pending, label: 'Pending', icon: 'package' },
  confirmed: {
    ...DS.color.status.confirmed,
    label: 'Confirmed',
    icon: 'check-circle',
  },
  processing: {
    ...DS.color.status.processing,
    label: 'Processing',
    icon: 'refresh-cw',
  },
  shipped: { ...DS.color.status.shipped, label: 'Shipped', icon: 'truck' },
  delivered: {
    ...DS.color.status.delivered,
    label: 'Delivered',
    icon: 'check-circle',
  },
  cancelled: {
    ...DS.color.status.cancelled,
    label: 'Cancelled',
    icon: 'x-circle',
  },
} as const;

/* ─── Screen ─────────────────────────────────────── */

export const OrdersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<Nav>();

  const {
    orders,
    getOrdersByCustomerId,
    searchOrder,
    cancelOrder,
    deleteOrder,
    advanceOrder,
  } = useOrder();
  const { customer_id } = route.params as { customer_id: number };

  // ── All state at top (no hooks after early returns) ──
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>('Pending');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [advanceModalVisible, setAdvanceModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [orderDetailsToView, setOrderDetailsToView] =
    useState<OrderDetails | null>(null);
  const [menuLayout, setMenuLayout] = useState<{
    orderId: number | null;
    openUpward: boolean;
  }>({
    orderId: null,
    openUpward: false,
  });

  const sortedOrders = React.useMemo(() => {
    if (!orders?.length) return [];
    const status = FILTER_MAP[selectedFilter];
    return status ? orders.filter((o) => o.status === status) : orders;
  }, [orders, selectedFilter]);

  /* ── Fetch ──────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await getOrdersByCustomerId(customer_id);
        setSelectedFilter('Pending');
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Handlers ───────────────────────────────────── */

  const getNextStatus = (cur: OrderStatusType) => STATUS_FLOW[cur] ?? null;

  const validateAdvancement = (cur: OrderStatusType): TransitionResult => {
    const next = getNextStatus(cur);
    if (!next)
      return { isValid: false, message: 'Order cannot be advanced further.' };
    if (STATUS_FLOW[cur] !== next)
      return { isValid: false, message: 'Invalid status transition.' };
    return { isValid: true, status: next };
  };

  async function handleSearch(query: string) {
    if (!query.trim()) {
      await getOrdersByCustomerId(customer_id);
      return;
    }
    await searchOrder(query);
  }

  const handleAdd = () =>
    navigation.navigate('OrderForm', {
      mode: 'create',
      customerId: customer_id,
    });
  const handleEdit = (id: number) =>
    navigation.navigate('OrderForm', { mode: 'edit', orderId: id });
  const handleDelete = (id: number) => {
    setDeleteOrderId(id);
    setDeleteModalVisible(true);
  };
  const handleCancel = (id: number) => {
    setCancelOrderId(id);
    setCancelModalVisible(true);
  };
  const handleViewDetails = (order: OrderDetails) => {
    setOrderDetailsToView(order);
    setDetailsModalVisible(true);
  };

  const handleAdvance = (order: OrderDetails) => {
    const result = validateAdvancement(order.status);
    if (!result.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.message ?? 'Failed to advance order',
      });
      return;
    }
    setSelectedOrder(order);
    setAdvanceModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteOrderId === null) return;
    try {
      await deleteOrder(deleteOrderId);
      setDeleteModalVisible(false);
      setDeleteOrderId(null);
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Order removed successfully',
      });
    } catch {
      setDeleteModalVisible(false);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete' });
    }
  };

  const confirmCancel = async () => {
    if (cancelOrderId === null) return;
    try {
      await cancelOrder(cancelOrderId);
      setCancelModalVisible(false);
      setCancelOrderId(null);
      Toast.show({
        type: 'success',
        text1: 'Cancelled',
        text2: 'Order cancelled successfully',
      });
    } catch {
      setCancelModalVisible(false);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to cancel' });
    }
  };

  const confirmAdvance = async () => {
    if (!selectedOrder) return;
    const result = validateAdvancement(selectedOrder.status);
    if (!result.isValid || !result.status) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.message ?? 'Invalid transition',
      });
      return;
    }
    try {
      await advanceOrder(selectedOrder.id, result.status);
      setAdvanceModalVisible(false);
      setSelectedOrder(null);
      Toast.show({
        type: 'success',
        text1: 'Advanced',
        text2: 'Order advanced successfully',
      });
    } catch {
      setAdvanceModalVisible(false);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to advance' });
    }
  };

  /* ── Early returns (after all hooks) ───────────── */
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  /* ── Render ─────────────────────────────────────── */
  return (
    <>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setOpenMenu(null)}>
          {/* PAGE HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>OPERATIONS</Text>
              <Text style={styles.pageTitle}>Order Management</Text>
              <Text style={styles.pageSubtitle}>
                Search, filter, and manage all orders
              </Text>
            </View>
            <View style={styles.headerIconBtn}>
              <Feather name="layers" size={18} color={DS.color.primary} />
            </View>
          </View>

          {/* ADD BUTTON */}
          <View style={styles.addContainer}>
            <Pressable style={styles.addButton} onPress={handleAdd}>
              <Feather name="plus" size={18} color={DS.color.textInverse} />
              <Text style={styles.addButtonText}>Add Order</Text>
            </Pressable>
          </View>

          {/* SEARCH */}
          <View style={styles.searchWrapper}>
            <SearchInput onSearch={handleSearch} />
          </View>

          {/* FILTER CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
          >
            <View style={styles.filtersRow}>
              {FILTERS.map((f) => {
                const isActive = selectedFilter === f;
                const dotKey = (
                  f === 'All Orders' ? 'all' : f.toLowerCase()
                ) as keyof typeof STATUS_UI;
                const dotColor = STATUS_UI[dotKey]?.dot ?? DS.color.textPrimary;

                return (
                  <Pressable
                    key={f}
                    onPress={() => setSelectedFilter(f)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                  >
                    <View
                      style={[styles.filterDot, { backgroundColor: dotColor }]}
                    />
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* ORDER LIST */}
          <View style={styles.ordersList}>
            {sortedOrders.length === 0 ? (
              <EmptyState />
            ) : (
              sortedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  menuLayout={menuLayout}
                  setMenuLayout={setMenuLayout}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                  onAdvance={handleAdvance}
                  onViewDetails={handleViewDetails}
                  btnLabel={BUTTON_LABELS[order.status]}
                />
              ))
            )}
          </View>
        </Pressable>
      </ScrollView>

      {/* ── MODALS ───────────────────────────────── */}
      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Permanent Deletion"
        message="Once deleted, this record cannot be recovered."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setDeleteModalVisible(false),
            variant: 'neutral',
          },
          { label: 'Delete', onPress: confirmDelete, variant: 'danger' },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />

      <ReusableModal
        state="danger"
        visible={cancelModalVisible}
        title="Cancel Order"
        message="This order will be permanently cancelled and cannot be undone."
        buttons={[
          {
            label: 'Close',
            onPress: () => setCancelModalVisible(false),
            variant: 'neutral',
          },
          { label: 'Cancel Order', onPress: confirmCancel, variant: 'danger' },
        ]}
        onClose={() => setCancelModalVisible(false)}
      />

      <ReusableModal
        state="success"
        visible={advanceModalVisible}
        title="Advance Order"
        message="The status of this order will be advanced. This cannot be undone."
        buttons={[
          {
            label: 'Close',
            onPress: () => setAdvanceModalVisible(false),
            variant: 'neutral',
          },
          { label: 'Advance', onPress: confirmAdvance, variant: 'primary' },
        ]}
        onClose={() => setAdvanceModalVisible(false)}
      />

      <ReusableModal
        state="neutral"
        visible={detailsModalVisible}
        title="Order Details"
        buttons={[
          {
            label: 'Close',
            onPress: () => setDetailsModalVisible(false),
            variant: 'primary',
          },
        ]}
        onClose={() => setDetailsModalVisible(false)}
      >
        {orderDetailsToView && (
          <OrderDetailsContent order={orderDetailsToView} />
        )}
      </ReusableModal>
    </>
  );
};

/* ─── Order Card ─────────────────────────────────── */

const OrderCard = ({
  order,
  openMenu,
  setOpenMenu,
  menuLayout,
  setMenuLayout,
  onEdit,
  onCancel,
  onDelete,
  onAdvance,
  onViewDetails,
  btnLabel,
}: any) => {
  const statusKey = order.status as keyof typeof STATUS_UI;
  const status = STATUS_UI[statusKey] ?? STATUS_UI.all;
  const isOpen = openMenu === order.id;
  const canEdit = ['pending', 'confirmed', 'processing'].includes(order.status);
  const canCancel = !['cancelled', 'delivered', 'shipped'].includes(
    order.status,
  );
  const canAdvance = !['cancelled', 'delivered'].includes(order.status);

  return (
    <View style={styles.orderCard}>
      {/* Left: icon */}
      <View style={[styles.orderIconWrap, { backgroundColor: status.bg }]}>
        <Feather name={status.icon as any} size={18} color={status.color} />
      </View>

      {/* Center: content */}
      <View style={styles.orderContent}>
        <Text style={styles.orderTitle} numberOfLines={1}>
          {order.description}
        </Text>

        <View style={styles.orderMeta}>
          <Feather name="hash" size={11} color={DS.color.textMuted} />
          <Text style={styles.orderMetaText}>
            {String(order.id).padStart(5, '0')}
          </Text>
          <Feather name="calendar" size={11} color={DS.color.textMuted} />
          <Text style={styles.orderMetaText}>
            {new Date(order.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.orderBottom}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusBadgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
          <Text style={styles.orderPrice}>{formatCurrency(order.price)}</Text>
        </View>
      </View>

      {/* Right: 3-dot menu trigger */}
      <TouchableOpacity
        style={styles.menuTrigger}
        onPress={(e) => {
          const { pageY } = e.nativeEvent;
          const openUpward = pageY > Dimensions.get('window').height - 240;
          setMenuLayout({ orderId: order.id, openUpward });
          setOpenMenu(isOpen ? null : order.id);
        }}
      >
        <Feather
          name="more-vertical"
          size={18}
          color={DS.color.textSecondary}
        />
      </TouchableOpacity>

      {/* Dropdown menu */}
      {isOpen && (
        <View
          style={[
            styles.menu,
            menuLayout.openUpward ? styles.menuTop : styles.menuBottom,
          ]}
        >
          <MenuItem
            icon="eye"
            label="View Details"
            onPress={() => {
              onViewDetails(order);
              setOpenMenu(null);
            }}
          />

          {canEdit && (
            <>
              <View style={styles.menuDivider} />
              <MenuItem
                icon="edit-2"
                label="Edit Order"
                onPress={() => {
                  onEdit(order.id);
                  setOpenMenu(null);
                }}
              />
            </>
          )}

          <View style={styles.menuDivider} />
          <MenuItem
            icon="trash-2"
            label="Delete"
            danger
            onPress={() => {
              onDelete(order.id);
              setOpenMenu(null);
            }}
          />

          {canCancel && (
            <>
              <View style={styles.menuDivider} />
              <MenuItem
                icon="slash"
                label="Cancel Order"
                danger
                onPress={() => {
                  onCancel(order.id);
                  setOpenMenu(null);
                }}
              />
            </>
          )}

          {canAdvance && btnLabel && (
            <>
              <View style={styles.menuDivider} />
              <MenuItem
                icon="arrow-right-circle"
                label={btnLabel}
                primary
                onPress={() => {
                  onAdvance(order);
                  setOpenMenu(null);
                }}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const MenuItem = ({
  icon,
  label,
  onPress,
  danger,
  primary,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
  primary?: boolean;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Feather
      name={icon}
      size={14}
      color={
        danger
          ? DS.color.danger
          : primary
            ? DS.color.primary
            : DS.color.textPrimary
      }
    />
    <Text
      style={[
        styles.menuItemText,
        danger && { color: DS.color.danger },
        primary && { color: DS.color.primary },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* ─── Order Details Content ──────────────────────── */

const OrderDetailsContent = ({ order }: { order: OrderDetails }) => (
  <View style={styles.detailsContent}>
    {[
      { label: 'Order ID', value: `#${String(order.id).padStart(5, '0')}` },
      { label: 'Description', value: order.description },
      {
        label: 'Status',
        value: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      },
      { label: 'Price', value: formatCurrency(order.price) },
      {
        label: 'Created',
        value: new Date(order.created_at).toLocaleDateString(),
      },
      ...(order.updated_at
        ? [
            {
              label: 'Updated',
              value: new Date(order.updated_at).toLocaleDateString(),
            },
          ]
        : []),
    ].map(({ label, value }) => (
      <View key={label} style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ))}
  </View>
);

/* ─── State Screens ──────────────────────────────── */

const LoadingScreen = () => (
  <View style={styles.stateScreen}>
    <ActivityIndicator size="large" color={DS.color.primary} />
    <Text style={styles.stateText}>Loading orders…</Text>
  </View>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <View style={styles.stateScreen}>
    <Feather name="alert-circle" size={28} color={DS.color.danger} />
    <Text style={[styles.stateText, { color: DS.color.danger }]}>{error}</Text>
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconWrap}>
      <Feather name="inbox" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No orders found</Text>
    <Text style={styles.emptyDesc}>
      Try a different filter or add a new order.
    </Text>
  </View>
);

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  // HEADER
  header: {
    paddingHorizontal: DS.spacing.xl,
    paddingTop: DS.spacing.xl,
    paddingBottom: DS.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: { ...DS.typography.eyebrow, marginBottom: 2 },
  pageTitle: { ...DS.typography.screenTitle },
  pageSubtitle: { fontSize: 13, color: DS.color.textSecondary, marginTop: 4 },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  // ADD BUTTON
  addContainer: {
    paddingHorizontal: DS.spacing.xl,
    marginBottom: DS.spacing.md,
  },
  addButton: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...DS.shadow.sm,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.color.textInverse,
  },

  // SEARCH
  searchWrapper: {
    paddingHorizontal: DS.spacing.xl,
    marginBottom: DS.spacing.sm,
  },

  // FILTERS
  filtersScroll: { paddingLeft: DS.spacing.xl, marginBottom: DS.spacing.md },
  filtersRow: { flexDirection: 'row', gap: 8, paddingRight: DS.spacing.xl },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  filterChipActive: {
    backgroundColor: DS.color.primaryMuted,
    borderColor: DS.color.primaryLight,
  },
  filterDot: { width: 7, height: 7, borderRadius: DS.radius.full },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: DS.color.textSecondary,
  },
  filterChipTextActive: { fontWeight: '700', color: DS.color.primary },

  // ORDERS LIST
  ordersList: {
    paddingHorizontal: DS.spacing.xl,
    gap: DS.spacing.sm,
    paddingBottom: 32,
  },

  // ORDER CARD
  orderCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    ...DS.shadow.sm,
  },
  orderIconWrap: {
    width: 46,
    height: 46,
    borderRadius: DS.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderContent: { flex: 1 },
  orderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  orderMetaText: { fontSize: 11, color: DS.color.textMuted, marginRight: 6 },
  orderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radius.full,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  orderPrice: { fontSize: 13, fontWeight: '700', color: DS.color.textPrimary },
  menuTrigger: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.color.bg,
    borderWidth: 1,
    borderColor: DS.color.border,
    flexShrink: 0,
  },

  // MENU
  menu: {
    position: 'absolute',
    right: 0,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    width: 170,
    zIndex: 999,
    ...DS.shadow.md,
  },
  menuTop: { bottom: 40 },
  menuBottom: { top: 40 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: DS.spacing.md,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.color.textPrimary,
  },
  menuDivider: { height: 1, backgroundColor: DS.color.borderLight },

  // ORDER DETAILS
  detailsContent: { paddingVertical: DS.spacing.sm },
  detailRow: {
    paddingVertical: DS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.textMuted,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailValue: { fontSize: 14, fontWeight: '500', color: DS.color.textPrimary },

  // STATE SCREENS
  stateScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DS.color.bg,
    gap: DS.spacing.md,
  },
  stateText: { fontSize: 14, color: DS.color.textSecondary },

  // EMPTY
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: DS.spacing.sm },
  emptyIconWrap: {
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
  emptyTitle: { fontSize: 16, fontWeight: '700', color: DS.color.textPrimary },
  emptyDesc: { fontSize: 13, color: DS.color.textMuted, textAlign: 'center' },
});
