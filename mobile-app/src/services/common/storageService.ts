import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from './configService';

export interface StorageData {
  [key: string]: any;
}

class StorageService {
  private prefix = 'bus_booking_app_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const storageKey = this.getKey(key);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(storageKey, jsonValue);
      console.log(`💾 Storage: Saved ${key}`);
    } catch (error) {
      console.error(`❌ Storage: Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const storageKey = this.getKey(key);
      const jsonValue = await AsyncStorage.getItem(storageKey);
      if (jsonValue !== null) {
        const value = JSON.parse(jsonValue);
        console.log(`💾 Storage: Retrieved ${key}`);
        return value;
      }
      return null;
    } catch (error) {
      console.error(`❌ Storage: Error retrieving ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const storageKey = this.getKey(key);
      await AsyncStorage.removeItem(storageKey);
      console.log(`💾 Storage: Removed ${key}`);
    } catch (error) {
      console.error(`❌ Storage: Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
      console.log('💾 Storage: Cleared all app data');
    } catch (error) {
      console.error('❌ Storage: Error clearing all data:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      return appKeys.map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('❌ Storage: Error getting all keys:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<StorageData> {
    try {
      const storageKeys = keys.map(key => this.getKey(key));
      const keyValuePairs = await AsyncStorage.multiGet(storageKeys);
      const result: StorageData = {};
      
      keyValuePairs.forEach(([key, value]) => {
        if (value !== null) {
          const originalKey = key.replace(this.prefix, '');
          result[originalKey] = JSON.parse(value);
        }
      });
      
      return result;
    } catch (error) {
      console.error('❌ Storage: Error multi-get:', error);
      return {};
    }
  }

  async multiSet(keyValuePairs: [string, any][]): Promise<void> {
    try {
      const storageKeyValuePairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        this.getKey(key),
        JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(storageKeyValuePairs);
      console.log(`💾 Storage: Multi-saved ${keyValuePairs.length} items`);
    } catch (error) {
      console.error('❌ Storage: Error multi-set:', error);
      throw error;
    }
  }

  // Convenience methods for common storage keys
  async getAccessToken(): Promise<string | null> {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  async setAccessToken(token: string): Promise<void> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getUserData(): Promise<any | null> {
    return this.getItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
  }

  async setUserData(userData: any): Promise<void> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.USER_DATA, userData);
  }

  async getRecentSearches(): Promise<any[] | null> {
    return this.getItem<any[]>(APP_CONFIG.STORAGE_KEYS.RECENT_SEARCHES);
  }

  async setRecentSearches(searches: any[]): Promise<void> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.RECENT_SEARCHES, searches);
  }

  async getAppSettings(): Promise<any | null> {
    return this.getItem(APP_CONFIG.STORAGE_KEYS.APP_SETTINGS);
  }

  async setAppSettings(settings: any): Promise<void> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.APP_SETTINGS, settings);
  }

  // Clear auth data
  async clearAuthData(): Promise<void> {
    try {
      await this.removeItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      await this.removeItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      await this.removeItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
      console.log('💾 Storage: Cleared auth data');
    } catch (error) {
      console.error('❌ Storage: Error clearing auth data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
