import { Platform } from 'react-native';
import { COLORS } from './colors';

// Shadow system for consistent elevation
export const SHADOWS = {
  // Light shadows
  light: {
    small: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
    
    medium: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    
    large: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  // Medium shadows
  medium: {
    small: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    
    medium: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
    
    large: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  // Heavy shadows
  heavy: {
    small: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    
    medium: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
    
    large: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  
  // Special shadows
  special: {
    // Floating action button shadow
    fab: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    
    // Modal shadow
    modal: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 24,
      },
    }),
    
    // Card shadow
    card: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    
    // Button shadow
    button: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    
    // Header shadow
    header: Platform.select({
      ios: {
        shadowColor: COLORS.neutral.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
} as const;

// Shadow utility functions
export const getShadow = (type: keyof typeof SHADOWS, size: keyof typeof SHADOWS.light) => {
  if (type === 'light' || type === 'medium' || type === 'heavy') {
    return SHADOWS[type][size];
  }
  return SHADOWS.light.small; // fallback
};

export const getSpecialShadow = (type: keyof typeof SHADOWS.special) => {
  return SHADOWS.special[type];
};

// Common shadow combinations
export const COMMON_SHADOWS = {
  // Component shadows
  card: SHADOWS.special.card,
  button: SHADOWS.special.button,
  header: SHADOWS.special.header,
  fab: SHADOWS.special.fab,
  modal: SHADOWS.special.modal,
  
  // Elevation shadows
  elevation1: SHADOWS.light.small,
  elevation2: SHADOWS.light.medium,
  elevation4: SHADOWS.light.large,
  elevation8: SHADOWS.medium.medium,
  elevation16: SHADOWS.heavy.medium,
  elevation24: SHADOWS.heavy.large,
} as const;

// Create custom shadow
export const createShadow = (
  elevation: number,
  shadowColor: string = COLORS.neutral.black,
  shadowOpacity: number = 0.15
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity,
      shadowRadius: elevation / 2,
    };
  } else {
    return {
      elevation,
    };
  }
};

// Remove shadow (useful for conditional styling)
export const NO_SHADOW = Platform.select({
  ios: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  android: {
    elevation: 0,
  },
});
