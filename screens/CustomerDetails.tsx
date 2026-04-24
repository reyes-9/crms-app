import { useCustomerNote } from '@/hooks/useCustomerNote';
import { useOrder } from '@/hooks/useOrder';
import { theme } from '@/theme/colors';
import { RootStackParamList } from '@/types/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomerDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();

  const { customerNotes, getCustomerNotes } = useCustomerNote();

  const { customer } = route.params;
  const { orders, getOrders } = useOrder();

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
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
    <SafeAreaView style={{ flex: 1, paddingTop: 15 }}>
      <View>
        <ScrollView>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>Customer Details</Text>
            <View style={styles.side} />
          </View>
          {/* Profile */}

          <View style={styles.section}>
            <View style={styles.topRow}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={32} color="#1D9E75" />
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{customer.name}</Text>
                <Text style={styles.meta}>ID: {customer.id}</Text>
              </View>

              <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                <MaterialIcons name="edit" size={16} color="#fff" />
                <Text style={styles.editText}>Edit</Text>
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
            <Text style={styles.sectionTitle}>Orders</Text>
            <View style={styles.listContainer}>{ordersContent}</View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.listContainer}>{notesContent}</View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {/* <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
            <MaterialIcons name="edit" size={18} color="#FFF" />
            <Text style={styles.primaryButtonText}>Edit Details</Text>
          </TouchableOpacity> */}

            <View style={styles.secondaryRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {}}
              >
                <MaterialIcons name="phone" size={18} color="#1D9E75" />
                <Text style={styles.secondaryButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {}}
              >
                <MaterialIcons name="email" size={18} color="#1D9E75" />
                <Text style={styles.secondaryButtonText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 12,
  },

  metaItem: {
    fontSize: 12,
    color: '#555',
  },

  metaDot: {
    marginHorizontal: 6,
    color: '#999',
  },

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

  avatarPlaceholder: {
    backgroundColor: '#E6F7F1',
    justifyContent: 'center',
    alignItems: 'center',
  },

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
