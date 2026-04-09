import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/Input';
import { useUser } from '@/hooks/useUser';
import { theme } from '@/theme/colors';
import { LoginCredentials } from '@/types/auth';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

export const LoginScreen = () => {
  const { login, loadUser, user } = useUser();
  const [err, setErr] = useState('');

  const router = useRouter();

  useEffect(() => {
    // console.log(user);

    if (user != null) {
      router.push('/app/home');
    }
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginCredentials>({});

  const onSubmit = async (data: LoginCredentials) => {
    // console.log('Crasync edentials: ', data);

    try {
      await login({
        username: data.username,
        password: data.password,
      });

      (await loadUser(), router.push('/app/home'));
    } catch (err: any) {
      console.log(err.message);
      setErr(err.message);
    }
  };

  const handleSignUp = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView edges={['bottom', 'right']} style={styles.container}>
      {/* <BackButton /> */}
      <View style={styles.content}>
        {/* Branding */}
        <View style={styles.brand}>
          <Image
            source={require('../assets/images/nexus_logo.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>Locus</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.helperText}>
          Note: (<Text style={{ color: theme.colors.error }}>*</Text>) Required
          field — please fill this in
        </Text>

        {/* Form */}
        {/* { if value ? true : false } */}
        {err ? <Text style={styles.errorMsg}>{err}</Text> : ''}

        <View style={styles.form}>
          <Input
            name="username"
            placeholder="Username"
            control={control}
            rules={{
              required: true,
            }}
          />

          <Input
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{
              required: true,
            }}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && { backgroundColor: theme.colors.primaryLight }, // subtle feedback
              { opacity: pressed ? 0.7 : 1 }, // increase opacity when pressed,
              isSubmitting && { opacity: 0.7 }, // dim when disabled
            ]}
          >
            {isSubmitting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.textInverse}
                />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                  Logging In...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
          <Text style={styles.link}>Forgot Password</Text>
        </View>
      </View>
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
    padding: 50,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 70,
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
    marginBottom: 30,
  },
  helperText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  errorMsg: {
    color: theme.colors.error,
    backgroundColor: `${theme.colors.error}45`, // append hex alpha (80 = 50%)
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    backgroundColor: theme.colors.light,
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    color: theme.colors.textPrimary,
  },
  button: {
    backgroundColor: theme.colors.primaryLight,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
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
