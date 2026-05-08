import React, { useCallback } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { Stars } from '@/components/Stars';
import { feedbackResult } from '@/lib/audio';
import { useSessionStore } from '@/store/sessionStore';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type Rt = RouteProp<RootStackParamList, 'Result'>;

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} giây`;
  return `${m} phút ${s} giây`;
}

const PRAISE = [
  'Tuyệt vời! 🎉',
  'Quá giỏi! 👏',
  'Bạn thông minh quá! 🌟',
  'Cố lên nha! 💪',
  'Lần sau sẽ giỏi hơn nữa! 🚀',
];

function pickPraise(stars: number): string {
  if (stars === 3) return PRAISE[0];
  if (stars === 2) return PRAISE[1];
  if (stars === 1) return PRAISE[2];
  return PRAISE[3];
}

export function ResultScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const result = useSessionStore((s) => s.lastResult);

  useFocusEffect(
    useCallback(() => {
      feedbackResult();
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  if (!result || result.id !== route.params.sessionId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={typography.body}>Không có dữ liệu kết quả.</Text>
          <Button title="Về trang chủ" onPress={() => nav.popToTop()} style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.h1, { textAlign: 'center', marginTop: spacing.lg }]}>
          Hoàn thành! 🎊
        </Text>
        <Text style={[typography.h3, { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xs }]}>
          {pickPraise(result.stars)}
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <Stars stars={result.stars} size={56} />
        </View>

        {result.spinsEarned > 0 && (
          <View style={styles.spinBadge}>
            <Text style={{ fontSize: 28 }}>🎡</Text>
            <Text style={[typography.h3, { color: colors.textInverse }]}>
              +{result.spinsEarned} lượt quay may mắn!
            </Text>
          </View>
        )}

        <View style={styles.statsCard}>
          <StatRow label="✅ Đúng (lần đầu)" value={`${result.correctCount} / ${result.totalQuestions}`} />
          <StatRow label="📊 Độ chính xác" value={`${accuracy}%`} />
          <StatRow label="❌ Số lần sai" value={String(result.wrongAttempts)} />
          <StatRow label="🔁 Bỏ qua" value={String(result.skippedCount)} />
          <StatRow label="🔥 Đúng liên tiếp" value={String(result.bestStreak)} />
          <StatRow label="⏱ Thời gian" value={fmtTime(result.durationSeconds)} />
        </View>

        <View style={styles.actions}>
          {result.spinsEarned > 0 && (
            <Button
              title="🎡 Quay ngay"
              onPress={() => nav.replace('Wheel')}
              size="lg"
              fullWidth
            />
          )}
          <Button
            title="Làm bài khác"
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

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={[typography.body, { color: colors.text }]}>{label}</Text>
      <Text style={[typography.h3, { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  scroll: { padding: spacing.lg, gap: spacing.md, alignItems: 'stretch' },
  spinBadge: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { marginTop: spacing.xl, gap: spacing.md },
});
