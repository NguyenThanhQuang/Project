import { debounce } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { searchLocations } from "../../../services/locationService";
import type { LocationData } from "../../trips/types/location";

export const useLocationSearch = () => {
  const [options, setOptions] = useState<readonly LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async (query: string) => {
    if (query) {
      setLoading(true);
      const results = await searchLocations(query);
      setOptions(results);
      setLoading(false);
    } else {
      setOptions([]);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetch, 400), []);

  const handleInputChange = useCallback(
    (query: string) => {
      debouncedFetch(query.trim());
    },
    [debouncedFetch]
  );

  return { options, loading, handleInputChange, setOptions };
};
