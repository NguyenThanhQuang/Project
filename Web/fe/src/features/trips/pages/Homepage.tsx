import React, { useState } from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import {
  ContactSection,
  CustomerReviews,
  HeroSection,
  HowItWorks,
  PopularRoutes,
  WhyChooseUs,
} from "../components/homepage";
import type { LocationData } from "../../trips/types/location";
import { useLocationSearch } from "../hooks/useLocationSearch";

const Homepage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    from: null as LocationData | null,
    to: null as LocationData | null,
    date: dayjs(),
    passengers: 1,
  });

  const fromSearch = useLocationSearch();
  const toSearch = useLocationSearch();

  const handlePopularRouteSelect = (from: LocationData, to: LocationData) => {
    setSearchData({
      from: from,
      to: to,
      date: dayjs(),
      passengers: 1,
    });
    fromSearch.setOptions([from]);
    toSearch.setOptions([to]);
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <HeroSection
          searchData={searchData}
          setSearchData={setSearchData}
          fromOptions={fromSearch.options}
          fromLoading={fromSearch.loading}
          onFromInputChange={fromSearch.handleInputChange}
          toOptions={toSearch.options}
          toLoading={toSearch.loading}
          onToInputChange={toSearch.handleInputChange}
        />
        <PopularRoutes onRouteSelect={handlePopularRouteSelect} />
        <WhyChooseUs />
        <CustomerReviews />
        <HowItWorks />
        {/* Phần thống kê chung (500+ Tuyến đường...) có thể là một component riêng hoặc để trong ContactSection */}
        <ContactSection />
      </Box>
    </LocalizationProvider>
  );
};

export default Homepage;
