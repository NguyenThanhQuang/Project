import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchLocations } from "../../../services/locationService";
import type { SearchData } from "../../../types";
import { useLocationSearch } from "./useLocationSearch";

export const useSharedSearchForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchData, setSearchData] = useState<SearchData>({
    from: null,
    to: null,
    date: dayjs(searchParams.get("date")).isValid()
      ? dayjs(searchParams.get("date"))
      : dayjs(),
    passengers: parseInt(searchParams.get("passengers") || "1"),
  });

  const fromLocationSearch = useLocationSearch();
  const toLocationSearch = useLocationSearch();
  useEffect(() => {
    const initLocations = async () => {
      const fromQuery = searchParams.get("from");
      const toQuery = searchParams.get("to");

      if (fromQuery && !searchData.from) {
        const fromResult = await searchLocations(fromQuery);
        if (fromResult.length > 0) {
          setSearchData((prev) => ({ ...prev, from: fromResult[0] }));
          fromLocationSearch.setOptions(fromResult);
        }
      }
      if (toQuery && !searchData.to) {
        const toResult = await searchLocations(toQuery);
        if (toResult.length > 0) {
          setSearchData((prev) => ({ ...prev, to: toResult[0] }));
          toLocationSearch.setOptions(toResult);
        }
      }
    };
    initLocations();
  }, [searchParams]);

  const fromLocationOptions = useMemo(() => {
    if (!searchData.to) {
      return fromLocationSearch.options;
    }
    return fromLocationSearch.options.filter(
      (option) => option._id !== searchData.to?._id
    );
  }, [fromLocationSearch.options, searchData.to]);

  const toLocationOptions = useMemo(() => {
    if (!searchData.from) {
      return toLocationSearch.options;
    }
    return toLocationSearch.options.filter(
      (option) => option._id !== searchData.from?._id
    );
  }, [toLocationSearch.options, searchData.from]);

  const handleSearchDataChange = useCallback(
    <K extends keyof SearchData>(field: K, value: SearchData[K]) => {
      setSearchData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSwapLocations = useCallback(() => {
    setSearchData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  }, []);

  const handleSearch = useCallback(() => {
    if (searchData.from && searchData.to && searchData.date) {
      const params = new URLSearchParams({
        from: searchData.from.province,
        to: searchData.to.province,
        date: searchData.date.format("YYYY-MM-DD"),
        passengers: String(searchData.passengers),
      });
      navigate(`/trips/search-results?${params.toString()}`);
    }
  }, [searchData, navigate]);

  return {
    searchData,
    setSearchData,
    handleSearchDataChange,
    handleSwapLocations,
    handleSearch,
    fromProps: {
      options: fromLocationOptions,
      loading: fromLocationSearch.loading,
      onInputChange: fromLocationSearch.handleInputChange,
    },
    toProps: {
      options: toLocationOptions,
      loading: toLocationSearch.loading,
      onInputChange: toLocationSearch.handleInputChange,
    },
  };
};
