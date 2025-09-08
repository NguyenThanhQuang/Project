// Theme Index
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './commonStyles';
export * from './componentStyles';
// App-wide route and icon constants
export const ROUTES = {
  TripDetails: 'TripDetails',
  BookingCheckout: 'BookingCheckout',
  SearchTrips: 'SearchTrips',
  MyBookings: 'MyBookings',
  BusTracking: 'BusTracking',
  Profile: 'Profile',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
  ChangePassword: 'ChangePassword',
  CompanyRegistration: 'CompanyRegistration',
  AdminPanel: 'AdminPanel',
} as const;

export const ICONS = {
  seat: 'car',
  time: 'time',
  timeOutline: 'time-outline',
  bus: 'bus',
  person: 'person',
  personCircle: 'person-circle',
  location: 'location',
  refresh: 'refresh',
  arrowForward: 'arrow-forward',
  arrowBack: 'arrow-back',
  bookmark: 'bookmark',
  help: 'help-circle',
  search: 'search',
  calendar: 'calendar-outline',
  car: 'car',
} as const;
