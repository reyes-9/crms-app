import { Input } from '@/components/Input';
import { useCustomer } from '@/hooks/useCustomer';
import { DS } from '@/theme/design';
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

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const EditCustomerScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetails'>>();
  const { customer } = route.params;
  const { editCustomer } = useCustomer();

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

  const initials =
    watchedName
      ?.split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() ?? '?';

  const onSubmit = async (data: CustomerProfile) => {
    try {
      await editCustomer(customer.id, data);
      Toast.show({
        type: 'success',
        text1: 'Customer Updated',
        text2: 'Profile saved successfully',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Something went wrong while saving',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── PAGE HEADER ──────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EDITING</Text>
          <Text style={styles.pageTitle}>Edit Customer</Text>
          <Text style={styles.pageSubtitle}>
            Update customer details and contact information
          </Text>
        </View>

        {/* ── PROFILE PREVIEW ──────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              {watchedName || 'Customer Name'}
            </Text>
            <Text style={styles.profileCompany}>
              {watchedCompany || 'No company'}
            </Text>
          </View>

          <View style={styles.profileBadge}>
            <Feather name="user" size={13} color={DS.color.primary} />
            <Text style={styles.profileBadgeText}>Customer</Text>
          </View>
        </View>

        {/* ── FORM CARD ────────────────────────── */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Customer Information</Text>
            <Text style={styles.formSubtitle}>
              Update the customer's profile and contact details
            </Text>
          </View>

          <Input
            name="name"
            label="Full Name"
            placeholder="Juan Dela Cruz"
            control={control}
            rules={{ required: 'Name is required' }}
          />

          <Input
            name="email"
            label="Email Address"
            placeholder="juan@email.com"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: { value: EMAIL_REGEX, message: 'Invalid email address' },
            }}
          />

          <Input
            name="number"
            label="Phone Number"
            placeholder="09123456789"
            control={control}
            rules={{ required: 'Phone number is required' }}
          />

          <Input
            name="company"
            label="Company"
            placeholder="Locus CRM Inc."
            control={control}
            rules={{ required: 'Company is required' }}
          />

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.88 },
              isSubmitting && { opacity: 0.7 },
            ]}
          >
            {isSubmitting ? (
              <View style={styles.submitRow}>
                <ActivityIndicator size="small" color={DS.color.textInverse} />
                <Text style={styles.submitText}>Saving Changes…</Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Feather name="save" size={18} color={DS.color.textInverse} />
                <Text style={styles.submitText}>Save Changes</Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DS.color.bg },
  content: { padding: DS.spacing.xl, paddingBottom: 48, gap: DS.spacing.md },

  // HEADER
  header: {},
  eyebrow: { ...DS.typography.eyebrow, marginBottom: 2 },
  pageTitle: { ...DS.typography.screenTitle },
  pageSubtitle: { fontSize: 13, color: DS.color.textSecondary, marginTop: 4 },

  // PROFILE
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
  avatarText: { fontSize: 18, fontWeight: '700', color: DS.color.primary },
  profileName: { fontSize: 16, fontWeight: '700', color: DS.color.textPrimary },
  profileCompany: { fontSize: 13, color: DS.color.textSecondary, marginTop: 2 },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DS.color.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: DS.radius.full,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: DS.color.primary,
  },

  // FORM
  formCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    gap: DS.spacing.md,
    ...DS.shadow.sm,
  },
  formHeader: { gap: 4, marginBottom: DS.spacing.xs },
  formTitle: { ...DS.typography.sectionTitle },
  formSubtitle: { fontSize: 13, color: DS.color.textSecondary },

  // SUBMIT
  submitBtn: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.spacing.sm,
  },
  submitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitText: { fontSize: 15, fontWeight: '600', color: DS.color.textInverse },
});
