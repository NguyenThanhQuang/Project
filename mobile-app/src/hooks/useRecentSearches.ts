import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentSearch {
  from: string;
  to: string;
  timestamp: number;
}

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('recentTripSearches');
      if (data) {
        const searches = JSON.parse(data);
        // Sort by timestamp, most recent first
        const sortedSearches = searches.sort((a: RecentSearch, b: RecentSearch) => 
          b.timestamp - a.timestamp
        );
        setRecentSearches(sortedSearches);
      }
    } catch (err) {
      console.error('Error loading recent searches:', err);
    }
  }, []);

  const saveRecentSearch = useCallback(async (from: string, to: string) => {
    try {
      const newSearch: RecentSearch = {
        from,
        to,
        timestamp: Date.now(),
      };

      // Remove duplicate searches and add new one at the beginning
      const filteredSearches = recentSearches.filter(
        search => !(search.from === from && search.to === to)
      );
      
      const updatedSearches = [newSearch, ...filteredSearches].slice(0, 10); // Keep only 10 most recent
      
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentTripSearches', JSON.stringify(updatedSearches));
    } catch (err) {
      console.error('Error saving recent search:', err);
    }
  }, [recentSearches]);

  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recentTripSearches');
    } catch (err) {
      console.error('Error clearing recent searches:', err);
    }
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  return {
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
    loadRecentSearches,
  };
};
