import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { colors } from '@/theme';

type Props = { stars: 0 | 1 | 2 | 3; size?: number };

export function Stars({ stars, size = 64 }: Props) {
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);

  useEffect(() => {
    s1.value = withDelay(200, withSpring(stars >= 1 ? 1 : 0.4, { damping: 8 }));
    s2.value = withDelay(500, withSpring(stars >= 2 ? 1 : 0.4, { damping: 8 }));
    s3.value = withDelay(800, withSpring(stars >= 3 ? 1 : 0.4, { damping: 8 }));
  }, [stars, s1, s2, s3]);

  const a1 = useAnimatedStyle(() => ({ transform: [{ scale: s1.value }] }));
  const a2 = useAnimatedStyle(() => ({ transform: [{ scale: s2.value }] }));
  const a3 = useAnimatedStyle(() => ({ transform: [{ scale: s3.value }] }));

  return (
    <View style={styles.row}>
      <Animated.View style={a1}>
        <Text style={[styles.star, { fontSize: size, color: stars >= 1 ? colors.star : colors.starOff }]}>★</Text>
      </Animated.View>
      <Animated.View style={a2}>
        <Text style={[styles.star, { fontSize: size + 16, color: stars >= 2 ? colors.star : colors.starOff }]}>★</Text>
      </Animated.View>
      <Animated.View style={a3}>
        <Text style={[styles.star, { fontSize: size, color: stars >= 3 ? colors.star : colors.starOff }]}>★</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  star: { textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
});
