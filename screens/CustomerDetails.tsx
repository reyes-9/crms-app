import { BackButton } from '@/components/BackButton';
import { useOrder } from '@/hooks/useOrder';
import { theme } from '@/theme/colors';
import { RootStackParamList } from '@/types/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';

export const CustomerDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();
  const { customer_id } = route.params;

  const customer = {
    name: 'John Doe',
    id: 'CUST-1024',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Springfield',
    orders: [
      { id: '1001', status: 'Delivered' },
      { id: '1002', status: 'In Progress' },
      { id: '1003', status: 'Cancelled' },
    ],
    notes: [
      'VIP customer, prefers email contact',
      'Interested in premium plan upgrade',
    ],
  };
  const { orders, getOrders } = useOrder();

  useEffect(() => {
    getOrders(customer_id);
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

  // let notesContent;
  // if (!notes || notes.length === 0) {
  //   notesContent = <Text>No notes found.</Text>;
  // } else {
  //   notesContent = notes.map((note, index) => (
  //     <Text style={styles.sectionItem} key={index}>
  //       • {note}
  //     </Text>
  //   ));
  // }

  // console.log('ORDERS: ', orders);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Customer Details</Text>
          <View style={styles.side} />
        </View>
        {/* Profile */}
        <View style={styles.profile}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialIcons name="person" size={48} color="#1D9E75" />
          </View>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.id}>ID: {customer.id}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <Text style={styles.sectionText}>Email: {customer.email}</Text>
          <Text style={styles.sectionText}>Phone: {customer.phone}</Text>
          <Text style={styles.sectionText}>Address: {customer.address}</Text>
        </View>

        {/* Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <View style={styles.listContainer}>{ordersContent}</View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {/* <View style={styles.listContainer}>{notesContent}</View> */}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
            <MaterialIcons name="edit" size={18} color="#FFF" />
            <Text style={styles.primaryButtonText}>Edit Details</Text>
          </TouchableOpacity>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  side: {
    width: 80, // fixed width to match back button area
    justifyContent: 'center',
    paddingLeft: 12,
  },

  profile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#E6F7F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  id: { color: '#666' },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
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
    borderWidth: 1,
    borderColor: 'red',
  },

  sectionItem: {
    // borderWidth: 1,
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

  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,

    ...theme.elevation.md,
  },

  primaryButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
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
