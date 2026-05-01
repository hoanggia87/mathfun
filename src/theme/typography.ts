import { TextStyle } from 'react-native';

const FONT_REGULAR = 'Baloo2_400Regular';
const FONT_MEDIUM = 'Baloo2_500Medium';
const FONT_SEMIBOLD = 'Baloo2_600SemiBold';
const FONT_BOLD = 'Baloo2_700Bold';
const FONT_EXTRA = 'Baloo2_800ExtraBold';

export const fonts = {
  regular: FONT_REGULAR,
  medium: FONT_MEDIUM,
  semibold: FONT_SEMIBOLD,
  bold: FONT_BOLD,
  extra: FONT_EXTRA,
};

export const typography = {
  display: { fontSize: 48, fontFamily: FONT_EXTRA, letterSpacing: -1 },
  h1: { fontSize: 32, fontFamily: FONT_EXTRA },
  h2: { fontSize: 26, fontFamily: FONT_BOLD },
  h3: { fontSize: 22, fontFamily: FONT_SEMIBOLD },
  body: { fontSize: 18, fontFamily: FONT_MEDIUM },
  bodyLg: { fontSize: 22, fontFamily: FONT_MEDIUM },
  caption: { fontSize: 14, fontFamily: FONT_MEDIUM },
  button: { fontSize: 22, fontFamily: FONT_BOLD, letterSpacing: 0.5 },
  question: { fontSize: 32, fontFamily: FONT_BOLD },
} satisfies Record<string, TextStyle>;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};
