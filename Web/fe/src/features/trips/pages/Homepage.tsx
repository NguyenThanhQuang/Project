import React from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  ContactSection,
  CustomerReviews,
  HeroSection,
  HowItWorks,
  PopularRoutes,
  WhyChooseUs,
} from "../components/homepage";
import type { LocationData } from "../../trips/types/location";
import { useSharedSearchForm } from "../hooks/useSharedSearchForm";

const Homepage: React.FC = () => {
  const sharedSearchForm = useSharedSearchForm();

  const handlePopularRouteSelect = (from: LocationData, to: LocationData) => {
    sharedSearchForm.setSearchData((prev) => ({
      ...prev,
      from: from,
      to: to,
    }));

    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <HeroSection {...sharedSearchForm} />
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
