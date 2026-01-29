import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { SPACING, LAYOUT } from './spacing';
import { TYPOGRAPHY } from './typography';
import { COMMON_SHADOWS } from './shadows';

// Common styles used across the app
export const COMMON_STYLES = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  
  contentHorizontal: {
    paddingHorizontal: SPACING.md,
  },
  
  contentVertical: {
    paddingVertical: SPACING.md,
  },
  
  // Flex utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Alignment utilities
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  centerHorizontal: {
    alignItems: 'center',
  },
  
  centerVertical: {
    justifyContent: 'center',
  },
  
  // Spacing utilities
  marginTop: {
    marginTop: SPACING.md,
  },
  
  marginBottom: {
    marginBottom: SPACING.md,
  },
  
  marginLeft: {
    marginLeft: SPACING.md,
  },
  
  marginRight: {
    marginRight: SPACING.md,
  },
  
  padding: {
    padding: SPACING.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: SPACING.md,
  },
  
  paddingVertical: {
    paddingVertical: SPACING.md,
  },
  
  // Card styles
  card: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.cardPadding,
    margin: LAYOUT.cardMargin,
    ...COMMON_SHADOWS.card,
  },
  
  cardFlat: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.cardPadding,
    margin: LAYOUT.cardMargin,
  },
  
  // Button styles
  button: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
    ...COMMON_SHADOWS.button,
  },
  
  buttonSecondary: {
    backgroundColor: COLORS.secondary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
    ...COMMON_SHADOWS.button,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonDisabled: {
    backgroundColor: COLORS.neutral.gray400,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input styles
  input: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.border.light,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.primary,
  },
  
  inputFocused: {
    backgroundColor: COLORS.background.primary,
    borderWidth: LAYOUT.borderWidth.medium,
    borderColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.primary,
  },
  
  inputError: {
    backgroundColor: COLORS.background.primary,
    borderWidth: LAYOUT.borderWidth.medium,
    borderColor: COLORS.error.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.primary,
  },
  
  // Label styles
  label: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.h6.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  labelRequired: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.h6.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  // Divider styles
  divider: {
    height: LAYOUT.borderWidth.thin,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.md,
  },
  
  dividerHorizontal: {
    width: LAYOUT.borderWidth.thin,
    backgroundColor: COLORS.border.light,
    marginHorizontal: SPACING.md,
  },
  
  // Badge styles
  badge: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeSuccess: {
    backgroundColor: COLORS.success.main,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeWarning: {
    backgroundColor: COLORS.warning.main,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeError: {
    backgroundColor: COLORS.error.main,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  
  // Error styles
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderRadius: LAYOUT.borderRadius.md,
    margin: SPACING.md,
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.error.main,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  
  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  
  emptyText: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  
  // Header styles
  header: {
    backgroundColor: COLORS.primary.main,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...COMMON_SHADOWS.header,
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.text.inverse,
    textAlign: 'center',
  },
  
  // Tab styles
  tabBar: {
    backgroundColor: COLORS.background.primary,
    borderTopWidth: LAYOUT.borderWidth.thin,
    borderTopColor: COLORS.border.light,
    paddingBottom: SPACING.xs,
    paddingTop: SPACING.xs,
    height: LAYOUT.tabBarHeight,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.modalPadding,
    margin: LAYOUT.modalMargin,
    maxWidth: '90%',
    maxHeight: '80%',
    ...COMMON_SHADOWS.modal,
  },
  
  // List styles
  listItem: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.md,
    borderBottomWidth: LAYOUT.borderWidth.thin,
    borderBottomColor: COLORS.border.light,
  },
  
  listItemLast: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.md,
  },
  
  // Form styles
  formGroup: {
    marginBottom: SPACING.md,
  },
  
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  // Chip styles
  chip: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  
  chipSelected: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  
  // Icon styles
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconSmall: {
    width: LAYOUT.iconSmall,
    height: LAYOUT.iconSmall,
  },
  
  iconMedium: {
    width: LAYOUT.iconMedium,
    height: LAYOUT.iconMedium,
  },
  
  iconLarge: {
    width: LAYOUT.iconLarge,
    height: LAYOUT.iconLarge,
  },
  
  // Avatar styles
  avatar: {
    borderRadius: LAYOUT.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatarSmall: {
    width: LAYOUT.avatarSmall,
    height: LAYOUT.avatarSmall,
  },
  
  avatarMedium: {
    width: LAYOUT.avatarMedium,
    height: LAYOUT.avatarMedium,
  },
  
  avatarLarge: {
    width: LAYOUT.avatarLarge,
    height: LAYOUT.avatarLarge,
  },
  
  // Utility styles
  hidden: {
    display: 'none',
  },
  
  visible: {
    display: 'flex',
  },
  
  absolute: {
    position: 'absolute',
  },
  
  relative: {
    position: 'relative',
  },
  
  fullWidth: {
    width: '100%',
  },
  
  fullHeight: {
    height: '100%',
  },
  
  // Text alignment
  textLeft: {
    textAlign: 'left',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // Border styles
  borderTop: {
    borderTopWidth: LAYOUT.borderWidth.light,
    borderTopColor: COLORS.border.light,
  },
  
  borderBottom: {
    borderBottomWidth: LAYOUT.borderWidth.light,
    borderBottomColor: COLORS.border.light,
  },
  
  borderLeft: {
    borderLeftWidth: LAYOUT.borderWidth.light,
    borderLeftColor: COLORS.border.light,
  },
  
  borderRight: {
    borderRightWidth: LAYOUT.borderWidth.light,
    borderRightColor: COLORS.border.light,
  },
  
  // Rounded corners
  rounded: {
    borderRadius: LAYOUT.borderRadius.round,
  },
  
  roundedSmall: {
    borderRadius: LAYOUT.borderRadius.sm,
  },
  
  roundedMedium: {
    borderRadius: LAYOUT.borderRadius.md,
  },
  
  roundedLarge: {
    borderRadius: LAYOUT.borderRadius.lg,
  },
});
