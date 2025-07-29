// Hệ thống dữ liệu trung tâm cho ứng dụng xe bus

// Định nghĩa các công ty xe bus
export const BUS_COMPANIES = {
  'phuong-trang': {
    id: 'phuong-trang',
    name: 'Phương Trang',
    logo: 'PT',
    color: '#2196F3'
  },
  'hoang-long': {
    id: 'hoang-long',
    name: 'Hoàng Long',
    logo: 'HL', 
    color: '#4CAF50'
  },
  'mai-linh': {
    id: 'mai-linh',
    name: 'Mai Linh',
    logo: 'ML',
    color: '#FF5722'
  },
  'thanh-buoi': {
    id: 'thanh-buoi',
    name: 'Thanh Bưởi',
    logo: 'TB',
    color: '#9C27B0'
  }
} as const;

// Định nghĩa các tuyến đường
export const ROUTES = {
  'hanoi-haiphong': {
    id: 'hanoi-haiphong',
    name: 'Hà Nội - Hải Phòng',
    coordinates: [
      // Theo Quốc lộ 5 (QL5)
      [21.0285, 105.8342], // Hà Nội - Bến xe Giáp Bát
      [21.0367, 105.8495], // Đại lộ Thăng Long
      [21.0456, 105.8634], // Cầu Thanh Trì
      [21.0523, 105.8789], // Quận Gia Lâm
      [21.0583, 105.9173], // Gia Lâm - Đường QL5
      [21.0645, 105.9456], // Vành đai 3
      [21.0712, 105.9789], // Thị trấn Trâu Quỳ
      [21.0823, 106.0234], // Huyện Gia Lâm
      [21.0945, 106.0567], // Chợ Yên Viên
      [21.1067, 106.0823], // Thị trấn Kiến Hưng
      [21.1189, 106.1089], // Thành phố Hải Dương
      [21.1213, 106.1166], // Trung tâm Hải Dương
      [21.1156, 106.1445], // Ra khỏi thành phố Hải Dương
      [21.1034, 106.1789], // Huyện Kim Thành
      [21.0912, 106.2134], // Thị trấn Phú Thái
      [21.0789, 106.2478], // Huyện Thanh Hà
      [21.0667, 106.2823], // Thị trấn Thanh Hà
      [21.0545, 106.3167], // Huyện Cẩm Giàng
      [21.0412, 106.3512], // Thị trấn Cẩm Giang
      [21.0234, 106.3789], // Thành phố Chí Linh
      [20.9653, 106.3969], // Trung tâm Chí Linh
      [20.9489, 106.4234], // Ra khỏi Chí Linh
      [20.9345, 106.4567], // Huyện Thanh Miện
      [20.9201, 106.4901], // Thị trấn Thanh Miện
      [20.9056, 106.5234], // Huyện Kiến Thụy
      [20.8912, 106.5567], // Thị trấn Kiến Thụy
      [20.8767, 106.5901], // Vào thành phố Hải Phòng
      [20.8623, 106.6234], // Quận Thủy Nguyên
      [20.8534, 106.6456], // Quận Đồ Sơn
      [20.8489, 106.6678], // Quận Hồng Bàng
      [20.8449, 106.6807]  // Hải Phòng - Bến xe Lạch Tray
    ] as [number, number][],
    color: '#FF5722',
    distance: 120,
    duration: 150 // minutes
  },
  'hanoi-danang': {
    id: 'hanoi-danang',
    name: 'Hà Nội - Đà Nẵng', 
    coordinates: [
      // Theo Quốc lộ 1A (QL1A)
      [21.0285, 105.8342], // Hà Nội - Bến xe Giáp Bát
      [20.9867, 105.8456], // Hà Đông
      [20.9534, 105.8623], // Quốc Oai
      [20.9201, 105.8789], // Hòa Bình (nhánh)
      [20.8867, 105.8956], // Xuân Mai
      [20.8234, 105.9234], // Văn Điển
      [20.7601, 105.9512], // Thanh Oai
      [20.6967, 105.9789], // Ứng Hòa
      [20.6334, 106.0067], // Mỹ Đức
      [20.5701, 106.0345], // Phú Xuyên
      [20.5067, 106.0623], // Chương Mỹ
      [20.4434, 106.0901], // Đan Phượng
      [20.3801, 106.1178], // Hoài Đức
      [20.3167, 106.1456], // Vào Ninh Bình
      [20.2534, 106.1734], // Nho Quan
      [20.2506, 105.9745], // Ninh Bình - QL1A
      [20.1901, 105.9567], // Gia Viễn
      [20.1234, 105.9389], // Yên Khánh
      [20.0567, 105.9211], // Kim Sơn
      [19.9901, 105.9034], // Vụ Bản
      [19.9234, 105.8856], // Giao Thủy
      [19.8567, 105.8678], // Xuân Trường
      [19.7901, 105.8501], // Hải Hậu
      [19.7234, 105.8323], // Nghĩa Hưng
      [19.6567, 105.8145], // Vào Thanh Hóa
      [19.5901, 105.7967], // Hậu Lộc
      [19.5234, 105.7789], // Nga Sơn
      [19.4567, 105.7612], // Triệu Sơn
      [19.3901, 105.7434], // Thiệu Hóa
      [19.3234, 105.7256], // Hoằng Hóa
      [19.2567, 105.7078], // Quảng Xương
      [19.1901, 105.6901], // Đông Sơn
      [19.1234, 105.6723], // Yên Định
      [19.0567, 105.6545], // Thọ Xuân
      [18.9901, 105.6367], // Nông Cống
      [18.9234, 105.6189], // Như Thanh
      [18.8567, 105.6012], // Như Xuân
      [18.7901, 105.5834], // Ngọc Lặc
      [18.7234, 105.5656], // Thạch Thành
      [18.6567, 105.5478], // Cẩm Thủy
      [18.5901, 105.5301], // Vào Nghệ An
      [18.5234, 105.5123], // Yên Thành
      [18.4567, 105.4945], // Diễn Châu
      [18.3901, 105.4767], // Nghi Lộc
      [18.3234, 105.4589], // Nam Đàn
      [18.2567, 105.4412], // Hưng Nguyên
      [18.1901, 105.4234], // Đô Lương
      [18.1234, 105.4056], // Thanh Chương
      [18.0567, 105.3878], // Nghi Xuân
      [17.9901, 105.3701], // Vào Hà Tĩnh
      [17.9234, 105.3523], // Đức Thọ
      [17.8567, 105.3345], // Can Lộc
      [17.7901, 105.3167], // Thạch Hà
      [17.7234, 105.2989], // Cẩm Xuyên
      [17.6567, 105.2812], // Kỳ Anh
      [17.5901, 105.2634], // Vào Quảng Bình
      [17.5234, 105.2456], // Lệ Thủy
      [17.4567, 105.2278], // Quảng Ninh
      [17.3901, 105.2101], // Bố Trạch
      [17.3234, 105.1923], // Minh Hóa
      [17.2567, 105.1745], // Tuyên Hóa
      [17.1901, 105.1567], // Vào Quảng Trị
      [17.1234, 105.1389], // Vĩnh Linh
      [17.0567, 105.1212], // Gio Linh
      [16.9901, 105.1034], // Đăk Hà
      [16.9234, 105.0856], // Cam Lộ
      [16.8567, 105.0678], // Triệu Phong
      [16.7901, 105.0501], // Hải Lăng
      [16.7234, 105.0323], // Vào Thừa Thiên Huế
      [16.6567, 105.0145], // Phong Điền
      [16.5901, 104.9967], // Quảng Điền
      [16.5234, 104.9789], // Phú Vang
      [16.4901, 105.0234], // A Lưới
      [16.4637, 107.5909], // Huế - trung tâm
      [16.4234, 107.6234], // Ra khỏi Huế
      [16.3801, 107.6567], // Phú Lộc
      [16.3367, 107.6901], // Nam Đông
      [16.2934, 107.7234], // Đồng Hới
      [16.2501, 107.7567], // Vào Đà Nẵng
      [16.2067, 107.7901], // Hòa Vang
      [16.1634, 107.8234], // Liên Chiểu
      [16.1201, 107.8567], // Cẩm Lệ
      [16.0767, 107.8901], // Hải Châu
      [16.0544, 108.2022]  // Đà Nẵng - Bến xe
    ] as [number, number][],
    color: '#2196F3',
    distance: 791,
    duration: 720 // minutes (12 hours)
  },
  'hcm-cantho': {
    id: 'hcm-cantho',
    name: 'TP.HCM - Cần Thơ',
    coordinates: [
      // Theo QL1A và QL80
      [10.8231, 106.6297], // TP.HCM - Bến xe Miền Tây
      [10.8156, 106.6178], // Quận Bình Tân
      [10.8034, 106.6012], // Huyện Bình Chánh
      [10.7912, 106.5845], // Thị trấn Tân Túc
      [10.7789, 106.5678], // Huyện Hóc Môn
      [10.7667, 106.5512], // Thị trấn Hóc Môn
      [10.7545, 106.5345], // Huyện Củ Chi
      [10.7423, 106.5178], // Thị trấn Củ Chi
      [10.7301, 106.5012], // Vào Long An
      [10.7178, 106.4845], // Huyện Đức Hòa
      [10.7056, 106.4678], // Thị trấn Đức Hòa
      [10.6934, 106.4512], // Huyện Bến Lức
      [10.6812, 106.4345], // Thị trấn Bến Lức
      [10.6689, 106.4178], // Huyện Thủ Thừa
      [10.6567, 106.4012], // Thị trấn Thủ Thừa
      [10.6445, 106.3845], // Huyện Tân Trụ
      [10.6323, 106.3678], // Thị trấn Tân Trụ
      [10.6201, 106.3512], // Huyện Cần Đước
      [10.6078, 106.3345], // Thị trấn Cần Đước
      [10.5956, 106.3178], // Huyện Cần Giuộc
      [10.5834, 106.3012], // Thị trấn Cần Giuộc
      [10.5712, 106.2845], // Vào Tiền Giang
      [10.5589, 106.2678], // Huyện Châu Thành
      [10.5467, 106.2512], // Thị trấn Tân Phước
      [10.5345, 106.2345], // Huyện Gò Công Tây
      [10.5223, 106.2178], // Thị trấn Gò Công Tây
      [10.5101, 106.2012], // Huyện Gò Công Đông
      [10.4978, 106.1845], // Thị trấn Gò Công Đông
      [10.4856, 106.1678], // Huyện Tân Phú Đông
      [10.4734, 106.1512], // Huyện Chợ Gạo
      [10.4612, 106.1345], // Thị trấn Chợ Gạo
      [10.4489, 106.1178], // Huyện Cái Bè
      [10.4367, 106.1012], // Thị trấn Cái Bè
      [10.4245, 106.0845], // Huyện Cai Lậy
      [10.4123, 106.0678], // Thị trấn Cai Lậy
      [10.4001, 106.0512], // Vào Đồng Tháp - theo QL80
      [10.3878, 106.0345], // Huyện Lấp Vò
      [10.3756, 106.0178], // Thị trấn Lấp Vò
      [10.3634, 106.0012], // Huyện Lai Vung
      [10.3512, 105.9845], // Thị trấn Lai Vung
      [10.3389, 105.9678], // Huyện Thanh Bình
      [10.3267, 105.9512], // Thị trấn Thanh Bình
      [10.3145, 105.9345], // Huyện Tam Nông
      [10.3023, 105.9178], // Thị trấn Tam Nông
      [10.2901, 105.9012], // Huyện Cao Lãnh
      [10.2778, 105.8845], // Thành phố Cao Lãnh
      [10.2656, 105.8678], // Ra khỏi Cao Lãnh
      [10.2534, 105.8512], // Huyện Tháp Mười
      [10.2412, 105.8345], // Thị trấn Mỹ An
      [10.2289, 105.8178], // Huyện Hồng Ngự
      [10.2167, 105.8012], // Thị trấn An Thạnh Trung
      [10.2045, 105.7845], // Vào An Giang
      [10.1923, 105.7678], // Huyện Thoại Sơn
      [10.1801, 105.7512], // Thị trấn Núi Sập
      [10.1678, 105.7345], // Vào Cần Thơ
      [10.1556, 105.7178], // Huyện Thốt Nốt
      [10.1434, 105.7012], // Quận Thốt Nốt
      [10.1312, 105.6845], // Huyện Vĩnh Thạnh
      [10.1189, 105.6678], // Quận Ô Môn
      [10.1067, 105.6512], // Quận Bình Thủy
      [10.0945, 105.6345], // Quận Cái Răng
      [10.0823, 105.6178], // Quận Ninh Kiều
      [10.0701, 105.6012], // Trung tâm Cần Thơ
      [10.0578, 105.5845], // Bến xe Cần Thơ
      [10.0352, 105.7809]  // Cần Thơ - Bến xe chính
    ] as [number, number][],
    color: '#4CAF50',
    distance: 169,
    duration: 210 // minutes (3.5 hours)
  },
  'danang-hue': {
    id: 'danang-hue',
    name: 'Đà Nẵng - Huế',
    coordinates: [
      // Theo Quốc lộ 1A qua Đèo Hải Vân
      [16.0544, 108.2022], // Đà Nẵng - Bến xe
      [16.0634, 108.1956], // Quận Hải Châu
      [16.0723, 108.1889], // Quận Thanh Khê
      [16.0812, 108.1823], // Quận Liên Chiểu
      [16.0901, 108.1756], // Huyện Hòa Vang
      [16.0989, 108.1689], // Thị trấn Hòa Vang
      [16.1078, 108.1623], // Huyện Đông Giang
      [16.1167, 108.1556], // Vào khu vực miền núi
      [16.1256, 108.1489], // Bắt đầu lên Đèo Hải Vân
      [16.1345, 108.1423], // Dốc Đèo Hải Vân (1)
      [16.1434, 108.1356], // Dốc Đèo Hải Vân (2)
      [16.1523, 108.1289], // Dốc Đèo Hải Vân (3)
      [16.1612, 108.1223], // Dốc Đèo Hải Vân (4)
      [16.1701, 108.1156], // Đỉnh Đèo Hải Vân (500m)
      [16.1789, 108.1089], // Đỉnh Đèo Hải Vân cao nhất
      [16.1878, 108.1023], // Xuống Đèo Hải Vân (1)
      [16.1967, 108.0956], // Xuống Đèo Hải Vân (2)
      [16.2056, 108.0889], // Xuống Đèo Hải Vân (3)
      [16.2145, 108.0823], // Xuống Đèo Hải Vân (4)
      [16.2234, 108.0756], // Chân Đèo Hải Vân (Huế)
      [16.2323, 108.0689], // Vào Thừa Thiên Huế
      [16.2412, 108.0623], // Huyện Phú Lộc
      [16.2501, 108.0556], // Thị trấn Lăng Cô
      [16.2589, 108.0489], // Bãi biển Lăng Cô
      [16.2678, 108.0423], // Huyện Nam Đông
      [16.2767, 108.0356], // Thị trấn Khe Tre
      [16.2856, 108.0289], // Huyện A Lưới
      [16.2945, 108.0223], // Thị trấn A Lưới
      [16.3034, 108.0156], // Vào gần Huế
      [16.3123, 108.0089], // Huyện Phong Điền
      [16.3212, 108.0023], // Thị trấn Phong Điền
      [16.3301, 107.9956], // Huyện Quảng Điền
      [16.3389, 107.9889], // Thị trấn Sịa
      [16.3478, 107.9823], // Vào thành phố Huế
      [16.3567, 107.9756], // Quận Phú Nhuận (Huế)
      [16.3656, 107.9689], // Quận Phú Hội
      [16.3745, 107.9623], // Trung tâm Huế cổ
      [16.3834, 107.9556], // Đại Nội Huế
      [16.3923, 107.9489], // Sông Hương
      [16.4012, 107.9423], // Chùa Thiên Mụ
      [16.4101, 107.9356], // Lăng Tự Đức
      [16.4189, 107.9289], // Vào trung tâm Huế
      [16.4278, 107.9223], // Bến xe Phía Nam
      [16.4367, 107.9156], // Bến xe An Hòa
      [16.4456, 107.9089], // Bến xe An Cựu
      [16.4545, 107.9023], // Đại học Huế
      [16.4634, 107.8956], // Sân bay Phú Bài (gần)
      [16.4637, 107.5909]  // Huế - Bến xe chính
    ] as [number, number][],
    color: '#9C27B0',
    distance: 108,
    duration: 180 // minutes (3 hours)
  }
} as const;

// Định nghĩa các chuyến xe cụ thể
export const TRIPS = [
  {
    id: 'TRIP001',
    routeId: 'hanoi-haiphong',
    companyId: 'phuong-trang',
    vehicleNumber: 'HN-HP-001',
    vehicleType: 'Giường nằm 45 chỗ',
    totalSeats: 45,
    departureTime: '08:00',
    arrivalTime: '10:30',
    price: 150000,
    fromLocation: 'Bến xe Giáp Bát, Hà Nội',
    toLocation: 'Bến xe Lạch Tray, Hải Phòng',
    driver: 'Nguyễn Văn An',
    currentPassengers: 28,
    availableSeats: 17,
    status: 'active' as const,
    departureDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'TRIP002', 
    routeId: 'hanoi-danang',
    companyId: 'hoang-long',
    vehicleNumber: 'HN-DN-002',
    vehicleType: 'Limousine 50 chỗ',
    totalSeats: 50,
    departureTime: '06:00',
    arrivalTime: '18:00',
    price: 450000,
    fromLocation: 'Bến xe Giáp Bát, Hà Nội',
    toLocation: 'Bến xe Đà Nẵng',
    driver: 'Trần Thị Bình',
    currentPassengers: 42,
    availableSeats: 8,
    status: 'active' as const,
    departureDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'TRIP003',
    routeId: 'hcm-cantho', 
    companyId: 'mai-linh',
    vehicleNumber: 'HCM-CT-003',
    vehicleType: 'Ghế ngồi 40 chỗ',
    totalSeats: 40,
    departureTime: '14:00',
    arrivalTime: '17:30',
    price: 180000,
    fromLocation: 'Bến xe Miền Tây, HCM',
    toLocation: 'Bến xe Cần Thơ',
    driver: 'Lê Văn Cường',
    currentPassengers: 35,
    availableSeats: 5,
    status: 'active' as const,
    departureDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'TRIP004',
    routeId: 'danang-hue',
    companyId: 'thanh-buoi',
    vehicleNumber: 'DN-HUE-004', 
    vehicleType: 'Limousine 35 chỗ',
    totalSeats: 35,
    departureTime: '15:30',
    arrivalTime: '18:30',
    price: 120000,
    fromLocation: 'Bến xe Đà Nẵng',
    toLocation: 'Bến xe Huế',
    driver: 'Phạm Thị Dung',
    currentPassengers: 22,
    availableSeats: 13,
    status: 'active' as const,
    departureDate: new Date().toISOString().split('T')[0]
  },
  // Thêm một số chuyến khác để có đa dạng
  {
    id: 'TRIP005',
    routeId: 'hanoi-haiphong',
    companyId: 'hoang-long',
    vehicleNumber: 'HN-HP-005',
    vehicleType: 'Ghế ngồi 45 chỗ',
    totalSeats: 45,
    departureTime: '14:00',
    arrivalTime: '16:30',
    price: 120000,
    fromLocation: 'Bến xe Giáp Bát, Hà Nội',
    toLocation: 'Bến xe Lạch Tray, Hải Phòng',
    driver: 'Hoàng Văn Nam',
    currentPassengers: 0,
    availableSeats: 45,
    status: 'scheduled' as const,
    departureDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 'TRIP006',
    routeId: 'hcm-cantho',
    companyId: 'phuong-trang',
    vehicleNumber: 'HCM-CT-006',
    vehicleType: 'Giường nằm 40 chỗ',
    totalSeats: 40,
    departureTime: '22:00',
    arrivalTime: '01:30',
    price: 200000,
    fromLocation: 'Bến xe Miền Tây, HCM',
    toLocation: 'Bến xe Cần Thơ',
    driver: 'Nguyễn Thị Lan',
    currentPassengers: 0,
    availableSeats: 40,
    status: 'scheduled' as const,
    departureDate: new Date().toISOString().split('T')[0]
  }
] as const;

// Dữ liệu xe bus với vị trí thời gian thực
export const REAL_TIME_BUSES = [
  {
    tripId: 'TRIP001',
    currentPosition: [21.0583, 105.9173] as [number, number],
    progress: 0.25,
    speed: 65,
    isMoving: true,
    nextStop: 'Hải Dương',
    estimatedArrival: '10:30'
  },
  {
    tripId: 'TRIP002',
    currentPosition: [18.6739, 105.6899] as [number, number],
    progress: 0.6,
    speed: 70,
    isMoving: true,
    nextStop: 'Đông Hà',
    estimatedArrival: '18:00'
  },
  {
    tripId: 'TRIP003',
    currentPosition: [10.3431, 106.3651] as [number, number],
    progress: 0.8,
    speed: 45,
    isMoving: false,
    nextStop: 'Cần Thơ',
    estimatedArrival: '17:30'
  },
  {
    tripId: 'TRIP004',
    currentPosition: [16.2163, 108.0624] as [number, number],
    progress: 0.5,
    speed: 55,
    isMoving: true,
    nextStop: 'Huế',
    estimatedArrival: '18:30'
  }
] as const;

// Dữ liệu vé đặt mẫu
export const SAMPLE_BOOKINGS = [
  {
    id: 'BK1735279234567',
    ticketCode: 'TK234567',
    status: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    bookingTime: '2024-12-27 15:30:00',
    tripId: 'TRIP001',
    totalAmount: 300000, // 2 ghế x 150,000
    seats: [
      { seatNumber: 'A1', passengerName: 'Nguyễn Văn A' },
      { seatNumber: 'A2', passengerName: 'Trần Thị B' },
    ],
  },
  {
    id: 'BK1735279234568',
    ticketCode: 'TK234568', 
    status: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    bookingTime: '2024-12-27 09:15:00',
    tripId: 'TRIP002',
    totalAmount: 450000, // 1 ghế x 450,000
    seats: [
      { seatNumber: 'VIP1', passengerName: 'Nguyễn Văn A' },
    ],
  },
  {
    id: 'BK1735279234569',
    ticketCode: 'TK234569',
    status: 'completed' as const,
    paymentStatus: 'paid' as const, 
    bookingTime: '2024-12-20 10:15:00',
    tripId: 'TRIP003',
    totalAmount: 180000, // 1 ghế x 180,000
    // Cập nhật ngày để thành completed
    trip: {
      ...TRIPS.find(t => t.id === 'TRIP003'),
      departureDate: '2024-12-22'
    } as any,
    seats: [
      { seatNumber: 'B1', passengerName: 'Nguyễn Văn A' },
    ],
  },
  {
    id: 'BK1735279234570',
    ticketCode: 'TK234570',
    status: 'cancelled' as const,
    paymentStatus: 'refunded' as const,
    bookingTime: '2024-12-25 14:20:00',
    tripId: 'TRIP004',
    totalAmount: 120000, // 1 ghế x 120,000
    // Cập nhật ngày để thành cancelled  
    trip: {
      ...TRIPS.find(t => t.id === 'TRIP004'),
      departureDate: '2024-12-26'
    } as any,
    seats: [
      { seatNumber: 'C5', passengerName: 'Nguyễn Văn A' },
    ],
  },
  // Thêm vé đang giữ chỗ
  {
    id: 'BK1735279234571',
    ticketCode: 'TK234571',
    status: 'held' as const,
    paymentStatus: 'pending' as const,
    bookingTime: '2024-12-27 16:45:00',
    tripId: 'TRIP005',
    totalAmount: 120000, // 1 ghế x 120,000
    seats: [
      { seatNumber: 'A5', passengerName: 'Nguyễn Văn A' },
    ],
  },
  // Thêm vé tương lai
  {
    id: 'BK1735279234572',
    ticketCode: 'TK234572',
    status: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    bookingTime: '2024-12-27 11:20:00',
    tripId: 'TRIP006',
    totalAmount: 400000, // 2 ghế x 200,000
    // Cập nhật ngày mai để thành future trip
    trip: {
      ...TRIPS.find(t => t.id === 'TRIP006'),
      departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } as any,
    seats: [
      { seatNumber: 'VIP1', passengerName: 'Nguyễn Văn A' },
      { seatNumber: 'VIP2', passengerName: 'Trần Thị B' },
    ],
  }
] as const;

// Helper functions để lấy dữ liệu liên quan
export const getTrip = (tripId: string) => {
  return TRIPS.find(trip => trip.id === tripId);
};

export const getRoute = (routeId: string) => {
  return ROUTES[routeId as keyof typeof ROUTES];
};

export const getCompany = (companyId: string) => {
  return BUS_COMPANIES[companyId as keyof typeof BUS_COMPANIES];
};

export const getRealTimeBus = (tripId: string) => {
  return REAL_TIME_BUSES.find(bus => bus.tripId === tripId);
};

export const getActiveTrips = () => {
  return TRIPS.filter(trip => trip.status === 'active');
};

export const getScheduledTrips = () => {
  return TRIPS.filter(trip => trip.status === 'scheduled');
};

// Helper để tạo dữ liệu bus cho map component
export const getBusDataForMap = () => {
  return REAL_TIME_BUSES.map(bus => {
    const trip = getTrip(bus.tripId);
    const route = trip ? getRoute(trip.routeId) : null;
    const company = trip ? getCompany(trip.companyId) : null;
    
    if (!trip || !route || !company) return null;
    
    return {
      id: trip.id,
      number: trip.vehicleNumber,
      route: trip.routeId,
      driver: trip.driver,
      currentPosition: bus.currentPosition,
      progress: bus.progress,
      speed: bus.speed,
      passengers: trip.currentPassengers,
      maxPassengers: trip.totalSeats,
      status: bus.isMoving ? 'moving' as const : 'stopped' as const,
      nextStop: bus.nextStop,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      isMoving: bus.isMoving,
      booking: {
        price: trip.price,
        availableSeats: trip.availableSeats,
        totalSeats: trip.totalSeats,
        departureDate: trip.departureDate,
        companyName: company.name,
        vehicleType: trip.vehicleType,
        fromLocation: trip.fromLocation,
        toLocation: trip.toLocation
      }
    };
  }).filter(Boolean);
};

// Helper để tạo dữ liệu booking cho MyBookings component
export const getBookingDataForMyBookings = () => {
  return SAMPLE_BOOKINGS.map(booking => {
    const trip = getTrip(booking.tripId);
    const company = trip ? getCompany(trip.companyId) : null;
    
    if (!trip || !company) return null;
    
    // Nếu booking có override trip data, sử dụng nó
    const tripData = (booking as any).trip || trip;
    
    return {
      id: booking.id,
      ticketCode: booking.ticketCode,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      bookingTime: booking.bookingTime,
      totalAmount: booking.totalAmount,
      trip: {
        id: trip.id,
        companyName: company.name,
        companyLogo: company.logo,
        vehicleType: trip.vehicleType,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        fromLocation: trip.fromLocation,
        toLocation: trip.toLocation,
        departureDate: tripData.departureDate || trip.departureDate,
      },
      seats: booking.seats,
    };
  }).filter(Boolean);
}; 