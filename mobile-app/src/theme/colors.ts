// Color palette for the entire app
export const COLORS = {
  // Primary colors
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrast: '#ffffff',
  },
  
  // Secondary colors
  secondary: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrast: '#ffffff',
  },
  
  // Success colors
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrast: '#ffffff',
  },
  
  // Warning colors
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrast: '#000000',
  },
  
  // Error colors
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrast: '#ffffff',
  },
  
  // Info colors
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrast: '#ffffff',
  },
  
  // Neutral colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray50: '#fafafa',
    gray100: '#f5f5f5',
    gray200: '#eeeeee',
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
  
  // Text colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#9e9e9e',
    inverse: '#ffffff',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#fafafa',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Border colors
  border: {
    light: '#e0e0e0',
    medium: '#bdbdbd',
    dark: '#9e9e9e',
  },
  
  // Status colors
  status: {
    active: '#4caf50',
    inactive: '#9e9e9e',
    pending: '#ff9800',
    cancelled: '#f44336',
    completed: '#2196f3',
  },
  
  // Bus specific colors
  bus: {
    available: '#4caf50',
    occupied: '#f44336',
    selected: '#2196f3',
    disabled: '#9e9e9e',
  },
  
  // Company colors
  company: {
    phuongTrang: '#e91e63',
    maiLinh: '#9c27b0',
    thanhBuoi: '#3f51b5',
    hoangLong: '#009688',
    saoViet: '#ff9800',
  },
} as const;

// Color utility functions
export const getColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let current: any = COLORS;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Color not found: ${colorPath}`);
      return COLORS.neutral.gray500;
    }
    current = current[key];
  }
  
  return current;
};

// Opacity utilities
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
