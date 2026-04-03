import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Input } from '@/components/Input';
import { useUser } from '@/hooks/useUser';
import { theme } from '@/theme/colors';
import { RegisterCredentials } from '@/types/auth';
import { useForm } from 'react-hook-form';

export const RegisterScreen = () => {
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const { user } = useUser();

  const onSubmit = (data: RegisterCredentials) => {
    console.log('Data: ', data);
    // console.log('Current User:', user);
    // Add your login logic here
  };

  const {
    control,
    handleSubmit,
    watch,
    // formState: { errors },
  } = useForm<RegisterCredentials>();

  const pwd = watch('password');

  return (
    <SafeAreaView edges={['bottom', 'right']} style={styles.container}>
      <BackButton />
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
        <Text style={styles.title}>Register</Text>
        {/* Form */}
        <Input
          name="firstName"
          placeholder="First Name"
          control={control}
          rules={{ required: 'First name is required' }}
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          control={control}
          rules={{ required: 'Last name is required' }}
        />
        <Input
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: { value: EMAIL_REGEX, message: 'Invalid email.' },
          }}
        />
        <Input
          name="username"
          placeholder="Username"
          control={control}
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be minimum 3 characters long.',
            },
            maxLength: {
              value: 25,
              message: 'Username should be maximum 25 characters long.',
            },
          }}
        />
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          control={control}
          rules={{
            required: 'This field is required',
            minLength: {
              value: 11,
              message:
                'Phone Number should always be minimum 11 characters long.',
            },
            maxLength: {
              value: 11,
              message:
                'Phone Number should always be maximum 11 characters long.',
            },
          }}
        />
        <Input
          name="address"
          placeholder="Address"
          control={control}
          rules={{ required: 'Address is required' }}
        />
        <Input
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be minimum 8 characters long.',
            },
          }}
        />
        <Input
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
          control={control}
          rules={{
            validate: (value) => value === pwd || 'Password do not match',
          }}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footer}></View>
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
  form: {
    marginBottom: 30,
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
