import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DS } from '@/theme/design';
import { BackButton } from './BackButton';

export const Header = ({
  title,
  isReturn,
}: {
  title: string;
  isReturn: boolean;
}) => {
  const titles: Record<string, string> = {
    Dashboard: 'Dashboard',
    Customer: 'Customers',
    Leads: 'Leads',
    Profile: 'Profile',
    CustomerDetails: 'Customer Details',
    EditCustomer: 'Edit Customer',
    LeadDetails: 'Lead Details',
    Orders: 'Orders',
    OrderForm: 'Order Form',
    CustomerNotes: 'Customer Notes',
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        {/* LEFT */}
        <View style={styles.left}>
          {isReturn ? (
            <BackButton />
          ) : (
            <Text style={styles.brand}>LOCUS</Text>
          )}
        </View>

        {/* CENTER */}
        <View style={styles.center}>
          <Text style={styles.title}>
            {titles[title] ?? 'LOCUS'}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <Feather
            name="bell"
            size={18}
            color={DS.color.textSecondary}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: DS.color.card,
  },

  container: {
    height: 56,
    backgroundColor: DS.color.card,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: DS.spacing.lg,

    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },

  left: {
    width: 80,
    justifyContent: 'center',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  right: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: DS.color.primary,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
});