import apiService from './apiService';
import { networkService } from './networkService';
import { NetworkStatus } from '../../types/network';

export interface AppInitResult {
  apiConnected: boolean;
  hasStoredAuth: boolean;
  initializationSuccess: boolean;
  workingApiUrl?: string;
}

class AppInitService {
  async initializeApp(): Promise<AppInitResult> {
    console.log('🚀 Starting app initialization...');
    
    try {
      // Step 1: Test API connectivity
      console.log('1️⃣ Testing API connectivity...');
      const networkStatus = await networkService.checkApiConnectivity();
      
      if (networkStatus.apiReachable && networkStatus.workingApiUrl) {
        // Update API service with working URL
        apiService.updateBaseURL(networkStatus.workingApiUrl);
        console.log(`✅ API connected: ${networkStatus.workingApiUrl}`);
      } else {
        console.log('⚠️ API not reachable - continuing in offline mode');
      }

      // Step 2: Check for stored authentication (don't try to validate yet)
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const storedToken = await AsyncStorage.getItem('accessToken');
      const hasStoredAuth = !!storedToken;
      
      if (hasStoredAuth) {
        console.log('ℹ️ Found stored authentication token');
      } else {
        console.log('ℹ️ No stored authentication found - user will need to login');
      }

      console.log('✅ App initialization completed');
      
      return {
        apiConnected: networkStatus.apiReachable,
        hasStoredAuth,
        initializationSuccess: true,
        workingApiUrl: networkStatus.workingApiUrl,
      };
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      
      return {
        apiConnected: false,
        hasStoredAuth: false,
        initializationSuccess: false,
      };
    }
  }

  async retryApiConnection(): Promise<boolean> {
    console.log('🔄 Retrying API connection...');
    return await apiService.initializeConnection();
  }
}

export const appInitService = new AppInitService();
export default appInitService;
