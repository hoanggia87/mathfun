import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Avatar } from '@/components/Avatar';
import { Stars } from '@/components/Stars';
import { listProfiles, type Profile } from '@/lib/db/profiles';
import { listSessionsByProfile, type SessionRecord } from '@/lib/db/sessions';
import { colors, radius, spacing, typography } from '@/theme';

function fmtDate(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${min}`;
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}p ${s}s`;
}

export function ParentHistoryScreen() {
  const [data, setData] = useState<{ profile: Profile; sessions: SessionRecord[] }[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const profiles = await listProfiles();
        const out = await Promise.all(
          profiles.map(async (p) => ({
            profile: p,
            sessions: await listSessionsByProfile(p.id, 30),
          }))
        );
        setData(out);
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {data.map(({ profile, sessions }) => (
          <View key={profile.id} style={styles.profileBlock}>
            <View style={styles.profileHeader}>
              <Avatar uri={profile.avatarUri} name={profile.name} size={48} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={typography.h3}>{profile.name}</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {sessions.length} lần làm bài • ⭐ {profile.totalPoints} điểm
                </Text>
              </View>
            </View>

            {sessions.length === 0 && (
              <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', padding: spacing.lg }]}>
                Chưa có lịch sử
              </Text>
            )}

            {sessions.map((s) => {
              const acc = Math.round((s.correctCount / s.totalQuestions) * 100);
              return (
                <View key={s.id} style={styles.sessionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.body}>
                      Lớp {s.grade} • HK{s.semester} • {s.totalQuestions} câu
                    </Text>
                    <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                      {fmtDate(s.createdAt)} • ⏱ {fmtDuration(s.durationSeconds)} • {acc}% đúng
                    </Text>
                  </View>
                  <Stars stars={s.stars} size={20} />
                </View>
              );
            })}
          </View>
        ))}

        {data.length === 0 && (
          <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', padding: spacing.xl }]}>
            Chưa có hồ sơ nào
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, gap: spacing.lg },
  profileBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
});
