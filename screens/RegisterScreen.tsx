import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Input } from '@/components/Input';
import { ReusableModal } from '@/components/ReusableModal';
import { useUser } from '@/hooks/useUser';
import { DS } from '@/theme/design';
import { RegisterCredentials } from '@/types/auth';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

type NavProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const RegisterScreen = ({ navigation }: { navigation: NavProp }) => {
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const { register } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterCredentials>();

  const password = watch('password');

  type BackendErrorResponse = Record<string, string[]>;

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await register({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        address: data.address,
        email: data.email,
        password: data.password,
      });

      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.replace('Login');
      }, 2500);
    } catch (err: any) {
      if (err.response?.data) {
        const errorData = err.response.data as BackendErrorResponse;

        Object.entries(errorData).forEach(([field, messages]) => {
          setError(field as any, {
            type: 'manual',
            message: Array.isArray(messages)
              ? messages.join(', ')
              : String(messages),
          });
        });
      } else {
        Alert.alert('Registration failed', 'Unexpected error occurred.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <BackButton />

          <ReusableModal
            state="success"
            buttons={[]}
            visible={modalVisible}
            title="Account Created"
            message="You can now sign in to your workspace."
            onClose={() => setModalVisible(false)}
          />

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>LOCUS CRM</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Set up your workspace to manage customers, orders, and notes.
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.card}>
            {/* PERSONAL INFO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.row}>
                <View style={styles.half}>
                  <Input
                    name="first_name"
                    label="First Name"
                    placeholder="Juan"
                    control={control}
                    rules={{ required: true }}
                    variant="light"
                  />
                </View>

                <View style={styles.half}>
                  <Input
                    name="last_name"
                    label="Last Name"
                    placeholder="Dela Cruz"
                    control={control}
                    rules={{ required: true }}
                    variant="light"
                  />
                </View>
              </View>

              <Input
                name="email"
                label="Email"
                placeholder="juan@email.com"
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Invalid email',
                  },
                }}
                variant="light"
              />

              <View style={styles.row}>
                <View style={styles.half}>
                  <Input
                    name="phone_number"
                    label="Phone Number"
                    placeholder="09123456789"
                    control={control}
                    rules={{ required: true }}
                    variant="light"
                  />
                </View>

                <View style={styles.half}>
                  <Input
                    name="username"
                    label="Username"
                    placeholder="juandelacruz"
                    control={control}
                    rules={{ required: true }}
                    variant="light"
                  />
                </View>
              </View>

              <Input
                name="address"
                label="Address"
                placeholder="Quezon City"
                control={control}
                rules={{ required: true }}
                variant="light"
              />
            </View>

            {/* ACCOUNT INFO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Security</Text>

              <Input
                name="password"
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                control={control}
                rules={{ required: true, minLength: 8 }}
                variant="light"
              />

              <Input
                name="confirm_password"
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry
                control={control}
                rules={{
                  required: true,
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                }}
                variant="light"
              />
            </View>

            {/* SUBMIT */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.85 },
                isSubmitting && { opacity: 0.7 },
              ]}
            >
              {isSubmitting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={DS.color.textInverse} />
                  <Text style={styles.buttonText}>Creating account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>

              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  scroll: {
    padding: DS.spacing.xxl,
    paddingBottom: DS.spacing.xxxl,
  },

  header: {
    marginBottom: DS.spacing.xxl,
  },

  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: DS.spacing.sm,
  },

  title: {
    ...DS.typography.screenTitle,
  },

  subtitle: {
    ...DS.typography.body,
    color: DS.color.textSecondary,
    marginTop: DS.spacing.sm,
  },

  card: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.xxl,
    ...DS.shadow.sm,
  },

  section: {
    marginBottom: DS.spacing.xxl,
  },

  sectionTitle: {
    ...DS.typography.sectionTitle,
    marginBottom: DS.spacing.lg,
  },

  row: {
    flexDirection: 'row',
    gap: DS.spacing.md,
  },

  half: {
    flex: 1,
  },

  button: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.spacing.sm,
  },

  buttonText: {
    color: DS.color.textInverse,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: DS.spacing.sm,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    marginTop: DS.spacing.xl,
    alignItems: 'center',
  },

  footerText: {
    color: DS.color.textSecondary,
    fontSize: 14,
  },

  footerLink: {
    marginTop: 6,
    color: DS.color.primary,
    fontWeight: '600',
  },
});
