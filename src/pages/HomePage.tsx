import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import PopularNow from '../components/PopularNow';



export default function HomePage() {
  // Analytics: Track section view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'view_section', {
                section: 'popular_now'
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const popularSection = document.getElementById('popular-now');
    if (popularSection) {
      observer.observe(popularSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PopularNow />
    </div>
  );
}