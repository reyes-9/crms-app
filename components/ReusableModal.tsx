import { theme } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// TYPES
type ButtonVariant = 'success' | 'danger' | 'primary' | 'neutral' | 'dark';
type ModalState = 'success' | 'danger' | 'neutral';
type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface ModalButton {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  title: string;
  state: ModalState;
  buttons?: ModalButton[];
}

const buttonVariantColors: Record<ButtonVariant, string> = {
  primary: theme.colors.primary,
  success: theme.colors.success,
  danger: theme.colors.danger,
  dark: theme.colors.dark,
  neutral: theme.colors.neutral,
};

// STATE CONFIG
const stateConfig: Record<ModalState, { icon: IconName; color: string }> = {
  success: { icon: 'check-circle', color: theme.colors.success },
  danger: { icon: 'error', color: theme.colors.danger },
  neutral: { icon: 'info', color: theme.colors.neutral },
};

export const ReusableModal = ({
  visible,
  onClose,
  message,
  title,
  state,
  buttons = [],
}: ModalProps) => {
  const translateY = useSharedValue(300);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });
    } else {
      translateY.value = withSpring(300, {
        damping: 20,
        stiffness: 150,
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.centeredView, animatedStyle]}>
        <View style={styles.modalView}>
          <MaterialIcons
            name={stateConfig[state].icon}
            size={65}
            color={stateConfig[state].color}
          />

          <Text style={styles.modalTextHead}>{title}</Text>
          <Text style={styles.modalTextBody}>{message}</Text>

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
                      backgroundColor:
                        buttonVariantColors[btn.variant || 'primary'],
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 15,
    // backgroundColor: theme.colors.offWhite,
    // backgroundColor: '#EEF3F1',
    backgroundColor: '#F3F7F5',
    borderWidth: 1,
    borderColor: '#DDEEE7',
    borderRadius: 14,
    padding: 15,
    paddingTop: 60,
    alignItems: 'center',
    ...theme.elevation.xl,
  },
  modalTextHead: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    // color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  modalTextBody: {
    padding: 20,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 30,
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
