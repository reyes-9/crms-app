import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { DS } from '@/theme/design';
import { LoginCredentials } from '@/types/auth';
import { RootStackParamList } from '@/types/navigation';

type SplashScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export const LoginScreen = () => {
  const { login, loadUser, user } = useUser();
  const navigation = useNavigation<SplashScreenNavProp>();

  const [err, setErr] = useState('');

  useEffect(() => {
    if (user) {
      navigation.replace('Main');
    }
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setErr('');

      await login({
        username: data.username,
        password: data.password,
      });

      navigation.replace('Main');
    } catch (err: any) {
      setErr(err.message);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brand}>
          <Image
            source={require('@/assets/images/nexus_logo.png')}
            style={styles.logo}
          />

          <Text style={styles.appName}>LOCUS</Text>

          <Text style={styles.appDescription}>
            Customer Relationship Management
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.authCard}>
          <Text style={styles.eyebrow}>WORKSPACE ACCESS</Text>

          <Text style={styles.title}>Sign In</Text>

          <Text style={styles.subtitle}>
            Access your workspace to manage customers, orders, notes, and
            activities.
          </Text>

          {err ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={DS.color.danger} />
              <Text style={styles.errorMsg}>{err}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              name="username"
              label="Username"
              placeholder="Enter your username"
              control={control}
              rules={{
                required: true,
              }}
              variant="light"
            />

            <Input
              name="password"
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              control={control}
              rules={{
                required: true,
              }}
              variant="light"
            />

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={[
                styles.signInButton,
                isSubmitting && styles.signInButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="small"
                    color={DS.color.textInverse}
                  />
                  <Text style={styles.signInButtonText}>Signing In...</Text>
                </View>
              ) : (
                <>
                  <Feather
                    name="log-in"
                    size={18}
                    color={DS.color.textInverse}
                  />
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </>
              )}
            </Pressable>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>

          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: DS.spacing.xxl,
  },

  brand: {
    alignItems: 'center',
    marginBottom: DS.spacing.xxxl,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: DS.radius.lg,
  },

  appName: {
    marginTop: DS.spacing.lg,
    fontSize: 28,
    fontWeight: '700',
    color: DS.color.textPrimary,
    letterSpacing: 1,
  },

  appDescription: {
    marginTop: DS.spacing.xs,
    ...DS.typography.caption,
  },

  authCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.xxl,
    ...DS.shadow.sm,
  },

  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: DS.spacing.sm,
  },

  title: {
    ...DS.typography.screenTitle,
    marginBottom: DS.spacing.sm,
  },

  subtitle: {
    ...DS.typography.body,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.xl,
  },

  form: {
    gap: DS.spacing.lg,
    marginTop: DS.spacing.lg,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DS.spacing.md,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: DS.spacing.lg,
  },

  errorMsg: {
    flex: 1,
    marginLeft: DS.spacing.sm,
    color: DS.color.danger,
    fontSize: 13,
  },

  signInButton: {
    marginTop: DS.spacing.sm,
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  signInButtonDisabled: {
    opacity: 0.7,
  },

  signInButtonText: {
    marginLeft: DS.spacing.sm,
    color: DS.color.textInverse,
    fontWeight: '600',
    fontSize: 15,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: DS.spacing.sm,
  },

  linkText: {
    color: DS.color.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  footer: {
    marginTop: DS.spacing.xxl,
    alignItems: 'center',
  },

  footerText: {
    color: DS.color.textSecondary,
    fontSize: 14,
  },

  createAccountText: {
    marginTop: DS.spacing.xs,
    color: DS.color.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
