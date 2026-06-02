import Dropdown from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { useLead } from '@/hooks/useLead';
import { DS } from '@/theme/design';
import { LeadProfileForm, LeadSource } from '@/types/lead';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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

export const LeadFormScreen = () => {
  const navigation = useNavigation();

  const { addLead } = useLead();

  const [source, setSource] = useState<LeadSource | null>(null);
  const [sourceError, setSourceError] = useState(false);
  const [status, setStatus] = useState('new');

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<LeadProfileForm>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      number: '',
      source: undefined,
    },
  });

  const watchedName = watch('name');
  const watchedCompany = watch('company');

  const onSubmit = async (payload: LeadProfileForm) => {
    console.log('Customer Payload:', payload);
    try {
      await addLead(payload);
      Toast.show({
        type: 'success',
        text1: 'Lead Created',
        text2: 'New lead added successfully',
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      > */}
        {/* HEADER */}
        <View>
          <Text style={styles.eyebrow}>LEAD</Text>
          <Text style={styles.pageTitle}>New Lead</Text>
          <Text style={styles.pageSubtitle}>Add a new lead to your CRM</Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Feather name="user" size={22} color={DS.color.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {watchedName || 'Unnamed Lead'}
            </Text>

            <Text style={styles.summarySubtitle}>
              {watchedCompany || 'No company'}
            </Text>
          </View>
        </View>

        {/* FORM */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Lead Information</Text>
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

          <Dropdown
            name="source"
            control={control}
            label="Source"
            options={[
              { label: 'Website', value: 'website' },
              { label: 'Referral', value: 'referral' },
              { label: 'Social', value: 'social' },
              { label: 'Email', value: 'email' },
              { label: 'Other', value: 'other' },
            ]}
            required
            rules={{
              required: 'Source is required',
            }}
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
      {/* </KeyboardAvoidingView> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  content: {
    paddingHorizontal: DS.spacing.lg,
    paddingTop: DS.spacing.lg,
    paddingBottom: DS.spacing.xxl,
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
    marginTop: DS.spacing.md,
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
    marginTop: DS.spacing.md,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    ...DS.shadow.sm,
  },

  formTitle: {
    ...DS.typography.sectionTitle,
  },

  formSubtitle: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.xl,
  },

  // SUBMIT
  submitBtn: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.spacing.lg,
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
