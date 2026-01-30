// locationService.ts
import axios from 'axios';
import api from './api';

// Mock data từ file vietnam-locations.json
const mockLocations = [
  {
    _id: "1",
    name: "Bến xe Miền Đông mới",
    province: "Hồ Chí Minh",
    district: "Thủ Đức",
    fullAddress: "501 Hoàng Hữu Nam, Long Bình, Thủ Đức",
    type: "bus_station",
    location: { type: "Point", coordinates: [106.8211, 10.8711] }
  },
  {
    _id: "2",
    name: "Bến xe liên tỉnh Đà Lạt",
    province: "Lâm Đồng",
    district: "Thành phố Đà Lạt",
    fullAddress: "01 Tô Hiến Thành, Phường 3, Thành phố Đà Lạt",
    type: "bus_station",
    location: { type: "Point", coordinates: [108.4323, 11.9287] }
  },
  {
    _id: "3",
    name: "Bến xe phía Nam Nha Trang",
    province: "Khánh Hòa",
    district: "Thành phố Nha Trang",
    fullAddress: "Km 6, đường 23/10, Vĩnh Trung, Thành phố Nha Trang",
    type: "bus_station",
    location: { type: "Point", coordinates: [109.155, 12.2388] }
  },
  {
    _id: "4",
    name: "Bến xe Trung tâm Đà Nẵng",
    province: "Đà Nẵng",
    district: "Quận Liên Chiểu",
    fullAddress: "185 Tôn Đức Thắng, quận Liên Chiểu, TP. Đà Nẵng",
    type: "bus_station",
    location: { type: "Point", coordinates: [108.17338, 16.05499] }
  },
  {
    _id: "5",
    name: "Bến xe Giáp Bát",
    province: "Hà Nội",
    district: "Hoàng Mai",
    fullAddress: "Km số 6, đường Giải Phóng, Hoàng Mai",
    type: "bus_station",
    location: { type: "Point", coordinates: [105.841, 20.9802] }
  },
  {
    _id: "6",
    name: "Bến xe Mỹ Đình",
    province: "Hà Nội",
    district: "Quận Nam Từ Liêm",
    fullAddress: "Số 20 Phạm Hùng, phường Mỹ Đình 2, quận Nam Từ Liêm, Hà Nội",
    type: "bus_station",
    location: { type: "Point", coordinates: [105.7775, 21.028056] }
  },
  {
    _id: "7",
    name: "Văn phòng Phương Trang Đề Thám",
    province: "Hồ Chí Minh",
    district: "Quận 1",
    fullAddress: "208 Đề Thám, Phường Phạm Ngũ Lão, Quận 1",
    type: "company_office",
    location: { type: "Point", coordinates: [106.6917, 10.7675] }
  },
  {
    _id: "8",
    name: "Văn phòng Thành Bưởi Lê Hồng Phong",
    province: "Hồ Chí Minh",
    district: "Quận 5",
    fullAddress: "266-268 Lê Hồng Phong, Phường 4, Quận 5",
    type: "company_office",
    location: { type: "Point", coordinates: [106.6781, 10.7601] }
  },
  {
    _id: "9",
    name: "Bến xe Nước Ngầm",
    province: "Hà Nội",
    district: "Quận Hoàng Mai",
    fullAddress: "Đường Giải Phóng, phường Hoàng Liệt, quận Hoàng Mai, Hà Nội",
    type: "bus_station",
    location: { type: "Point", coordinates: [105.84224, 20.96476] }
  },
  {
    _id: "10",
    name: "Bến xe Miền Đông (cũ)",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    fullAddress: "292 Đinh Bộ Lĩnh, phường 26, quận Bình Thạnh, TP. Hồ Chí Minh",
    type: "bus_station",
    location: { type: "Point", coordinates: [106.71125, 10.81473] }
  },
  {
    _id: "11",
    name: "Bến xe Miền Tây",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Tân",
    fullAddress: "395 Kinh Dương Vương, phường An Lạc, quận Bình Tân, TP. Hồ Chí Minh",
    type: "bus_station",
    location: { type: "Point", coordinates: [106.61918, 10.74008] }
  },
  {
    _id: "12",
    name: "Bến xe Trung tâm Cần Thơ",
    province: "Cần Thơ",
    district: "Quận Cái Răng",
    fullAddress: "Quốc lộ 1A, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ",
    type: "bus_station",
    location: { type: "Point", coordinates: [105.77231, 10.0052] }
  },
  {
    _id: "13",
    name: "Bến xe Thượng Lý",
    province: "Hải Phòng",
    district: "Quận Hồng Bàng",
    fullAddress: "Phường Thượng Lý, quận Hồng Bàng, TP. Hải Phòng",
    type: "bus_station",
    location: { type: "Point", coordinates: [106.68027, 20.85561] }
  },
  {
    _id: "14",
    name: "Bến xe Non Nước",
    province: "Đà Nẵng",
    district: "Quận Ngũ Hành Sơn",
    fullAddress: "Gần làng đá mỹ nghệ Non Nước, quận Ngũ Hành Sơn, TP. Đà Nẵng",
    type: "bus_station",
    location: { type: "Point", coordinates: [108.26597, 15.99999] }
  },
  {
    _id: "15",
    name: "CoCoVIP Limousine - Văn phòng Hội An",
    province: "Quảng Nam",
    district: "TP. Hội An",
    fullAddress: "214 Nguyễn Duy Hiệu, phường Cẩm Châu, TP. Hội An, Quảng Nam",
    type: "company_office",
    location: { type: "Point", coordinates: [108.34162, 15.87906] }
  },
  {
    _id: "16",
    name: "Hội An Tourist Buses",
    province: "Quảng Nam",
    district: "TP. Hội An",
    fullAddress: "Khu vực trung tâm TP. Hội An (điểm đón khách du lịch)",
    type: "bus_station",
    location: { type: "Point", coordinates: [108.32627, 15.88479] }
  }
];

export const searchLocations = async (query: string): Promise<any[]> => {
  try {
    console.log(`🔍 Searching locations for: "${query}"`);
    
    // Trả về mảng rỗng nếu query rỗng
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const searchText = query.toLowerCase().trim();
    
    // Thử kết nối đến backend trước
    try {
      const response = await api.get(`/api/locations/search`, {
        params: { q: searchText },
        timeout: 3000, // Timeout sau 3 giây
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Got ${response.data.length} results from backend`);
        return response.data;
      }
    } catch (backendError) {
      console.log('⚠️ Backend not available, using mock data');
    }
    
    // Sử dụng mock data nếu backend không hoạt động
    const filtered = mockLocations.filter(location => {
      return (
        location.name.toLowerCase().includes(searchText) ||
        location.province.toLowerCase().includes(searchText) ||
        (location.district && location.district.toLowerCase().includes(searchText)) ||
        (location.fullAddress && location.fullAddress.toLowerCase().includes(searchText))
      );
    });
    
    console.log(`📌 Found ${filtered.length} mock results for: "${query}"`);
    return filtered;
    
  } catch (error) {
    console.error('❌ Error in searchLocations:', error);
    // Trả về mảng rỗng khi có lỗi
    return [];
  }
};

export const getLocationById = async (id: string): Promise<any> => {
  try {
    // Tìm trong mock data
    const location = mockLocations.find(loc => loc._id === id);
    if (location) {
      return location;
    }
    
    // Thử từ backend
    try {
      const response = await api.get(`/api/locations/${id}`);
      return response.data;
    } catch (backendError) {
      return null;
    }
  } catch (error) {
    console.error('Error getting location by id:', error);
    return null;
  }
};

// Hàm để lấy tất cả địa điểm (cho dropdown)
export const getAllLocations = async (): Promise<any[]> => {
  return mockLocations;
};