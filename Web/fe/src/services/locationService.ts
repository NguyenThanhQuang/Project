// locationService.ts
import axios from 'axios';

// Import dữ liệu từ file JSON (giả sử bạn đã import nó)
// Nếu bạn không thể import trực tiếp, hãy sao chép dữ liệu vào đây
const vietnamLocations = [
  {
    name: "Bến xe Miền Đông mới",
    province: "Hồ Chí Minh",
    district: "Thủ Đức",
    fullAddress: "501 Hoàng Hữu Nam, Long Bình, Thủ Đức",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.8211, 10.8711]
    }
  },
  {
    name: "Bến xe liên tỉnh Đà Lạt",
    province: "Lâm Đồng",
    district: "Thành phố Đà Lạt",
    fullAddress: "01 Tô Hiến Thành, Phường 3, Thành phố Đà Lạt",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [108.4323, 11.9287]
    }
  },
  {
    name: "Bến xe phía Nam Nha Trang",
    province: "Khánh Hòa",
    district: "Thành phố Nha Trang",
    fullAddress: "Km 6, đường 23/10, Vĩnh Trung, Thành phố Nha Trang",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [109.155, 12.2388]
    }
  },
  {
    name: "Bến xe Trung tâm Đà Nẵng",
    province: "Đà Nẵng",
    district: "Quận Liên Chiểu",
    fullAddress: "185 Tôn Đức Thắng, quận Liên Chiểu, TP. Đà Nẵng",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [108.17338, 16.05499]
    }
  },
  {
    name: "Bến xe Giáp Bát",
    province: "Hà Nội",
    district: "Hoàng Mai",
    fullAddress: "Km số 6, đường Giải Phóng, Hoàng Mai",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.841, 20.9802]
    }
  },
  {
    name: "Bến xe Mỹ Đình",
    province: "Hà Nội",
    district: "Quận Nam Từ Liêm",
    fullAddress: "Số 20 Phạm Hùng, phường Mỹ Đình 2, quận Nam Từ Liêm, Hà Nội",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.7775, 21.028056]
    }
  },
  {
    name: "Văn phòng Phương Trang Đề Thám",
    province: "Hồ Chí Minh",
    district: "Quận 1",
    fullAddress: "208 Đề Thám, Phường Phạm Ngũ Lão, Quận 1",
    type: "company_office",
    location: {
      type: "Point",
      coordinates: [106.6917, 10.7675]
    }
  },
  {
    name: "Văn phòng Thành Bưởi Lê Hồng Phong",
    province: "Hồ Chí Minh",
    district: "Quận 5",
    fullAddress: "266-268 Lê Hồng Phong, Phường 4, Quận 5",
    type: "company_office",
    location: {
      type: "Point",
      coordinates: [106.6781, 10.7601]
    }
  },
  {
    name: "Bến xe Nước Ngầm",
    province: "Hà Nội",
    district: "Quận Hoàng Mai",
    fullAddress: "Đường Giải Phóng, phường Hoàng Liệt, quận Hoàng Mai, Hà Nội",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.84224, 20.96476]
    }
  },
  {
    name: "Bến xe Miền Đông (cũ)",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    fullAddress: "292 Đinh Bộ Lĩnh, phường 26, quận Bình Thạnh, TP. Hồ Chí Minh",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.71125, 10.81473]
    }
  },
  {
    name: "Bến xe Miền Tây",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Tân",
    fullAddress: "395 Kinh Dương Vương, phường An Lạc, quận Bình Tân, TP. Hồ Chí Minh",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.61918, 10.74008]
    }
  },
  {
    name: "Bến xe Trung tâm Cần Thơ",
    province: "Cần Thơ",
    district: "Quận Cái Răng",
    fullAddress: "Quốc lộ 1A, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.77231, 10.0052]
    }
  },
  {
    name: "Bến xe Thượng Lý",
    province: "Hải Phòng",
    district: "Quận Hồng Bàng",
    fullAddress: "Phường Thượng Lý, quận Hồng Bàng, TP. Hải Phòng",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.68027, 20.85561]
    }
  },
  {
    name: "Bến xe Non Nước",
    province: "Đà Nẵng",
    district: "Quận Ngũ Hành Sơn",
    fullAddress: "Gần làng đá mỹ nghệ Non Nước, quận Ngũ Hành Sơn, TP. Đà Nẵng",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [108.26597, 15.99999]
    }
  },
  {
    name: "CoCoVIP Limousine - Văn phòng Hội An",
    province: "Quảng Nam",
    district: "TP. Hội An",
    fullAddress: "214 Nguyễn Duy Hiệu, phường Cẩm Châu, TP. Hội An, Quảng Nam",
    type: "company_office",
    location: {
      type: "Point",
      coordinates: [108.34162, 15.87906]
    }
  },
  {
    name: "Hội An Tourist Buses",
    province: "Quảng Nam",
    district: "TP. Hội An",
    fullAddress: "Khu vực trung tâm TP. Hội An (điểm đón khách du lịch)",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [108.32627, 15.88479]
    }
  },
  {
    name: "Bến xe Yên Nghĩa",
    province: "Hà Nội",
    district: "Hà Đông",
    fullAddress: "QL6, P. Yên Nghĩa, Q. Hà Đông, Hà Nội",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.746667, 20.95]
    }
  },
  {
    name: "Bến xe An Sương",
    province: "TP. Hồ Chí Minh",
    district: "Quận 12",
    fullAddress: "QL1A, P. Trung Mỹ Tây, Q. 12, TP.HCM",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.61417, 10.84417]
    }
  },
  {
    name: "Bến xe khách tỉnh Kiên Giang (Rạch Giá)",
    province: "Kiên Giang",
    district: "Châu Thành",
    fullAddress: "QL80, H. Châu Thành, tỉnh Kiên Giang",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.129444, 9.944167]
    }
  },
  {
    name: "Bến xe Bắc Bình Minh",
    province: "Cần Thơ",
    district: "Ninh Kiều",
    fullAddress: "136 Trần Phú, Q. Ninh Kiều, TP. Cần Thơ",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [105.798611, 10.058889]
    }
  },
  {
    name: "Bến xe Phố Lu",
    province: "Lào Cai",
    district: "Bảo Thắng",
    fullAddress: "TT. Phố Lu, H. Bảo Thắng, Lào Cai",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [104.186389, 22.313889]
    }
  },
  {
    name: "Bến xe Bắc Hà",
    province: "Lào Cai",
    district: "Bắc Hà",
    fullAddress: "TT. Bắc Hà, H. Bắc Hà, Lào Cai",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [104.295, 22.533611]
    }
  },
  {
    name: "Bến xe Hát Lót",
    province: "Sơn La",
    district: "Mai Sơn",
    fullAddress: "TT. Hát Lót, H. Mai Sơn, Sơn La",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [104.105833, 21.196389]
    }
  },
  {
    name: "Bến xe phía Nam Huế",
    province: "Thừa Thiên Huế",
    district: "TP. Huế",
    fullAddress: "97 An Dương Vương, P. An Đông, TP. Huế",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [107.605556, 16.450833]
    }
  },
  {
    name: "Bến xe phía Bắc Huế",
    province: "Thừa Thiên Huế",
    district: "TP. Huế",
    fullAddress: "Đường CMT8, P. Hương Sơ, TP. Huế",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [107.546667, 16.486389]
    }
  },
  {
    name: "Bến xe mới Vĩnh Điện",
    province: "Quảng Nam",
    district: "Điện Bàn",
    fullAddress: "QL1A, P. Vĩnh Điện, TX. Điện Bàn, Quảng Nam",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [108.238056, 15.908333]
    }
  },
  {
    name: "Bến xe Tam Đường",
    province: "Lai Châu",
    district: "Tam Đường",
    fullAddress: "TT. Tam Đường, H. Tam Đường, Lai Châu",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [103.6275, 22.32]
    }
  },
  {
    name: "Bến xe Vàm Láng",
    province: "Tiền Giang",
    district: "Gò Công Đông",
    fullAddress: "TT. Vàm Láng, H. Gò Công Đông, Tiền Giang",
    type: "bus_station",
    location: {
      type: "Point",
      coordinates: [106.763889, 10.408889]
    }
  },
  {
    name: "Trạm dừng nghỉ Nam Thành (Ninh Bình)",
    province: "Ninh Bình",
    district: "TP. Ninh Bình",
    fullAddress: "Km267 QL1A, P. Nam Thành, TP. Ninh Bình",
    type: "rest_stop",
    location: {
      type: "Point",
      coordinates: [105.965556, 20.231111]
    }
  },
  {
    name: "Trạm dừng nghỉ Phước An (Km22+900, CT.05 Nội Bài – Lào Cai)",
    province: "Vĩnh Phúc",
    district: "Bình Xuyên",
    fullAddress: "Km22+900, Cao tốc Nội Bài – Lào Cai (CT.05), xã Hương Sơn/Thiện Kế khu vực Phước An, huyện Bình Xuyên, Vĩnh Phúc",
    type: "rest_stop",
    location: {
      type: "Point",
      coordinates: [105.73166666666667, 21.196666666666665]
    }
  },
  {
    name: "Trạm dừng nghỉ Tuấn Tú (Km57+500, CT.05 Nội Bài – Lào Cai)",
    province: "Phú Thọ",
    district: "Phù Ninh",
    fullAddress: "Km57+500, Cao tốc Nội Bài – Lào Cai (CT.05), huyện Phù Ninh, Phú Thọ",
    type: "rest_stop",
    location: {
      type: "Point",
      coordinates: [105.5611111111111, 21.17638888888889]
    }
  },
  {
    name: "Trạm dừng nghỉ Km117+500 (CT.05 Nội Bài – Lào Cai, chiều đi)",
    province: "Yên Bái",
    district: "Trấn Yên",
    fullAddress: "Km117+500, Cao tốc Nội Bài – Lào Cai (CT.05), xã Bảo Hưng, Trấn Yên, Yên Bái",
    type: "rest_stop",
    location: { type: "Point", coordinates: [104.879501, 21.67452] }
  },
  {
    name: "Trạm dừng nghỉ V52 (Km53+400, CT.04 Hà Nội – Hải Phòng)",
    province: "Hải Dương",
    district: "Gia Lộc",
    fullAddress: "Km53+400, Cao tốc Hà Nội – Hải Phòng (CT.04), xã Hoàng Diệu, Gia Lộc, Hải Dương",
    type: "rest_stop",
    location: { type: "Point", coordinates: [106.335342, 20.859716] }
  },
  {
    name: "Trạm dừng nghỉ Ninh Bình (Bến xe Nam Thành, QL1A)",
    province: "Ninh Bình",
    district: "Thành phố Ninh Bình",
    fullAddress: "Đường 30 Tháng 6, phường Nam Thành, TP Ninh Bình (mặt QL1A hướng Tam Điệp)",
    type: "rest_stop",
    location: { type: "Point", coordinates: [105.965729, 20.231779] }
  }
];

// Thêm _id cho mỗi location
const locationsWithId = vietnamLocations.map((location, index) => ({
  ...location,
  _id: String(index + 1)
}));

// API base URL - SỬA LỖI "api/api"
const API_BASE_URL = 'http://localhost:3001';

export const searchLocations = async (query: string): Promise<any[]> => {
  try {
    console.log(`🔍 Searching locations for: "${query}"`);
    
    // Trả về mảng rỗng nếu query rỗng
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const searchText = query.toLowerCase().trim();
    
    // THỬ KẾT NỐI ĐẾN BACKEND TRƯỚC - SỬA URL
    try {
      const response = await axios.get(`${API_BASE_URL}/api/locations/search`, {
        params: { q: searchText },
        timeout: 2000, // Timeout sau 2 giây
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Got ${response.data.length} results from backend`);
        return response.data;
      }
    } catch (backendError: any) {
      console.log('⚠️ Backend not available, using local data');
    }
    
    // SỬ DỤNG DỮ LIỆU TỪ FILE JSON
    const filtered = locationsWithId.filter(location => {
      const nameMatch = location.name.toLowerCase().includes(searchText);
      const provinceMatch = location.province.toLowerCase().includes(searchText);
      const districtMatch = location.district?.toLowerCase().includes(searchText) || false;
      const addressMatch = location.fullAddress?.toLowerCase().includes(searchText) || false;
      
      return nameMatch || provinceMatch || districtMatch || addressMatch;
    });
    
    // Giới hạn kết quả
    const limitedResults = filtered.slice(0, 15);
    
    console.log(`📌 Found ${limitedResults.length} results for: "${query}"`);
    
    // Format để phù hợp với Autocomplete
    return limitedResults.map(location => ({
      _id: location._id,
      name: location.name,
      province: location.province,
      district: location.district || '',
      fullAddress: location.fullAddress || '',
      type: location.type,
      location: location.location
    }));
    
  } catch (error) {
    console.error('❌ Error in searchLocations:', error);
    // Trả về mảng rỗng khi có lỗi
    return [];
  }
};

export const getLocationById = async (id: string): Promise<any> => {
  try {
    // Tìm trong dữ liệu local
    const location = locationsWithId.find(loc => loc._id === id);
    if (location) {
      return location;
    }
    
    // Thử từ backend
    try {
      const response = await axios.get(`${API_BASE_URL}/api/locations/${id}`);
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
  return locationsWithId;
};

// Hàm để lấy các địa điểm phổ biến
export const getPopularLocations = async (limit: number = 10): Promise<any[]> => {
  // Lọc các bến xe và văn phòng công ty
  const popularLocations = locationsWithId.filter(loc => 
    loc.type === 'bus_station' || loc.type === 'company_office'
  );
  
  // Giới hạn số lượng
  return popularLocations.slice(0, limit);
};