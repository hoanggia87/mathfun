import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

type Props = {
  uri: string | null;
  name: string;
  size?: number;
  style?: ViewStyle;
};

export const DEFAULT_AVATARS = ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐶', '🐱', '🐰', '🐸', '🦄', '🐵'];

function colorFromName(name: string): string {
  const palette = [colors.grade[1], colors.grade[2], colors.grade[3], colors.grade[4], colors.grade[5]];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function Avatar({ uri, name, size = 80, style }: Props) {
  const isEmoji = uri && /^\p{Emoji}/u.test(uri);
  const bg = colorFromName(name || '?');

  if (uri && !isEmoji) {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }, style]}>
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      </View>
    );
  }

  const display = isEmoji ? uri : (name?.trim()?.charAt(0).toUpperCase() || '?');
  return (
    <View
      style={[
        styles.wrap,
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.55, color: colors.textInverse, fontWeight: '700' }}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
