import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Avatar } from '@/components/Avatar';
import { listProfiles, type Profile } from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import { colors, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profiles'>;

export function ProfilesScreen() {
  const nav = useNavigation<Nav>();
  const setCurrent = useProfileStore((s) => s.setCurrent);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const list = await listProfiles();
        if (!cancelled) {
          setProfiles(list);
          setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleSelect = (p: Profile) => {
    setCurrent(p);
    nav.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[typography.h1, { textAlign: 'center' }]}>Chào bé! 👋</Text>
          <Text style={[typography.body, { color: colors.textMuted, marginTop: 4, textAlign: 'center' }]}>
            Hãy chọn bé để bắt đầu nhé
          </Text>
        </View>

        <View style={styles.grid}>
          {!loading &&
            profiles.map((p) => (
              <ProfileTile key={p.id} profile={p} onPress={() => handleSelect(p)} />
            ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => nav.navigate('ParentGate', { next: 'ParentSettings' })}
        style={styles.parentBtn}
      >
        <Text style={styles.parentBtnText}>👨‍👩‍👧 Phụ huynh</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function ProfileTile({ profile, onPress }: { profile: Profile; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Avatar uri={profile.avatarUri} name={profile.name} size={96} />
      <Text style={styles.tileName} numberOfLines={1}>
        {profile.name}
      </Text>
      <View style={styles.gradeBadge}>
        <Text style={styles.gradeText}>Lớp {profile.grade}</Text>
      </View>
      <View style={styles.pointBadge}>
        <Text style={styles.pointText}>⭐ {profile.totalPoints}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: { alignItems: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  tile: {
    backgroundColor: colors.surface,
    width: 160,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tileName: { ...typography.h3, color: colors.text, marginTop: spacing.xs },
  gradeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  gradeText: { ...typography.caption, color: colors.textInverse, fontSize: 14, fontWeight: '700' },
  pointBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pointText: { fontSize: 14, color: colors.text, fontWeight: '700' },
  parentBtn: {
    alignSelf: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  parentBtnText: { ...typography.caption, color: colors.textMuted, fontSize: 16 },
});
