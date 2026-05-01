import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '@/components/Button';
import { setParentPin } from '@/lib/db/settings';
import { feedbackTap } from '@/lib/audio';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ParentPin'>;

export function ParentPinScreen() {
  const nav = useNavigation<Nav>();
  const [step, setStep] = useState<'new' | 'confirm'>('new');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const onDigit = (d: string) => {
    feedbackTap();
    if (step === 'new') {
      if (newPin.length < 4) {
        const np = newPin + d;
        setNewPin(np);
        if (np.length === 4) setTimeout(() => setStep('confirm'), 200);
      }
    } else {
      if (confirmPin.length < 4) {
        const cp = confirmPin + d;
        setConfirmPin(cp);
        if (cp.length === 4) {
          setTimeout(async () => {
            if (cp === newPin) {
              await setParentPin(cp);
              Alert.alert('Đã đổi PIN', 'PIN mới đã được lưu.', [
                { text: 'OK', onPress: () => nav.goBack() },
              ]);
            } else {
              Alert.alert('PIN không khớp', 'Vui lòng nhập lại từ đầu.');
              setNewPin('');
              setConfirmPin('');
              setStep('new');
            }
          }, 200);
        }
      }
    }
  };

  const onBack = () => {
    feedbackTap();
    if (step === 'new') setNewPin((p) => p.slice(0, -1));
    else setConfirmPin((p) => p.slice(0, -1));
  };

  const currentPin = step === 'new' ? newPin : confirmPin;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={typography.h2}>{step === 'new' ? 'Nhập PIN mới' : 'Xác nhận PIN mới'}</Text>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.dot, currentPin.length > i && styles.dotFilled]}
            />
          ))}
        </View>

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
  dots: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  dotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  pad: { gap: spacing.md, marginTop: spacing.lg },
  padRow: { flexDirection: 'row', gap: spacing.md },
  padBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  padText: { ...typography.h1, color: colors.text },
});
