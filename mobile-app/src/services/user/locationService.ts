import { mockLocations, MockLocation } from '../../data/locations';
import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';

export interface Location extends MockLocation {}

export const getPopularLocations = async (): Promise<Location[]> => {
  try {
    console.log('📍 Fetching popular locations...');
    
    const response = await apiService.get<Location[]>(API_ENDPOINTS.LOCATIONS.POPULAR);
    console.log('✅ Popular locations fetched:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching popular locations:', error);
    
    // Return mock data as fallback
    console.log('🔄 Using mock data due to API error');
    return mockLocations.slice(0, 20); // Return first 20 locations
  }
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    console.log('🔍 Searching locations with query:', query);
    
    const response = await apiService.get<Location[]>(API_ENDPOINTS.LOCATIONS.SEARCH, {
      params: { q: query.trim() }
    });
    
    console.log('✅ Location search results:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error searching locations:', error);
    
    // Return filtered mock data as fallback
    console.log('🔄 Using mock data due to API error');
    const filteredLocations = mockLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.province.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredLocations.slice(0, 10); // Return max 10 results
  }
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    const response = await apiService.get<Location>(`${API_ENDPOINTS.LOCATIONS.BASE}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching location by ID:', error);
    
    // Return mock location as fallback
    const mockLocation = mockLocations.find(loc => loc._id === id);
    return mockLocation || null;
  }
};

export const getLocationsByProvince = async (province: string): Promise<Location[]> => {
  try {
    const response = await apiService.get<Location[]>(API_ENDPOINTS.LOCATIONS.BY_PROVINCE, {
      params: { province }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching locations by province:', error);
    
    // Return filtered mock data as fallback
    return mockLocations.filter(location => 
      location.province.toLowerCase().includes(province.toLowerCase())
    );
  }
};
