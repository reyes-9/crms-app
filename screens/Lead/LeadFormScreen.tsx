import Dropdown from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { useLead } from '@/hooks/useLead';
import { DS } from '@/theme/design';
import { LeadProfileForm } from '@/types/lead';
import { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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

type LeadFormRoute = RouteProp<RootStackParamList, 'LeadForm'>;

export const LeadFormScreen = () => {
  const navigation = useNavigation();

  const route = useRoute<LeadFormRoute>();
  const { mode } = route.params;
  const isEditing = mode === 'edit';
  const lead = isEditing ? route.params.lead : undefined;

  const { addLead, editLead } = useLead();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<LeadProfileForm>({
    defaultValues: {
      name: lead?.name ?? '',
      company: lead?.company ?? '',
      email: lead?.email ?? '',
      number: lead?.number ?? '',
      source: lead?.source ?? undefined,
    },
  });

  const watchedName = watch('name');
  const watchedCompany = watch('company');

  const onSubmit = async (payload: LeadProfileForm) => {
    try {
      if (isEditing) {
        await editLead(lead.id, payload);
        Toast.show({
          type: 'success',
          text1: 'Lead Updated',
          text2: 'Lead updated successfully',
        });
      } else {
        await addLead(payload);
        Toast.show({
          type: 'success',
          text1: 'Lead Created',
          text2: 'New lead added successfully',
        });
        navigation.goBack();
      }
      
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to ${isEditing ? 'update' : 'save'} lead`,
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
          <Text style={styles.eyebrow}>LEAD</Text>
          <Text style={styles.pageTitle}>
            {isEditing ? 'Edit Lead' : 'New Lead'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isEditing
              ? 'Update the details of this lead'
              : 'Add a new lead to your CRM'}
          </Text>
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
            rules={{ required: 'Source is required' }}
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
                <Text style={styles.submitText}>
                  {isEditing ? 'Updating Lead...' : 'Saving Lead...'}
                </Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Feather
                  name={isEditing ? 'save' : 'user-plus'}
                  size={18}
                  color={DS.color.textInverse}
                />
                <Text style={styles.submitText}>
                  {isEditing ? 'Update Lead' : 'Create Lead'}
                </Text>
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
