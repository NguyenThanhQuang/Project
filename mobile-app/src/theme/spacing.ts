// Spacing system for consistent layout
export const SPACING = {
  // Base spacing unit
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
} as const;

// Margin and padding shortcuts
export const MARGIN = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  '2xl': SPACING['2xl'],
  '3xl': SPACING['3xl'],
  '4xl': SPACING['4xl'],
  '5xl': SPACING['5xl'],
} as const;

export const PADDING = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  '2xl': SPACING['2xl'],
  '3xl': SPACING['3xl'],
  '4xl': SPACING['4xl'],
  '5xl': SPACING['5xl'],
} as const;

// Layout constants
export const LAYOUT = {
  // Screen dimensions
  screenPadding: SPACING.md,
  screenPaddingHorizontal: SPACING.md,
  screenPaddingVertical: SPACING.md,
  
  // Component spacing
  componentMargin: SPACING.md,
  componentPadding: SPACING.md,
  
  // Form spacing
  formSpacing: SPACING.md,
  inputSpacing: SPACING.sm,
  labelSpacing: SPACING.xs,
  
  // List spacing
  listItemSpacing: SPACING.sm,
  listSectionSpacing: SPACING.md,
  
  // Card spacing
  cardPadding: SPACING.md,
  cardMargin: SPACING.sm,
  cardSpacing: SPACING.md,
  
  // Button spacing
  buttonPadding: SPACING.sm,
  buttonMargin: SPACING.xs,
  buttonSpacing: SPACING.sm,
  
  // Header spacing
  headerPadding: SPACING.md,
  headerHeight: 56,
  headerIconSize: 24,
  
  // Tab spacing
  tabBarHeight: 56,
  tabBarPadding: SPACING.xs,
  
  // Modal spacing
  modalPadding: SPACING.lg,
  modalMargin: SPACING.md,
  
  // Drawer spacing
  drawerWidth: 280,
  drawerPadding: SPACING.md,
  
  // Floating action button
  fabSize: 56,
  fabMargin: SPACING.md,
  
  // Avatar sizes
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,
  avatarXLarge: 96,
  
  // Icon sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  iconXLarge: 48,
  
  // Border radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },
  
  // Border width
  borderWidth: {
    thin: 0.5,
    light: 1,
    medium: 2,
    thick: 3,
  },
} as const;

// Spacing utility functions
export const getSpacing = (size: keyof typeof SPACING): number => {
  return SPACING[size];
};

export const getMargin = (size: keyof typeof MARGIN): number => {
  return MARGIN[size];
};

export const getPadding = (size: keyof typeof PADDING): number => {
  return PADDING[size];
};

export const getLayout = (key: string): any => {
  const keys = key.split('.');
  let current: any = LAYOUT;
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Layout key not found: ${key}`);
      return SPACING.md;
    }
    current = current[k];
  }
  
  return current;
};

// Common spacing combinations
export const SPACING_COMBINATIONS = {
  // Horizontal spacing
  horizontal: {
    xs: SPACING.xs,
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
    xl: SPACING.xl,
  },
  
  // Vertical spacing
  vertical: {
    xs: SPACING.xs,
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
    xl: SPACING.xl,
  },
  
  // Component spacing
  component: {
    tight: SPACING.xs,
    normal: SPACING.sm,
    relaxed: SPACING.md,
    loose: SPACING.lg,
  },
  
  // Section spacing
  section: {
    small: SPACING.md,
    medium: SPACING.lg,
    large: SPACING.xl,
    xlarge: SPACING['2xl'],
  },
} as const;
