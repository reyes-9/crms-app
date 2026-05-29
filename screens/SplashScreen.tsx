import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { DS } from '@/theme/design';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

export const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const anim = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    anim.start(() => {
      setTimeout(() => {
        navigation.replace('Login');
      }, 500);
    });

    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/nexus_logo.png')}
            style={styles.logo}
          />

          <Text style={styles.appName}>LOCUS</Text>

          <Text style={styles.appTag}>Customer Relationship Management</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.slogan}>
          Manage customers, orders, and relationships in one place.
        </Text>

        <View style={styles.loadingDot} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: DS.spacing.xxl,
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: DS.radius.lg,
    marginBottom: DS.spacing.lg,
  },

  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: DS.color.textPrimary,
    letterSpacing: 1.5,
  },

  appTag: {
    marginTop: DS.spacing.xs,
    fontSize: 13,
    color: DS.color.textSecondary,
  },

  divider: {
    width: 120,
    height: 1,
    backgroundColor: DS.color.border,
    marginVertical: DS.spacing.xl,
  },

  slogan: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.xl,
    maxWidth: 260,
  },

  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: DS.color.primary,
    opacity: 0.6,
  },
});
