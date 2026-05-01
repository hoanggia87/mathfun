import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Button } from '@/components/Button';
import { listWheelSegments, replaceWheelSegments } from '@/lib/db/rewards';
import { colors, radius, spacing, typography } from '@/theme';

const PALETTE = ['#FF6B9D', '#5BC0EB', '#52B788', '#FF8A00', '#9B5DE5', '#FFC107', '#E63946', '#06AED5'];

type Segment = { points: string; color: string };

export function ParentWheelConfigScreen() {
  const [segments, setSegments] = useState<Segment[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const segs = await listWheelSegments();
        setSegments(segs.map((s) => ({ points: String(s.points), color: s.color })));
      })();
    }, [])
  );

  const updateSeg = (i: number, patch: Partial<Segment>) => {
    setSegments((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  };

  const addSeg = () => {
    if (segments.length >= 8) {
      Alert.alert('Tối đa 8 ô', 'Vòng quay chỉ có tối đa 8 ô.');
      return;
    }
    setSegments((s) => [...s, { points: '10', color: PALETTE[s.length % PALETTE.length] }]);
  };

  const removeSeg = (i: number) => {
    if (segments.length <= 4) {
      Alert.alert('Tối thiểu 4 ô', 'Vòng quay cần ít nhất 4 ô.');
      return;
    }
    setSegments((s) => s.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    const parsed = segments.map((s) => ({ points: parseInt(s.points, 10) || 0, color: s.color }));
    if (parsed.some((s) => s.points <= 0)) {
      Alert.alert('Lỗi', 'Mỗi ô phải có điểm > 0.');
      return;
    }
    await replaceWheelSegments(parsed);
    Alert.alert('Đã lưu', 'Cấu hình vòng quay đã được cập nhật.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={[typography.body, { color: colors.textMuted, marginBottom: spacing.md }]}>
          Cấu hình từ 4 đến 8 ô. Mỗi ô có điểm thưởng và màu riêng.
        </Text>

        {segments.map((s, i) => (
          <View key={i} style={styles.row}>
            <View style={[styles.colorSwatch, { backgroundColor: s.color }]} />
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={typography.caption}>Điểm</Text>
              <TextInput
                value={s.points}
                onChangeText={(v) => updateSeg(i, { points: v.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                style={styles.input}
                maxLength={4}
              />
            </View>
            <View style={styles.colorPicker}>
              {PALETTE.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => updateSeg(i, { color: c })}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    s.color === c && styles.colorDotOn,
                  ]}
                />
              ))}
            </View>
            <Pressable onPress={() => removeSeg(i)} style={styles.iconBtn}>
              <Text style={{ fontSize: 22 }}>🗑️</Text>
            </Pressable>
          </View>
        ))}

        <Button
          title="+ Thêm ô"
          onPress={addSeg}
          variant="ghost"
          size="md"
          fullWidth
          style={{ marginTop: spacing.md }}
          disabled={segments.length >= 8}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Lưu cấu hình" onPress={handleSave} size="lg" fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, gap: spacing.md },
  row: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
    minWidth: 60,
    textAlign: 'center',
  },
  colorPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, maxWidth: 120 },
  colorDot: { width: 20, height: 20, borderRadius: 10 },
  colorDotOn: { borderWidth: 3, borderColor: colors.text },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
