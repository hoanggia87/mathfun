import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { Semester } from '@/lib/questions/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Semester'>;
type Rt = RouteProp<RootStackParamList, 'Semester'>;

const OPTIONS: { value: Semester | 'all'; label: string; sub: string; emoji: string }[] = [
  { value: 1, label: 'Học kỳ 1', sub: 'Nửa đầu năm học', emoji: '🌱' },
  { value: 2, label: 'Học kỳ 2', sub: 'Nửa sau năm học', emoji: '🌳' },
  { value: 'all', label: 'Cả năm', sub: 'Toàn bộ chương trình', emoji: '🎯' },
];

export function SemesterScreen() {
  const nav = useNavigation<Nav>();
  const { grade } = useRoute<Rt>().params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={[typography.h2, styles.title]}>Lớp {grade} — Chọn học kỳ</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {OPTIONS.map((opt) => (
          <Pressable
            key={String(opt.value)}
            onPress={() => nav.navigate('TopicSelect', { grade, semester: opt.value })}
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={typography.h2}>{opt.label}</Text>
              <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>{opt.sub}</Text>
            </View>
            <Text style={{ fontSize: 28, color: colors.primary }}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  list: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emoji: { fontSize: 48 },
});
