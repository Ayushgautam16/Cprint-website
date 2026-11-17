import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import BestsellerGrid from '@/components/home/BestsellerGrid';
import LiveCustomizerSection from '@/components/home/LiveCustomizerSection';
import InsideLookSection from '@/components/home/InsideLookSection';
import VisualBannerSection from '@/components/home/VisualBannerSection';
import WatchInActionSection from '@/components/home/WatchInActionSection';
import CustomizationStepSection from '@/components/home/CustomizationStepSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CorporateSection from '@/components/home/CorporateSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Categories Section */}
      <FeaturedCategories />

      {/* 3. Bestselling Products with Auto-Swiping Galleries */}
      <BestsellerGrid />

      {/* 4. Live Customizer Studio */}
      <LiveCustomizerSection />

      {/* 5. Inside Look & Craftsmanship Breakdown */}
      <InsideLookSection />

      {/* 6. Editorial Visual Banner */}
      <VisualBannerSection />

      {/* 7. Watch It Come To Life */}
      <WatchInActionSection />

      {/* 8. Three Steps How It Works */}
      <CustomizationStepSection />

      {/* 9. Why Choose RYNOCHI */}
      <WhyChooseUs />

      {/* 10. Corporate & Bulk Orders */}
      <CorporateSection />

      {/* 11. Customer Stories & Testimonials */}
      <TestimonialsSection />

      {/* 12. FAQ Section */}
      <FaqSection />

      {/* 13. VIP Club & Newsletter */}
      <NewsletterSection />
    </div>
  );
}
