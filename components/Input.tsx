import { theme } from '@/theme/colors';
import { InputProps } from '@/types/auth';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const Input: React.FC<InputProps> = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  rules,
  variant,
  defaultValue = '',
  disabled = false,
}) => {
  const isDark = variant === 'dark';

  const colors = {
    text: isDark ? theme.colors.light : theme.colors.dark,

    border: isDark ? '#374151' : '#D1D5DB',

    borderFocused: isDark
      ? theme.colors.primaryLight
      : theme.colors.primary,

    background: isDark ? '#111827' : '#FFFFFF',

    label: isDark ? '#D1D5DB' : '#374151',

    placeholder: isDark ? '#6B7280' : '#9CA3AF',

    error: theme.colors.danger,

    disabledBackground: '#F3F4F6',
    disabledText: '#9CA3AF',
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <View style={styles.container}>
            {label && (
              <Text
                style={[
                  styles.label,
                  {
                    color: error ? colors.error : colors.label,
                  },
                ]}
              >
                {label}
                {rules?.required && (
                  <Text style={styles.asterisk}> *</Text>
                )}
              </Text>
            )}

            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: error ? colors.error : colors.border,
                  backgroundColor: disabled
                    ? colors.disabledBackground
                    : colors.background,
                },
              ]}
            >
              <TextInput
                value={value}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  {
                    color: disabled ? colors.disabledText : colors.text,
                  },
                ]}
              />
            </View>

            {!!error?.message && (
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
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },

  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    justifyContent: 'center',
  },

  input: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    padding: 0,
  },

  error: {
    marginTop: 6,
    marginLeft: 2,
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.xs,
  },

  asterisk: {
    color: theme.colors.danger,
  },
});