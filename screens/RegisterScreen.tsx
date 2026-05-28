import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Input } from '@/components/Input';
import { ReusableModal } from '@/components/ReusableModal';
import { useUser } from '@/hooks/useUser';
import { theme } from '@/theme/colors';
import { RegisterCredentials } from '@/types/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm } from 'react-hook-form';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

export const RegisterScreen = () => {
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const setFieldMessage = true;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { register } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterCredentials>({
    /*can have default values for the inputs*/
    // FOR TESTING ONLY
    defaultValues: {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      phone_number: '12345678901',
      address: '123 Test Street',
      email: 'test@example.com',
      password: 'testpassword',
      // confirmPassword: 'testpassword',
    },
  });
  // for validating the confirm password real-time
  const password = watch('password');
  // You are telling TypeScript:
  // "I know this data is an object where keys are field names and values are arrays of error strings."
  // This allows you to use Object.entries safely.

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
      }, 3500);
    } catch (err: any) {
      console.log(err);
      if (err.response && err.response.data) {
        const errorData = err.response.data as BackendErrorResponse;

        Object.entries(errorData).forEach(([field, messages]) => {
          setError(field as keyof RegisterCredentials, {
            type: 'manual',
            message: Array.isArray(messages) ? messages.join(', ') : messages,
          });
        });
      } else {
        Alert.alert('Registration failed', 'Unexpected error occurred.');
      }
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={{ alignItems: 'flex-start', marginStart: 20 }}>
        <BackButton />
      </View>

      <ReusableModal
        state="success"
        buttons={[]}
        visible={modalVisible}
        title="Account Created Successfully!"
        message="Now you can login and use our services."
        onClose={() => setModalVisible(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20} // tweak if needed
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Register</Text>

          <Text style={styles.helperText}>
            Note: (<Text style={{ color: theme.colors.danger }}>*</Text>)
            Required field — please fill this in
          </Text>

          {/* First Name + Last Name */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                name="first_name"
                label="First Name"
                placeholder="Juan"
                control={control}
                rules={{ required: setFieldMessage }}
                variant="dark"
              />
            </View>

            <View style={styles.half}>
              <Input
                name="last_name"
                label="Last Name"
                placeholder="Dela Cruz"
                control={control}
                rules={{ required: setFieldMessage }}
                variant="dark"
              />
            </View>
          </View>

          {/* Email */}
          <Input
            name="email"
            label="Email"
            placeholder="juan@email.com"
            control={control}
            rules={{
              required: setFieldMessage,
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email.',
              },
            }}
            variant="dark"
          />

          {/* Username + Phone */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                name="username"
                label="Username"
                placeholder="juandelacruz"
                control={control}
                rules={{
                  required: setFieldMessage,
                  minLength: {
                    value: 3,
                    message: 'It should be minimum 3 characters long.',
                  },
                  maxLength: {
                    value: 25,
                    message: 'It should be maximum 25 characters long.',
                  },
                }}
                variant="dark"
              />
            </View>

            <View style={styles.half}>
              <Input
                name="phone_number"
                label="Phone Number"
                placeholder="09123456789"
                control={control}
                rules={{
                  required: setFieldMessage,
                  minLength: {
                    value: 11,
                    message:
                      'Phone Number should be minimum 11 characters long.',
                  },
                  maxLength: {
                    value: 11,
                    message:
                      'Phone Number should be maximum 11 characters long.',
                  },
                }}
                variant="dark"
              />
            </View>
          </View>

          {/* Address */}
          <Input
            name="address"
            label="Address"
            placeholder="Quezon City, Metro Manila"
            control={control}
            rules={{ required: setFieldMessage }}
            variant="dark"
          />

          {/* Password */}
          <Input
            name="password"
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            control={control}
            rules={{
              required: setFieldMessage,
              minLength: {
                value: 8,
                message: 'Password should be minimum 8 characters long.',
              },
            }}
            variant="dark"
          />

          {/* Confirm Password */}
          <Input
            name="confirm_password"
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            control={control}
            rules={{
              required: setFieldMessage,
              validate: (value) =>
                value === password || 'Password do not match',
            }}
            variant="dark"
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && {
                backgroundColor: theme.colors.primaryLight,
                opacity: 0.85,
              },
              isSubmitting && { opacity: 0.7 },
            ]}
          >
            {isSubmitting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.textInverse}
                />

                <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                  Creating account...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </Pressable>

          <View style={styles.footer} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.dark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    paddingTop: 0,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 45,
  },
  logo: {
    borderRadius: 8,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '500',
    color: theme.colors.primarySoft,
    marginBottom: 40,
  },
  helperText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 40,
  },

  form: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  half: {
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primaryLight,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: theme.colors.light,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: theme.colors.primarySoft,
    marginTop: 10,
  },
});
