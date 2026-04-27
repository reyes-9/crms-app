import { Input } from '@/components/Input';
import { useCustomer } from '@/hooks/useCustomer';
import { theme } from '@/theme/colors';
import { CustomerProfile } from '@/types/customer';
import { RootStackParamList } from '@/types/navigation';
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

  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const setFieldMessage = true;

  const {
    control,
    handleSubmit,
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

  const onSubmit = async (data: CustomerProfile) => {
    try {
      await editCustomer(customer.id, data);
      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Profile updated',
      });
      console.log('Customer updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Customer Profile</Text>
            <Text style={styles.subtitle}>Edit and manage customer data</Text>
          </View>

          <Text style={styles.note}>
            Note: (<Text style={{ color: theme.colors.danger }}>*</Text>)
            Required field — please fill this in
          </Text>

          <Input
            name="name"
            placeholder="Name"
            control={control}
            rules={{ required: true }}
          />
          <Input
            name="email"
            placeholder="Email"
            control={control}
            rules={{
              required: setFieldMessage,
              pattern: { value: EMAIL_REGEX, message: 'Invalid email.' },
            }}
          />
          <Input
            name="company"
            placeholder="Company"
            control={control}
            rules={{ required: true }}
          />
          <Input
            name="number"
            placeholder="Number"
            control={control}
            rules={{ required: true }}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.textInverse}
                />
                <Text style={styles.btnText}>Applying Changes...</Text>
              </View>
            ) : (
              <Text style={styles.btnText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {},

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  card: {
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#1D9E75',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },

  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
