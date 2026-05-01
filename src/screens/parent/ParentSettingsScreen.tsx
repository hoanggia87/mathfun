import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ParentSettings'>;

const ITEMS: { route: keyof RootStackParamList; emoji: string; title: string; sub: string }[] = [
  { route: 'ParentProfilesEdit', emoji: '👶', title: 'Quản lý hồ sơ bé', sub: 'Thêm / sửa / xóa hồ sơ và lớp học của bé' },
  { route: 'ParentRewardsEdit', emoji: '🎁', title: 'Quản lý quà', sub: 'Thêm / sửa / xóa danh sách quà cho bé' },
  { route: 'ParentWheelConfig', emoji: '🎡', title: 'Cấu hình vòng quay', sub: 'Thay đổi điểm và màu các ô' },
  { route: 'ParentHistory', emoji: '📊', title: 'Lịch sử bài làm', sub: 'Xem tiến độ học tập của các bé' },
  { route: 'ParentPin', emoji: '🔐', title: 'Đổi PIN', sub: 'Cập nhật PIN bảo vệ' },
];

export function ParentSettingsScreen() {
  const nav = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list}>
        {ITEMS.map((it) => (
          <Pressable
            key={it.route}
            onPress={() => nav.navigate(it.route as any)}
            style={({ pressed }) => [
              styles.row,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.emoji}>{it.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{it.title}</Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>{it.sub}</Text>
            </View>
            <Text style={{ fontSize: 24, color: colors.primary }}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  emoji: { fontSize: 40 },
});
