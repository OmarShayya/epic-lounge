import React from "react";
import { Box } from "@mui/material";
import Hero from "@components/landing/Hero";
import Features from "@components/landing/Features";
import Gallery from "@components/landing/Gallery";
import About from "@components/landing/About";
import Location from "@components/landing/Location";
import CTA from "@components/landing/CTA";

const LandingPage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section - First impression with logo and CTA */}
      <Hero />

      {/* Features Section - Showcase all amenities */}
      <Features />

      {/* Gallery Section - Visual tour */}
      <Gallery />

      {/* About Section - Story and stats */}
      <About />

      {/* Location Section - Contact info and hours */}
      <Location />

      {/* CTA Section - Final push to action */}
      <CTA />
    </Box>
  );
};

export default LandingPage;
