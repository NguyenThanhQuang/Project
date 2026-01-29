import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkService } from './networkService';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private getBaseURL(): string {
    // Development
    if (__DEV__) {
      // Try multiple URLs for mobile app development
      // The app will automatically fallback if one doesn't work
      return 'http://10.0.2.2:3000/api'; // Android emulator
      // For iOS simulator or physical device, use your computer's IP
      // return 'http://192.168.20.185:3000/api'; // Updated with correct IP
    }
    
    // Production - adjust as needed
    return 'https://your-production-api.com/api';
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token from storage:', error);
        }
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const errorInfo = {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data
        };

        // Handle different types of errors with appropriate logging levels
        if (error.message === 'Network Error') {
          console.log('⚠️ Network Error - API unavailable, using offline mode');
        } else if (error.code === 'ECONNABORTED') {
          console.log('⏰ Request timeout - server may be slow');
        } else {
          console.error('❌ API Response Error:', errorInfo);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          console.log('🔑 Authentication expired - clearing tokens');
          try {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('user');
            // You might want to redirect to login here
          } catch (storageError) {
            console.error('Error clearing tokens:', storageError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  // Generic POST request
  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  // Generic PUT request
  async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  // Generic PATCH request
  async patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  // Health check with automatic API discovery
  async healthCheck(): Promise<boolean> {
    try {
      const networkStatus = await networkService.checkApiConnectivity();
      
      if (networkStatus.apiReachable && networkStatus.workingApiUrl) {
        this.updateBaseURL(networkStatus.workingApiUrl);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  // Initialize API connection
  async initializeConnection(): Promise<boolean> {
    console.log('🚀 Initializing API connection...');
    const isHealthy = await this.healthCheck();
    
    if (isHealthy) {
      console.log('✅ API connection established successfully');
    } else {
      console.log('⚠️ API connection failed - app will work in offline mode');
    }
    
    return isHealthy;
  }



  // Update base URL (useful for testing)
  updateBaseURL(newURL: string): void {
    this.baseURL = newURL;
    this.api.defaults.baseURL = newURL;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export both the class and the instance
export { ApiService };
export default apiService;
