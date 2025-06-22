const API_BASE_URL = 'http://localhost:3000/api';

// API Response interface
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Trip related interfaces
export interface Trip {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    logo?: string;
  };
  vehicleId: {
    _id: string;
    type: string;
    totalSeats: number;
  };
  route: {
    from: string;
    to: string;
    distance: number;
    estimatedDuration: number;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  amenities: string[];
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface TripQuery {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number;
}

// Auth interfaces
export interface LoginData {
  identifier: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
  };
}

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    const config: RequestInit = {
      credentials: 'include', // Enable cookies and CORS credentials
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log('🔥 API Request:', { method: config.method || 'GET', url: fullUrl, config });

    try {
      const response = await fetch(fullUrl, config);
      console.log('🔥 API Response:', { status: response.status, ok: response.ok, url: fullUrl });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🔥 API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔥 API Success Data:', data);
      return data;
    } catch (error) {
      console.error('🔥 API Request failed:', { url: fullUrl, error });
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Trip API
export const tripApi = {
  // Get all trips with optional filters
  getTrips: (query?: TripQuery): Promise<Trip[]> => {
    const params = new URLSearchParams();
    if (query?.from) params.append('from', query.from);
    if (query?.to) params.append('to', query.to);
    if (query?.date) params.append('date', query.date);
    if (query?.passengers) params.append('passengers', query.passengers.toString());
    
    const queryString = params.toString();
    return apiClient.get<Trip[]>(`/trips${queryString ? `?${queryString}` : ''}`);
  },

  // Get trip by ID
  getTripById: (tripId: string): Promise<Trip> => {
    return apiClient.get<Trip>(`/trips/${tripId}`);
  },

  // Create new trip (for admin/company)
  createTrip: (tripData: any): Promise<Trip> => {
    return apiClient.post<Trip>('/trips', tripData);
  },

  // Update trip
  updateTrip: (tripId: string, tripData: any): Promise<Trip> => {
    return apiClient.put<Trip>(`/trips/${tripId}`, tripData);
  },

  // Delete trip
  deleteTrip: (tripId: string): Promise<void> => {
    return apiClient.delete<void>(`/trips/${tripId}`);
  },
};

// Auth API
export const authApi = {
  // Login
  login: (loginData: LoginData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', loginData);
  },

  // Register
  register: (registerData: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', registerData);
  },

  // Get current user profile
  getProfile: (): Promise<any> => {
    return apiClient.get<any>('/auth/profile');
  },

  // Refresh token
  refreshToken: (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh');
  },
};

// User API
export const userApi = {
  // Get user profile
  getProfile: (): Promise<any> => {
    return apiClient.get<any>('/users/profile');
  },

  // Update user profile
  updateProfile: (userData: any): Promise<any> => {
    return apiClient.put<any>('/users/profile', userData);
  },
};

// Company API
export const companyApi = {
  // Get all companies
  getCompanies: (): Promise<any[]> => {
    return apiClient.get<any[]>('/companies');
  },

  // Get company by ID
  getCompanyById: (companyId: string): Promise<any> => {
    return apiClient.get<any>(`/companies/${companyId}`);
  },
};

// Export default API client
export default apiClient;
