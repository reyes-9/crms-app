import { Input } from '@/components/Input';
import { useOrder } from '@/hooks/useOrder';
import { theme } from '@/theme/colors';
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

export const OrderFormScreen = () => {
  const navigation = useNavigation();

  const { getOrdersById, editOrder, addOrder } = useOrder();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderFormScreen'>>();

  const { mode } = route.params;
  const customerId = mode === 'create' ? route.params.customerId : undefined;

  const orderId = mode === 'edit' ? route.params.orderId : undefined;
  const isEdit = mode === 'edit';

  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateOrderPayload>({
    defaultValues: {
      description: '',
      price: 0,
      status: 'pending',
    },
  });

  useEffect(() => {
    if (isEdit && orderId) {
      const fetchOrder = async () => {
        const orderData = await getOrdersById(orderId);
        setCurrentOrder(orderData || null);
      };
      fetchOrder();
    }
  }, [isEdit, orderId, getOrdersById]);

  useEffect(() => {
    if (isEdit && currentOrder) {
      reset({
        description: currentOrder.description ?? '',
        price: currentOrder.price ?? '',
        status: currentOrder.status ?? 'pending',
      });
    }
  }, [currentOrder, isEdit, reset]);

  const watchedDescription = watch('description');
  const watchedPrice = watch('price');
  const watchedStatus = watch('status');
  const properCaseStatus = watchedStatus
    ? watchedStatus.charAt(0).toUpperCase() +
      watchedStatus.slice(1).toLowerCase()
    : '';

  const onSubmit = async (data: CreateOrderPayload) => {
    try {
      if (isEdit) {
        if (!currentOrder) {
          throw new Error('No current order to update');
        }

        const updatedOrder: OrderDetails = {
          ...currentOrder,
          description: data.description,
          price: Number(data.price),
          status: data.status,
        };

        await editOrder(currentOrder.id, updatedOrder);
        Toast.show({
          type: 'success',
          text1: 'Order Updated',
          text2: 'Order details updated successfully',
        });
      } else {
        if (!customerId) {
          throw new Error('Missing customerId');
        }

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
          text2: 'New order created successfully',
        });

        navigation.goBack();
      }
    } catch (err: any) {
      // console.error('Submit failed:', err);
      // console.error('Error details:', err?.response?.data || err?.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message || 'Failed to save order',
      });
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? 'Edit Order' : 'Create Order'}
          </Text>

          <Text style={styles.subtitle}>
            {isEdit
              ? 'Update order information and status'
              : 'Create a new order and assign details'}
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Feather name="shopping-bag" size={24} color="#2563EB" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {watchedDescription || 'Untitled Order'}
            </Text>

            <Text style={styles.summarySubtitle}>
              {/* ₱ {watchedPrice || '0.00'} */}
              {formatCurrency(watchedPrice) || '0.00'}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {properCaseStatus || 'pending'}
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isEdit ? 'Edit Order' : 'Create Order'}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {isEdit
                ? 'Update order details and pricing information'
                : 'Fill in the order details below'}
            </Text>
          </View>

          {/* Description */}
          <Input
            name="description"
            label="Order Description"
            placeholder="Website redesign package"
            control={control}
            rules={{
              required: 'Description is required',
            }}
          />

          {/* Price */}
          <Input
            name="price"
            label="Price"
            placeholder="₱15,000"
            control={control}
            rules={{
              required: 'Price is required',
            }}
          />

          {/* Status */}
          <Input
            name="status"
            label="Order Status"
            placeholder="Pending"
            control={control}
            rules={{
              required: 'Status is required',
            }}
            disabled
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

                <Text style={styles.buttonText}>
                  {isEdit ? 'Saving Changes...' : 'Creating Order...'}
                </Text>
              </View>
            ) : (
              <>
                <Feather
                  name={isEdit ? 'save' : 'plus'}
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  {isEdit ? 'Save Changes' : 'Create Order'}
                </Text>
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

  summaryCard: {
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

  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,

    backgroundColor: '#DBEAFE',

    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  summarySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
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
