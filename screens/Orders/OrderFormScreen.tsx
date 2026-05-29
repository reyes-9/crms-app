import { Input } from '@/components/Input';
import { useOrder } from '@/hooks/useOrder';
import { DS } from '@/theme/design';
import { RootStackParamList } from '@/types/navigation';
import { CreateOrderPayload, OrderDetails } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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

/* ─── Screen ─────────────────────────────────────── */

export const OrderFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderFormScreen'>>();
  const { getOrdersById, editOrder, addOrder } = useOrder();

  const { mode } = route.params;
  const isEdit = mode === 'edit';
  const customerId = mode === 'create' ? route.params.customerId : undefined;
  const orderId = mode === 'edit' ? route.params.orderId : undefined;

  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateOrderPayload>({
    defaultValues: { description: '', price: 0, status: 'pending' },
  });

  useEffect(() => {
    if (isEdit && orderId) {
      getOrdersById(orderId).then((data) => setCurrentOrder(data ?? null));
    }
  }, [isEdit, orderId]);

  useEffect(() => {
    if (isEdit && currentOrder) {
      reset({
        description: currentOrder.description ?? '',
        price: currentOrder.price ?? '',
        status: currentOrder.status ?? 'pending',
      });
    }
  }, [currentOrder, isEdit]);

  const watchedDescription = watch('description');
  const watchedPrice = watch('price');
  const watchedStatus = watch('status');
  const prettyStatus = watchedStatus
    ? watchedStatus.charAt(0).toUpperCase() + watchedStatus.slice(1)
    : 'Pending';

  const onSubmit = async (data: CreateOrderPayload) => {
    try {
      if (isEdit) {
        if (!currentOrder) throw new Error('No current order to update');
        await editOrder(currentOrder.id, {
          ...currentOrder,
          ...data,
          price: Number(data.price),
        });
        Toast.show({
          type: 'success',
          text1: 'Order Updated',
          text2: 'Changes saved successfully',
        });
      } else {
        if (!customerId) throw new Error('Missing customerId');

        const newOrder: CreateOrderPayload = {
          customer: customerId,
          description: data.description,
          price: Number(data.price),
          status: data.status,
        };

        await addOrder(newOrder);

        Toast.show({
          type: 'success',
          text1: 'Order Created',
          text2: 'New order added successfully',
        });
        navigation.goBack();
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to save order',
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
          <Text style={styles.eyebrow}>{isEdit ? 'EDITING' : 'CREATE'}</Text>
          <Text style={styles.pageTitle}>
            {isEdit ? 'Edit Order' : 'New Order'}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isEdit
              ? 'Update order details and pricing'
              : 'Fill in the order details below'}
          </Text>
        </View>

        {/* ── SUMMARY CARD ─────────────────────── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Feather name="shopping-bag" size={22} color={DS.color.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {watchedDescription || 'Untitled Order'}
            </Text>
            <Text style={styles.summaryPrice}>
              {watchedPrice ? formatCurrency(watchedPrice) : '₱0.00'}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{prettyStatus}</Text>
          </View>
        </View>

        {/* ── FORM CARD ────────────────────────── */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Order Information</Text>
            <Text style={styles.formSubtitle}>
              {isEdit
                ? 'Update the details for this order'
                : 'Enter the details for the new order'}
            </Text>
          </View>

          <Input
            name="description"
            label="Order Description"
            placeholder="Website redesign package"
            control={control}
            rules={{ required: 'Description is required' }}
          />

          <Input
            name="price"
            label="Price (₱)"
            placeholder="15000"
            control={control}
            rules={{ required: 'Price is required' }}
          />

          <Input
            name="status"
            label="Status"
            placeholder="Pending"
            control={control}
            rules={{ required: 'Status is required' }}
            disabled
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
                <Text style={styles.submitText}>
                  {isEdit ? 'Saving Changes…' : 'Creating Order…'}
                </Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Feather
                  name={isEdit ? 'save' : 'plus'}
                  size={18}
                  color={DS.color.textInverse}
                />
                <Text style={styles.submitText}>
                  {isEdit ? 'Save Changes' : 'Create Order'}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DS.color.bg },
  content: { padding: DS.spacing.xl, paddingBottom: 48, gap: DS.spacing.md },

  // HEADER
  header: {},
  eyebrow: { ...DS.typography.eyebrow, marginBottom: 2 },
  pageTitle: { ...DS.typography.screenTitle },
  pageSubtitle: { fontSize: 13, color: DS.color.textSecondary, marginTop: 4 },

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  summaryPrice: { fontSize: 13, color: DS.color.textSecondary, marginTop: 3 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DS.radius.full,
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: { fontSize: 12, fontWeight: '600', color: '#92400E' },

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
