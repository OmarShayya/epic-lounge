import React from "react";
import { Box } from "@mui/material";
import Hero from "@components/landing/Hero";
import Marquee from "@components/landing/Marquee";
import Games from "@components/landing/Games";
import Features from "@components/landing/Features";
import Gallery from "@components/landing/Gallery";
import About from "@components/landing/About";
import Location from "@components/landing/Location";

const LandingPage: React.FC = () => {
  return (
    <Box>
      <Hero />
      <Marquee />
      <Games />
      <Features />
      <Gallery />
      <About />
      <Location />
    </Box>
  );
};

export default LandingPage;
