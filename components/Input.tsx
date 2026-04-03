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
      //   rules={{ required: true }}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={
              error ? theme.colors.error : theme.colors.textSecondary
            }
            style={[
              styles.input,
              {
                borderColor: error
                  ? theme.colors.error
                  : theme.colors.primaryLight,
              },
            ]}
            value={value}
            secureTextEntry={secureTextEntry}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {error && (
            <Text style={styles.error}>{error.message || 'Error'}</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.primaryLight,
    backgroundColor: theme.colors.light,
    padding: 12,
    borderRadius: 5,
    color: theme.colors.textPrimary,
  },
  container: {
    marginBottom: 20,
  },
  error: {
    alignSelf: 'stretch',
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});
