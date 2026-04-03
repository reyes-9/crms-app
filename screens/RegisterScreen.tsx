// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)
// the api is created just need to use it in here (ui)

import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '../components/BackButton';
import { useUser } from '../hooks/useUser';
import { theme } from '../theme/colors';

export const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const { user } = useUser();

  const handleLogin = () => {
    console.log('Current User:', user);
    console.log('Username:', email);
    console.log('Password:', password);
    // Add your login logic here
  };

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
        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={first_name}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={last_name}
            onChangeText={setLastName}
          />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone_number}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

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
