// Services Index - Main entry point for all services
export * from './user';
export * from './admin';
export * from './common';

// Legacy exports for backward compatibility (will be removed in future versions)
export { default as apiService } from './common/apiService';
export { storageService } from './common/storageService';
export { debugService } from './common/debugService';
