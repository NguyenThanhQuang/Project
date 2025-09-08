import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { SPACING, LAYOUT } from './spacing';
import { TYPOGRAPHY } from './typography';
import { COMMON_SHADOWS } from './shadows';

// Component-specific styles
export const COMPONENT_STYLES = StyleSheet.create({
  // Search Components
  searchForm: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
    borderRadius: LAYOUT.borderRadius.lg,
    marginBottom: SPACING.lg,
    ...COMMON_SHADOWS.card,
  },
  
  searchInput: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.border.light,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body1.fontSize,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  
  searchButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    ...COMMON_SHADOWS.button,
  },
  
  searchButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
  },
  
  // Trip Components
  tripCard: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...COMMON_SHADOWS.card,
  },
  
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  
  tripRoute: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  tripCompany: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  tripPrice: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.primary.main,
  },
  
  tripTime: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  // Booking Components
  bookingCard: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...COMMON_SHADOWS.card,
  },
  
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: LAYOUT.borderWidth.light,
    borderBottomColor: COLORS.border.light,
  },
  
  bookingStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: LAYOUT.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bookingStatusText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
    color: COLORS.text.inverse,
  },
  
  // Seat Components
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  
  seat: {
    width: 40,
    height: 40,
    margin: SPACING.xs,
    borderRadius: LAYOUT.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.border.light,
  },
  
  seatAvailable: {
    backgroundColor: COLORS.bus.available,
    borderColor: COLORS.bus.available,
  },
  
  seatOccupied: {
    backgroundColor: COLORS.bus.occupied,
    borderColor: COLORS.bus.occupied,
  },
  
  seatSelected: {
    backgroundColor: COLORS.bus.selected,
    borderColor: COLORS.bus.selected,
  },
  
  seatDisabled: {
    backgroundColor: COLORS.bus.disabled,
    borderColor: COLORS.bus.disabled,
  },
  
  seatText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
    color: COLORS.text.inverse,
  },
  
  // Location Components
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: LAYOUT.borderWidth.thin,
    borderBottomColor: COLORS.border.light,
  },
  
  locationIcon: {
    width: LAYOUT.iconMedium,
    height: LAYOUT.iconMedium,
    marginRight: SPACING.sm,
    borderRadius: LAYOUT.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  locationInfo: {
    flex: 1,
  },
  
  locationName: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  locationProvince: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
  },
  
  // Form Components
  formContainer: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
    borderRadius: LAYOUT.borderRadius.lg,
    marginBottom: SPACING.lg,
    ...COMMON_SHADOWS.card,
  },
  
  formTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  formGroup: {
    marginBottom: SPACING.md,
  },
  
  formLabel: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.h6.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  formInput: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.border.light,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body1.fontSize,
    color: COLORS.text.primary,
  },
  
  formButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    ...COMMON_SHADOWS.button,
  },
  
  formButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
  },
  
  // Header Components
  headerContainer: {
    backgroundColor: COLORS.primary.main,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...COMMON_SHADOWS.header,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.text.inverse,
    flex: 1,
    textAlign: 'center',
  },
  
  headerButton: {
    width: LAYOUT.headerIconSize,
    height: LAYOUT.headerIconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tab Components
  tabContainer: {
    backgroundColor: COLORS.background.primary,
    borderTopWidth: LAYOUT.borderWidth.light,
    borderTopColor: COLORS.border.light,
    paddingBottom: SPACING.xs,
    paddingTop: SPACING.xs,
    height: LAYOUT.tabBarHeight,
  },
  
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  
  tabIcon: {
    width: LAYOUT.iconMedium,
    height: LAYOUT.iconMedium,
    marginBottom: SPACING.xs,
  },
  
  tabLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text.secondary,
  },
  
  tabLabelActive: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.primary.main,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
  },
  
  // Modal Components
  modalContainer: {
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
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: LAYOUT.borderWidth.light,
    borderBottomColor: COLORS.border.light,
  },
  
  modalTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
  },
  
  modalCloseButton: {
    width: LAYOUT.iconMedium,
    height: LAYOUT.iconMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // List Components
  listContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: LAYOUT.borderRadius.lg,
    overflow: 'hidden',
    ...COMMON_SHADOWS.card,
  },
  
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
  
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  listItemText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  
  listItemTitle: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  listItemSubtitle: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
  },
  
  // Chip Components
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  
  chip: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: LAYOUT.borderRadius.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: LAYOUT.borderWidth.light,
    borderColor: COLORS.border.light,
  },
  
  chipSelected: {
    backgroundColor: COLORS.primary.main,
    borderColor: COLORS.primary.main,
  },
  
  chipText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text.primary,
  },
  
  chipTextSelected: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.text.inverse,
  },
  
  // Loading Components
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  
  loadingSpinner: {
    width: LAYOUT.iconLarge,
    height: LAYOUT.iconLarge,
    marginBottom: SPACING.md,
  },
  
  loadingText: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  
  // Error Components
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderRadius: LAYOUT.borderRadius.md,
    margin: SPACING.md,
  },
  
  errorIcon: {
    width: LAYOUT.iconXLarge,
    height: LAYOUT.iconXLarge,
    marginBottom: SPACING.md,
    color: COLORS.error.main,
  },
  
  errorTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.error.main,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  errorMessage: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  errorButton: {
    backgroundColor: COLORS.error.main,
    borderRadius: LAYOUT.borderRadius.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  errorButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
  },
  
  // Empty State Components
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  
  emptyIcon: {
    width: LAYOUT.iconXLarge,
    height: LAYOUT.iconXLarge,
    marginBottom: SPACING.md,
    color: COLORS.text.disabled,
  },
  
  emptyTitle: {
    fontSize: TYPOGRAPHY.h5.fontSize,
    fontWeight: TYPOGRAPHY.h5.fontWeight,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  emptyMessage: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  emptyButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadius.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
  },
} as const);
