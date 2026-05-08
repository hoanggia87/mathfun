import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, fonts } from '@/theme';

const DOT_COLORS = ['#FF8A00', '#FFC107', '#4CAF50'];
const DOT_PERIOD = 900;

export function LoadingScreen() {
  const dot0 = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);

  useEffect(() => {
    const startDot = (sv: typeof dot0, delay: number) => {
      sv.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delay }),
          withTiming(1, { duration: DOT_PERIOD / 3, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: DOT_PERIOD / 3, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: DOT_PERIOD / 3 }),
        ),
        -1,
        false,
      );
    };
    startDot(dot0, 0);
    startDot(dot1, DOT_PERIOD / 4);
    startDot(dot2, DOT_PERIOD / 2);
    return () => {
      cancelAnimation(dot0);
      cancelAnimation(dot1);
      cancelAnimation(dot2);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>Đang tải</Text>
        <Dot sv={dot0} color={DOT_COLORS[0]} />
        <Dot sv={dot1} color={DOT_COLORS[1]} />
        <Dot sv={dot2} color={DOT_COLORS[2]} />
      </View>
    </View>
  );
}

function Dot({ sv, color }: { sv: SharedValue<number>; color: string }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -10 * sv.value }, { scale: 1 + 0.4 * sv.value }],
    opacity: 0.4 + 0.6 * sv.value,
  }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 28, fontFamily: fonts.bold, color: colors.text, marginRight: 4 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
