import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { getParentPin } from '@/lib/db/settings';
import { feedbackTap, feedbackWrong } from '@/lib/audio';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ParentGate'>;
type Rt = RouteProp<RootStackParamList, 'ParentGate'>;

export function ParentGateScreen() {
  const nav = useNavigation<Nav>();
  const { next } = useRoute<Rt>().params;
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDigit = async (d: string) => {
    feedbackTap();
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    setError(null);
    if (newPin.length === 4) {
      const stored = await getParentPin();
      if (newPin === stored) {
        nav.replace(next as any);
      } else {
        feedbackWrong();
        setError('PIN không đúng');
        setTimeout(() => setPin(''), 600);
      }
    }
  };

  const onBack = () => {
    feedbackTap();
    setPin((p) => p.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={typography.h1}>Khu vực phụ huynh</Text>
        <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }]}>
          Nhập PIN 4 số để tiếp tục{'\n'}
          (mặc định: 1234)
        </Text>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                pin.length > i && styles.dotFilled,
                error && styles.dotError,
              ]}
            />
          ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.pad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', '⌫'],
          ].map((row, i) => (
            <View key={i} style={styles.padRow}>
              {row.map((d, j) => {
                if (d === '') return <View key={j} style={styles.padBtn} />;
                if (d === '⌫') {
                  return (
                    <Pressable key={j} onPress={onBack} style={({ pressed }) => [styles.padBtn, { opacity: pressed ? 0.7 : 1 }]}>
                      <Text style={styles.padText}>⌫</Text>
                    </Pressable>
                  );
                }
                return (
                  <Pressable key={j} onPress={() => onDigit(d)} style={({ pressed }) => [styles.padBtn, { opacity: pressed ? 0.7 : 1 }]}>
                    <Text style={styles.padText}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <Button title="Hủy" onPress={() => nav.goBack()} variant="ghost" size="md" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  icon: { fontSize: 64 },
  dots: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotError: { borderColor: colors.danger },
  errorText: { ...typography.body, color: colors.danger, marginTop: spacing.sm },
  pad: { gap: spacing.md, marginTop: spacing.lg },
  padRow: { flexDirection: 'row', gap: spacing.md },
  padBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padText: { ...typography.h1, color: colors.text },
});
