import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const SOUND_SOURCES = {
  tap: require('../../assets/sounds/tap.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  result: require('../../assets/sounds/result.wav'),
  win: require('../../assets/sounds/win.wav'),
} as const;

type SoundKey = keyof typeof SOUND_SOURCES;

const players: Partial<Record<SoundKey, AudioPlayer>> = {};
let initialized = false;

async function ensureInit() {
  if (initialized) return;
  initialized = true;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    });
  } catch {}
  for (const key of Object.keys(SOUND_SOURCES) as SoundKey[]) {
    try {
      players[key] = createAudioPlayer(SOUND_SOURCES[key]);
    } catch {}
  }
}

export function preloadAudio() {
  void ensureInit();
}

function play(key: SoundKey) {
  ensureInit();
  const p = players[key];
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {}
}

export async function feedbackCorrect() {
  play('correct');
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

export async function feedbackWrong() {
  play('wrong');
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
}

export async function feedbackTap() {
  play('tap');
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export function feedbackResult() {
  play('result');
}

export function feedbackWin() {
  play('win');
}
