import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Input } from '@/components/Input';
import { useUser } from '@/hooks/useUser';
import { theme } from '@/theme/colors';
import { RegisterCredentials } from '@/types/auth';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

export const RegisterScreen = () => {
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const router = useRouter();

  const { register } = useUser();
  const {
    control,
    handleSubmit,
    watch,
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

      router.replace('/login');
    } catch (err: any) {
      const msg = err.message;
      Alert.alert('Registration failed. Please try again.', msg);
    }
  };

  const fieldMessage = true;

  return (
    <SafeAreaView edges={['bottom', 'right']} style={styles.container}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20} // tweak if needed
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Register</Text>
          <Text style={styles.helperText}>
            {' '}
            Note:
            <Text style={{ color: theme.colors.error }}> *</Text> Required field
            — please fill this in
          </Text>
          {/* Form */}
          {/* First Name + Last Name */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                name="first_name"
                placeholder="First Name"
                control={control}
                rules={{ required: fieldMessage }}
              />
            </View>
            <View style={styles.half}>
              <Input
                name="last_name"
                placeholder="Last Name"
                control={control}
                rules={{ required: fieldMessage }}
              />
            </View>
          </View>

          {/* Email */}
          <Input
            name="email"
            placeholder="Email"
            control={control}
            rules={{
              required: fieldMessage,
              pattern: { value: EMAIL_REGEX, message: 'Invalid email.' },
            }}
          />

          {/* Username + Phone */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                name="username"
                placeholder="Username"
                control={control}
                rules={{
                  required: fieldMessage,
                  minLength: {
                    value: 3,
                    message: 'It should be minimum 3 characters long.',
                  },
                  maxLength: {
                    value: 25,
                    message: 'It should be maximum 25 characters long.',
                  },
                }}
              />
            </View>
            <View style={styles.half}>
              <Input
                name="phone_number"
                placeholder="Phone Number"
                control={control}
                rules={{
                  required: fieldMessage,
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
              />
            </View>
          </View>

          {/* Address */}
          <Input
            name="address"
            placeholder="Address"
            control={control}
            rules={{ required: fieldMessage }}
          />

          {/* Password */}
          <Input
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{
              required: fieldMessage,
              minLength: {
                value: 8,
                message: 'Password should be minimum 8 characters long.',
              },
            }}
          />

          {/* Confirm Password */}
          <Input
            name="confirm_password"
            placeholder="Confirm Password"
            secureTextEntry
            control={control}
            rules={{
              required: fieldMessage,
              validate: (value) =>
                value === password || 'Password do not match',
            }}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footer}></View>
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
  appName: {
    fontSize: 24,
    color: theme.colors.textInverse,
  },
  title: {
    fontSize: 48,
    fontWeight: '500',
    color: theme.colors.primarySoft,
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
  helperText: {
    fontSize: 12, // small, unobtrusive
    fontStyle: 'italic',
    color: theme.colors.textSecondary, // or use a neutral gray if not error-related
    alignSelf: 'flex-start', // aligns nicely under the field
    marginBottom: 20,
  },
});
