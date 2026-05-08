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

const PARTICLE_EMOJIS = ['⭐', '✨', '🌟', '💫', '🎉', '🎊', '🥳', '💖', '🌈', '🍭'];
const CONFETTI_COUNT = 40;

export function FeedbackOverlay({ type, streak = 0 }: Props) {
  if (type !== 'correct') return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <GreenFlash />
      <ConfettiBurst />
      {streak >= 5 && <StreakBadge streak={streak} />}
    </View>
  );
}

function GreenFlash() {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.22, { duration: 90 }),
      withTiming(0, { duration: 500 }),
    );
  }, [opacity]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.flash, anim]} pointerEvents="none" />;
}

function StreakBadge({ streak }: { streak: number }) {
  const scale = useSharedValue(0);
  const ty = useSharedValue(40);
  useEffect(() => {
    scale.value = withDelay(150, withSequence(withSpring(1.15, { damping: 7 }), withSpring(1)));
    ty.value = withDelay(150, withSpring(0, { damping: 9 }));
  }, [scale, ty]);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: ty.value }],
  }));
  return (
    <Animated.View style={[styles.streakPill, anim]}>
      <Text style={styles.streakText}>🔥 {streak} câu liên tiếp!</Text>
    </Animated.View>
  );
}

function ConfettiBurst() {
  const particles = useMemo(() => {
    const screenH = Dimensions.get('window').height;
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
      const angle = (i / CONFETTI_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 240 + Math.random() * 220;
      const peakX = Math.cos(angle) * speed;
      const peakY = Math.sin(angle) * speed;
      const fallY = peakY + screenH * 0.6 + Math.random() * 120;
      return {
        id: i,
        emoji: PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)],
        peakX,
        peakY,
        fallY,
        rotation: (Math.random() - 0.5) * 720,
        delay: Math.random() * 100,
        size: 22 + Math.random() * 22,
      };
    });
  }, []);

  return (
    <View style={styles.confettiOrigin} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </View>
  );
}

function ConfettiPiece({
  emoji,
  peakX,
  peakY,
  fallY,
  rotation,
  delay,
  size,
}: {
  emoji: string;
  peakX: number;
  peakY: number;
  fallY: number;
  rotation: number;
  delay: number;
  size: number;
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    const burstDur = 380;
    const fallDur = 1000;
    opacity.value = withSequence(
      withDelay(delay, withTiming(1, { duration: 80 })),
      withDelay(burstDur + fallDur * 0.55, withTiming(0, { duration: fallDur * 0.45 })),
    );
    scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 180 }));
    x.value = withDelay(
      delay,
      withSequence(
        withTiming(peakX, { duration: burstDur, easing: Easing.out(Easing.cubic) }),
        withTiming(peakX + (Math.random() - 0.5) * 60, {
          duration: fallDur,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
    );
    y.value = withDelay(
      delay,
      withSequence(
        withTiming(peakY, { duration: burstDur, easing: Easing.out(Easing.cubic) }),
        withTiming(fallY, { duration: fallDur, easing: Easing.in(Easing.quad) }),
      ),
    );
    rot.value = withDelay(
      delay,
      withTiming(rotation, { duration: burstDur + fallDur, easing: Easing.linear }),
    );
  }, [x, y, rot, opacity, scale, peakX, peakY, fallY, rotation, delay]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rot.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return <Animated.Text style={[styles.confetti, { fontSize: size }, anim]}>{emoji}</Animated.Text>;
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#52B788',
  },
  streakPill: {
    position: 'absolute',
    bottom: 120,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  streakText: { ...typography.h3, color: colors.textInverse },
  confettiOrigin: { position: 'absolute' },
  confetti: { position: 'absolute' },
});
