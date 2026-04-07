import { theme } from '@/theme/colors';
import { InputProps } from '@/types/auth';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const Input: React.FC<InputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry,
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {/* Label + Asterisk */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>{placeholder}</Text>
            {rules?.required && error && (
              <Text style={styles.asterisk}> * </Text>
            )}
            {/* {error && <Text style={styles.error}>{error.message}</Text>} */}
          </View>

          {/* Input */}
          <TextInput
            // placeholder={placeholder}
            placeholderTextColor={
              error ? theme.colors.error : theme.colors.textSecondary
            }
            style={[styles.input, { borderColor: theme.colors.primaryLight }]}
            value={value}
            secureTextEntry={secureTextEntry}
            onChangeText={onChange}
            onBlur={onBlur}
          />

          {/* Error */}
          {error?.message && <Text style={styles.error}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },

  asterisk: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },

  input: {
    borderBottomWidth: 2,
    color: theme.colors.light,
    fontSize: theme.typography.fontSize.md,
  },

  error: {
    marginTop: 4,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
  },
});
