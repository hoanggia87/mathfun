import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { LuckyWheel, type WheelHandle, type WheelSegmentData } from '@/components/LuckyWheel';
import { listWheelSegments } from '@/lib/db/rewards';
import { consumeSpin } from '@/lib/db/sessions';
import { addPoints, getProfile } from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import { useSessionStore } from '@/store/sessionStore';
import { feedbackCorrect } from '@/lib/audio';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Wheel'>;
type Rt = RouteProp<RootStackParamList, 'Wheel'>;

export function WheelScreen() {
  const nav = useNavigation<Nav>();
  const { sessionId } = useRoute<Rt>().params;
  const profile = useProfileStore((s) => s.current);
  const setCurrent = useProfileStore((s) => s.setCurrent);
  const lastResult = useSessionStore((s) => s.lastResult);
  const setLastResult = useSessionStore((s) => s.setLastResult);

  const [segments, setSegments] = useState<WheelSegmentData[]>([]);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const wheelRef = useRef<WheelHandle>(null);

  useEffect(() => {
    (async () => {
      const segs = await listWheelSegments();
      setSegments(segs.map((s) => ({ points: s.points, color: s.color })));
    })();
    if (lastResult && lastResult.id === sessionId) {
      setSpinsLeft(lastResult.spinsEarned - lastResult.spinsUsed);
    }
  }, [sessionId, lastResult]);

  const startSpin = () => {
    if (spinning || spinsLeft <= 0 || !wheelRef.current) return;
    setLastWin(null);
    setSpinning(true);
    wheelRef.current.spin();
  };

  const handleResult = async (_idx: number, points: number) => {
    feedbackCorrect();
    if (!profile) return;
    await consumeSpin(sessionId);
    const newTotal = await addPoints(profile.id, points);
    const refreshed = await getProfile(profile.id);
    if (refreshed) setCurrent(refreshed);
    if (lastResult && lastResult.id === sessionId) {
      setLastResult({ ...lastResult, spinsUsed: lastResult.spinsUsed + 1 });
    }
    setSpinsLeft((s) => s - 1);
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
            <LuckyWheel ref={wheelRef} segments={segments} size={wheelSize} onResult={handleResult} />
          )}
        </View>

        {lastWin !== null && (
          <View style={styles.winBox}>
            <Text style={typography.h2}>🎉 Bé nhận được</Text>
            <Text style={styles.winPoints}>+{lastWin} điểm</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title={spinning ? 'Đang quay...' : spinsLeft > 0 ? '🎡 Quay!' : 'Hết lượt quay'}
            onPress={startSpin}
            disabled={spinning || spinsLeft <= 0}
            size="lg"
            fullWidth
          />
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
  wheelArea: { alignItems: 'center', marginVertical: spacing.lg },
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
