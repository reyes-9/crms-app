import { useState } from 'react';
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
import { theme } from '../theme/colors';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
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
        <Text style={styles.title}>Login</Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
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
