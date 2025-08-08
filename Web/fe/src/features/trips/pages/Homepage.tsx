import React from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  HeroSection,
  PopularRoutes,
  WhyChooseUs,
  CustomerReviews,
  HowItWorks,
  ContactSection,
} from "../components/homepage";

const Homepage: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <HeroSection />
        <PopularRoutes />
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
