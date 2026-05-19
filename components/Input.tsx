import { theme } from '@/theme/colors';
import { InputProps } from '@/types/auth';
import { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

export const Input: React.FC<InputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry,
  rules,
  variant,
}) => {
  const isDark = variant === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const animateUp = () => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 120,
      friction: 14,
    }).start();
  };

  const animateDown = () => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 120,
      friction: 14,
    }).start();
  };

  const anim = useRef(new Animated.Value(0)).current;

  const colors = {
    text: isDark ? theme.colors.light : theme.colors.dark,
    border: isDark ? theme.colors.primaryLight : theme.colors.primary,
    // placeholder: isDark ? theme.colors.primary : theme.colors.primary,
    error: theme.colors.danger,
    background: isDark ? theme.colors.dark : theme.colors.light,
    label: isDark ? theme.colors.lightSecondary : theme.colors.textSecondary,
    labelFocused: isDark ? theme.colors.primaryLight : theme.colors.primary,
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const shouldFloat = isFocused || !!value;

        useEffect(() => {
          Animated.timing(anim, {
            toValue: shouldFloat ? 1 : 0,
            duration: 180,
            useNativeDriver: false,
          }).start();
        }, [shouldFloat]);

        return (
          <View style={styles.container}>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: error
                    ? colors.error
                    : isFocused
                      ? colors.border
                      : colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {/* Floating Label */}
              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: error
                      ? colors.error
                      : isFocused
                        ? colors.labelFocused
                        : colors.label,
                    top: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, 6],
                    }),

                    fontSize: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        theme.typography.fontSize.md,
                        theme.typography.fontSize.xs,
                      ],
                    }),
                  },
                ]}
              >
                {placeholder}
                {rules?.required && error && (
                  <Text style={styles.asterisk}> * </Text>
                )}
              </Animated.Text>

              <TextInput
                value={value}
                secureTextEntry={secureTextEntry}
                onChangeText={onChange}
                onFocus={() => {
                  setIsFocused(true);
                  animateUp();
                }}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();

                  if (!value) {
                    animateDown();
                  }
                }}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    paddingTop: 12,
                  },
                ]}
              />
            </View>

            {error?.message && (
              <Text style={styles.error}>{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
    position: 'relative',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  input: {
    fontSize: theme.typography.fontSize.md,
    padding: 0,
  },

  label: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
    fontWeight: '500',
  },

  error: {
    marginTop: 6,
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.xs,
    paddingHorizontal: 2,
  },

  asterisk: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.sm,
  },
});
