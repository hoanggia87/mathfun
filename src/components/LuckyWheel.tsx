import React, { useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type WheelSegmentData = { points: number; color: string };

type Props = {
  segments: WheelSegmentData[];
  size: number;
  onResult: (idx: number, points: number) => void;
};

export type WheelHandle = {
  spin: () => void;
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

export const LuckyWheel = React.forwardRef<WheelHandle, Props>(({ segments, size, onResult }, ref) => {
  const rotation = useSharedValue(0);
  const r = size / 2;
  const segAngle = 360 / segments.length;

  const slices = useMemo(() => {
    return segments.map((s, i) => {
      const start = i * segAngle;
      const end = start + segAngle;
      const labelAngle = start + segAngle / 2;
      const labelPos = polar(r, r, r * 0.65, labelAngle);
      return {
        path: arcPath(r, r, r, start, end),
        color: s.color,
        points: s.points,
        labelX: labelPos.x,
        labelY: labelPos.y,
      };
    });
  }, [segments, r, segAngle]);

  useImperativeHandle(ref, () => ({
    spin: () => {
      cancelAnimation(rotation);
      const targetIdx = Math.floor(Math.random() * segments.length);
      const fullSpins = 5 + Math.floor(Math.random() * 3);
      const stopAt = 360 - (targetIdx * segAngle + segAngle / 2);
      const target = fullSpins * 360 + stopAt;
      const current = rotation.value % 360;
      rotation.value = current;
      rotation.value = withTiming(
        current + (target - current),
        { duration: 4500, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onResult)(targetIdx, segments[targetIdx].points);
          }
        }
      );
    },
  }));

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.wrap, { width: size + 40, height: size + 40 }]}>
      <Animated.View style={[{ width: size, height: size }, wheelStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {slices.map((s, i) => (
              <Path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={3} />
            ))}
            {slices.map((s, i) => (
              <SvgText
                key={`t-${i}`}
                x={s.labelX}
                y={s.labelY}
                fontSize={size * 0.07}
                fontWeight="800"
                fill="#fff"
                textAnchor="middle"
                alignmentBaseline="middle"
                rotation={i * segAngle + segAngle / 2}
                originX={s.labelX}
                originY={s.labelY}
              >
                {s.points}
              </SvgText>
            ))}
          </G>
        </Svg>
      </Animated.View>

      <View style={[styles.pointer, { top: 0 }]} />
      <View style={styles.center} />
    </View>
  );
});

LuckyWheel.displayName = 'LuckyWheel';

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  pointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E63946',
  },
  center: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#FF8A00',
  },
});
