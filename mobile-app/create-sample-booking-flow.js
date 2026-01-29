// Quick demo script để test booking flow
// Chạy script này để tạo demo data và test flow booking

console.log(`
🚌 Demo Flow Mua Vé Mobile App

📋 Hướng dẫn sử dụng:

1️⃣ **Tìm kiếm chuyến xe:**
   - Mở SearchTripsScreen trong mobile app
   - Chọn: Hồ Chí Minh → Hà Nội
   - Chọn ngày: Hôm nay hoặc ngày mai
   - Nhấn "Tìm kiếm chuyến xe"

2️⃣ **Chọn chuyến xe:**
   - App sẽ hiển thị mock data (do chưa có real data)
   - Nhấn "Đặt vé" trên chuyến xe bất kỳ
   - Hoặc nhấn "Xem chi tiết" để chọn ghế

3️⃣ **Chọn ghế (nếu vào chi tiết):**
   - Xem sơ đồ ghế ngồi 
   - Chọn ghế màu xanh (available)
   - Nhấn "Tiếp tục đặt vé"

4️⃣ **Điền thông tin:**
   - Nhập thông tin liên hệ
   - Nhập thông tin hành khách cho từng ghế
   - Nhấn "Xác nhận đặt vé"

5️⃣ **Thanh toán:**
   - App sẽ tạo booking hold
   - Nhấn "Thanh toán ngay" 
   - Thành công! 🎉

🔧 **Tính năng đã hoàn thành:**

✅ Tìm kiếm chuyến xe với autocomplete locations
✅ Hiển thị kết quả tìm kiếm với thông tin đầy đủ
✅ Chi tiết chuyến xe với sơ đồ ghế ngồi
✅ Booking flow hoàn chỉnh với form validation
✅ Integration với backend API (khi có kết nối)
✅ Fallback data khi offline
✅ Error handling và user feedback
✅ Responsive UI với Material Design

🌐 **API Endpoints được sử dụng:**

- GET /api/trips?from=...&to=...&date=... (tìm kiếm)
- GET /api/trips/:id (chi tiết chuyến xe)  
- POST /api/bookings/hold (tạo booking)
- PATCH /api/bookings/:id/mock-confirm-payment (thanh toán)

📱 **Trải nghiệm người dùng:**

- Smooth navigation giữa các màn hình
- Validation input với thông báo rõ ràng
- Loading states cho tất cả API calls
- Offline mode với mock data
- Error recovery với retry options
- Success confirmation với clear next steps

🔄 **Backup Flow (khi offline):**

Khi không có internet hoặc backend không chạy:
- App vẫn hoạt động với mock data
- Tất cả features vẫn có thể test được
- Thông báo rõ ràng về việc sử dụng demo data

🚀 **Để test với real backend:**

1. Đảm bảo backend chạy: http://localhost:3000
2. Tạo sample data:
   - Companies (nhà xe)
   - Locations (địa điểm)  
   - Vehicles (xe)
   - Trips (chuyến xe)
3. Restart mobile app để clear cache

✨ **Flow hoàn chỉnh đã sẵn sàng sử dụng!**
`);

// Export cho mobile app import
module.exports = {
  demoFlow: {
    step1: 'SearchTripsScreen - Tìm kiếm chuyến xe',
    step2: 'TripDetailsScreen - Chọn ghế ngồi', 
    step3: 'BookingCheckoutScreen - Xác nhận đặt vé',
    step4: 'Payment confirmation - Hoàn thành'
  },
  
  testData: {
    searchParams: {
      from: 'Hồ Chí Minh',
      to: 'Hà Nội', 
      date: '2025-01-10',
      passengers: 1
    },
    
    mockTrip: {
      _id: 'demo-trip-001',
      from: 'Hồ Chí Minh',
      to: 'Hà Nội',
      departureTime: '2025-01-10T08:00:00.000Z',
      expectedArrivalTime: '2025-01-10T20:00:00.000Z',
      price: 450000,
      availableSeats: 25,
      company: { name: 'Phương Trang', _id: 'company-001' },
      route: {
        fromLocationId: { name: 'Bến xe Miền Đông', province: 'Hồ Chí Minh' },
        toLocationId: { name: 'Bến xe Mỹ Đình', province: 'Hà Nội' }
      },
      vehicleId: { type: 'Xe giường nằm', totalSeats: 45 }
    }
  }
};

