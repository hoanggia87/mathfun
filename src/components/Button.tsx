import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  style?: ViewStyle;
};

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.textInverse },
  secondary: { bg: colors.secondary, text: colors.textInverse },
  ghost: { bg: colors.surface, text: colors.text, border: colors.border },
  danger: { bg: colors.danger, text: colors.textInverse },
};

const SIZE_STYLES: Record<Size, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: spacing.sm, paddingH: spacing.md, fontSize: 16 },
  md: { paddingV: spacing.md, paddingH: spacing.lg, fontSize: 20 },
  lg: { paddingV: spacing.lg, paddingH: spacing.xl, fontSize: 24 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  style,
}: Props) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 2 : 0,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Text style={[styles.icon, { fontSize: s.fontSize + 4 }]}>{icon}</Text> : null}
        <Text style={[typography.button, { color: v.text, fontSize: s.fontSize }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    color: 'inherit' as any,
  },
});
