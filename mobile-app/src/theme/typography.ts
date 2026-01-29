import { Platform } from 'react-native';
import { COLORS } from './colors';

// Font families
export const FONTS = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
    default: 'System',
  }),
} as const;

// Font sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
} as const;

// Font weights
export const FONT_WEIGHTS = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// Line heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Typography styles
export const TYPOGRAPHY = {
  // Display styles
  display1: {
    fontSize: FONT_SIZES['6xl'],
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['6xl'] * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  display2: {
    fontSize: FONT_SIZES['5xl'],
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['5xl'] * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  // Heading styles
  h1: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['4xl'] * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  h2: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES['3xl'] * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  h3: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES['2xl'] * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  h4: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  h5: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  h6: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  
  // Body styles
  body1: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  
  body2: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  
  body3: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  
  // Caption styles
  caption: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
    color: COLORS.text.secondary,
  },
  
  // Button styles
  button: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.tight,
    color: COLORS.text.inverse,
  },
  
  buttonSmall: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.tight,
    color: COLORS.text.inverse,
  },
  
  buttonLarge: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.tight,
    color: COLORS.text.inverse,
  },
  
  // Override styles
  overline: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.tight,
    color: COLORS.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
} as const;

// Typography utility functions
export const getTypography = (variant: keyof typeof TYPOGRAPHY) => {
  return TYPOGRAPHY[variant];
};

export const createTypography = (
  fontSize: number,
  fontWeight: keyof typeof FONT_WEIGHTS = 'normal',
  color: string = COLORS.text.primary,
  lineHeight?: number
) => ({
  fontSize,
  fontFamily: FONTS.regular,
  fontWeight: FONT_WEIGHTS[fontWeight],
  lineHeight: lineHeight || fontSize * LINE_HEIGHTS.normal,
  color,
});
