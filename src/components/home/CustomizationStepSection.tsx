'use client';

import React from 'react';

const STEPS = [
  {
    n: '1',
    title: 'Choose your product',
    text: 'Browse pens, diaries and gift sets and pick the one that fits the person or the occasion.',
  },
  {
    n: '2',
    title: 'Personalize it',
    text: 'Add a name, company, message or upload your logo, then choose finish and placement.',
  },
  {
    n: '3',
    title: 'Preview, approve, order',
    text: 'Review your design, approve the proof and pay securely. We engrave and ship it to you.',
  },
];

export const CustomizationStepSection: React.FC = () => {
  return (
    <section id="how" className="py-28 bg-[#FFFDF8]">
      <div className="wrap">
        <div className="text-center max-w-[720px] mx-auto">
          <div className="eyebrow">How it works</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
            Three steps to a one-of-a-kind gift
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 mt-20">
          {/* Dotted connecting line on desktop */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[38px] left-[16%] right-[16%] h-[2px] opacity-60 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(90deg, #C9A24B 0 8px, transparent 8px 18px)',
            }}
          />

          {STEPS.map((step) => (
            <div
              key={step.n}
              className="step flex flex-col items-center text-center gap-5"
            >
              <div className="relative">
                <span className="pulse-ring" />
                <div className="stepno serif">{step.n}</div>
              </div>
              <h3 className="serif text-[30px] font-semibold leading-tight text-[#2A2620]">
                {step.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-[#5B5444] max-w-[320px]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomizationStepSection;
