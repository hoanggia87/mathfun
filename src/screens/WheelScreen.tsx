import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { LuckyWheel, type WheelHandle, type WheelSegmentData } from '@/components/LuckyWheel';
import { listWheelSegments } from '@/lib/db/rewards';
import { addPoints, consumePendingSpin, getProfile } from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import { feedbackCorrect, feedbackTap, feedbackWin } from '@/lib/audio';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Wheel'>;

export function WheelScreen() {
  const nav = useNavigation<Nav>();
  const profile = useProfileStore((s) => s.current);
  const setCurrent = useProfileStore((s) => s.setCurrent);
  const updateCurrent = useProfileStore((s) => s.updateCurrent);

  const [segments, setSegments] = useState<WheelSegmentData[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const wheelRef = useRef<WheelHandle>(null);

  const spinsLeft = profile?.pendingSpins ?? 0;

  useEffect(() => {
    (async () => {
      const segs = await listWheelSegments();
      setSegments(segs.map((s) => ({ points: s.points, color: s.color })));
    })();
  }, []);

  const startSpin = () => {
    if (spinning || spinsLeft <= 0 || !wheelRef.current) return;
    feedbackTap();
    setLastWin(null);
    setSpinning(true);
    wheelRef.current.spin();
  };

  const handleResult = async (_idx: number, points: number) => {
    feedbackWin();
    feedbackCorrect();
    if (!profile) return;
    const newPending = await consumePendingSpin(profile.id);
    await addPoints(profile.id, points);
    const refreshed = await getProfile(profile.id);
    if (refreshed) setCurrent(refreshed);
    else updateCurrent({ pendingSpins: newPending });
    setLastWin(points);
    setSpinning(false);
  };

  const screenW = Dimensions.get('window').width;
  const wheelSize = Math.min(screenW - 64, 360);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.h1, styles.title]}>Vòng quay may mắn 🎡</Text>
        <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
          Còn lại: <Text style={{ color: colors.primary, fontWeight: '700' }}>{spinsLeft}</Text> lượt quay
        </Text>

        <View style={styles.wheelArea}>
          {segments.length > 0 && (
            <Pressable
              onPress={startSpin}
              disabled={spinning || spinsLeft <= 0}
              hitSlop={8}
              style={({ pressed }) => ({
                opacity: pressed && !spinning && spinsLeft > 0 ? 0.85 : 1,
                transform: [{ scale: pressed && !spinning && spinsLeft > 0 ? 0.98 : 1 }],
              })}
            >
              <LuckyWheel ref={wheelRef} segments={segments} size={wheelSize} onResult={handleResult} />
            </Pressable>
          )}
        </View>

        <Text style={styles.hint}>
          {spinning
            ? 'Đang quay...'
            : spinsLeft > 0
            ? '👆 Bấm vào vòng quay để quay'
            : 'Hết lượt quay'}
        </Text>

        {lastWin !== null && (
          <View style={styles.winBox}>
            <Text style={typography.h2}>🎉 Bạn nhận được</Text>
            <Text style={styles.winPoints}>+{lastWin} điểm</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="🎁 Đổi quà"
            onPress={() => nav.navigate('Rewards')}
            variant="secondary"
            size="md"
            fullWidth
          />
          <Button
            title="Về trang chủ"
            onPress={() => nav.popToTop()}
            variant="ghost"
            size="md"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, alignItems: 'stretch' },
  title: { textAlign: 'center', marginBottom: spacing.xs },
  wheelArea: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  hint: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  winBox: {
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  winPoints: { ...typography.display, color: colors.success },
  actions: { gap: spacing.md, marginTop: spacing.md },
});
