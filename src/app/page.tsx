'use client';
import React, { useEffect, useState } from 'react';
import HeroSection from "@components/HeroSection";
import AboutSection from "@components/AboutSection";
import ServicesSection from "@components/ServicesSection";
import PortfolioSection from "@components/PortfolioSection";
import CallToActionSection from "@components/CallToActionSection";
import AboutNoeticsDash from "@components/AboutNoeticsDash";

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <main className="space-y-20">
      <HeroSection />
      <ServicesSection />
      <AboutNoeticsDash />
      <AboutSection />
      <PortfolioSection />
      <CallToActionSection
        title="Ready for the next mission?"
        subtitle="We have the skills, tools, focus, and intensity to ensure it's complete. Let's talk."
      />
    </main>
  );
};

export default Home;