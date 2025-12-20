/**
 * 📝 MULTILINGUAL DATA EXAMPLES
 * 
 * File này demo cách sử dụng hệ thống đa ngôn ngữ với dữ liệu từ database
 * Copy các examples này vào components thật khi tích hợp backend
 */

import { useLocalizedData, useLocalizedCompany, useLocalizedRoute } from '../hooks/useLocalizedData';
import { useLanguage } from '../components/LanguageContext';

// ============================================================================
// EXAMPLE 1: Company Card với Multi-lang Data
// ============================================================================

/**
 * Mock data từ API - Company
 * Trong thực tế, data này sẽ đến từ: GET /api/v1/companies/:id
 */
const mockCompanyFromAPI = {
  _id: '123',
  name: 'Phương Trang', // Tên riêng - giữ nguyên
  slug: 'phuong-trang',
  
  description: {
    vi: 'Nhà xe uy tín hàng đầu Việt Nam với đội xe hiện đại, tài xế chuyên nghiệp',
    en: 'Leading bus company in Vietnam with modern fleet and professional drivers'
  },
  
  address: {
    street: '272 Đường 3/2',
    district: 'Quận 10',
    city: {
      vi: 'Hồ Chí Minh',
      en: 'Ho Chi Minh City'
    },
    country: {
      vi: 'Việt Nam',
      en: 'Vietnam'
    }
  },
  
  policies: {
    cancellation: {
      vi: 'Miễn phí hủy vé trước 24h. Phí 20% nếu hủy trong vòng 24h.',
      en: 'Free cancellation 24h before. 20% fee if cancelled within 24h.'
    },
    refund: {
      vi: 'Hoàn tiền trong vòng 7-10 ngày làm việc',
      en: 'Refund within 7-10 business days'
    }
  },
  
  rating: 4.8,
  totalReviews: 1234
};

/**
 * Component hiển thị thông tin nhà xe
 */
export function CompanyCard() {
  const { localize, address, language } = useLocalizedData();
  const company = mockCompanyFromAPI;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* Tên nhà xe - Giữ nguyên */}
      <h2 className="text-2xl text-gray-900 dark:text-white mb-4">
        {company.name}
      </h2>
      
      {/* Mô tả - Tự động localize */}
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {localize(company.description)}
      </p>
      
      {/* Địa chỉ - Tự động localize city/country */}
      <div className="text-sm text-gray-500 dark:text-gray-500 mb-4">
        📍 {address(company.address)}
      </div>
      
      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-yellow-500">★ {company.rating}</span>
        <span className="text-gray-500">
          ({company.totalReviews} {language === 'vi' ? 'đánh giá' : 'reviews'})
        </span>
      </div>
      
      {/* Chính sách */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div>
          <strong className="text-gray-900 dark:text-white">
            {language === 'vi' ? 'Chính sách hủy vé:' : 'Cancellation Policy:'}
          </strong>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {localize(company.policies.cancellation)}
          </p>
        </div>
        
        <div>
          <strong className="text-gray-900 dark:text-white">
            {language === 'vi' ? 'Chính sách hoàn tiền:' : 'Refund Policy:'}
          </strong>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {localize(company.policies.refund)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Route Card với Multi-lang Data
// ============================================================================

/**
 * Mock data từ API - Route
 * Trong thực tế: GET /api/v1/routes/:id
 */
const mockRouteFromAPI = {
  _id: '456',
  routeCode: 'HCM-DL-001',
  
  departure: {
    city: {
      vi: 'Hồ Chí Minh',
      en: 'Ho Chi Minh City'
    },
    terminal: {
      vi: 'Bến xe Miền Đông',
      en: 'Mien Dong Bus Station'
    },
    address: '292 Đinh Bộ Lĩnh, Bình Thạnh'
  },
  
  destination: {
    city: {
      vi: 'Đà Lạt',
      en: 'Da Lat'
    },
    terminal: {
      vi: 'Bến xe Đà Lạt',
      en: 'Da Lat Bus Station'
    },
    address: '1 Tô Hiến Thành'
  },
  
  distance: 308, // km
  duration: 390, // minutes
  basePrice: 250000
};

export function RouteCard() {
  const { localize, routeName, price } = useLocalizedData();
  const { t } = useLanguage();
  const route = mockRouteFromAPI;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* Tên tuyến - Auto localize */}
      <h3 className="text-xl text-gray-900 dark:text-white mb-4">
        {routeName(route.departure.city, route.destination.city, ' → ')}
      </h3>
      
      {/* Điểm đi */}
      <div className="mb-3">
        <div className="text-sm text-gray-500 dark:text-gray-500">{t('departure')}</div>
        <div className="text-gray-900 dark:text-white">
          {localize(route.departure.terminal)}
        </div>
        <div className="text-xs text-gray-500">
          {route.departure.address}
        </div>
      </div>
      
      {/* Điểm đến */}
      <div className="mb-3">
        <div className="text-sm text-gray-500 dark:text-gray-500">{t('destination')}</div>
        <div className="text-gray-900 dark:text-white">
          {localize(route.destination.terminal)}
        </div>
        <div className="text-xs text-gray-500">
          {route.destination.address}
        </div>
      </div>
      
      {/* Khoảng cách & Thời gian */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>📏 {route.distance} km</span>
        <span>⏱️ {Math.floor(route.duration / 60)}h {route.duration % 60}m</span>
      </div>
      
      {/* Giá */}
      <div className="text-2xl text-blue-600 dark:text-blue-400">
        {price(route.basePrice)}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Vehicle Card với Amenities
// ============================================================================

const mockVehicleFromAPI = {
  _id: '789',
  plateNumber: '51B-12345',
  
  vehicleType: {
    vi: 'Giường nằm VIP',
    en: 'VIP Sleeper Bus'
  },
  
  capacity: {
    totalSeats: 22,
    layout: '2-1'
  },
  
  amenities: [
    {
      code: 'wifi',
      name: {
        vi: 'WiFi miễn phí',
        en: 'Free WiFi'
      },
      description: {
        vi: 'WiFi tốc độ cao suốt hành trình',
        en: 'High-speed WiFi throughout the journey'
      }
    },
    {
      code: 'ac',
      name: {
        vi: 'Điều hòa',
        en: 'Air Conditioning'
      },
      description: {
        vi: 'Hệ thống điều hòa hiện đại',
        en: 'Modern air conditioning system'
      }
    },
    {
      code: 'tv',
      name: {
        vi: 'TV giải trí',
        en: 'Entertainment TV'
      },
      description: {
        vi: 'Màn hình cá nhân tại mỗi ghế',
        en: 'Personal screen at each seat'
      }
    }
  ]
};

export function VehicleCard() {
  const { localize } = useLocalizedData();
  const { t } = useLanguage();
  const vehicle = mockVehicleFromAPI;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* Loại xe */}
      <h3 className="text-xl text-gray-900 dark:text-white mb-2">
        {localize(vehicle.vehicleType)}
      </h3>
      
      {/* Biển số */}
      <div className="text-sm text-gray-500 dark:text-gray-500 mb-4">
        {vehicle.plateNumber}
      </div>
      
      {/* Capacity */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {t('capacity')}: {vehicle.capacity.totalSeats} {t('seats')} ({vehicle.capacity.layout})
      </div>
      
      {/* Tiện nghi - Auto localize */}
      <div>
        <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {t('amenities')}:
        </h4>
        <div className="space-y-2">
          {vehicle.amenities.map((amenity) => (
            <div key={amenity.code} className="flex items-start space-x-2 text-sm">
              <span className="text-blue-600">✓</span>
              <div>
                <div className="text-gray-900 dark:text-white">
                  {localize(amenity.name)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {localize(amenity.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Notification với Multi-lang
// ============================================================================

const mockNotificationFromAPI = {
  _id: 'notif123',
  userId: 'user456',
  
  title: {
    vi: 'Chuyến đi sắp khởi hành',
    en: 'Trip Departure Soon'
  },
  
  message: {
    vi: 'Chuyến xe của bạn sẽ khởi hành trong 2 giờ nữa. Vui lòng có mặt tại điểm đón trước 30 phút.',
    en: 'Your bus will depart in 2 hours. Please arrive at pickup point 30 minutes early.'
  },
  
  type: 'trip',
  createdAt: new Date()
};

export function NotificationCard() {
  const { localize, date } = useLocalizedData();
  const notification = mockNotificationFromAPI;
  
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
      {/* Title - Auto localize */}
      <h4 className="text-blue-900 dark:text-blue-100 mb-2">
        {localize(notification.title)}
      </h4>
      
      {/* Message - Auto localize */}
      <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
        {localize(notification.message)}
      </p>
      
      {/* Date */}
      <div className="text-xs text-blue-600 dark:text-blue-400">
        {date(notification.createdAt, 'long')}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Trip List với Localized Data
// ============================================================================

const mockTripsFromAPI = [
  {
    _id: 'trip1',
    tripCode: 'PT-HCM-DL-001',
    departureTime: new Date('2024-12-16T08:00:00'),
    basePrice: 250000,
    availableSeats: 15,
    
    route: {
      departure: {
        city: { vi: 'Hồ Chí Minh', en: 'Ho Chi Minh City' }
      },
      destination: {
        city: { vi: 'Đà Lạt', en: 'Da Lat' }
      }
    },
    
    company: {
      name: 'Phương Trang'
    },
    
    vehicle: {
      vehicleType: {
        vi: 'Giường nằm VIP',
        en: 'VIP Sleeper Bus'
      }
    }
  }
];

export function TripList() {
  const { localize, routeName, price, date } = useLocalizedData();
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {mockTripsFromAPI.map((trip) => (
        <div key={trip._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          {/* Route name */}
          <h3 className="text-xl text-gray-900 dark:text-white mb-2">
            {routeName(trip.route.departure.city, trip.route.destination.city)}
          </h3>
          
          {/* Company & Vehicle type */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {trip.company.name} • {localize(trip.vehicle.vehicleType)}
          </div>
          
          {/* Time & Seats */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-500">
              ⏰ {date(trip.departureTime)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {trip.availableSeats} {t('seatsAvailable')}
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl text-blue-600 dark:text-blue-400">
              {price(trip.basePrice)}
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              {t('viewDetails')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Search với Multi-lang Cities
// ============================================================================

/**
 * Mock danh sách thành phố từ API
 * GET /api/v1/cities
 */
const mockCitiesFromAPI = [
  { code: 'hcm', vi: 'Hồ Chí Minh', en: 'Ho Chi Minh City' },
  { code: 'hn', vi: 'Hà Nội', en: 'Hanoi' },
  { code: 'dl', vi: 'Đà Lạt', en: 'Da Lat' },
  { code: 'vt', vi: 'Vũng Tàu', en: 'Vung Tau' },
  { code: 'dn', vi: 'Đà Nẵng', en: 'Da Nang' }
];

export function CitySelect() {
  const { localize } = useLocalizedData();
  const { t } = useLanguage();
  
  return (
    <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
      <option value="">{t('selectDeparture')}</option>
      {mockCitiesFromAPI.map((city) => (
        <option key={city.code} value={city.code}>
          {localize(city)}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// EXAMPLE 7: Admin Form - Input Multi-lang
// ============================================================================

import { useState } from 'react';

export function AdminCompanyForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: {
      vi: '',
      en: ''
    }
  });
  
  return (
    <form className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6">
      {/* Company Name - Single language */}
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
          {t('companyName')}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Phương Trang"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl"
        />
        <p className="text-xs text-gray-500 mt-1">
          {language === 'vi' 
            ? 'Tên riêng của nhà xe (không cần dịch)' 
            : 'Company proper name (no translation needed)'}
        </p>
      </div>
      
      {/* Description - Multi-language */}
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
          {t('description')}
        </label>
        
        {/* Vietnamese */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">🇻🇳 Tiếng Việt</div>
          <textarea
            value={formData.description.vi}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description, vi: e.target.value }
            })}
            placeholder="Nhà xe uy tín hàng đầu..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl"
          />
        </div>
        
        {/* English */}
        <div>
          <div className="text-xs text-gray-500 mb-1">🇬🇧 English</div>
          <textarea
            value={formData.description.en}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description, en: e.target.value }
            })}
            placeholder="Leading bus company..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl"
          />
        </div>
      </div>
      
      <button 
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        {t('save')}
      </button>
    </form>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default {
  CompanyCard,
  RouteCard,
  VehicleCard,
  NotificationCard,
  TripList,
  CitySelect,
  AdminCompanyForm
};
