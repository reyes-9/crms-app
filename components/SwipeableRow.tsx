import { DS } from '@/theme/design';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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

let hasShownSwipeHintThisSession = false;

const MAX_LEFT = -180;
const THRESHOLD = MAX_LEFT / 2;

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
  const hintX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(isOpen ? MAX_LEFT : 0, {
      damping: 80,
      stiffness: 500,
    });
  }, [isOpen]);

  useEffect(() => {
    translateX.value = withSpring(0, {
      damping: 80,
      stiffness: 500,
    });
  }, [resetSignal]);

  useEffect(() => {
    if (!isHint || hasShownSwipeHintThisSession) return;

    hasShownSwipeHintThisSession = true;

    hintOpacity.value = withTiming(1, { duration: 150 });

    hintX.value = withSpring(-6, {
      damping: 20,
      stiffness: 200,
    });

    setTimeout(() => {
      hintOpacity.value = withTiming(0, { duration: 300 });
    }, 1200);
  }, [isHint]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      const next = startX.value + e.translationX;

      translateX.value = Math.max(Math.min(next, 0), MAX_LEFT);
    })
    .onEnd(() => {
      const shouldOpen = translateX.value < THRESHOLD;
      const target = shouldOpen ? MAX_LEFT : 0;

      translateX.value = withSpring(target, {
        damping: 80,
        stiffness: 500,
      });

      if (shouldOpen) runOnJS(onOpen)(rowId);
      else runOnJS(onClose)();
    });

  const fgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const archiveStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(translateX.value) / Math.abs(MAX_LEFT), 1);

    return {
      opacity: p,
      transform: [{ scale: 0.85 + p * 0.15 }],
    };
  });

  const deleteStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(translateX.value) / Math.abs(MAX_LEFT), 1);

    return {
      opacity: p,
      transform: [{ scale: 0.85 + p * 0.15 }],
    };
  });

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
    transform: [{ translateX: hintX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* ACTIONS BACKGROUND */}
      <View style={styles.actions}>
        <Animated.View style={[styles.action, styles.archive, archiveStyle]}>
          <Pressable onPress={onArchive} style={styles.actionInner}>
            <Feather name="archive" size={18} color={DS.color.textSecondary} />
            <Text style={styles.label}>Archive</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.action, styles.delete, deleteStyle]}>
          <Pressable onPress={onDelete} style={styles.actionInner}>
            <Feather name="trash-2" size={18} color={DS.color.danger} />
            <Text style={[styles.label, { color: DS.color.danger }]}>
              Delete
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* FOREGROUND */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.foreground, fgStyle]}>
          {children}

          <Animated.View style={[styles.hint, hintStyle]}>
            <Feather name="chevron-left" size={14} color={DS.color.textMuted} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },

  actions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
    zIndex: 0,
  },

  action: {
    width: 85,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DS.radius.md,
  },

  actionInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  archive: {
    backgroundColor: DS.color.primaryMuted,
  },

  delete: {
    backgroundColor: DS.color.dangerLight,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.textSecondary,
  },

  foreground: {
    backgroundColor: DS.color.card,
    zIndex: 2,
  },

  hint: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default SwipeableRow;
