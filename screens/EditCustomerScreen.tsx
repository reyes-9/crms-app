import { Input } from '@/components/Input';
import { useCustomer } from '@/hooks/useCustomer';
import { theme } from '@/theme/colors';
import { CustomerProfile } from '@/types/customer';
import { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export const EditCustomerScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();

  const { customer } = route.params;

  const { editCustomer } = useCustomer();

  const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CustomerProfile>({
    defaultValues: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      company: customer.company,
      number: customer.number,
    },
  });

  const watchedName = watch('name');
  const watchedCompany = watch('company');

  const onSubmit = async (data: CustomerProfile) => {
    try {
      await editCustomer(customer.id, data);

      Toast.show({
        type: 'success',
        text1: 'Customer Updated',
        text2: 'Customer profile saved successfully',
      });

      console.log('Customer updated successfully');
    } catch (err) {
      console.error('Update failed:', err);

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Something went wrong while saving changes',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={10} // tweak if needed
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Customer</Text>

          <Text style={styles.subtitle}>
            Update customer details and contact information
          </Text>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {customer.name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{watchedName}</Text>

            <Text style={styles.customerCompany}>
              {watchedCompany || 'No company'}
            </Text>
          </View>

          <View style={styles.badge}>
            <Feather name="user" size={14} color={theme.colors.primary} />

            <Text style={styles.badgeText}>Customer</Text>
          </View>
        </View>

        {/* Form Card */}
        {/* Form Card */}
        <View style={styles.card}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customer Information</Text>

            <Text style={styles.sectionSubtitle}>
              Update the customer's profile and contact details
            </Text>
          </View>

          {/* Name */}
          <Input
            name="name"
            label="Full Name"
            placeholder="Juan Dela Cruz"
            control={control}
            rules={{
              required: 'Name is required',
            }}
          />

          {/* Email */}
          <Input
            name="email"
            label="Email Address"
            placeholder="juan@email.com"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email address',
              },
            }}
          />

          {/* Phone */}
          <Input
            name="number"
            label="Phone Number"
            placeholder="09123456789"
            control={control}
            rules={{
              required: 'Phone number is required',
            }}
          />

          {/* Company */}
          <Input
            name="company"
            label="Company"
            placeholder="Locus CRM Inc."
            control={control}
            rules={{
              required: 'Company is required',
            }}
          />

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={styles.buttonText}>Saving Changes...</Text>
              </View>
            ) : (
              <>
                <Feather name="save" size={18} color="#FFFFFF" />

                <Text style={styles.buttonText}>Save Changes</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,

    marginBottom: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: '#DCFCE7',

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15803D',
  },

  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  customerCompany: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 999,

    backgroundColor: '#EFF6FF',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // FORM
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sectionHeader: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },

  button: {
    marginTop: 8,

    height: 54,
    borderRadius: 14,

    backgroundColor: theme.colors.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  buttonPressed: {
    opacity: 0.9,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
