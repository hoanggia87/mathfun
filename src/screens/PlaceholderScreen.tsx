import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

export function makePlaceholder(title: string) {
  return function Placeholder() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={typography.h2}>{title}</Text>
          <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.md }]}>
            (Màn hình này sẽ được xây trong các milestone tiếp theo)
          </Text>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
});
