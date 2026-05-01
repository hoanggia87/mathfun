import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  type: 'idle' | 'correct' | 'wrong';
  streak?: number;
};

const FLOAT_EMOJIS = ['⭐', '✨', '🌟', '💫', '🎉', '🎊'];

export function FeedbackOverlay({ type, streak = 0 }: Props) {
  if (type !== 'correct') return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <FloatingEmojis />
      {streak >= 5 && <StreakBadge streak={streak} />}
    </View>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSequence(withSpring(1.1, { damping: 8 }), withSpring(1));
  }, [scale]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.streakPill, anim]}>
      <Text style={styles.streakText}>🔥 {streak} câu liên tiếp!</Text>
    </Animated.View>
  );
}

function FloatingEmojis() {
  const items = useMemo(() => {
    const screenW = Dimensions.get('window').width;
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
      startX: Math.random() * (screenW - 40),
      delay: Math.random() * 200,
      duration: 900 + Math.random() * 400,
      drift: (Math.random() - 0.5) * 80,
    }));
  }, []);

  return (
    <>
      {items.map((it) => (
        <FloatingEmoji key={it.id} {...it} />
      ))}
    </>
  );
}

function FloatingEmoji({
  emoji,
  startX,
  delay,
  duration,
  drift,
}: {
  emoji: string;
  startX: number;
  delay: number;
  duration: number;
  drift: number;
}) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    y.value = withDelay(delay, withTiming(-280, { duration, easing: Easing.out(Easing.cubic) }));
    x.value = withDelay(delay, withTiming(drift, { duration }));
    scale.value = withDelay(delay, withSpring(1.2, { damping: 8 }));
    opacity.value = withDelay(delay + duration * 0.6, withTiming(0, { duration: duration * 0.4 }));
  }, [y, x, opacity, scale, delay, duration, drift]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[styles.floatingEmoji, { left: startX, top: '60%' as any }, animStyle]}
    >
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  streakPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  streakText: { ...typography.h3, color: colors.textInverse },
  floatingEmoji: { position: 'absolute', fontSize: 36 },
});
