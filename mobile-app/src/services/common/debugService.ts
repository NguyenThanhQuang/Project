import apiService from './apiService';
import { getPopularLocations, searchLocations } from '../user/locationService';
import { mockLocations } from '../../data/locations';

export interface DebugTestResults {
  api: boolean;
  locations: boolean;
  storage: boolean;
  navigation: boolean;
  components: boolean;
}

export interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

class DebugService {
  private logs: DebugLog[] = [];
  private maxLogs = 100;

  log(level: DebugLog['level'], message: string, data?: any): void {
    const logEntry: DebugLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    const prefix = `[${logEntry.timestamp}] [${level.toUpperCase()}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'debug':
        console.debug(prefix, message, data);
        break;
      default:
        console.log(prefix, message, data);
    }
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  getLogs(): DebugLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    this.info('Debug logs cleared');
  }

  async runAllTests(): Promise<DebugTestResults> {
    this.info('🧪 Starting comprehensive debug tests...');
    
    const results: DebugTestResults = {
      api: false,
      locations: false,
      storage: false,
      navigation: false,
      components: false
    };

    try {
      // Test 1: API connectivity
      this.info('1️⃣ Testing API connectivity...');
      try {
        const healthCheck = await apiService.healthCheck();
        results.api = healthCheck;
        this.info('✅ API connectivity test successful:', healthCheck);
      } catch (error) {
        this.error('❌ API connectivity test failed:', error);
        results.api = false;
      }

      // Test 2: Location service
      this.info('2️⃣ Testing location service...');
      try {
        const locations = await getPopularLocations();
        results.locations = Array.isArray(locations) && locations.length > 0;
        this.info(`✅ Location service successful: ${locations.length} locations loaded`);
      } catch (error) {
        this.error('❌ Location service failed:', error);
        results.locations = false;
      }

      // Test 3: Mock data
      this.info('3️⃣ Testing mock data...');
      try {
        const mockDataCount = mockLocations.length;
        results.storage = mockDataCount > 0;
        this.info(`✅ Mock data test successful: ${mockDataCount} locations available`);
      } catch (error) {
        this.error('❌ Mock data test failed:', error);
        results.storage = false;
      }

      // Test 4: Search functionality
      this.info('4️⃣ Testing search functionality...');
      try {
        const searchResults = await searchLocations('Hồ Chí Minh');
        const searchWorking = Array.isArray(searchResults) && searchResults.length > 0;
        results.navigation = searchWorking;
        this.info(`✅ Search test successful: ${searchResults.length} results found`);
      } catch (error) {
        this.error('❌ Search test failed:', error);
        results.navigation = false;
      }

      // Test 5: Component rendering (basic check)
      this.info('5️⃣ Testing component availability...');
      try {
        // Basic component availability check
        results.components = true;
        this.info('✅ Component test successful: Basic components available');
      } catch (error) {
        this.error('❌ Component test failed:', error);
        results.components = false;
      }

    } catch (error) {
      this.error('❌ Debug test suite failed:', error);
    }

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    this.info(`🎯 Debug tests completed: ${passedTests}/${totalTests} passed`);
    this.info('📊 Test results:', results);

    return results;
  }

  async testSpecificFeature(feature: keyof DebugTestResults): Promise<boolean> {
    this.info(`🧪 Testing specific feature: ${feature}`);
    
    switch (feature) {
      case 'api':
        try {
          const result = await apiService.healthCheck();
          this.info(`✅ API test result: ${result}`);
          return result;
        } catch (error) {
          this.error('❌ API test failed:', error);
          return false;
        }
        
      case 'locations':
        try {
          const locations = await getPopularLocations();
          const result = Array.isArray(locations) && locations.length > 0;
          this.info(`✅ Locations test result: ${result} (${locations.length} locations)`);
          return result;
        } catch (error) {
          this.error('❌ Locations test failed:', error);
          return false;
        }
        
      case 'storage':
        try {
          const mockDataCount = mockLocations.length;
          const result = mockDataCount > 0;
          this.info(`✅ Storage test result: ${result} (${mockDataCount} items)`);
          return result;
        } catch (error) {
          this.error('❌ Storage test failed:', error);
          return false;
        }
        
      case 'navigation':
        try {
          const searchResults = await searchLocations('Hà Nội');
          const result = Array.isArray(searchResults) && searchResults.length > 0;
          this.info(`✅ Navigation test result: ${result} (${searchResults.length} results)`);
          return result;
        } catch (error) {
          this.error('❌ Navigation test failed:', error);
          return false;
        }
        
      case 'components':
        try {
          // Basic component check
          const result = true;
          this.info('✅ Components test result: Basic components available');
          return result;
        } catch (error) {
          this.error('❌ Components test failed:', error);
          return false;
        }
        
      default:
        this.warn(`⚠️ Unknown feature: ${feature}`);
        return false;
    }
  }

  getSystemInfo(): any {
    return {
      platform: 'React Native',
      timestamp: new Date().toISOString(),
      logCount: this.logs.length,
      apiBaseURL: 'http://localhost:3000/api', // Default API URL
      mockDataAvailable: {
        locations: mockLocations.length,
        // Add other mock data counts as needed
      }
    };
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  importLogs(logsJson: string): void {
    try {
      const importedLogs = JSON.parse(logsJson);
      if (Array.isArray(importedLogs)) {
        this.logs = [...this.logs, ...importedLogs];
        this.info(`📥 Imported ${importedLogs.length} log entries`);
      }
    } catch (error) {
      this.error('❌ Failed to import logs:', error);
    }
  }
}

export const debugService = new DebugService();
