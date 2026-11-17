'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    q: 'What can I customize on my products?',
    a: 'You can personalize recipient names, company names, designation titles, corporate logos, or bespoke messages. Engraving placements include metallic brass plaques, pen barrels, and clips depending on the chosen model.',
  },
  {
    q: 'Is there a minimum order quantity?',
    a: 'No minimum order quantity applies for individual retail gifting — you can order a single personalized pen or diary. For corporate bulk batches of 20+ units, tiered volume discounts apply automatically.',
  },
  {
    q: 'Will I see a design proof before production?',
    a: 'Yes. Upon receiving your order, our master studio prepares a digital vector layout showing the exact font, size, and alignment. We share this with you via WhatsApp/Email for final approval prior to laser engraving.',
  },
  {
    q: 'Which payment methods are accepted?',
    a: 'We accept all major online payment channels powered by Razorpay: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and select Cash on Delivery (COD) options.',
  },
  {
    q: 'How do I track my order status?',
    a: 'You can track your order progression anytime using our 12-Stage Live Tracking portal with your Order Reference Number. You will also receive automated SMS and WhatsApp milestone notifications.',
  },
  {
    q: 'What if there is a defect or misprint on my order?',
    a: 'We operate under our strict Zero-Defect Guarantee. In the rare event of a manufacturing flaw or spelling discrepancy made on our end, we re-engrave and ship a brand new piece immediately free of charge.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    'Hello RYNOCHI Concierge, I have a question regarding custom printing and personalization.'
  )}`;

  return (
    <section id="faq" className="py-28 bg-[#FFFDF8]">
      <div className="wrap flex flex-wrap gap-14 lg:gap-20">
        {/* Left Column: Heading & WhatsApp CTA */}
        <div className="flex-1 basis-[320px] min-w-0">
          <div className="eyebrow">FAQ</div>
          <h2 className="serif mt-4 text-[clamp(40px,5vw,62px)] leading-[1.04] font-semibold text-[#2A2620]">
            Questions, answered
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-[#5B5444]">
            Cannot find what you need? Message our concierge and our laser studio will assist you in planning the perfect gifting suite.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-7"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Right Column: Accordion Rows */}
        <div className="flex-2 basis-[520px] min-w-0 border-t border-[#E6D9B3]">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="faqrow">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="faqq"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <span
                    className="plus"
                    style={{
                      transform: isOpen ? 'rotate(135deg)' : 'none',
                      backgroundColor: isOpen ? '#F0DFAE' : 'transparent',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </span>
                </button>
                <div
                  className="faqa"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div>
                    <p className="mb-6 text-[16px] leading-[1.75] text-[#5B5444] max-w-[620px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
