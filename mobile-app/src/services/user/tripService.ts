import { generateMockTrips } from '../../data/trips';
import { API_ENDPOINTS } from '../common/configService';
import apiService from '../common/apiService';
import { Trip, SearchTripsParams, SearchTripsResponse, CreateTripPayload } from '../../types/trip';

 

export const searchTrips = async (params: SearchTripsParams): Promise<Trip[]> => {
  try {
    console.log('🔍 Searching trips with params:', params);
    
    const response = await apiService.get<SearchTripsResponse>(API_ENDPOINTS.TRIPS.SEARCH, {
      params: {
        from: params.from,
        to: params.to,
        date: params.date,
        passengers: params.passengers
      },
    });
    
    console.log('✅ Search trips response:', response.data);
    return response.data.trips || [];
  } catch (error: any) {
    console.error('❌ Error searching trips:', error);
    
    // Return mock data as fallback
    console.log('🔄 Using mock data due to API error');
    return generateMockTrips(params.from, params.to, params.date);
  }
};

export const getTripById = async (id: string): Promise<Trip> => {
  try {
    const response = await apiService.get<Trip>(`${API_ENDPOINTS.TRIPS.BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw error;
  }
};

export const getPopularTrips = async (): Promise<Trip[]> => {
  try {
    const response = await apiService.get<Trip[]>(API_ENDPOINTS.TRIPS.POPULAR);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular trips:', error);
    return [];
  }
};

export const getTripsByCompany = async (companyId: string): Promise<Trip[]> => {
  try {
    const response = await apiService.get<Trip[]>(API_ENDPOINTS.TRIPS.BY_COMPANY.replace(':companyId', companyId));
    return response.data;
  } catch (error) {
    console.error('Error fetching company trips:', error);
    throw error;
  }
};


export const createTrip = async (payload: CreateTripPayload): Promise<Trip> => {
  try {
    const response = await apiService.post<Trip>(API_ENDPOINTS.TRIPS.BASE, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};
