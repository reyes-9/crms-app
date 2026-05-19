import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  };

  return (
    <SafeAreaView style={{}} edges={['left', 'right', 'top']}>
      <View style={styles.container}>
        {/* Left (Brand) */}
        {isReturn ? <BackButton /> : <Text style={styles.brand}>Locus</Text>}
        {/* Center (Title) */}
        <Text style={styles.title}>{title ? titles[title] : 'Locus'}</Text>
        {/* Right (Icon) */}
        <Feather name="bell" size={22} color="#444" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  brand: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },

  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',

    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2A',
  },
});
