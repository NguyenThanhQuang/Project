/**
 * 🪝 useLocalizedData Hook
 * 
 * React hook để xử lý dữ liệu đa ngôn ngữ từ database
 * Kết hợp với LanguageContext để tự động lấy ngôn ngữ hiện tại
 */

import { useCallback } from 'react';
import { useLanguage } from '../components/LanguageContext';
import {
  getLocalizedValue,
  localizeObject,
  localizeArray,
  translateRouteName,
  formatLocalizedAddress,
  formatLocalizedPrice,
  formatLocalizedDate,
  getLocalizedWeekday,
  getLocalizedMonth,
  pluralize,
  type MultiLangField,
  type Language
} from '../utils/i18n';

/**
 * Hook chính để localize data
 * 
 * @returns Object chứa các helper functions
 * 
 * @example
 * function CompanyCard({ company }) {
 *   const { localize, localizeObj } = useLocalizedData();
 *   
 *   return (
 *     <div>
 *       <h3>{company.name}</h3>
 *       <p>{localize(company.description)}</p>
 *       <span>{localize(company.address.city)}</span>
 *     </div>
 *   );
 * }
 */
export function useLocalizedData() {
  const { language } = useLanguage();
  
  /**
   * Localize single field
   */
  const localize = useCallback((
    field: string | MultiLangField | null | undefined
  ): string => {
    return getLocalizedValue(field, language as Language);
  }, [language]);
  
  /**
   * Localize entire object
   */
  const localizeObj = useCallback(<T extends object>(obj: T): any => {
    return localizeObject(obj, language as Language);
  }, [language]);
  
  /**
   * Localize array of objects
   */
  const localizeArr = useCallback(<T extends object>(items: T[]): any[] => {
    return localizeArray(items, language as Language);
  }, [language]);
  
  /**
   * Translate route name (from → to)
   */
  const routeName = useCallback((
    from: string | MultiLangField,
    to: string | MultiLangField,
    separator: string = ' - '
  ): string => {
    return translateRouteName(from, to, language as Language, separator);
  }, [language]);
  
  /**
   * Format address
   */
  const address = useCallback((addressObj: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string | MultiLangField;
    country?: string | MultiLangField;
  }): string => {
    return formatLocalizedAddress(addressObj, language as Language);
  }, [language]);
  
  /**
   * Format price
   */
  const price = useCallback((amount: number): string => {
    return formatLocalizedPrice(amount, language as Language);
  }, [language]);
  
  /**
   * Format date
   */
  const date = useCallback((
    dateObj: Date | string,
    format: 'short' | 'long' | 'full' = 'short'
  ): string => {
    return formatLocalizedDate(dateObj, language as Language, format);
  }, [language]);
  
  /**
   * Get weekday name
   */
  const weekday = useCallback((dateObj: Date): string => {
    return getLocalizedWeekday(dateObj, language as Language);
  }, [language]);
  
  /**
   * Get month name
   */
  const month = useCallback((monthNumber: number): string => {
    return getLocalizedMonth(monthNumber, language as Language);
  }, [language]);
  
  /**
   * Pluralize text
   */
  const plural = useCallback((
    count: number,
    singular: string,
    pluralForm: string,
    viText: string
  ): string => {
    return pluralize(count, singular, pluralForm, viText, language as Language);
  }, [language]);
  
  return {
    localize,
    localizeObj,
    localizeArr,
    routeName,
    address,
    price,
    date,
    weekday,
    month,
    plural,
    language
  };
}

/**
 * Hook để localize company data
 * 
 * @param company - Company object từ API
 * @returns Localized company object
 */
export function useLocalizedCompany(company: any) {
  const { localize, address } = useLocalizedData();
  
  if (!company) return null;
  
  return {
    ...company,
    description: localize(company.description),
    address: company.address ? address(company.address) : '',
    policies: company.policies ? {
      cancellation: localize(company.policies?.cancellation),
      refund: localize(company.policies?.refund)
    } : null
  };
}

/**
 * Hook để localize route data
 * 
 * @param route - Route object từ API
 * @returns Localized route object
 */
export function useLocalizedRoute(route: any) {
  const { localize, routeName } = useLocalizedData();
  
  if (!route) return null;
  
  return {
    ...route,
    name: routeName(route.departure?.city, route.destination?.city),
    departure: route.departure ? {
      ...route.departure,
      city: localize(route.departure.city),
      terminal: localize(route.departure.terminal)
    } : null,
    destination: route.destination ? {
      ...route.destination,
      city: localize(route.destination.city),
      terminal: localize(route.destination.terminal)
    } : null
  };
}

/**
 * Hook để localize vehicle data
 * 
 * @param vehicle - Vehicle object từ API
 * @returns Localized vehicle object
 */
export function useLocalizedVehicle(vehicle: any) {
  const { localize } = useLocalizedData();
  
  if (!vehicle) return null;
  
  return {
    ...vehicle,
    vehicleType: localize(vehicle.vehicleType),
    amenities: vehicle.amenities?.map((amenity: any) => ({
      ...amenity,
      name: localize(amenity.name),
      description: localize(amenity.description)
    })) || []
  };
}

/**
 * Hook để localize notification data
 * 
 * @param notification - Notification object từ API
 * @returns Localized notification object
 */
export function useLocalizedNotification(notification: any) {
  const { localize } = useLocalizedData();
  
  if (!notification) return null;
  
  return {
    ...notification,
    title: localize(notification.title),
    message: localize(notification.message)
  };
}

/**
 * Hook để localize array of trips
 * 
 * @param trips - Array of trip objects
 * @returns Localized trips
 */
export function useLocalizedTrips(trips: any[]) {
  const { localizeArr } = useLocalizedData();
  
  if (!trips || trips.length === 0) return [];
  
  return localizeArr(trips);
}

/**
 * Hook cho booking status text
 * 
 * @param status - Booking status
 * @returns Localized status text
 */
export function useBookingStatus(status: string) {
  const { language } = useLanguage();
  const { t } = useLanguage();
  
  const statusMap: Record<string, string> = {
    confirmed: t('confirmed'),
    pending: t('pending'),
    cancelled: t('cancelled'),
    completed: t('completed'),
    refunded: t('refunded')
  };
  
  return statusMap[status] || status;
}

/**
 * Hook cho vehicle type text
 * 
 * @param type - Vehicle type code
 * @returns Localized vehicle type
 */
export function useVehicleType(type: string) {
  const { language } = useLanguage();
  
  const typeMap: Record<string, { vi: string; en: string }> = {
    limousine: { vi: 'Limousine', en: 'Limousine' },
    sleeper: { vi: 'Giường nằm', en: 'Sleeper Bus' },
    seater: { vi: 'Ghế ngồi', en: 'Seater Bus' },
    'double-decker': { vi: 'Hai tầng', en: 'Double Decker' },
    vip: { vi: 'VIP', en: 'VIP' }
  };
  
  const mapped = typeMap[type];
  if (!mapped) return type;
  
  return language === 'vi' ? mapped.vi : mapped.en;
}

/**
 * Hook cho amenity names
 * 
 * @param amenityCode - Amenity code
 * @returns Localized amenity name
 */
export function useAmenityName(amenityCode: string) {
  const { language } = useLanguage();
  
  const amenityMap: Record<string, { vi: string; en: string }> = {
    wifi: { vi: 'WiFi miễn phí', en: 'Free WiFi' },
    ac: { vi: 'Điều hòa', en: 'Air Conditioning' },
    tv: { vi: 'TV', en: 'TV' },
    toilet: { vi: 'Nhà vệ sinh', en: 'Toilet' },
    charging: { vi: 'Sạc điện thoại', en: 'Phone Charger' },
    water: { vi: 'Nước uống', en: 'Water' },
    blanket: { vi: 'Chăn', en: 'Blanket' },
    tissue: { vi: 'Khăn giấy', en: 'Tissue' },
    pillow: { vi: 'Gối', en: 'Pillow' },
    snack: { vi: 'Snack', en: 'Snack' }
  };
  
  const mapped = amenityMap[amenityCode];
  if (!mapped) return amenityCode;
  
  return language === 'vi' ? mapped.vi : mapped.en;
}

/**
 * Hook để format duration (phút → giờ phút)
 * 
 * @param minutes - Số phút
 * @returns Formatted duration text
 */
export function useDuration(minutes: number) {
  const { language } = useLanguage();
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (language === 'vi') {
    if (hours === 0) return `${mins} phút`;
    if (mins === 0) return `${hours} giờ`;
    return `${hours} giờ ${mins} phút`;
  } else {
    if (hours === 0) return `${mins} min${mins > 1 ? 's' : ''}`;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
  }
}

/**
 * Hook để format distance (km)
 * 
 * @param km - Khoảng cách (km)
 * @returns Formatted distance text
 */
export function useDistance(km: number) {
  const { language } = useLanguage();
  
  if (language === 'vi') {
    return `${km.toLocaleString('vi-VN')} km`;
  } else {
    return `${km.toLocaleString('en-US')} km`;
  }
}

/**
 * Hook để format seat number với prefix
 * 
 * @param seatNumber - Số ghế
 * @returns Formatted seat text
 */
export function useSeatNumber(seatNumber: string | string[]) {
  const { language } = useLanguage();
  
  const prefix = language === 'vi' ? 'Ghế' : 'Seat';
  
  if (Array.isArray(seatNumber)) {
    return `${prefix} ${seatNumber.join(', ')}`;
  }
  
  return `${prefix} ${seatNumber}`;
}

export default useLocalizedData;
