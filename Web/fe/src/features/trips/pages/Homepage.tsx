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
import type { Location } from "../../../types";

const Homepage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    from: null as Location | null,
    to: null as Location | null,
    date: dayjs(),
    passengers: 1,
  });

  const handlePopularRouteSelect = (from: Location, to: Location) => {
    setSearchData({
      from: from,
      to: to,
      date: dayjs(),
      passengers: 1,
    });
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <HeroSection searchData={searchData} setSearchData={setSearchData} />
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
