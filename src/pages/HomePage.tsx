import React from 'react';
import HeroSection from '../components/HeroSection';
import PopularNow from '../components/PopularNow';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PopularNow />
    </div>
  );
}