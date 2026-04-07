// import React from 'react';
import { theme } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  title: string;
}

export const ReusableModal = ({
  visible,
  onClose,
  message,
  title,
}: ModalProps) => {
  const translateY = useSharedValue(300); // start off-screen (bottom)

  useEffect(() => {
    if (visible) {
      // Slide up with a smooth ease-out curve
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.exp), // exponential ease-out
      });
    } else {
      // Slide down with a spring for a softer exit
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
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        onClose();
      }}
    >
      <Animated.View style={[styles.centeredView, animatedStyle]}>
        <View style={styles.modalView}>
          {/* <Pressable style={styles.button} onPress={onClose}>
            <MaterialIcons name="close" size={30} color={theme.colors.dark} />
          </Pressable> */}

          <MaterialIcons
            name="check-circle"
            size={65}
            color={theme.colors.success}
          />
          <Text style={styles.modalTextHead}>{title}</Text>
          <Text style={styles.modalTextBody}>{message}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 15,
    backgroundColor: theme.colors.offWhite,
    borderRadius: 14,
    padding: 15,
    paddingTop: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    ...theme.elevation.xl,
  },
  button: {
    position: 'absolute',
    top: 10, // distance from top edge of modal
    right: 10, // distance from right edge of modal
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalTextHead: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  modalTextBody: {
    padding: 20,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});
