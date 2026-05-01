import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { useProfileStore } from '@/store/profileStore';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  const profile = useProfileStore((s) => s.current);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={typography.body}>Chưa chọn bé.</Text>
          <Button title="Chọn bé" onPress={() => nav.popToTop()} style={{ marginTop: spacing.md }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <Avatar uri={profile.avatarUri} name={profile.name} size={120} />
          <Text style={[typography.h1, { marginTop: spacing.md }]}>{profile.name}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>Lớp {profile.grade}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.badgeText, { color: colors.text }]}>⭐ {profile.totalPoints} điểm</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="▶  Bắt đầu làm bài"
            onPress={() => nav.navigate('Semester', { grade: profile.grade })}
            size="lg"
            fullWidth
          />
          <Button
            title="🎁  Đổi quà"
            onPress={() => nav.navigate('Rewards')}
            variant="secondary"
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  badgeText: { ...typography.body, color: colors.textInverse, fontWeight: '700' },
  actions: { gap: spacing.md },
});
