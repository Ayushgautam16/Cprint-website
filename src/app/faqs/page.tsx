import React from 'react';
import FaqSection from '@/components/home/FaqSection';

export const metadata = {
  title: 'Frequently Asked Questions | RYNOCHI',
  description:
    'Answers to all questions about laser engraving, custom printing, delivery, minimum order quantities, and corporate gifting.',
};

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-12">
      <FaqSection />
    </div>
  );
}

