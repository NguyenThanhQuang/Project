export interface MockLocation {
  _id: string;
  name: string;
  province: string;
  type: string;
  fullAddress?: string;
  location?: { type: string; coordinates: number[] };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

export const mockLocations: MockLocation[] = [
  // Bus Stations in Ho Chi Minh City
  { _id: '1', name: 'Bến xe Miền Đông', province: 'Hồ Chí Minh', type: 'bus_station' },
  { _id: '2', name: 'Bến xe Miền Tây', province: 'Hồ Chí Minh', type: 'bus_station' },
  { _id: '3', name: 'Bến xe An Sương', province: 'Hồ Chí Minh', type: 'bus_station' },
  { _id: '4', name: 'Bến xe Chợ Lớn', province: 'Hồ Chí Minh', type: 'bus_station' },
  { _id: '5', name: 'Bến xe Sài Gòn', province: 'Hồ Chí Minh', type: 'bus_station' },
  
  // Bus Stations in Hanoi
  { _id: '6', name: 'Bến xe Mỹ Đình', province: 'Hà Nội', type: 'bus_station' },
  { _id: '7', name: 'Bến xe Giáp Bát', province: 'Hà Nội', type: 'bus_station' },
  { _id: '8', name: 'Bến xe Nước Ngầm', province: 'Hà Nội', type: 'bus_station' },
  { _id: '9', name: 'Bến xe Yên Nghĩa', province: 'Hà Nội', type: 'bus_station' },
  { _id: '10', name: 'Bến xe Gia Lâm', province: 'Hà Nội', type: 'bus_station' },
  
  // Bus Stations in Da Nang
  { _id: '11', name: 'Bến xe Trung tâm Đà Nẵng', province: 'Đà Nẵng', type: 'bus_station' },
  { _id: '12', name: 'Bến xe Đà Nẵng', province: 'Đà Nẵng', type: 'bus_station' },
  
  // Bus Stations in other provinces
  { _id: '13', name: 'Bến xe Nha Trang', province: 'Khánh Hòa', type: 'bus_station' },
  { _id: '14', name: 'Bến xe Đà Lạt', province: 'Lâm Đồng', type: 'bus_station' },
  { _id: '15', name: 'Bến xe Huế', province: 'Thừa Thiên Huế', type: 'bus_station' },
  { _id: '16', name: 'Bến xe Vũng Tàu', province: 'Bà Rịa - Vũng Tàu', type: 'bus_station' },
  { _id: '17', name: 'Bến xe Cần Thơ', province: 'Cần Thơ', type: 'bus_station' },
  { _id: '18', name: 'Bến xe Long Xuyên', province: 'An Giang', type: 'bus_station' },
  { _id: '19', name: 'Bến xe Rạch Giá', province: 'Kiên Giang', type: 'bus_station' },
  { _id: '20', name: 'Bến xe Mỹ Tho', province: 'Tiền Giang', type: 'bus_station' },
  
  // Popular cities/towns
  { _id: '21', name: 'Thành phố Hồ Chí Minh', province: 'Hồ Chí Minh', type: 'city' },
  { _id: '22', name: 'Thành phố Hà Nội', province: 'Hà Nội', type: 'city' },
  { _id: '23', name: 'Thành phố Đà Nẵng', province: 'Đà Nẵng', type: 'city' },
  { _id: '24', name: 'Thành phố Nha Trang', province: 'Khánh Hòa', type: 'city' },
  { _id: '25', name: 'Thành phố Đà Lạt', province: 'Lâm Đồng', type: 'city' },
  { _id: '26', name: 'Thành phố Huế', province: 'Thừa Thiên Huế', type: 'city' },
  { _id: '27', name: 'Thành phố Vũng Tàu', province: 'Bà Rịa - Vũng Tàu', type: 'city' },
  { _id: '28', name: 'Thành phố Cần Thơ', province: 'Cần Thơ', type: 'city' },
  { _id: '29', name: 'Thành phố Long Xuyên', province: 'An Giang', type: 'city' },
  { _id: '30', name: 'Thành phố Rạch Giá', province: 'Kiên Giang', type: 'city' },
  { _id: '31', name: 'Thành phố Mỹ Tho', province: 'Tiền Giang', type: 'city' },
  { _id: '32', name: 'Thành phố Biên Hòa', province: 'Đồng Nai', type: 'city' },
  { _id: '33', name: 'Thành phố Thủ Dầu Một', province: 'Bình Dương', type: 'city' },
  { _id: '34', name: 'Thành phố Tân An', province: 'Long An', type: 'city' },
  { _id: '35', name: 'Thành phố Cao Lãnh', province: 'Đồng Tháp', type: 'city' },
  { _id: '36', name: 'Thành phố Sa Đéc', province: 'Đồng Tháp', type: 'city' },
  { _id: '37', name: 'Thành phố Châu Đốc', province: 'An Giang', type: 'city' },
  { _id: '38', name: 'Thành phố Hà Tiên', province: 'Kiên Giang', type: 'city' },
  { _id: '39', name: 'Thành phố Phú Quốc', province: 'Kiên Giang', type: 'city' },
  { _id: '40', name: 'Thành phố Bạc Liêu', province: 'Bạc Liêu', type: 'city' },
  { _id: '41', name: 'Thành phố Sóc Trăng', province: 'Sóc Trăng', type: 'city' },
  { _id: '42', name: 'Thành phố Trà Vinh', province: 'Trà Vinh', type: 'city' },
  { _id: '43', name: 'Thành phố Bến Tre', province: 'Bến Tre', type: 'city' },
  { _id: '44', name: 'Thành phố Vĩnh Long', province: 'Vĩnh Long', type: 'city' },
  { _id: '45', name: 'Thành phố Tân Uyên', province: 'Bình Dương', type: 'city' },
  { _id: '46', name: 'Thành phố Thuận An', province: 'Bình Dương', type: 'city' },
  { _id: '47', name: 'Thành phố Dĩ An', province: 'Bình Dương', type: 'city' },
  { _id: '48', name: 'Thành phố Long Khánh', province: 'Đồng Nai', type: 'city' },
  { _id: '49', name: 'Thành phố Xuân Lộc', province: 'Đồng Nai', type: 'city' },
  { _id: '50', name: 'Thành phố Long Thành', province: 'Đồng Nai', type: 'city' },
];
