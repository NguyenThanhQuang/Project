/**
 * 🌐 Internationalization Utilities
 * 
 * Helper functions để xử lý dữ liệu đa ngôn ngữ từ database
 */

export type Language = 'vi' | 'en';

/**
 * Interface cho field đa ngôn ngữ trong database
 */
export interface MultiLangField {
  vi: string;
  en: string;
}

/**
 * Interface cho object có thể chứa multi-lang fields
 */
export interface MultiLangObject {
  [key: string]: string | MultiLangField | MultiLangObject | any;
}

/**
 * Lấy giá trị đã localize từ field
 * 
 * @param field - Field có thể là string hoặc object {vi, en}
 * @param language - Ngôn ngữ cần lấy ('vi' | 'en')
 * @returns Giá trị đã localize
 * 
 * @example
 * const description = { vi: "Mô tả", en: "Description" };
 * getLocalizedValue(description, 'en'); // "Description"
 * 
 * const name = "Phương Trang";
 * getLocalizedValue(name, 'en'); // "Phương Trang" (giữ nguyên)
 */
export function getLocalizedValue(
  field: string | MultiLangField | null | undefined,
  language: Language = 'vi'
): string {
  // Null/undefined check
  if (!field) return '';
  
  // Nếu là string, trả về nguyên bản
  if (typeof field === 'string') {
    return field;
  }
  
  // Nếu là object, lấy theo language
  if (typeof field === 'object' && field !== null) {
    return field[language] || field.vi || field.en || '';
  }
  
  return String(field);
}

/**
 * Localize toàn bộ object (deep)
 * 
 * @param obj - Object cần localize
 * @param language - Ngôn ngữ
 * @returns Object đã được localize
 * 
 * @example
 * const company = {
 *   name: "Phương Trang",
 *   description: { vi: "Nhà xe", en: "Bus company" },
 *   address: {
 *     city: { vi: "TP.HCM", en: "Ho Chi Minh City" }
 *   }
 * };
 * 
 * localizeObject(company, 'en');
 * // {
 * //   name: "Phương Trang",
 * //   description: "Bus company",
 * //   address: { city: "Ho Chi Minh City" }
 * // }
 */
export function localizeObject<T extends MultiLangObject>(
  obj: T,
  language: Language = 'vi'
): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Nếu là array
  if (Array.isArray(obj)) {
    return obj.map(item => localizeObject(item, language));
  }
  
  // Nếu là MultiLangField
  if ('vi' in obj && 'en' in obj && Object.keys(obj).length === 2) {
    return obj[language] || obj.vi || obj.en;
  }
  
  // Localize từng field
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (value === null || value === undefined) {
        result[key] = value;
      } else if (typeof value === 'object') {
        result[key] = localizeObject(value, language);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * Localize array of objects
 * 
 * @param items - Mảng các object
 * @param language - Ngôn ngữ
 * @returns Mảng đã localize
 */
export function localizeArray<T extends MultiLangObject>(
  items: T[],
  language: Language = 'vi'
): any[] {
  return items.map(item => localizeObject(item, language));
}

/**
 * Check xem field có phải là MultiLangField không
 * 
 * @param field - Field cần check
 * @returns true nếu là MultiLangField
 */
export function isMultiLangField(field: any): field is MultiLangField {
  return (
    field &&
    typeof field === 'object' &&
    'vi' in field &&
    'en' in field &&
    Object.keys(field).length === 2
  );
}

/**
 * Tạo MultiLangField từ 2 string
 * 
 * @param vi - Text tiếng Việt
 * @param en - Text tiếng Anh
 * @returns MultiLangField object
 */
export function createMultiLangField(vi: string, en: string): MultiLangField {
  return { vi, en };
}

/**
 * Merge 2 MultiLangField objects
 * 
 * @param field1 - Field 1
 * @param field2 - Field 2
 * @returns Merged field
 */
export function mergeMultiLangFields(
  field1: MultiLangField,
  field2: Partial<MultiLangField>
): MultiLangField {
  return {
    vi: field2.vi || field1.vi,
    en: field2.en || field1.en
  };
}

/**
 * Translate route name
 * Helper đặc biệt cho tên tuyến đường
 * 
 * @param from - Điểm đi
 * @param to - Điểm đến
 * @param language - Ngôn ngữ
 * @returns Tên tuyến đường đã format
 * 
 * @example
 * const from = { vi: "TP.HCM", en: "Ho Chi Minh City" };
 * const to = { vi: "Đà Lạt", en: "Da Lat" };
 * translateRouteName(from, to, 'en'); // "Ho Chi Minh City - Da Lat"
 */
export function translateRouteName(
  from: string | MultiLangField,
  to: string | MultiLangField,
  language: Language = 'vi',
  separator: string = ' - '
): string {
  const fromText = getLocalizedValue(from, language);
  const toText = getLocalizedValue(to, language);
  return `${fromText}${separator}${toText}`;
}

/**
 * Format địa chỉ đa ngôn ngữ
 * 
 * @param address - Object địa chỉ
 * @param language - Ngôn ngữ
 * @returns Địa chỉ đã format
 */
export function formatLocalizedAddress(
  address: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string | MultiLangField;
    country?: string | MultiLangField;
  },
  language: Language = 'vi'
): string {
  const parts: string[] = [];
  
  if (address.street) parts.push(address.street);
  if (address.ward) parts.push(address.ward);
  if (address.district) parts.push(address.district);
  if (address.city) parts.push(getLocalizedValue(address.city, language));
  if (address.country) parts.push(getLocalizedValue(address.country, language));
  
  return parts.filter(Boolean).join(', ');
}

/**
 * Get language-specific currency symbol
 * 
 * @param language - Ngôn ngữ
 * @returns Currency symbol
 */
export function getCurrencySymbol(language: Language): string {
  return language === 'vi' ? 'đ' : 'VND';
}

/**
 * Format price theo ngôn ngữ
 * 
 * @param amount - Số tiền
 * @param language - Ngôn ngữ
 * @returns Formatted price
 */
export function formatLocalizedPrice(
  amount: number,
  language: Language = 'vi'
): string {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const formatted = amount.toLocaleString(locale);
  
  if (language === 'vi') {
    return `${formatted}đ`;
  } else {
    return `${formatted} VND`;
  }
}

/**
 * Format date theo ngôn ngữ
 * 
 * @param date - Date object or string
 * @param language - Ngôn ngữ
 * @param format - Format type
 * @returns Formatted date
 */
export function formatLocalizedDate(
  date: Date | string,
  language: Language = 'vi', // Đảm bảo type Language đã được import hoặc định nghĩa
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  // FIX: Khai báo kiểu Record rõ ràng để TS hiểu các giá trị bên trong đúng chuẩn Intl
  const formatOptions: Record<typeof format, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };

  // Lấy options dựa trên format
  const options = formatOptions[format];

  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Get weekday name
 * 
 * @param date - Date object
 * @param language - Ngôn ngữ
 * @returns Weekday name
 */
export function getLocalizedWeekday(
  date: Date,
  language: Language = 'vi'
): string {
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/**
 * Get month name
 * 
 * @param monthNumber - Month number (0-11)
 * @param language - Ngôn ngữ
 * @returns Month name
 */
export function getLocalizedMonth(
  monthNumber: number,
  language: Language = 'vi'
): string {
  const date = new Date(2024, monthNumber, 1);
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  return date.toLocaleDateString(locale, { month: 'long' });
}

/**
 * Pluralize text theo ngôn ngữ
 * Tiếng Việt không cần plural, tiếng Anh có
 * 
 * @param count - Số lượng
 * @param singular - Dạng số ít (EN)
 * @param plural - Dạng số nhiều (EN)
 * @param viText - Text tiếng Việt (không đổi)
 * @param language - Ngôn ngữ
 * @returns Text đã pluralize
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string,
  viText: string,
  language: Language = 'vi'
): string {
  if (language === 'vi') {
    return viText;
  }
  return count === 1 ? singular : plural;
}

/**
 * Validate MultiLangField
 * 
 * @param field - Field cần validate
 * @returns true nếu valid
 */
export function validateMultiLangField(field: any): boolean {
  if (!field || typeof field !== 'object') return false;
  
  return (
    'vi' in field &&
    'en' in field &&
    typeof field.vi === 'string' &&
    typeof field.en === 'string' &&
    field.vi.trim() !== '' &&
    field.en.trim() !== ''
  );
}

/**
 * Get missing translations
 * Debug helper để tìm field chưa dịch
 * 
 * @param obj - Object cần check
 * @returns Array of missing translation paths
 */
export function getMissingTranslations(
  obj: any,
  path: string = ''
): string[] {
  const missing: string[] = [];
  
  if (!obj || typeof obj !== 'object') return missing;
  
  // Check nếu là MultiLangField
  if (isMultiLangField(obj)) {
    if (!obj.vi || !obj.en) {
      missing.push(path);
    }
    return missing;
  }
  
  // Recursive check
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null) {
        missing.push(...getMissingTranslations(value, newPath));
      }
    }
  }
  
  return missing;
}

export default {
  getLocalizedValue,
  localizeObject,
  localizeArray,
  isMultiLangField,
  createMultiLangField,
  mergeMultiLangFields,
  translateRouteName,
  formatLocalizedAddress,
  getCurrencySymbol,
  formatLocalizedPrice,
  formatLocalizedDate,
  getLocalizedWeekday,
  getLocalizedMonth,
  pluralize,
  validateMultiLangField,
  getMissingTranslations
};
