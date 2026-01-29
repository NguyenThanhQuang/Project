import { useCallback, useEffect, useRef, useState } from "react";
import { mockLocations } from "../data";
import { Location, UseLocationSearchReturn } from "../types/index-types";

export const useLocationSearch = (): UseLocationSearchReturn => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const searchLocationsHandler = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const results = mockLocations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.province.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error searching locations:", err);
      setSuggestions([]);
    }
  }, []);

  const loadPopularLocations = useCallback(async () => {
    try {
      setLoading(true);
      const popularLocations = mockLocations.slice(0, 10);
      setLocations(popularLocations || []);
    } catch (err) {
      console.error("Error loading popular locations:", err);
      // Fallback to mock data if needed
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        searchLocationsHandler(query);
      }, 300);
    },
    [searchLocationsHandler]
  );

  useEffect(() => {
    loadPopularLocations();
  }, [loadPopularLocations]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    locations,
    suggestions,
    loading,
    searchLocations: async (query: string) => {
      debouncedSearch(query);
    },
    clearSuggestions,
  };
};
