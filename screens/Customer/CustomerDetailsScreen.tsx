import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerNote } from '@/hooks/useCustomerNote';
import { useOrder } from '@/hooks/useOrder';
import { DS } from '@/theme/design';
import { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* ─── Types ─────────────────────────────────────── */

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ORDER_STATUS_MAP: Record<string, { bg: string; color: string }> = {
  pending: DS.color.status.pending,
  confirmed: DS.color.status.confirmed,
  processing: DS.color.status.processing,
  shipped: DS.color.status.shipped,
  delivered: DS.color.status.delivered,
  cancelled: DS.color.status.cancelled,
};

/* ─── Screen ─────────────────────────────────────── */

export const CustomerDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();
  const navigation = useNavigation<Nav>();

  const { customers } = useCustomer();
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

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── PROFILE CARD ─────────────────────────── */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{customer.name}</Text>
          <View style={styles.activePill}>
            <View style={styles.activeIndicator} />
            <Text style={styles.activeText}>Active</Text>
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
            ] ?? { bg: '#F3F4F6', color: '#6B7280' };

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
    backgroundColor: DS.color.successLight,
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
});
