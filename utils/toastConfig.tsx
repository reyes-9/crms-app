import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

const TOAST_DURATION = 4000;

const SystemToast = ({
  text1,
  text2,
  type,
  id,
  toastId: toastIdProp,
  ...rest
}: any) => {
  const progress = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const toastId = id ?? toastIdProp ?? Date.now();

  useEffect(() => {
    progress.setValue(1);
    translateY.setValue(-20);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progress, {
      toValue: 0,
      duration: TOAST_DURATION,
      useNativeDriver: false,
    }).start();
  }, [toastId]);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return {
          name: 'close' as const,
          color: '#FFFFFF',
          bg: '#EF4444',
        };
      case 'info':
        return {
          name: 'info' as const,
          color: '#FFFFFF',
          bg: '#3B82F6',
        };
      default:
        return {
          name: 'check' as const,
          color: '#FFFFFF',
          bg: '#10B981',
        };
    }
  };

  const getBarColor = () => {
    switch (type) {
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
      default:
        return '#10B981';
    }
  };

  const icon = getIcon();

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      {/* <LinearGradient
        colors={['#F9F9F8', '#01C7A0']}
        start={{ x: 1.0, y: 0.5 }}
        end={{ x: 0.0, y: 0.5 }}
        locations={[0, 1]}
        style={{ flex: 1 }}
      > */}
      <View style={styles.card}>
        {/* Icon — solid colored circle like the reference */}
        <View style={styles.iconCicleBg}>
          <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
            <MaterialIcons
              name={icon.name as any}
              size={20}
              color={icon.color}
            />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {text1}
          </Text>
          {!!text2 && (
            <Text style={styles.subtitle} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: getBarColor(),
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      {/* </LinearGradient> */}
    </Animated.View>
  );
};

export const toastConfig = {
  success: (props: any) => (
    <SystemToast key={props?.id ?? Date.now()} {...props} type="success" />
  ),
  error: (props: any) => (
    <SystemToast key={props?.id ?? Date.now()} {...props} type="error" />
  ),
  info: (props: any) => (
    <SystemToast key={props?.id ?? Date.now()} {...props} type="info" />
  ),
};

const styles = StyleSheet.create({
  container: {
    width: '88%',
    alignSelf: 'center',
    marginTop: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F9F9F8',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.07)',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    // Android shadow
    elevation: 5,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // more breathing room like reference
    paddingHorizontal: 16,
    gap: 14, // clean gap instead of margin
  },

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14, // perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // never squish the icon
  },

  iconCicleBg: {
    width: 44,
    height: 44,
    borderRadius: 22, // perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '700', // bolder like the reference
    color: '#111827',
    letterSpacing: 0.1,
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
    lineHeight: 18,
  },

  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },

  progressBar: {
    height: 3,
  },
});
