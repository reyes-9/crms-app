// CREATE THE MANAGE NOTES SCREEN
// CREATE THE MANAGE NOTES SCREEN
// CREATE THE MANAGE NOTES SCREEN

// COMPLETE IT ALL TOMMOROW
// COMPLETE IT ALL TOMMOROW
// COMPLETE IT ALL TOMMOROW

// UI - PROCESSES
// UI - PROCESSES
// UI - PROCESSES

import { useCustomer } from '@/hooks/useCustomer';
import { useCustomerNote } from '@/hooks/useCustomerNote';
import { useOrder } from '@/hooks/useOrder';
import { theme } from '@/theme/colors';
import { RootStackParamList } from '@/types/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const CustomerDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const statusColors: Record<string, string> = {
    pending: '#C2410C',
    confirmed: '#1D4ED8',
    processing: '#5B21B6',
    shipped: '#0E7490',
    delivered: '#047857',
    cancelled: '#991B1B',
  };

  const { customers } = useCustomer();
  const { customerNotes, getCustomerNotes } = useCustomerNote();

  const { customer: routeCustomer } = route.params;
  const { orders, getOrdersByCustomerIdLimit } = useOrder();

  const [showEditModal, setShowEditModal] = useState(false);

  // Get the updated customer from context, fallback to route params
  const customer = useMemo(
    () => customers.find((c) => c.id === routeCustomer.id) || routeCustomer,
    [customers, routeCustomer.id],
  );

  const handleOrders = () => {
    console.log('Orders is pressed');
    console.log('CUSTOMER ID: ', customer.id);
    navigation.navigate('Orders', { customer_id: customer.id });
  };
  const handleNotes = () => {
    console.log('Notes is pressed');
    setShowEditModal(true);
  };
  const handleEdit = () => {
    navigation.navigate('EditCustomer', { customer });
  };

  useEffect(() => {
    getOrdersByCustomerIdLimit(customer.id);
    getCustomerNotes(customer.id);
  }, []);

  let ordersContent;

  if (!orders || orders.length === 0) {
    ordersContent = <Text>No order found.</Text>;
  } else {
    ordersContent = orders.map((order) => {
      const statusColor = statusColors[order.status.toLowerCase()] || '#6B7280';

      return (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderTitle}>{order.description}</Text>

              <Text style={styles.orderDetails}>ID: {order.id}</Text>

              <Text style={styles.orderDetails}>Created Mar 10, 2025</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${statusColor}20`, // transparent background
                  borderColor: statusColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: statusColor,
                  },
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  }

  let notesContent;
  if (!customerNotes || customerNotes.length === 0) {
    notesContent = <Text>No notes found.</Text>;
  } else {
    notesContent = customerNotes.map((customerNote) => (
      <View key={customerNote.id}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{customerNote.content}</Text>

          <Text style={styles.noteMeta}>Apr 10, 2025 · you</Text>
        </View>
        <View style={styles.divider} />
      </View>
    ));
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}
    >
      {/* Profile */}
      <View style={styles.divider} />
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={32} color="#1D9E75" />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.meta}>ID: {customer.id}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <MaterialIcons name="edit" size={16} color="#1D9E75" />
            <Text style={styles.editText}>Edit Customer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaItemPill}>Active</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaItem}>Last order 2 days ago</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <MaterialIcons name="phone" size={18} color="#1D9E75" />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <MaterialIcons name="email" size={18} color="#1D9E75" />
            <Text style={styles.actionBtnText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      {/* <View style={styles.actions}></View> */}

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTACT INFO</Text>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Email:</Text>
          <Text style={styles.sectionValue}>{customer.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Phone:</Text>
          <Text style={styles.sectionValue}>{customer.number}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Company:</Text>
          <Text style={styles.sectionValue}>{customer.company}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ORDERS</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleOrders}>
            <MaterialIcons name="inventory" size={16} color="#1D9E75" />
            <Text style={styles.editText}>Manage Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>{ordersContent}</View>
      </View>
      <View style={styles.divider} />

      {/* Notes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NOTES</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleNotes}>
            <MaterialIcons name="note" size={16} color="#1D9E75" />
            <Text style={styles.editText}>Manage Notes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>{notesContent}</View>
      </View>
      <View style={styles.divider} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    // textTransform: 'uppercase',
  },

  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.button.base,
    ...theme.components.button.sizes.sm.container,
    ...theme.components.button.variants.secondary,
    gap: theme.spacing.xs,
  },

  editText: {
    ...theme.components.button.text.base,
    ...theme.components.button.text.variants.secondary,
    fontSize: theme.components.button.sizes.sm.text.fontSize,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  metaItem: {
    fontSize: 12,
    color: '#555',
  },

  metaItemPill: {
    fontSize: 12,
    color: '#555',
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },

  metaDot: {
    marginHorizontal: 6,
    color: '#999',
  },

  section: {
    marginHorizontal: 12,
    paddingVertical: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0', // light gray line
    width: '100%',
    marginVertical: 6, // spacing above and below
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1d',
    marginBottom: 10,
    textAlign: 'left',
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes label left, value right
    alignItems: 'center',
    marginVertical: 4,
  },

  sectionLabel: {
    fontSize: 14,
    color: '#555',
  },

  sectionValue: {
    fontSize: 14,
    color: '#000', // darker for emphasis
    textAlign: 'right',
  },

  listContainer: {
    flexDirection: 'column',
  },

  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  actionBtn: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    ...theme.components.button.base,
    ...theme.components.button.sizes.sm.container,
    ...theme.components.button.variants.secondary,
  },

  actionBtnText: {
    ...theme.components.button.text.base,
    ...theme.components.button.text.variants.secondary,
    fontSize: theme.components.button.sizes.sm.text.fontSize,
  },

  // ORDERS
  orderCard: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: theme.radius.md,

    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,

    borderWidth: 1,
    borderColor: theme.colors.border,

    marginBottom: theme.spacing.sm,
  },

  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  orderTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },

  orderDetails: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'center',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  // NOTES
  noteCard: {
    marginBottom: theme.spacing.sm,
  },

  noteText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  noteMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
