# Mock Data Directory Documentation

## Tổng quan

Thư mục `data` chứa tất cả mock data và helper functions để hỗ trợ development và testing. Thay vì hardcode data trong components, chúng ta sử dụng mock data tập trung để dễ quản lý và thay đổi.

## Cấu trúc thư mục

```
src/data/
├── index.ts              # Export tất cả mock data
├── locations.ts          # Địa điểm, bến xe, tỉnh thành
├── trips.ts              # Chuyến xe, lịch trình
├── companies.ts          # Công ty vận tải
├── vehicles.ts           # Xe, loại xe, thông tin xe
├── users.ts              # Người dùng, thông tin cá nhân
├── bookings.ts           # Đặt vé, trạng thái vé
├── notifications.ts      # Thông báo, push notification
├── reviews.ts            # Đánh giá, review chuyến xe
├── dashboard.ts          # Thống kê, biểu đồ dashboard
└── README.md             # Tài liệu này
```

## Chi tiết từng file

### 1. **`locations.ts`** - Quản lý địa điểm
- **MockLocation**: Interface cho địa điểm
- **mockLocations**: Array các địa điểm mẫu
- **Helper functions**: Tìm kiếm, lọc theo tỉnh, lấy địa điểm phổ biến

```typescript
import { mockLocations, getLocationsByProvince } from '../data';

// Sử dụng
const hcmLocations = getLocationsByProvince('Hồ Chí Minh');
const popularLocations = mockLocations.filter(loc => loc.isPopular);
```

### 2. **`trips.ts`** - Quản lý chuyến xe
- **MockTrip**: Interface cho chuyến xe
- **generateMockTrips**: Function tạo mock trips động
- **Helper functions**: Tìm kiếm, lọc theo tiêu chí

```typescript
import { generateMockTrips } from '../data';

// Sử dụng
const mockTrips = generateMockTrips(10); // Tạo 10 chuyến xe mẫu
```

### 3. **`companies.ts`** - Quản lý công ty vận tải
- **MockCompany**: Interface cho công ty
- **mockCompanies**: Array các công ty mẫu
- **Helper functions**: Tìm kiếm, lọc theo tiêu chí

```typescript
import { mockCompanies, getCompanyById } from '../data';

// Sử dụng
const company = getCompanyById('company1');
const topCompanies = mockCompanies.filter(comp => comp.rating >= 4.5);
```

### 4. **`vehicles.ts`** - Quản lý xe
- **MockVehicle**: Interface cho xe
- **mockVehicles**: Array các xe mẫu
- **Helper functions**: Lọc theo loại xe, công ty

```typescript
import { mockVehicles, getVehiclesByCompany } from '../data';

// Sử dụng
const companyVehicles = getVehiclesByCompany('company1');
const availableVehicles = mockVehicles.filter(v => v.status === 'available');
```

### 5. **`users.ts`** - Quản lý người dùng
- **MockUser**: Interface cho người dùng
- **mockUsers**: Array các user mẫu
- **Helper functions**: Tìm kiếm, xác thực

```typescript
import { mockUsers, getUserById, authenticateUser } from '../data';

// Sử dụng
const user = getUserById('user1');
const isAuthenticated = authenticateUser('user@example.com', 'password');
```

### 6. **`bookings.ts`** - Quản lý đặt vé
- **MockBooking**: Interface cho booking
- **mockBookings**: Array các booking mẫu
- **Helper functions**: Tạo, cập nhật, hủy booking

```typescript
import { mockBookings, createBooking, updateBookingStatus } from '../data';

// Sử dụng
const newBooking = createBooking(bookingData);
const updated = updateBookingStatus('booking1', 'confirmed');
```

### 7. **`notifications.ts`** - Quản lý thông báo
- **MockNotification**: Interface cho notification
- **mockNotifications**: Array các notification mẫu
- **Helper functions**: Đánh dấu đã đọc, xóa, lọc

```typescript
import { mockNotifications, getUnreadNotifications, markAsRead } from '../data';

// Sử dụng
const unread = getUnreadNotifications('user1');
markAsRead('notification1');
```

### 8. **`reviews.ts`** - Quản lý đánh giá
- **MockReview**: Interface cho review
- **mockReviews**: Array các review mẫu
- **Helper functions**: Tạo, cập nhật, xóa review, tính rating

```typescript
import { mockReviews, addReview, getAverageRating } from '../data';

// Sử dụng
const newReview = addReview(reviewData);
const avgRating = getAverageRating('company1');
```

### 9. **`dashboard.ts`** - Quản lý thống kê dashboard
- **MockDashboardStats**: Interface cho thống kê
- **mockRevenueData**: Dữ liệu biểu đồ doanh thu
- **mockTopRoutes**: Top tuyến đường
- **mockTopCompanies**: Top công ty
- **Helper functions**: Lấy thống kê, cập nhật data

```typescript
import { getDashboardStats, getTopRoutes, getRevenueData } from '../data';

// Sử dụng
const stats = getDashboardStats();
const topRoutes = getTopRoutes(5);
const monthlyRevenue = getRevenueData('monthly');
```

## Cách sử dụng

### 1. **Import mock data**
```typescript
// Import tất cả
import { 
  mockLocations, 
  mockTrips, 
  mockCompanies,
  generateMockTrips,
  getLocationsByProvince 
} from '../data';

// Hoặc import từng file
import { mockLocations } from '../data/locations';
import { generateMockTrips } from '../data/trips';
```

### 2. **Sử dụng trong components**
```typescript
import React, { useState, useEffect } from 'react';
import { mockLocations, getLocationsByProvince } from '../data';

const LocationPicker = () => {
  const [locations, setLocations] = useState(mockLocations);
  
  const searchLocations = (query: string) => {
    if (isProvince(query)) {
      setLocations(getLocationsByProvince(query));
    } else {
      setLocations(mockLocations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
      ));
    }
  };
  
  return (
    // Component logic
  );
};
```

### 3. **Sử dụng trong services**
```typescript
import { generateMockTrips, mockLocations } from '../data';

export const tripService = {
  async searchTrips(params: SearchParams) {
    try {
      // Gọi API thật
      const response = await api.get('/trips', { params });
      return response.data;
    } catch (error) {
      // Fallback về mock data
      console.warn('API failed, using mock data');
      return generateMockTrips(10);
    }
  }
};
```

## Best Practices

### 1. **Ưu tiên sử dụng helper functions**
```typescript
// ✅ Tốt - Sử dụng helper function
const user = getUserById('user1');
const locations = getLocationsByProvince('Hồ Chí Minh');

// ❌ Không tốt - Truy cập trực tiếp
const user = mockUsers.find(u => u.id === 'user1');
const locations = mockLocations.filter(l => l.province === 'Hồ Chí Minh');
```

### 2. **Sử dụng mock data làm fallback**
```typescript
try {
  const response = await api.get('/trips');
  return response.data;
} catch (error) {
  // Fallback về mock data khi API fail
  return generateMockTrips(5);
}
```

### 3. **Cập nhật mock data khi cần**
```typescript
// Cập nhật trạng thái
updateBookingStatus('booking1', 'confirmed');

// Thêm data mới
addReview(newReviewData);

// Cập nhật thống kê
updateDashboardStats({ totalBookings: 50000 });
```

### 4. **Tạo mock data động**
```typescript
// Tạo trips với số lượng tùy chỉnh
const customTrips = generateMockTrips(20);

// Tạo user với thông tin tùy chỉnh
const customUser = createMockUser({
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123456789'
});
```

## Lợi ích

### ✅ **Centralized Data Management**
- Tất cả mock data ở một nơi, dễ quản lý
- Không duplicate data giữa các components

### ✅ **Consistent Data Structure**
- Interface nhất quán cho tất cả data types
- Type safety với TypeScript

### ✅ **Easy Testing & Development**
- Dễ dàng test với data mẫu
- Không cần API thật để development

### ✅ **Flexible Fallback**
- Sử dụng mock data khi API fail
- Đảm bảo app luôn có data để hiển thị

### ✅ **Maintainable**
- Dễ dàng update data mẫu
- Helper functions tái sử dụng

## Migration từ hardcode data

### Trước (Hardcode trong component):
```typescript
const SearchTripsScreen = () => {
  const mockTrips = [
    {
      id: '1',
      from: 'Hồ Chí Minh',
      to: 'Đà Lạt',
      price: 450000,
      // ... more hardcoded data
    }
  ];
  
  return (
    // Component with hardcoded data
  );
};
```

### Sau (Sử dụng mock data):
```typescript
import { generateMockTrips } from '../data';

const SearchTripsScreen = () => {
  const [trips, setTrips] = useState([]);
  
  useEffect(() => {
    setTrips(generateMockTrips(10));
  }, []);
  
  return (
    // Component with centralized mock data
  );
};
```

## Next Steps

1. **Migration components** để sử dụng mock data
2. **Tùy chỉnh mock data** theo business logic
3. **Thêm helper functions** cho các use case cụ thể
4. **Tích hợp với API** để có fallback mechanism
