import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { topicsForGradeSemester } from '@/lib/questions/curriculum';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TopicSelect'>;
type Rt = RouteProp<RootStackParamList, 'TopicSelect'>;

const COUNT_OPTIONS = [10, 20, 50, 100];

export function TopicSelectScreen() {
  const nav = useNavigation<Nav>();
  const { grade, semester } = useRoute<Rt>().params;
  const allTopics = useMemo(() => topicsForGradeSemester(grade, semester), [grade, semester]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(allTopics.map((t) => t.key)));
  const [count, setCount] = useState(20);

  const toggle = (key: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === allTopics.length) setSelected(new Set());
    else setSelected(new Set(allTopics.map((t) => t.key)));
  };

  const start = () => {
    const topics = Array.from(selected);
    if (topics.length === 0) return;
    nav.navigate('Practice', { grade, semester, topics, count });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={typography.h2}>Chọn dạng bài</Text>
          <Pressable onPress={toggleAll}>
            <Text style={styles.allBtn}>
              {selected.size === allTopics.length ? 'Bỏ chọn' : 'Chọn tất cả'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.topicGrid}>
          {allTopics.map((t) => {
            const isOn = selected.has(t.key);
            return (
              <Pressable
                key={t.key}
                onPress={() => toggle(t.key)}
                style={({ pressed }) => [
                  styles.topicChip,
                  isOn && styles.topicChipOn,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={{ fontSize: 22, marginRight: spacing.sm }}>{t.emoji}</Text>
                <Text
                  style={[
                    styles.topicLabel,
                    isOn && { color: colors.textInverse },
                  ]}
                  numberOfLines={2}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {allTopics.length === 0 && (
          <View style={styles.empty}>
            <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
              Lớp này chưa có dạng bài cho học kỳ đã chọn. Vui lòng quay lại.
            </Text>
          </View>
        )}

        <Text style={[typography.h2, { marginTop: spacing.xl }]}>Số câu</Text>
        <View style={styles.countRow}>
          {COUNT_OPTIONS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCount(c)}
              style={[styles.countBtn, count === c && styles.countBtnOn]}
            >
              <Text
                style={[
                  styles.countText,
                  count === c && { color: colors.textInverse },
                ]}
              >
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`▶ Bắt đầu (${count} câu)`}
          onPress={start}
          disabled={selected.size === 0}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  allBtn: { ...typography.body, color: colors.primary, fontWeight: '700' },
  topicGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 56,
    maxWidth: '100%',
  },
  topicChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  topicLabel: { ...typography.body, color: colors.text, flexShrink: 1 },
  countRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  countBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  countBtnOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  countText: { ...typography.h3, color: colors.text },
  empty: { padding: spacing.xl },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
