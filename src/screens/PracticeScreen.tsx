import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { NumberPad } from '@/components/NumberPad';
import { Button } from '@/components/Button';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { generateQuestions, checkAnswer } from '@/lib/questions/mixer';
import type { Question } from '@/lib/questions/types';
import { saveSession } from '@/lib/db/sessions';
import { addPendingSpins } from '@/lib/db/profiles';
import { useProfileStore } from '@/store/profileStore';
import { useSessionStore } from '@/store/sessionStore';
import { feedbackCorrect, feedbackTap, feedbackWrong } from '@/lib/audio';
import { colors, fonts, radius, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Practice'>;
type Rt = RouteProp<RootStackParamList, 'Practice'>;

type Stars = 0 | 1 | 2 | 3;

function computeStars(accuracy: number): Stars {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.75) return 2;
  if (accuracy >= 0.5) return 1;
  return 0;
}

function computeSpins(stars: Stars, count: number): number {
  if (stars === 0) return 0;
  let table: readonly [number, number, number];
  if (count <= 20) table = [1, 2, 3];
  else if (count <= 50) table = [3, 6, 10];
  else table = [5, 9, 15];
  return table[stars - 1];
}

export function PracticeScreen() {
  const nav = useNavigation<Nav>();
  const params = useRoute<Rt>().params;
  const profile = useProfileStore((s) => s.current);
  const updateCurrent = useProfileStore((s) => s.updateCurrent);
  const setLastResult = useSessionStore((s) => s.setLastResult);

  const [queue, setQueue] = useState<Question[]>([]);
  const [skipQueue, setSkipQueue] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongOnCurrent, setWrongOnCurrent] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [phase, setPhase] = useState<'main' | 'review'>('main');

  const startTimeRef = useRef(Date.now());
  const submittingRef = useRef(false);

  const shake = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    const qs = generateQuestions({
      grade: params.grade,
      semester: params.semester,
      topics: params.topics,
      count: params.count,
    });
    setQueue(qs);
    startTimeRef.current = Date.now();
  }, [params.count, params.grade, params.semester, params.topics]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, []);

  const current = queue[idx];
  const total = params.count;
  const completed = idx + (phase === 'review' ? params.count - skipQueue.length : 0);

  const confirmExit = () => {
    Alert.alert('Thoát bài làm?', 'Tiến độ hiện tại sẽ không được lưu.', [
      { text: 'Tiếp tục làm', style: 'cancel' },
      { text: 'Thoát', style: 'destructive', onPress: () => nav.popToTop() },
    ]);
  };

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: cardScale.value }],
  }));

  const handleSubmitInput = (rawInput?: string) => {
    if (!current || submittingRef.current) return;
    const ans = (rawInput ?? input).trim();
    if (!ans) return;
    submittingRef.current = true;

    const ok = checkAnswer(ans, current.answer);
    if (ok) {
      feedbackCorrect();
      setFeedback('correct');
      cardScale.value = withSequence(withSpring(1.05, { damping: 8 }), withSpring(1));
      if (wrongOnCurrent === 0) setFirstTryCorrect((c) => c + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setTimeout(() => goNext(), 700);
    } else {
      feedbackWrong();
      setFeedback('wrong');
      shake.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      setWrongAttempts((w) => w + 1);
      setWrongOnCurrent((w) => w + 1);
      setStreak(0);
      setTimeout(() => {
        setFeedback('idle');
        setInput('');
        submittingRef.current = false;
      }, 900);
    }
  };

  const goNext = () => {
    setFeedback('idle');
    setInput('');
    setWrongOnCurrent(0);
    submittingRef.current = false;

    if (phase === 'main') {
      if (idx + 1 >= queue.length) {
        if (skipQueue.length > 0) {
          setQueue(skipQueue);
          setSkipQueue([]);
          setIdx(0);
          setPhase('review');
        } else {
          finish();
        }
      } else {
        setIdx((i) => i + 1);
      }
    } else {
      if (idx + 1 >= queue.length) finish();
      else setIdx((i) => i + 1);
    }
  };

  const handleSkip = () => {
    if (!current) return;
    setSkippedCount((s) => s + 1);
    setSkipQueue((sq) => [...sq, current]);
    setStreak(0);
    goNext();
  };

  const finish = async () => {
    if (!profile) return;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const accuracy = firstTryCorrect / total;
    const stars = computeStars(accuracy);
    const spins = computeSpins(stars, total);

    const record = await saveSession({
      profileId: profile.id,
      grade: params.grade,
      semester: typeof params.semester === 'number' ? params.semester : 1,
      topics: params.topics,
      totalQuestions: total,
      correctCount: firstTryCorrect,
      wrongAttempts,
      skippedCount,
      bestStreak,
      durationSeconds: duration,
      stars,
      spinsEarned: spins,
    });
    if (spins > 0) {
      const newPending = await addPendingSpins(profile.id, spins);
      updateCurrent({ pendingSpins: newPending });
    }
    setLastResult(record);
    nav.replace('Result', { sessionId: record.id });
  };

  if (!current) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={typography.body}>Đang tạo câu hỏi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={confirmExit} style={styles.exitBtn} hitSlop={8}>
          <Text style={styles.exitBtnText}>✕</Text>
        </Pressable>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, ((idx + 1) / queue.length) * 100)}%` },
              ]}
            />
            <View style={styles.progressLabelWrap} pointerEvents="none">
              <Text style={styles.progressLabel}>
                {phase === 'review' ? '🔁 ' : ''}
                {idx + 1} / {queue.length}
              </Text>
            </View>
          </View>
        </View>

        {streak >= 3 ? (
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 {streak}</Text>
          </View>
        ) : (
          <View style={styles.streakPlaceholder} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.card, cardAnim]}>
          {current.type === 'word-problem' ? (
            <Text style={styles.promptWord}>{current.prompt}</Text>
          ) : (
            <Text
              style={styles.promptExpr}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {current.prompt}
            </Text>
          )}
          {current.unit && <Text style={styles.unitHint}>(điền số, đơn vị: {current.unit})</Text>}

          {current.type !== 'multiple-choice' && (
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>{input || ' '}</Text>
              {feedback === 'correct' && <Text style={styles.bigEmoji}>✅</Text>}
              {feedback === 'wrong' && <Text style={styles.bigEmoji}>❌</Text>}
            </View>
          )}
        </Animated.View>

        {wrongOnCurrent >= 3 && phase === 'main' && (
          <View style={styles.skipWrap}>
            <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm }]}>
              Câu này khó quá nhỉ, để dành làm cuối nhé!
            </Text>
            <Button title="Bỏ qua câu này" onPress={handleSkip} variant="ghost" size="md" />
          </View>
        )}
      </ScrollView>

      {current.type === 'multiple-choice' && current.choices ? (
        (() => {
          const longChoice = current.choices.some((c) => c.length > 2);
          return (
            <View style={styles.choicesBar}>
              {current.choices.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    feedbackTap();
                    setInput(c);
                    handleSubmitInput(c);
                  }}
                  disabled={feedback !== 'idle'}
                  style={({ pressed }) => [
                    styles.choice,
                    longChoice && styles.choiceWide,
                    { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                  ]}
                >
                  <Text style={styles.choiceText} numberOfLines={1} adjustsFontSizeToFit>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          );
        })()
      ) : (
        <NumberPad
          value={input}
          onChange={setInput}
          onSubmit={() => handleSubmitInput()}
          disabled={feedback !== 'idle'}
          allowDecimal
          allowSign={false}
        />
      )}

      <FeedbackOverlay
        key={`${idx}-${feedback}-${wrongOnCurrent}`}
        type={feedback}
        streak={streak}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  exitBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  exitBtnText: { fontSize: 20, fontFamily: fonts.bold, color: colors.text },
  progressWrap: { flex: 1 },
  progressTrack: {
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 14,
  },
  progressLabelWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: { fontSize: 16, fontFamily: fonts.bold, color: colors.text },
  streakPill: {
    minWidth: 60,
    paddingHorizontal: spacing.sm,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: { fontSize: 16, fontFamily: fonts.bold, color: colors.textInverse },
  streakPlaceholder: { width: 60 },
  scroll: { padding: spacing.md, gap: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  card: {
    padding: spacing.xl,
    minHeight: 220,
    justifyContent: 'center',
    gap: spacing.md,
  },
  promptExpr: {
    fontSize: 80,
    fontFamily: fonts.extra,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  promptWord: {
    ...typography.question,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 42,
  },
  unitHint: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  inputBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  inputText: { fontSize: 64, fontFamily: fonts.extra, color: colors.primary, minHeight: 70 },
  bigEmoji: { fontSize: 48 },
  choicesBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  choice: {
    backgroundColor: colors.secondary,
    flexGrow: 1,
    flexBasis: 80,
    maxWidth: 200,
    minHeight: 72,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  choiceWide: {
    flexBasis: '45%',
    flexGrow: 0,
    maxWidth: undefined,
    paddingHorizontal: spacing.md,
  },
  choiceText: { ...typography.h2, color: colors.textInverse, fontSize: 28 },
  skipWrap: { paddingHorizontal: spacing.md },
});
