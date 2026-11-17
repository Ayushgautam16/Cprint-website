import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import BestsellerGrid from '@/components/home/BestsellerGrid';
import CustomizationStepSection from '@/components/home/CustomizationStepSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CorporateSection from '@/components/home/CorporateSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070C1E]">
      <HeroSection />
      <FeaturedCategories />
      <BestsellerGrid />
      <CustomizationStepSection />
      <WhyChooseUs />
      <CorporateSection />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}

