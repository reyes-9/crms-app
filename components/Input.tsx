import { DS } from '@/theme/design';
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
  defaultValue = '',
  disabled = false,
}) => {
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
        const hasError = !!error;

        return (
          <View style={styles.container}>
            {/* Label */}
            {label && (
              <Text style={[styles.label, hasError && styles.labelError]}>
                {label}
                {rules?.required && <Text style={styles.required}> *</Text>}
              </Text>
            )}

            {/* Input */}
            <View
              style={[
                styles.inputWrapper,
                hasError && styles.inputError,
                disabled && styles.inputDisabled,
              ]}
            >
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={DS.color.textMuted}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                style={[styles.input, disabled && styles.textDisabled]}
              />
            </View>

            {/* Error */}
            {hasError && <Text style={styles.errorText}>{error?.message}</Text>}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: DS.spacing.lg,
  },

  label: {
    marginBottom: DS.spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: DS.color.textSecondary,
    letterSpacing: 0.5,
  },

  labelError: {
    color: DS.color.danger,
  },

  required: {
    color: DS.color.danger,
  },

  inputWrapper: {
    height: 52,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    backgroundColor: DS.color.card,
    justifyContent: 'center',
    paddingHorizontal: DS.spacing.md,
  },

  inputError: {
    borderColor: DS.color.danger,
    backgroundColor: DS.color.dangerLight,
  },

  inputDisabled: {
    backgroundColor: DS.color.borderLight,
    borderColor: DS.color.borderLight,
  },

  input: {
    fontSize: 14,
    color: DS.color.textPrimary,
    fontWeight: '500',
  },

  textDisabled: {
    color: DS.color.textMuted,
  },

  errorText: {
    marginTop: DS.spacing.xs,
    fontSize: 12,
    color: DS.color.danger,
  },
});
