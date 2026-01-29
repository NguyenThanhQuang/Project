export interface MockTrip {
  _id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  expectedArrivalTime: string;
  price: number;
  availableSeats: number;
  company: {
    name: string;
    _id: string;
  };
  seats?: any[];
  status?: string;
}

// Sample trips data for testing
const sampleTripsData = [
  {
    _id: 'mock-trip-1',
    from: 'Hà Nội',
    to: 'TP. Hồ Chí Minh',
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    expectedArrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    price: 500000,
    availableSeats: 45,
    company: { name: 'Nhà xe Phương Trang', _id: 'mock-company-1' },
    seats: generateMockSeats(45, 500000),
    route: {
      fromLocationId: { name: 'Bến xe Mỹ Đình', province: 'Hà Nội' },
      toLocationId: { name: 'Bến xe Miền Đông', province: 'TP. Hồ Chí Minh' },
      stops: []
    },
    companyId: { name: 'Nhà xe Phương Trang', _id: 'mock-company-1' },
    vehicleId: { type: 'Xe khách 45 chỗ', totalSeats: 45, _id: 'mock-vehicle-1' },
    status: 'scheduled'
  },
  {
    _id: 'mock-trip-2',
    from: 'TP. Hồ Chí Minh',
    to: 'Hà Nội',
    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    expectedArrivalTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    price: 450000,
    availableSeats: 35,
    company: { name: 'Nhà xe Hoàng Long', _id: 'mock-company-2' },
    seats: generateMockSeats(35, 450000),
    route: {
      fromLocationId: { name: 'Bến xe Miền Đông', province: 'TP. Hồ Chí Minh' },
      toLocationId: { name: 'Bến xe Mỹ Đình', province: 'Hà Nội' },
      stops: []
    },
    companyId: { name: 'Nhà xe Hoàng Long', _id: 'mock-company-2' },
    vehicleId: { type: 'Xe khách 35 chỗ', totalSeats: 35, _id: 'mock-vehicle-2' },
    status: 'scheduled'
  },
  {
    _id: 'mock-trip-3',
    from: 'TP. Hồ Chí Minh',
    to: 'Đà Lạt',
    departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    expectedArrivalTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    price: 300000,
    availableSeats: 29,
    company: { name: 'Nhà xe Mai Linh', _id: 'mock-company-3' },
    seats: generateMockSeats(29, 300000),
    route: {
      fromLocationId: { name: 'Bến xe Miền Đông', province: 'TP. Hồ Chí Minh' },
      toLocationId: { name: 'Bến xe Đà Lạt', province: 'Lâm Đồng' },
      stops: []
    },
    companyId: { name: 'Nhà xe Mai Linh', _id: 'mock-company-3' },
    vehicleId: { type: 'Xe khách 29 chỗ', totalSeats: 29, _id: 'mock-vehicle-3' },
    status: 'scheduled'
  },
  {
    _id: 'mock-trip-4',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    departureTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    expectedArrivalTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    price: 150000,
    availableSeats: 16,
    company: { name: 'Nhà xe Thành Bưởi', _id: 'mock-company-4' },
    seats: generateMockSeats(16, 150000),
    route: {
      fromLocationId: { name: 'Bến xe Mỹ Đình', province: 'Hà Nội' },
      toLocationId: { name: 'Bến xe Hải Phòng', province: 'Hải Phòng' },
      stops: []
    },
    companyId: { name: 'Nhà xe Thành Bưởi', _id: 'mock-company-4' },
    vehicleId: { type: 'Xe limousine', totalSeats: 16, _id: 'mock-vehicle-4' },
    status: 'scheduled'
  },
  {
    _id: 'mock-trip-5',
    from: 'TP. Hồ Chí Minh',
    to: 'Nha Trang',
    departureTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    expectedArrivalTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
    price: 400000,
    availableSeats: 40,
    company: { name: 'Nhà xe Kumho', _id: 'mock-company-5' },
    seats: generateMockSeats(40, 400000),
    route: {
      fromLocationId: { name: 'Bến xe Miền Đông', province: 'TP. Hồ Chí Minh' },
      toLocationId: { name: 'Bến xe Nha Trang', province: 'Khánh Hòa' },
      stops: []
    },
    companyId: { name: 'Nhà xe Kumho', _id: 'mock-company-5' },
    vehicleId: { type: 'Xe giường nằm', totalSeats: 40, _id: 'mock-vehicle-5' },
    status: 'scheduled'
  }
];

function generateMockSeats(totalSeats: number, price: number) {
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / 4);
    const col = ((i - 1) % 4) + 1;
    const seatNumber = `${String.fromCharCode(64 + row)}${col}`;
    
    seats.push({
      _id: `seat-${i}`,
      seatNumber,
      status: Math.random() > 0.3 ? 'available' : 'booked', // 70% available
      price,
      isWindow: col === 1 || col === 4,
      isAisle: col === 2 || col === 3,
      row,
      column: col
    });
  }
  return seats;
}

// Helper function to normalize city names for better matching
const normalizeCityName = (cityName: string): string => {
  return cityName
    .toLowerCase()
    .trim()
    .replace(/tp\./g, 'tp') // Remove dots
    .replace(/\./g, '') // Remove all dots
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/hồ chí minh/g, 'ho chi minh') // Normalize Hồ Chí Minh
    .replace(/ho chi minh/g, 'hcm') // Short form
    .replace(/hà nội/g, 'ha noi') // Normalize Hà Nội
    .replace(/đà lạt/g, 'da lat') // Normalize Đà Lạt
    .replace(/hải phòng/g, 'hai phong') // Normalize Hải Phòng
    .replace(/nha trang/g, 'nha trang') // Normalize Nha Trang
    .replace(/cần thơ/g, 'can tho') // Normalize Cần Thơ
    .replace(/phan thiết/g, 'phan thiet') // Normalize Phan Thiết
    .replace(/vũng tàu/g, 'vung tau') // Normalize Vũng Tàu
    .replace(/sapa/g, 'sa pa') // Normalize Sapa
    .replace(/bà rịa/g, 'ba ria') // Normalize Bà Rịa
    .replace(/bình thuận/g, 'binh thuan') // Normalize Bình Thuận
    .replace(/khánh hòa/g, 'khanh hoa') // Normalize Khánh Hòa
    .replace(/lào cai/g, 'lao cai') // Normalize Lào Cai
    .replace(/lâm đồng/g, 'lam dong') // Normalize Lâm Đồng
    .replace(/cần thơ/g, 'can tho'); // Normalize Cần Thơ
};

// Helper function to check if two city names match
const cityNamesMatch = (searchTerm: string, tripCity: string): boolean => {
  const normalizedSearch = normalizeCityName(searchTerm);
  const normalizedTrip = normalizeCityName(tripCity);
  
  console.log(`🔍 Comparing: "${searchTerm}" (${normalizedSearch}) vs "${tripCity}" (${normalizedTrip})`);
  
  // Check for exact match
  if (normalizedSearch === normalizedTrip) {
    console.log('✅ Exact match');
    return true;
  }
  
  // Check if one contains the other
  if (normalizedSearch.includes(normalizedTrip) || normalizedTrip.includes(normalizedSearch)) {
    console.log('✅ Contains match');
    return true;
  }
  
  // Check for common abbreviations and variations
  const abbreviations: { [key: string]: string[] } = {
    'hcm': ['ho chi minh', 'tp ho chi minh', 'tp. ho chi minh', 'tp ho chi minh'],
    'ha noi': ['hà nội', 'ha noi'],
    'da lat': ['đà lạt', 'da lat'],
    'hai phong': ['hải phòng', 'hai phong'],
    'nha trang': ['nha trang'],
    'can tho': ['cần thơ', 'can tho'],
    'phan thiet': ['phan thiết', 'phan thiet'],
    'vung tau': ['vũng tàu', 'vung tau'],
    'sa pa': ['sapa', 'sa pa'],
    'ba ria': ['bà rịa', 'ba ria'],
    'binh thuan': ['bình thuận', 'binh thuan'],
    'khanh hoa': ['khánh hòa', 'khanh hoa'],
    'lao cai': ['lào cai', 'lao cai'],
    'lam dong': ['lâm đồng', 'lam dong']
  };
  
  // Check if search term is an abbreviation
  if (abbreviations[normalizedSearch]) {
    const match = abbreviations[normalizedSearch].some(alt => 
      normalizedTrip.includes(alt) || alt.includes(normalizedTrip)
    );
    if (match) {
      console.log('✅ Abbreviation match (search term)');
      return true;
    }
  }
  
  // Check if trip city is an abbreviation
  if (abbreviations[normalizedTrip]) {
    const match = abbreviations[normalizedTrip].some(alt => 
      normalizedSearch.includes(alt) || alt.includes(normalizedSearch)
    );
    if (match) {
      console.log('✅ Abbreviation match (trip city)');
      return true;
    }
  }
  
  // Additional fuzzy matching for common variations
  const searchWords = normalizedSearch.split(' ');
  const tripWords = normalizedTrip.split(' ');
  
  // Check if most words match
  const matchingWords = searchWords.filter(word => 
    tripWords.some(tripWord => 
      word.includes(tripWord) || tripWord.includes(word)
    )
  );
  
  if (matchingWords.length >= Math.min(searchWords.length, tripWords.length) * 0.7) {
    console.log('✅ Fuzzy match');
    return true;
  }
  
  console.log('❌ No match');
  return false;
};

export const generateMockTrips = (from: string, to: string, date: string): MockTrip[] => {
  console.log('🔍 generateMockTrips called with:', { from, to, date });
  
  // Filter sample trips based on search criteria
  let filteredTrips = sampleTripsData;
  
  if (from && to) {
    console.log('🔍 Searching for:', { from, to });
    
    filteredTrips = sampleTripsData.filter(trip => {
      const fromMatch = cityNamesMatch(from, trip.from);
      const toMatch = cityNamesMatch(to, trip.to);
      
      console.log(`🔍 Trip: ${trip.from} → ${trip.to}`, { fromMatch, toMatch });
      
      return fromMatch && toMatch;
    });
  } else if (from) {
    filteredTrips = sampleTripsData.filter(trip => {
      return cityNamesMatch(from, trip.from);
    });
  } else if (to) {
    filteredTrips = sampleTripsData.filter(trip => {
      return cityNamesMatch(to, trip.to);
    });
  }
  
  console.log('🔍 Filtered trips count:', filteredTrips.length);
  
  // If no matches found, return all trips
  if (filteredTrips.length === 0) {
    console.log('🔍 No matches found, returning all trips');
    filteredTrips = sampleTripsData;
  }
  
  return filteredTrips.map(trip => ({
    ...trip,
    arrivalTime: trip.expectedArrivalTime // Add arrivalTime for compatibility
  }));
};
