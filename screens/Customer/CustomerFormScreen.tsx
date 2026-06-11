import { Input } from '@/components/Input';
import { useCustomer } from '@/hooks/useCustomer';
import { DS } from '@/theme/design';
import { CustomerProfileForm } from '@/types/customer';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
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

export const CustomerFormScreen = () => {
  const navigation = useNavigation();
  const { addCustomer } = useCustomer();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CustomerProfileForm>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      number: '',
    },
  });

  const watchedName = watch('name');
  const watchedCompany = watch('company');

  const onSubmit = async (payload: CustomerProfileForm) => {
    try {
      await addCustomer(payload);
      Toast.show({
        type: 'success',
        text1: 'Customer Created',
        text2: 'New customer added successfully',
      });
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save order',
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
      >
        {/* HEADER */}
        <View>
          <Text style={styles.eyebrow}>CUSTOMER</Text>
          <Text style={styles.pageTitle}>New Customer</Text>
          <Text style={styles.pageSubtitle}>
            Add a new customer to your CRM
          </Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Feather name="user" size={22} color={DS.color.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {watchedName || 'Unnamed Customer'}
            </Text>

            <Text style={styles.summarySubtitle}>
              {watchedCompany || 'No company'}
            </Text>
          </View>
        </View>

        {/* FORM */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Customer Information</Text>
          <Text style={styles.formSubtitle}>Fill in the required details</Text>

          <Input
            control={control}
            name="name"
            label="Full Name"
            placeholder="Juan Dela Cruz"
            rules={{ required: 'Name is required' }}
          />

          <Input
            control={control}
            name="company"
            label="Company"
            placeholder="ABC Construction Corp."
            rules={{ required: 'Company is required' }}
          />

          <Input
            control={control}
            name="email"
            label="Email Address"
            placeholder="juan@example.com"
            rules={{ required: 'Email is required' }}
          />

          <Input
            control={control}
            name="number"
            label="Mobile Number"
            placeholder="+63 912 345 6789"
            rules={{ required: 'Phone number is required' }}
          />

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.9 },
              isSubmitting && { opacity: 0.7 },
            ]}
          >
            {isSubmitting ? (
              <View style={styles.submitRow}>
                <ActivityIndicator size="small" color={DS.color.textInverse} />
                <Text style={styles.submitText}>Saving Customer...</Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Feather
                  name="user-plus"
                  size={18}
                  color={DS.color.textInverse}
                />
                <Text style={styles.submitText}>Create Customer</Text>
              </View>
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
    backgroundColor: DS.color.bg,
  },

  content: {
    padding: DS.spacing.xl,
    gap: DS.spacing.md,
    paddingBottom: 40,
  },

  // HEADER
  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: 2,
  },
  pageTitle: {
    ...DS.typography.screenTitle,
  },
  pageSubtitle: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginTop: 4,
  },

  // SUMMARY
  summaryCard: {
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

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },

  summarySubtitle: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginTop: 3,
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

  formTitle: {
    ...DS.typography.sectionTitle,
  },

  formSubtitle: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.sm,
  },

  // SUBMIT
  submitBtn: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.spacing.sm,
  },

  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  submitText: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.color.textInverse,
  },
});
