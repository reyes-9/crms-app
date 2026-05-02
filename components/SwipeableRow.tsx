import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  rowId: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  isHint?: boolean;
  resetSignal?: number;
};

// SESSION FLAG (key part)
let hasShownSwipeHintThisSession = false;

const SwipeableRow = ({
  children,
  rowId,
  isOpen,
  isHint,
  onOpen,
  onClose,
  onDelete,
  onArchive,
  resetSignal,
}: Props) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const hintOpacity = useSharedValue(0);
  const hintTranslate = useSharedValue(0);

  const MAX_SWIPE_LEFT = -180;
  const MAX_SWIPE_RIGHT = 0;

  useEffect(() => {
    const target = isOpen ? MAX_SWIPE_LEFT : 0;

    if (translateX.value !== target) {
      translateX.value = withSpring(target, {
        damping: 60,
        stiffness: 400,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    translateX.value = withSpring(0, {
      damping: 60,
      stiffness: 400,
    });
  }, [resetSignal]);

  // ONBOARDING HINT (ONLY ONCE PER SESSION)
  useEffect(() => {
    if (!isHint) return;
    if (hasShownSwipeHintThisSession) return;

    hasShownSwipeHintThisSession = true;

    hintOpacity.value = withSequence(
      withSpring(0.15, { damping: 20, stiffness: 200 }),
      withSpring(1, { damping: 20, stiffness: 200 }),
      withSpring(0, { damping: 20, stiffness: 200 }),
    );

    hintTranslate.value = withSequence(
      withSpring(8, { damping: 20, stiffness: 200 }),
      withSpring(0, { damping: 20, stiffness: 200 }),
    );
  }, [isHint]);

  const actionAnimatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / 190, 1);

    return {
      transform: [{ scale: 0.8 + progress * 0.2 }],
      opacity: progress,
    };
  });

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
    transform: [{ translateX: hintTranslate.value }],
  }));

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])

    .onStart(() => {
      startX.value = translateX.value;
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

      translateX.value = withSpring(target, {
        damping: 60,
        stiffness: 400,
      });

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
        <Animated.View
          style={[styles.actionBlock, styles.archive, actionAnimatedStyle]}
        >
          <Pressable
            style={[styles.actionBlock, styles.archive]}
            onPress={onArchive}
          >
            <Feather name="archive" size={22} color="#6B7280" />
            <Text style={styles.label}>Archive</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.divider} />

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

          {/* Swipe hint */}
          <Animated.View style={[styles.swipeHint, hintStyle]}>
            <Text style={styles.swipeHintText}>← swipe</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  divider: {
    height: '70%',
    width: 1,
    backgroundColor: '#b3b3b3',
  },

  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginEnd: 5,
  },

  actionBlock: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },

  archive: {},
  delete: {},

  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  foreground: {},

  swipeHint: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  swipeHintText: {
    fontSize: 12,
    color: '#74777c',
    fontWeight: '500',
  },
});

export default SwipeableRow;
