import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  rowId: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  onDelete?: () => void;
};

const SwipeableRow = ({
  children,
  rowId,
  isOpen,
  onOpen,
  onClose,
  onDelete,
}: Props) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const MAX_SWIPE_LEFT = -180; // adjusted to match button width
  const MAX_SWIPE_RIGHT = 0;

  // Sync with parent state (only when needed)
  useEffect(() => {
    const target = isOpen ? MAX_SWIPE_LEFT : 0;

    if (translateX.value !== target) {
      translateX.value = withSpring(target, {
        damping: 60, // moderate damping to avoid bounce
        stiffness: 400, // strong pull back for speed
      });
    }
  }, [isOpen]);

  const actionAnimatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / 190, 1);

    return {
      transform: [{ scale: 0.8 + progress * 0.2 }],
      opacity: progress,
    };
  });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])

    .onStart(() => {
      startX.value = translateX.value; // ✅ critical fix
    })

    .onUpdate((event) => {
      const next = startX.value + event.translationX;

      translateX.value = Math.min(
        Math.max(next, MAX_SWIPE_LEFT),
        MAX_SWIPE_RIGHT,
      );
    })

    .onEnd(() => {
      const shouldOpen = translateX.value <= MAX_SWIPE_LEFT / 2;

      const target = shouldOpen ? MAX_SWIPE_LEFT : 0;

      // ✅ Always snap immediately
      translateX.value = withSpring(target, {
        damping: 60, // moderate damping to avoid bounce
        stiffness: 400, // strong pull back for speed
      });

      // Then sync parent state
      if (shouldOpen) {
        runOnJS(onOpen)(rowId);
      } else {
        runOnJS(onClose)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background actions */}
      <View style={styles.actionsContainer}>
        {/* Archive */}
        <Animated.View
          style={[styles.actionBlock, styles.archive, actionAnimatedStyle]}
        >
          <Feather name="archive" size={22} color="#6B7280" />
          <Text style={styles.label}>Archive</Text>
        </Animated.View>

        <View style={styles.divider} />

        {/* Delete */}
        <Animated.View
          style={[styles.actionBlock, styles.delete, actionAnimatedStyle]}
        >
          <Pressable
            style={[styles.actionBlock, styles.delete]}
            onPress={onDelete}
          >
            <Feather name="trash-2" size={22} color="#EF4444" />
            <Text style={styles.label}>Delete</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Foreground */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.foreground, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },

  divider: {
    height: '70%',
    width: 1,
    backgroundColor: '#b3b3b3', // light gray line
    marginVertical: 8,
  },

  // Background actions container (Archive + Delete)
  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginEnd: 5,
  },

  // Each action block (Archive/Delete)
  actionBlock: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },

  archive: {
    backgroundColor: '#F3F4F6', // soft gray
  },

  delete: {
    // backgroundColor: '#EF4444', // modern red
  },

  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  // Foreground card
  foreground: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
});

export default SwipeableRow;
