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

import { Button } from '@/components/Button';
import {
  createReward,
  deleteReward,
  listRewards,
  updateReward,
  type Reward,
} from '@/lib/db/rewards';
import { colors, radius, spacing, typography } from '@/theme';

const EMOJI_CHOICES = ['🎁', '📺', '🎮', '🍦', '🍫', '🍔', '🎡', '🎬', '🚲', '⚽', '📱', '💝'];

export function ParentRewardsEditScreen() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editing, setEditing] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [emoji, setEmoji] = useState('🎁');

  const reload = async () => setRewards(await listRewards());

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  const openCreate = () => {
    setEditing(null);
    setName('');
    setCost('');
    setEmoji('🎁');
    setShowModal(true);
  };

  const openEdit = (r: Reward) => {
    setEditing(r);
    setName(r.name);
    setCost(String(r.cost));
    setEmoji(r.emoji);
    setShowModal(true);
  };

  const handleSave = async () => {
    const c = parseInt(cost, 10);
    if (!name.trim() || isNaN(c) || c <= 0) {
      Alert.alert('Thiếu thông tin', 'Hãy nhập tên và điểm hợp lệ.');
      return;
    }
    if (editing) {
      await updateReward(editing.id, { name: name.trim(), cost: c, emoji });
    } else {
      await createReward({ name: name.trim(), cost: c, emoji });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = (r: Reward) => {
    Alert.alert('Xóa quà?', `Xóa "${r.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteReward(r.id);
          reload();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.list}>
        {rewards.map((r) => (
          <View key={r.id} style={styles.row}>
            <Text style={styles.emoji}>{r.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{r.name}</Text>
              <Text style={[typography.caption, { color: colors.primary }]}>⭐ {r.cost} điểm</Text>
            </View>
            <Pressable onPress={() => openEdit(r)} style={styles.iconBtn}>
              <Text style={{ fontSize: 22 }}>✏️</Text>
            </Pressable>
            <Pressable onPress={() => handleDelete(r)} style={styles.iconBtn}>
              <Text style={{ fontSize: 22 }}>🗑️</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="+ Thêm quà mới" onPress={openCreate} size="lg" fullWidth />
      </View>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={typography.h2}>{editing ? 'Sửa quà' : 'Thêm quà mới'}</Text>

            <Text style={[typography.body, { marginTop: spacing.md }]}>Biểu tượng</Text>
            <View style={styles.emojiRow}>
              {EMOJI_CHOICES.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.emojiBtn, emoji === e && styles.emojiBtnOn]}
                >
                  <Text style={{ fontSize: 28 }}>{e}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[typography.body, { marginTop: spacing.md }]}>Tên quà</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="VD: Xem TV 30 phút"
              style={styles.input}
              maxLength={40}
            />

            <Text style={[typography.body, { marginTop: spacing.md }]}>Điểm cần đổi</Text>
            <TextInput
              value={cost}
              onChangeText={setCost}
              keyboardType="number-pad"
              placeholder="VD: 100"
              style={styles.input}
              maxLength={6}
            />

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button title="Hủy" onPress={() => setShowModal(false)} variant="ghost" size="md" style={{ flex: 1 }} />
              <Button title="Lưu" onPress={handleSave} size="md" style={{ flex: 1 }} />
            </View>
          </View>
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
  emoji: { fontSize: 36 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.bg,
    padding: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
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
    ...typography.body,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
});
