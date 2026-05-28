// FUNCTIONALITY:   DELETE Order
// FUNCTIONALITY:   CANCEL Order
// FUNCTIONALITY:   ADVANCE Order
// BOTH USES A MODAL TO CONFIRM

// FUNCTIONALITY:   DELETE Order
// FUNCTIONALITY:   CANCEL Order
// FUNCTIONALITY:   ADVANCE Order
// BOTH USES A MODAL TO CONFIRM

import { ReusableModal } from '@/components/ReusableModal';
import SearchInput from '@/components/SearchInput';
import { useOrder } from '@/hooks/useOrder';
import { theme } from '@/theme/colors';
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

/* =========================================================
   TYPES
========================================================= */

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
/* =========================================================
   MAIN SCREEN
========================================================= */

export const OrdersScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    orders,
    getOrdersByCustomerId,
    searchOrder,
    cancelOrder,
    deleteOrder,
    advanceOrder,
  } = useOrder();

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
    delivered: undefined, // Explicitly no button
    cancelled: undefined, // Explicitly no button
  };

  const { customer_id } = route.params as { customer_id: number };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>('Pending');

  const sortedOrders = React.useMemo(() => {
    const status = getStatusFromFilter(selectedFilter);

    if (!orders?.length) return [];

    if (!status) return orders;

    return orders.filter((o) => o.status === status);
  }, [orders, selectedFilter]);

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);

  const [advanceModalVisible, setAdvanceModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  /* ================= FILTER DATA ================= */

  const filters = [
    'All Orders',
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ] as const;

  const statusDotColors: Record<FilterLabel, string> = {
    'All Orders': '#0F172A',
    Pending: '#C2410C',
    Confirmed: '#1D4ED8',
    Processing: '#5B21B6',
    Shipped: '#0E7490',
    Delivered: '#047857',
    Cancelled: '#991B1B',
  };

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

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        await getOrdersByCustomerId(customer_id);
        setSelectedFilter('Pending');
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  /* ================= LOGIC ================= */

  const [menuLayout, setMenuLayout] = useState<{
    orderId: number | null;
    openUpward: boolean;
  }>({
    orderId: null,
    openUpward: false,
  });

  function getStatusFromFilter(filter: FilterLabel): OrderStatusType | null {
    const map: Record<FilterLabel, OrderStatusType | null> = {
      'All Orders': null,
      Pending: 'pending',
      Confirmed: 'confirmed',
      Processing: 'processing',
      Shipped: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
    };

    return map[filter];
  }

  const filterOrders = (filter: FilterLabel) => {
    setSelectedFilter(filter);
  };

  async function handleSearch(query: string) {
    if (!query.trim()) {
      await getOrdersByCustomerId(customer_id);
      return;
    }
    await searchOrder(query);
  }

  const validateOrderAdvancement = (
    current: OrderStatusType,
  ): TransitionResult => {
    const nextStatus = getNextStatus(current);

    if (!nextStatus) {
      return {
        isValid: false,
        message: 'Order cannot be advanced further.',
      };
    }

    if (!canAdvanceStatus(current, nextStatus)) {
      return {
        isValid: false,
        message: 'Invalid status transition.',
      };
    }

    return {
      isValid: true,
      status: nextStatus,
    };
  };
  const getNextStatus = (current: OrderStatusType) => {
    return STATUS_FLOW[current] ?? null;
  };
  const canAdvanceStatus = (
    current: OrderStatusType,
    next: OrderStatusType,
  ): boolean => {
    return STATUS_FLOW[current] === next;
  };

  const handleAdd = () => {
    navigation.navigate('OrderForm', {
      mode: 'create',
      customerId: customer_id,
    });
  };
  const handleEdit = (id: number) => {
    navigation.navigate('OrderForm', { mode: 'edit', orderId: id });
  };
  const handleCancel = (id: number) => {
    setCancelOrderId(id);
    setCancelModalVisible(true);
  };
  const handleDelete = (id: number) => {
    setDeleteOrderId(id);
    setDeleteModalVisible(true);
  };
  const handleAdvance = (order: OrderDetails) => {
    const result = validateOrderAdvancement(order.status);

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
    if (deleteOrderId !== null) {
      try {
        await deleteOrder(deleteOrderId);
        setDeleteModalVisible(false);
        setDeleteOrderId(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Order deleted successfully',
        });
      } catch (error) {
        setDeleteModalVisible(false);
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete order',
        });
      }
    }
  };
  const confirmCancel = async () => {
    if (cancelOrderId !== null) {
      try {
        await cancelOrder(cancelOrderId);
        setCancelModalVisible(false);
        setCancelOrderId(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Order cancelled successfully',
        });
      } catch (error) {
        setCancelModalVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to cancel order',
        });
      }
    }
  };
  const confirmAdvance = async () => {
    if (!selectedOrder) return;

    try {
      const result = validateOrderAdvancement(selectedOrder.status);
      if (!result.isValid || !result.status) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message ?? 'Invalid transition',
        });
        return;
      }

      await advanceOrder(selectedOrder.id, result.status);

      setAdvanceModalVisible(false);
      setSelectedOrder(null);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Order advanced successfully',
      });
    } catch (error) {
      console.error(error);
      setAdvanceModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to advance order',
      });
    }
  };

  /* ================= UI STATES ================= */

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  /* ================= RENDER ================= */

  return (
    <>
      <ScrollView style={{ margin: 10 }} showsVerticalScrollIndicator={false}>
        <Pressable style={{ flex: 1 }} onPress={() => setOpenMenu(null)}>
          <View style={styles.container}>
            <HeaderSection />

            <AddButton onPress={handleAdd} />

            <SearchInput onSearch={handleSearch} />

            <OrderFilters
              filters={filters}
              selected={selectedFilter}
              colors={statusDotColors}
              onSelect={filterOrders}
            />

            <View style={styles.ordersContainer}>
              {sortedOrders.map((order) => (
                <OrderItemCard
                  key={order.id}
                  order={order}
                  statusMap={orderStatuses}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  menuLayout={menuLayout}
                  setMenuLayout={setMenuLayout}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                  onAdvance={handleAdvance}
                  btnLabels={BUTTON_LABELS[order.status]}
                />
              ))}

              {sortedOrders.length === 0 && (
                <View style={styles.emptyState}>
                  <Feather name="inbox" size={32} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No orders found</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </ScrollView>

      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Permanent Deletion"
        message="Once deleted, this record cannot be recovered."
        buttons={[
          {
            label: 'Close',
            onPress: () => setDeleteModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Delete',
            onPress: confirmDelete,
            variant: 'danger',
          },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />

      <ReusableModal
        state="danger"
        visible={cancelModalVisible}
        title="Order Cancellation"
        message="This order will be permanently cancelled and cannot be undone."
        buttons={[
          {
            label: 'Close',
            onPress: () => setCancelModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Cancel',
            onPress: confirmCancel,
            variant: 'danger',
          },
        ]}
        onClose={() => setCancelModalVisible(false)}
      />

      <ReusableModal
        state="success"
        visible={advanceModalVisible}
        title="Order Advancement"
        message="The status of this order will be advanced and cannot be undone."
        buttons={[
          {
            label: 'Close',
            onPress: () => setAdvanceModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Advance',
            onPress: confirmAdvance,
            variant: 'primary',
          },
        ]}
        onClose={() => setAdvanceModalVisible(false)}
      />
    </>
  );
};

/* =========================================================
   SUB COMPONENTS 
========================================================= */

const HeaderSection = () => (
  <View style={styles.pageHeader}>
    <View>
      <Text style={styles.pageEyebrow}>Operations</Text>
      <Text style={styles.pageTitle}>Order Management</Text>
      <Text style={styles.pageSubtitle}>
        Search, filter, and manage all customer orders
      </Text>
    </View>

    <View style={styles.pageHeaderIcon}>
      <Feather name="layers" size={20} color="#2563EB" />
    </View>
  </View>
);

const AddButton = ({ onPress }: any) => (
  <View style={styles.addBtnContainer}>
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: '#2563EB',
          width: '50%',
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: 'center',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={theme.components.button.text.variants.primary}>
        Add Orders
      </Text>
    </Pressable>
  </View>
);

const OrderFilters = ({ filters, selected, colors, onSelect }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.filterRow}>
      {filters.map((f: string) => {
        const isActive = selected === f;

        return (
          <Pressable
            key={f}
            onPress={() => onSelect(f)}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
          >
            <View style={[styles.statusDot, { backgroundColor: colors[f] }]} />
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
);

const OrderItemCard = ({
  order,
  statusMap,
  openMenu,
  setOpenMenu,
  onEdit,
  onCancel,
  onDelete,
  onAdvance,
  btnLabels,
  setMenuLayout,
  menuLayout,
}: any) => {
  const status = statusMap[order.status] ?? statusMap.all;

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderLeft}>
        <View style={[styles.orderIconWrapper, { backgroundColor: status.bg }]}>
          <Feather name={status.icon as any} size={18} color={status.color} />
        </View>

        <View style={styles.orderContent}>
          <Text style={styles.orderTitle}>{order.description}</Text>

          <View style={styles.orderMetaRow}>
            <Feather name="hash" size={12} color="#9CA3AF" />
            <Text style={styles.orderMetaText}>
              {String(order.id).padStart(5, '0')}
              {/* {order.id} */}
            </Text>

            <Feather name="calendar" size={12} color="#9CA3AF" />
            <Text style={styles.orderMetaText}>
              {new Date(order.created_at).toLocaleDateString()}
              {/* {order.created_at} */}
            </Text>
          </View>

          <View style={styles.orderBottomRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>

            <Text style={styles.orderPrice}>
              {/* ₱{Number(order.price.toLocaleString())} */}
              {formatCurrency(order.price)}
            </Text>
          </View>
        </View>
      </View>
      {/* 
      <TouchableOpacity
        onPress={() => setOpenMenu(openMenu === order.id ? null : order.id)}
      >
        <Feather name="more-vertical" size={18} />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={(event) => {
          const { pageY } = event.nativeEvent;

          const SCREEN_HEIGHT = Dimensions.get('window').height;

          // estimated menu height
          const MENU_HEIGHT = 230;

          const shouldOpenUpward = pageY > SCREEN_HEIGHT - MENU_HEIGHT;

          setMenuLayout({
            orderId: openMenu === order.id ? null : order.id,
            openUpward: shouldOpenUpward,
          });

          setOpenMenu(openMenu === order.id ? null : order.id);
        }}
      >
        <Feather name="more-vertical" size={18} />
      </TouchableOpacity>

      {openMenu === order.id && (
        <OrderMenu
          onEdit={() => onEdit(order.id)}
          onCancel={() => onCancel(order.id)}
          onDelete={() => onDelete(order.id)}
          onAdvance={() => onAdvance(order)}
          close={() => setOpenMenu(null)}
          orderStatus={order.status}
          btnLabels={btnLabels}
          style={[
            styles.menu,
            menuLayout.openUpward ? styles.menuTop : styles.menuBottom,
          ]}
        />
      )}
    </View>
  );
};

const OrderMenu = ({
  onEdit,
  onCancel,
  onDelete,
  onAdvance,
  close,
  style,
  orderStatus,
  btnLabels,
}: any) => (
  <View style={style}>
    <TouchableOpacity style={styles.menuItem} onPress={close}>
      <Feather name="eye" size={14} />
      <Text style={styles.menuText}>View Details</Text>
    </TouchableOpacity>

    {orderStatus === 'pending' ||
    orderStatus === 'confirmed' ||
    orderStatus === 'processing' ? (
      <>
        <View style={styles.menuDivider} />
        <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
          <Feather name="edit-2" size={14} />
          <Text style={styles.menuText}>Edit Order</Text>
        </TouchableOpacity>
      </>
    ) : (
      <></>
    )}

    <View style={styles.menuDivider} />

    <TouchableOpacity style={styles.menuItem} onPress={() => onDelete()}>
      <Feather name="trash-2" size={14} color="#DC2626" />
      <Text style={[styles.menuText, styles.menuDanger]}>Delete Order</Text>
    </TouchableOpacity>

    {orderStatus === 'cancelled' ||
    orderStatus === 'delivered' ||
    orderStatus === 'shipped' ? (
      <></>
    ) : (
      <>
        <View style={styles.menuDivider} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onCancel();
          }}
        >
          <Feather name="slash" size={14} color="#DC2626" />
          <Text style={[styles.menuText, styles.menuDanger]}>Cancel Order</Text>
        </TouchableOpacity>
      </>
    )}

    {orderStatus === 'cancelled' || orderStatus === 'delivered' ? (
      <></>
    ) : (
      <>
        <View style={styles.menuDivider} />
        <TouchableOpacity style={styles.menuItem} onPress={onAdvance}>
          <Feather name="arrow-right-circle" size={16} color="#2563EB" />
          <Text style={[styles.menuText, styles.menuPrimary]}>{btnLabels}</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

/* =========================================================
   STATES
========================================================= */

const LoadingScreen = () => (
  // <ScrollView style={{ margin: 10 }}>
  //   <SkeletonPlaceholder borderRadius={12}>
  //     {/* Header */}
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         justifyContent: 'space-between',
  //         marginBottom: 20,
  //       }}
  //     >
  //       <View>
  //         <View style={{ width: 120, height: 12, marginBottom: 6 }} />
  //         <View style={{ width: 180, height: 20, marginBottom: 6 }} />
  //         <View style={{ width: 220, height: 10 }} />
  //       </View>
  //       <View style={{ width: 44, height: 44, borderRadius: 12 }} />
  //     </View>

  //     {/* Button */}
  //     <View
  //       style={{ width: '50%', height: 40, borderRadius: 10, marginBottom: 15 }}
  //     />

  //     {/* Search */}
  //     <View
  //       style={{
  //         width: '100%',
  //         height: 44,
  //         borderRadius: 10,
  //         marginBottom: 15,
  //       }}
  //     />

  //     {/* Filter chips */}
  //     <View style={{ flexDirection: 'row', marginBottom: 20 }}>
  //       <View
  //         style={{ width: 90, height: 38, borderRadius: 12, marginRight: 10 }}
  //       />
  //       <View
  //         style={{ width: 90, height: 38, borderRadius: 12, marginRight: 10 }}
  //       />
  //       <View style={{ width: 90, height: 38, borderRadius: 12 }} />
  //     </View>

  //     {/* Order cards */}
  //     {[1, 2, 3].map((i) => (
  //       <View
  //         key={i}
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           padding: 16,
  //           borderRadius: 20,
  //           marginBottom: 12,
  //         }}
  //       >
  //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //           <View
  //             style={{
  //               width: 48,
  //               height: 48,
  //               borderRadius: 14,
  //               marginRight: 12,
  //             }}
  //           />
  //           <View>
  //             <View style={{ width: 120, height: 12, marginBottom: 6 }} />
  //             <View style={{ width: 180, height: 10, marginBottom: 6 }} />
  //             <View style={{ width: 140, height: 10 }} />
  //           </View>
  //         </View>

  //         <View style={{ width: 30, height: 30, borderRadius: 6 }} />
  //       </View>
  //     ))}
  //   </SkeletonPlaceholder>
  // </ScrollView>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>Loading...</Text>
  </View>
);

const ErrorScreen = ({ error }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: 'red' }}>{error}</Text>
  </View>
);

//  STYLES
const styles = StyleSheet.create({
  container: {},

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  pageEyebrow: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
  },

  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  pageHeaderIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtnContainer: { marginBottom: 15 },

  filterRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 12,
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: '#EFF6FF',
  },

  filterChipText: { fontSize: 12 },

  filterChipTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  ordersContainer: {
    gap: 12,
  },

  orderCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderLeft: { flexDirection: 'row', flex: 1 },

  orderIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderContent: { marginLeft: 14 },

  orderMetaRow: { flexDirection: 'row', alignItems: 'center' },

  orderMetaText: { fontSize: 12, marginRight: 10 },

  orderBottomRow: { flexDirection: 'row', marginTop: 6 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: { fontSize: 11, fontWeight: '600' },

  orderTitle: { fontSize: 15, fontWeight: '600' },

  orderPrice: { marginLeft: 10, fontWeight: '600' },

  // MENU
  menu: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 6,
    zIndex: 99,
  },

  menuBottom: {
    top: 45,
  },

  menuTop: {
    bottom: 45,
  },

  menuItem: {
    flexDirection: 'row',
    paddingVertical: 8,
  },

  menuText: { marginLeft: 8 },

  menuDanger: { color: '#DC2626' },
  menuPrimary: { color: '#2563EB' },

  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },

  emptyStateText: {
    color: '#9CA3AF',
  },
});
