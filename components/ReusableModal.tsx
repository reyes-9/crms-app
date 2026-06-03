import { DS } from '@/theme/design';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// TYPES
type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

type ModalState = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface ModalButton {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  title: string;
  state: ModalState;
  buttons?: ModalButton[];
  children?: ReactNode;
}

// BUTTON COLORS (CRM aligned)
const buttonColors: Record<ButtonVariant, string> = {
  primary: DS.color.primary,
  success: DS.color.success,
  warning: DS.color.warning,
  danger: DS.color.danger,
  neutral: DS.color.neutral,
};

// STATE ICON CONFIG
const stateConfig: Record<
  ModalState,
  { icon: IconName; color: string; bg: string }
> = {
  success: {
    icon: 'check-circle',
    color: DS.color.success,
    bg: DS.color.successLight,
  },

  danger: {
    icon: 'error',
    color: DS.color.danger,
    bg: DS.color.dangerLight,
  },

  warning: {
    icon: 'warning',
    color: DS.color.warning,
    bg: DS.color.warningLight,
  },

  info: {
    icon: 'info',
    color: DS.color.primary,
    bg: DS.color.primaryMuted,
  },

  neutral: {
    icon: 'help-outline',
    color: DS.color.neutral,
    bg: DS.color.neutralLight,
  },
};

export const ReusableModal = ({
  visible,
  onClose,
  message,
  title,
  state,
  buttons = [],
  children,
}: ModalProps) => {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });

      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 150,
      });

      translateY.value = withTiming(40, {
        duration: 180,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const config = stateConfig[state];

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, animatedStyle]} />

      {/* MODAL */}
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        <View style={styles.card}>
          {/* ICON */}
          <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
            <MaterialIcons name={config.icon} size={26} color={config.color} />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* MESSAGE */}
          {!children && message ? (
            <Text style={styles.message}>{message}</Text>
          ) : (
            children
          )}

          {/* BUTTONS */}
          {buttons.length > 0 && (
            <View style={styles.buttonContainer}>
              {buttons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={btn.onPress}
                  style={[
                    styles.button,
                    {
                      backgroundColor: buttonColors[btn.variant || 'primary'],
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

// STYLES
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.xxl,
  },

  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.xxl,
    alignItems: 'center',
    ...DS.shadow.md,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DS.spacing.lg,
  },

  title: {
    ...DS.typography.cardTitle,
    textAlign: 'center',
  },

  message: {
    marginTop: DS.spacing.sm,
    textAlign: 'center',
    color: DS.color.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
    marginTop: DS.spacing.xl,
    width: '100%',
  },

  button: {
    flex: 1,
    height: 42,
    borderRadius: DS.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: DS.color.textInverse,
    fontWeight: '600',
    fontSize: 13,
  },
});
