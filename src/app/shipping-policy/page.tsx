import React from 'react';

export const metadata = {
  title: 'Shipping & Delivery Policy | RYNOCHI',
  description: 'Pan-India express delivery speeds, dispatch windows, and courier tracking details.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-16 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-navy-800 pb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Logistics Guide
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Shipping & Delivery Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Updated for All-India Fulfillment</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">1. Manufacturing & Processing Time</h2>
            <p>
              Each item on RYNOCHI is personalized with precision fiber laser engraving. Production and quality inspection typically require <strong>24 to 48 business hours</strong> from the moment order and payment are confirmed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">2. Shipping Charges</h2>
            <p>
              We provide <strong>Complimentary Free Express Shipping</strong> across all serviceable Indian pincodes on orders with a subtotal above ₹999. For orders below this threshold, a flat nominal delivery fee of ₹99 applies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">3. Estimated Transit Timelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li><strong>Tier 1 Metro Cities:</strong> 2 to 3 business days post-dispatch (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata).</li>
              <li><strong>Tier 2 & Other Cities:</strong> 3 to 5 business days post-dispatch.</li>
              <li><strong>Remote / Northeast & Island Regions:</strong> 5 to 7 business days post-dispatch.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">4. Consignment Tracking</h2>
            <p>
              Once your parcel leaves our Delhi production studio, you will receive an automated SMS and WhatsApp notification containing the live Courier Air Waybill (AWB) number and direct tracking URL.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

