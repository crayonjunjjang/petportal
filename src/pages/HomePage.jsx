// src/pages/HomePage.jsx
import React from 'react';
// Removed Header and Footer imports
import HeroSection from '../components/sections/HeroSection';
import BestProductsSection from '../components/sections/BestProductsSection';
import PetSuppliesSection from '../components/sections/PetSuppliesSection';
import TrustSection from '../components/sections/TrustSection';
import PopularContentSection from '../components/sections/PopularContentSection';
import TestimonialSection from '../components/sections/TestimonialSection';
import LocationServiceSection from '../components/sections/LocationServiceSection';
import QuickCategorySection from '../components/sections/QuickCategorySection';
import NewsSection from '../components/sections/NewsSection';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      {/* Header removed */}
      <main>
        <HeroSection />
        <BestProductsSection />
        <PetSuppliesSection />
        <TrustSection />
        <PopularContentSection />
        <TestimonialSection />
        <LocationServiceSection />
        <QuickCategorySection />
        <NewsSection />
      </main>
      {/* Footer removed */}
    </div>
  );
};

export default HomePage;