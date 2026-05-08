import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { Avatar, DEFAULT_AVATARS } from '@/components/Avatar';
import { Button } from '@/components/Button';
import {
  createProfile,
  deleteProfile,
  listProfiles,
  updateProfile,
  type Profile,
} from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import type { Grade } from '@/lib/questions/types';
import { colors, radius, spacing, typography } from '@/theme';

const GRADES: Grade[] = [1, 2, 3, 4, 5];

export function ParentProfilesEditScreen() {
  const currentInStore = useProfileStore((s) => s.current);
  const setCurrent = useProfileStore((s) => s.setCurrent);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(DEFAULT_AVATARS[0]);
  const [grade, setGrade] = useState<Grade>(2);

  const reload = async () => setProfiles(await listProfiles());

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  const openCreate = () => {
    setEditing(null);
    setName('');
    setAvatarUri(DEFAULT_AVATARS[0]);
    setGrade(2);
    setShowModal(true);
  };

  const openEdit = (p: Profile) => {
    setEditing(p);
    setName(p.name);
    setAvatarUri(p.avatarUri ?? DEFAULT_AVATARS[0]);
    setGrade(p.grade);
    setShowModal(true);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép app truy cập thư viện ảnh.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Thiếu thông tin', 'Hãy nhập tên học sinh.');
      return;
    }
    if (editing) {
      await updateProfile(editing.id, { name: trimmed, avatarUri, grade });
      if (currentInStore?.id === editing.id) {
        setCurrent({ ...editing, name: trimmed, avatarUri, grade });
      }
    } else {
      await createProfile(trimmed, avatarUri, grade);
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = (p: Profile) => {
    if (profiles.length <= 1) {
      Alert.alert('Không thể xóa', 'Cần giữ ít nhất 1 hồ sơ.');
      return;
    }
    Alert.alert(
      'Xóa hồ sơ?',
      `Hồ sơ "${p.name}" và toàn bộ lịch sử sẽ bị xóa. Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(p.id);
            if (currentInStore?.id === p.id) setCurrent(null);
            reload();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list}>
        {profiles.map((p) => (
          <View key={p.id} style={styles.row}>
            <Avatar uri={p.avatarUri} name={p.name} size={56} />
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{p.name}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Lớp {p.grade} • ⭐ {p.totalPoints} điểm
              </Text>
            </View>
            <Pressable onPress={() => openEdit(p)} style={styles.iconBtn}>
              <Text style={{ fontSize: 22 }}>✏️</Text>
            </Pressable>
            <Pressable onPress={() => handleDelete(p)} style={styles.iconBtn}>
              <Text style={{ fontSize: 22 }}>🗑️</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="+ Thêm hồ sơ mới" onPress={openCreate} size="lg" fullWidth />
      </View>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
          <ScrollView style={styles.modal} contentContainerStyle={{ paddingBottom: spacing.xl }} keyboardShouldPersistTaps="handled">
            <Text style={typography.h2}>{editing ? 'Sửa hồ sơ' : 'Thêm hồ sơ mới'}</Text>

            <View style={styles.avatarSection}>
              <Avatar uri={avatarUri} name={name || 'Học sinh'} size={100} />
              <Pressable onPress={pickImage} style={styles.uploadBtn}>
                <Text style={styles.uploadBtnText}>📷 Chọn ảnh từ thư viện</Text>
              </Pressable>
            </View>

            <Text style={[typography.body, { marginTop: spacing.md, marginBottom: spacing.xs }]}>
              Hoặc chọn avatar
            </Text>
            <View style={styles.emojiRow}>
              {DEFAULT_AVATARS.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setAvatarUri(e)}
                  style={[styles.emojiBtn, avatarUri === e && styles.emojiBtnOn]}
                >
                  <Text style={{ fontSize: 28 }}>{e}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[typography.body, { marginTop: spacing.md, marginBottom: spacing.xs }]}>
              Tên học sinh
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="VD: Bin, Cún, An..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              maxLength={20}
            />

            <Text style={[typography.body, { marginTop: spacing.md, marginBottom: spacing.xs }]}>
              Lớp đang học
            </Text>
            <View style={styles.gradeRow}>
              {GRADES.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setGrade(g)}
                  style={[styles.gradeBtn, grade === g && styles.gradeBtnOn]}
                >
                  <Text style={[styles.gradeText, grade === g && { color: colors.textInverse }]}>
                    Lớp {g}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button title="Hủy" onPress={() => setShowModal(false)} variant="ghost" size="md" style={{ flex: 1 }} />
              <Button title="Lưu" onPress={handleSave} size="md" style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },

  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.bg,
    padding: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '90%',
  },
  avatarSection: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  uploadBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  uploadBtnText: { ...typography.body, color: colors.primary },

  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnOn: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },

  input: {
    ...typography.bodyLg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },

  gradeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gradeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  gradeBtnOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  gradeText: { ...typography.body, color: colors.text, fontWeight: '700' },
});
