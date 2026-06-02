import { DS } from '@/theme/design';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type DropdownOption<T = string> = {
  label: string;
  value: T;
};

type DropdownProps<
  T extends string | number = string,
  TFieldValues extends FieldValues = FieldValues,
> = {
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  options: DropdownOption<T>[];
  placeholder?: string;
  required?: boolean;
};

export default function Dropdown<
  T extends string | number,
  TFieldValues extends FieldValues = FieldValues,
>({
  label,
  name,
  control,
  rules,
  options,
  placeholder = 'Select an option',
  required = false,
}: DropdownProps<T, TFieldValues>) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const selected = options.find(
          (option) => option.value === field.value
        );

        return (
          <View style={styles.container}>
            {label && (
              <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
              </Text>
            )}

            <Pressable
              style={[
                styles.trigger,
                fieldState.error && styles.triggerError,
              ]}
              onPress={() => setOpen((prev) => !prev)}
            >
              <Text
                style={[
                  styles.triggerText,
                  !selected && styles.placeholderText,
                ]}
              >
                {selected?.label ?? placeholder}
              </Text>

              <Feather
                name={open ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={DS.color.textSecondary}
              />
            </Pressable>

            {open && (
              <View style={styles.dropdown}>
                {options.map((option) => {
                  const active = option.value === field.value;

                  return (
                    <Pressable
                      key={String(option.value)}
                      style={[
                        styles.option,
                        active && styles.optionActive,
                      ]}
                      onPress={() => {
                        field.onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          active && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>

                      {active && (
                        <Feather
                          name="check"
                          size={16}
                          color={DS.color.primary}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {!!fieldState.error && (
              <Text style={styles.errorText}>
                {fieldState.error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },

  label: {
    marginBottom: DS.spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: DS.color.textSecondary,
    letterSpacing: 0.5,
  },

  required: {
    color: DS.color.danger,
  },

  trigger: {
    minHeight: 48,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    backgroundColor: DS.color.card,
    paddingHorizontal: DS.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  triggerError: {
    borderColor: DS.color.danger,
    backgroundColor: DS.color.dangerLight,
  },

  triggerText: {
    flex: 1,
    fontSize: 14,
    color: DS.color.textPrimary,
  },

  placeholderText: {
    color: DS.color.textMuted,
  },

  dropdown: {
    marginTop: 6,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },

  option: {
    minHeight: 48,
    paddingHorizontal: DS.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionActive: {
    backgroundColor: DS.color.primaryMuted,
  },

  optionText: {
    fontSize: 14,
    color: DS.color.textSecondary,
  },

  optionTextActive: {
    color: DS.color.primary,
    fontWeight: '600',
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: DS.color.danger,
  },
});