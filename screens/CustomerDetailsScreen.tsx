// ADD THE EDIT FUNCTIONALITY
// ADD THE EDIT FUNCTIONALITY
// ADD THE EDIT FUNCTIONALITY
// ADD THE EDIT FUNCTIONALITY
// ADD THE EDIT FUNCTIONALITY
// ADD THE EDIT FUNCTIONALITY

// ADD THE EDIT BUTTONS
// (ORDERS: MANAGE ORDERS)  --  POSSIBLY DIFFERENT PAGE
// (NOTES: ADD NOTES)       --  MAYBE JUST A MODAL

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

  const { customers } = useCustomer();
  const { customerNotes, getCustomerNotes } = useCustomerNote();

  const { customer: routeCustomer } = route.params;
  const { orders, getOrders } = useOrder();

  const [showEditModal, setShowEditModal] = useState(false);

  // Get the updated customer from context, fallback to route params
  const customer = useMemo(
    () => customers.find((c) => c.id === routeCustomer.id) || routeCustomer,
    [customers, routeCustomer.id],
  );

  const handleOrders = () => {
    console.log('Orders is pressed');
    setShowEditModal(true);
  };
  const handleNotes = () => {
    console.log('Notes is pressed');
    setShowEditModal(true);
  };
  const handleEdit = () => {
    navigation.navigate('EditCustomer', { customer });
  };

  useEffect(() => {
    getOrders(customer.id);
    getCustomerNotes(customer.id);
  }, []);

  let ordersContent;
  if (!orders || orders.length === 0) {
    ordersContent = <Text>No order found.</Text>;
  } else {
    ordersContent = orders.map((order) => (
      <Text key={order.id} style={styles.sectionItem}>
        • Order #{order.id} - {order.status}
      </Text>
    ));
  }

  let notesContent;
  if (!customerNotes || customerNotes.length === 0) {
    notesContent = <Text>No notes found.</Text>;
  } else {
    notesContent = customerNotes.map((customerNotes, index) => (
      <Text style={styles.sectionItem} key={index}>
        • {customerNotes.description}
      </Text>
    ));
  }

  // console.log('ORDERS: ', orders);
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#ffffff',
      }}
    >
      {/* Profile */}

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={32} color="#1D9E75" />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.meta}>ID: {customer.id}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <MaterialIcons name="edit" size={16} color="#fff" />
            <Text style={styles.editText}>Edit Customer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>Active</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaItem}>Last order 2 days ago</Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <Text style={styles.sectionText}>Email: {customer.email}</Text>
        <Text style={styles.sectionText}>Phone: {customer.number}</Text>
        <Text style={styles.sectionText}>Company: {customer.company}</Text>
      </View>

      {/* Orders */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleOrders}>
            <MaterialIcons name="inventory" size={16} color="#fff" />
            <Text style={styles.editText}>Manage Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>{ordersContent}</View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleNotes}>
            <MaterialIcons name="note" size={16} color="#fff" />
            <Text style={styles.editText}>Manage Notes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>{notesContent}</View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <MaterialIcons name="phone" size={18} color="#1D9E75" />
            <Text style={styles.secondaryButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <MaterialIcons name="email" size={18} color="#1D9E75" />
            <Text style={styles.secondaryButtonText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
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
  },

  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F6E56',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  editText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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

  metaDot: {
    marginHorizontal: 6,
    color: '#999',
  },

  section: {
    // backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    paddingTop: 22,
    borderRadius: 15,
    borderBottomWidth: 1,

    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1D',
    marginBottom: 10,
  },

  sectionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },

  sectionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },

  listContainer: {
    flexDirection: 'column',
  },

  actions: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  secondaryRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryBackground,

    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
  },
});
