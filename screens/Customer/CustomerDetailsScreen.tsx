import { ReusableModal } from '@/components/ReusableModal';
import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerNote } from '@/hooks/useCustomerNote';
import { useOrder } from '@/hooks/useOrder';
import { DS } from '@/theme/design';
import { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ORDER_STATUS_MAP: Record<string, { bg: string; color: string }> = {
  pending: DS.color.status.pending,
  confirmed: DS.color.status.confirmed,
  processing: DS.color.status.processing,
  shipped: DS.color.status.shipped,
  delivered: DS.color.status.delivered,
  cancelled: DS.color.status.cancelled,
};

export const CustomerDetailsScreen = () => {
  const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
    active: { bg: '#DCFCE7', color: '#15803D' },
    archived: { bg: '#FEF3C7', color: '#B45309' },
    deleted: { bg: '#FEE2E2', color: '#B91C1C' },
  };

  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();
  const navigation = useNavigation<Nav>();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);

  const {
    customers,
    deleteCustomer,
    archiveCustomer,
    restoreCustomer,
    getCustomers,
  } = useCustomer();
  const { customerNotes, getCustomerNotes } = useCustomerNote();
  const { limitedOrders, getOrdersByCustomerIdLimit } = useOrder();

  const { customer: routeCustomer } = route.params;

  const customer = useMemo(
    () => customers.find((c) => c.id === routeCustomer.id) ?? routeCustomer,
    [customers, routeCustomer.id],
  );

  useEffect(() => {
    getOrdersByCustomerIdLimit(customer.id);
    getCustomerNotes(customer.id);
  }, []);

  const initials =
    customer.name
      ?.split(' ')
      .slice(0, 2)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase() ?? '?';

  const handleArchive = async () => {
    try {
      await archiveCustomer(customer.id);
      setArchiveModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Customer Archived',
        text2: 'Customer archived successfully',
      });
      await getCustomers();
      navigation.goBack();
    } catch (err: any) {
      setArchiveModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to archive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(customer.id);
      setDeleteModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Customer Deleted',
        text2: 'Customer deleted successfully',
      });
      await getCustomers();
      navigation.goBack();
    } catch (err: any) {
      setDeleteModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to delete',
      });
    }
  };

  const handleRestore = async () => {
    try {
      await restoreCustomer(customer.id);
      setRestoreModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Customer Restored',
        text2: 'Customer restored successfully',
      });
      await getCustomers();
      navigation.goBack();
    } catch (err: any) {
      setDeleteModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to restore',
      });
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── DELETE MODAL ──────────────────────── */}
      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Permanent Deletion"
        message="Once deleted, this record cannot be recovered. Consider archiving instead."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setDeleteModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Delete',
            variant: 'danger',
            onPress: handleDelete,
          },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />

      {/* ── ARCHIVE MODAL ─────────────────────── */}
      <ReusableModal
        state="warning"
        visible={archiveModalVisible}
        title="Archive this record?"
        message="This record will be moved to archive. You can restore it later."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setArchiveModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Archive',
            variant: 'warning',
            onPress: handleArchive,
          },
        ]}
        onClose={() => setArchiveModalVisible(false)}
      />

      {/* ── RESTORE MODAL ─────────────────────── */}
      <ReusableModal
        state="success"
        visible={restoreModalVisible}
        title="Restore this record?"
        message="This record will be restored."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setRestoreModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Restore',
            variant: 'success',
            onPress: handleRestore,
          },
        ]}
        onClose={() => setRestoreModalVisible(false)}
      />

      {/* ── PROFILE CARD ─────────────────────────── */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{customer.name}</Text>
          <View style={styles.activePill}>
            <View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor:
                    STATUS_COLOR[customer.status]?.color || DS.color.success,
                },
              ]}
            />
            <Text
              style={[
                styles.activeText,
                {
                  color:
                    STATUS_COLOR[customer.status]?.color || DS.color.success,
                },
              ]}
            >
              {customer.status?.charAt(0).toUpperCase() +
                customer.status?.slice(1) || 'Active'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditCustomer', { customer })}
        >
          <Feather name="edit-2" size={14} color={DS.color.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ── QUICK ACTIONS ───────────────────────── */}
      <View style={styles.row}>
        <ActionButton
          icon="phone"
          label="Call"
          onPress={() => Linking.openURL(`tel:${customer.number}`)}
        />
        <ActionButton
          icon="mail"
          label="Email"
          onPress={() => Linking.openURL(`mailto:${customer.email}`)}
        />
        <ActionButton
          icon="shopping-bag"
          label="Orders"
          onPress={() =>
            navigation.navigate('Orders', { customer_id: customer.id })
          }
          variant="primary"
        />
      </View>

      {/* ── CONTACT INFO ───────────────────────── */}
      <SectionCard title="Contact Info" icon="user">
        <InfoRow label="Email" value={customer.email} />
        <InfoRow label="Phone" value={customer.number} divider />
        <InfoRow label="Company" value={customer.company} divider />
      </SectionCard>

      {/* ── ORDERS ──────────────────────────────── */}
      <SectionCard
        title="Recent Orders"
        icon="package"
        actionLabel="Manage"
        onAction={() =>
          navigation.navigate('Orders', { customer_id: customer.id })
        }
      >
        {!limitedOrders || limitedOrders.length === 0 ? (
          <EmptyInline message="No orders yet" icon="inbox" />
        ) : (
          limitedOrders.map((order) => {
            const statusStyle = ORDER_STATUS_MAP[
              order.status.toLowerCase()
            ] ?? {
              bg: '#F3F4F6',
              color: '#6B7280',
            };
            return (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Text style={styles.orderItemTitle}>{order.description}</Text>
                  <Text style={styles.orderItemMeta}>
                    #{String(order.id).padStart(5, '0')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: statusStyle.color },
                    ]}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </SectionCard>

      {/* ── NOTES ───────────────────────────────── */}
      <SectionCard
        title="Notes"
        icon="file-text"
        actionLabel="Manage"
        onAction={() =>
          navigation.navigate('CustomerNotes', { customer_id: customer.id })
        }
      >
        {!customerNotes || customerNotes.length === 0 ? (
          <EmptyInline message="No notes yet" icon="file-text" />
        ) : (
          customerNotes.map((note, i) => (
            <View key={note.id}>
              {i > 0 && <View style={styles.noteDivider} />}
              <View style={styles.noteItem}>
                <Text style={styles.noteText}>{note.content}</Text>
                <View style={styles.noteMeta}>
                  <Feather name="clock" size={11} color={DS.color.textMuted} />
                  <Text style={styles.noteMetaText}>Apr 10, 2025 · you</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </SectionCard>

      {/* ── DANGER ZONE ──────────────────────── */}
      <SectionCard title="Danger Zone" icon="alert-triangle">
        <View style={styles.dangerRow}>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setArchiveModalVisible(true)} // ← fixed
          >
            <Feather name="archive" size={15} color={DS.color.warning} />
            <View style={styles.dangerBtnText}>
              <Text style={styles.dangerBtnTitle}>Archive Customer</Text>
              <Text style={styles.dangerBtnSub}>
                Hide from active customers list
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={DS.color.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setDeleteModalVisible(true)} // ← fixed
          >
            <Feather name="trash-2" size={15} color={DS.color.danger} />
            <View style={styles.dangerBtnText}>
              <Text style={[styles.dangerBtnTitle, { color: DS.color.danger }]}>
                Delete Customer
              </Text>
              <Text style={styles.dangerBtnSub}>
                Permanently remove this customer
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={DS.color.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setRestoreModalVisible(true)} // ← fixed
          >
            <Feather name="rotate-ccw" size={15} color={DS.color.success} />
            <View style={styles.dangerBtnText}>
              <Text
                style={[styles.dangerBtnTitle, { color: DS.color.success }]}
              >
                Restore Customer
              </Text>
              <Text style={styles.dangerBtnSub}>
                Show to the active customer list.
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={DS.color.textMuted}
            />
          </TouchableOpacity>
        </View>
      </SectionCard>
    </ScrollView>
  );
};

/* ─── Sub-components ──────────────────────────────── */

const ActionButton = ({
  icon,
  label,
  onPress,
  variant = 'secondary',
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) => (
  <TouchableOpacity
    style={[styles.actionBtn, variant === 'primary' && styles.actionBtnPrimary]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <Feather
      name={icon}
      size={16}
      color={variant === 'primary' ? DS.color.textInverse : DS.color.primary}
    />
    <Text
      style={[
        styles.actionBtnText,
        variant === 'primary' && styles.actionBtnTextPrimary,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SectionCard = ({
  title,
  icon,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.sectionIconWrap}>
          <Feather name={icon} size={14} color={DS.color.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.sectionAction} onPress={onAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Feather name="chevron-right" size={13} color={DS.color.primary} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const InfoRow = ({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) => (
  <>
    {divider && <View style={styles.infoRowDivider} />}
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </>
);

const EmptyInline = ({
  message,
  icon,
}: {
  message: string;
  icon: React.ComponentProps<typeof Feather>['name'];
}) => (
  <View style={styles.emptyInline}>
    <Feather name={icon} size={20} color={DS.color.border} />
    <Text style={styles.emptyInlineText}>{message}</Text>
  </View>
);

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },
  content: {
    padding: DS.spacing.xl,
    gap: DS.spacing.md,
    paddingBottom: 40,
  },

  // PROFILE CARD
  profileCard: {
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
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: DS.color.primary,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: DS.color.textPrimary,
    marginBottom: 6,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    // backgroundColor: DS.color.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DS.radius.full,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DS.color.success,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.success,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DS.color.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.color.primary,
  },

  // QUICK ACTIONS
  row: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  actionBtnPrimary: {
    backgroundColor: DS.color.primary,
    borderColor: DS.color.primary,
    flex: 1.5,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.color.primary,
  },
  actionBtnTextPrimary: {
    color: DS.color.textInverse,
  },

  // SECTION CARD
  sectionCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: DS.radius.xs,
    backgroundColor: DS.color.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.color.primary,
  },
  sectionBody: {
    padding: DS.spacing.lg,
  },

  // INFO ROWS
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DS.spacing.sm,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: DS.color.borderLight,
  },
  infoLabel: {
    fontSize: 13,
    color: DS.color.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.color.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },

  // ORDER ITEMS
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  orderItemLeft: { flex: 1, paddingRight: DS.spacing.md },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textPrimary,
  },
  orderItemMeta: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radius.full,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // NOTES
  noteDivider: {
    height: 1,
    backgroundColor: DS.color.borderLight,
    marginVertical: DS.spacing.sm,
  },
  noteItem: { gap: 6 },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
    color: DS.color.textSecondary,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteMetaText: {
    fontSize: 11,
    color: DS.color.textMuted,
  },

  // EMPTY
  emptyInline: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: DS.spacing.xl,
  },
  emptyInlineText: {
    fontSize: 13,
    color: DS.color.textMuted,
  },

  // DANGER ZONE
  dangerRow: { gap: 0 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
  },
  dangerBtnText: { flex: 1 },
  dangerBtnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.warning,
  },
  dangerBtnSub: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 2,
  },
});
