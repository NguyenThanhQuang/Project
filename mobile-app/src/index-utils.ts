// Main App Index
export * from "./data";
export * from "./theme";

// Export specific items to avoid conflicts
export {
  adminService,
  apiService,
  authService,
  bookingService,
  debugService,
  notificationService,
  profileService,
  storageService,
} from "./services";

// Re-export commonly used items for convenience
export {
  COLORS,
  COMMON_STYLES,
  COMPONENT_STYLES,
  SPACING,
  TYPOGRAPHY,
} from "./theme";

export { generateMockTrips, mockCompanies, mockLocations } from "./data";
