import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { listRewards, recordRedemption, type Reward } from '@/lib/db/rewards';
import { addPoints, getProfile } from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import { feedbackCorrect, feedbackWrong } from '@/lib/audio';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Rewards'>;

export function RewardsScreen() {
  const nav = useNavigation<Nav>();
  const profile = useProfileStore((s) => s.current);
  const setCurrent = useProfileStore((s) => s.setCurrent);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const r = await listRewards();
        if (alive) setRewards(r);
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  const handleRedeem = (r: Reward) => {
    if (!profile) return;
    if (profile.totalPoints < r.cost) {
      feedbackWrong();
      Alert.alert('Chưa đủ điểm', `Cần ${r.cost} điểm, bé hiện có ${profile.totalPoints} điểm.`);
      return;
    }
    Alert.alert('Đổi quà?', `Đổi "${r.name}" với ${r.cost} điểm?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đổi',
        onPress: async () => {
          await addPoints(profile.id, -r.cost);
          await recordRedemption(profile.id, r);
          const refreshed = await getProfile(profile.id);
          if (refreshed) setCurrent(refreshed);
          feedbackCorrect();
          Alert.alert('Đổi quà thành công 🎉', `Bé đã đổi "${r.name}". Hãy báo phụ huynh để nhận quà nhé!`);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={typography.h2}>Đổi quà 🎁</Text>
        <Text style={[typography.h3, { color: colors.primary }]}>⭐ {profile?.totalPoints ?? 0}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {rewards.map((r) => {
          const canAfford = (profile?.totalPoints ?? 0) >= r.cost;
          return (
            <View key={r.id} style={styles.row}>
              <Text style={styles.emoji}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{r.name}</Text>
                <Text style={[typography.caption, { color: colors.primary, marginTop: 2 }]}>
                  ⭐ {r.cost} điểm
                </Text>
              </View>
              <Pressable
                onPress={() => handleRedeem(r)}
                disabled={!canAfford}
                style={({ pressed }) => [
                  styles.redeemBtn,
                  { backgroundColor: canAfford ? colors.primary : colors.border },
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={styles.redeemText}>{canAfford ? 'Đổi' : 'Thiếu'}</Text>
              </Pressable>
            </View>
          );
        })}

        {rewards.length === 0 && (
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl }]}>
            Chưa có quà. Phụ huynh hãy thêm quà trong phần Cài đặt nhé!
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Quay lại" onPress={() => nav.goBack()} variant="ghost" size="md" fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: { padding: spacing.md, gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  emoji: { fontSize: 48 },
  redeemBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  redeemText: { ...typography.button, color: colors.textInverse, fontSize: 18 },
  footer: { padding: spacing.md },
});
