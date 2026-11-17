'use client';

import React from 'react';
import Link from 'next/link';

const CORP_PERKS = [
  { t: 'Logo + Name', d: 'Company marks and individual names engraved on the same batch.' },
  { t: 'Design Proof', d: 'See and approve vector artwork before production begins.' },
  { t: 'Flexible Quantity', d: 'From a handful of VIP gifts to full-organization orders.' },
  { t: 'Festivals & Events', d: 'Coordinated packaging planned around your exact dates.' },
];

export const CorporateSection: React.FC = () => {
  const bulkWhatsApp = `https://wa.me/917277338436?text=${encodeURIComponent(
    'Hello RYNOCHI, I would like a quote for a corporate / bulk order. Quantity: __ , Occasion: __ , Customization: __ .'
  )}`;

  return (
    <section id="corporate" className="py-28 bg-[#FFFDF8]">
      <div className="wrap">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FBF1D2] to-[#F0DFAE] p-8 sm:p-14 lg:p-20 flex flex-wrap gap-12 items-center border border-[#D9C48C] shadow-lg">
          <div className="sweepline !bg-[linear-gradient(90deg,transparent,#fff,transparent)]" />

          {/* Left info */}
          <div className="flex-1 basis-[440px] min-w-0">
            <div className="eyebrow">Corporate &amp; bulk orders</div>
            <h2 className="serif mt-4 text-[clamp(38px,5vw,64px)] leading-[1.04] font-semibold text-[#2A2620]">
              Gifting for teams, clients &amp; <span className="shimmer">events</span>
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-[#4A432F] max-w-[540px]">
              Company emblems, brand marks and individual patron names engraved across the whole batch. Share your estimated quantity and occasion and our corporate team will draft a bespoke quote and visual proof.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <a
                href={bulkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold !bg-white !text-[#2A2620] shadow-md"
              >
                Request a Quote
              </a>
              <Link href="/contact" className="btn btn-line">
                Talk to Us
              </Link>
            </div>
          </div>

          {/* Right 2x2 grid */}
          <div className="flex-1 basis-[320px] min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CORP_PERKS.map((perk) => (
              <div
                key={perk.t}
                className="p-6 border border-[#E1CF98] bg-white/75 backdrop-blur-sm"
              >
                <div className="serif text-[24px] font-semibold text-[#7A5C16] leading-tight">
                  {perk.t}
                </div>
                <div className="mt-2 text-[14px] leading-relaxed text-[#4A432F]">
                  {perk.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
