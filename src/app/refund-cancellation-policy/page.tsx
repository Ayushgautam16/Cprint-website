import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | RYNOCHI',
  description: 'Policies on cancellations, manufacturing defect replacements, and refunds for personalized items.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-16 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-navy-800 pb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Consumer Assurance
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Cancellation & Refund Policy</h1>
          <p className="text-xs text-gray-500 mt-1">100% Quality Assurance Standard</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">1. Cancellation Window</h2>
            <p>
              Due to the bespoke nature of personalized items, an order can only be cancelled or modified within <strong>2 hours</strong> of order placement before our laser engraving bench begins calibration. Once thermal engraving has commenced, the order enters non-cancellable status.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">2. 100% Free Replacement Guarantee</h2>
            <p>
              We stand unreservedly behind our laser craftsmanship. You are entitled to an <strong>immediate 100% free replacement</strong> in the following scenarios:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>A typographical or spelling error made on our part that differs from your submitted order specification.</li>
              <li>Visible physical transit damage, bent pen clips, or damaged presentation boxes upon delivery.</li>
              <li>Mechanical defects such as faulty pen twist mechanisms or broken diary clasps.</li>
            </ul>
            <p className="mt-2">
              To request a replacement, simply send a photo or unboxing video to our WhatsApp concierge or email <strong className="text-[#D4AF37]">support@rynochi.com</strong> within 48 hours of delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">3. Refund Processing</h2>
            <p>
              When a refund is approved by our management desk, it is credited directly to your original payment method (Bank account, Credit Card, or UPI) via Razorpay within 3 to 5 business banking days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

