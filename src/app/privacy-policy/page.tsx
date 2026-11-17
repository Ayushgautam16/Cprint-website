import React from 'react';

export const metadata = {
  title: 'Privacy Policy | RYNOCHI',
  description: 'How RYNOCHI collects, safeguards, and handles customer data and uploaded artwork.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-16 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-navy-800 pb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Legal Document
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Privacy Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Effective Date: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">1. Information We Collect</h2>
            <p>
              When you purchase or inquire on RYNOCHI (rynochi.com), we collect information necessary to fulfill your personalized orders, including your name, shipping address, email address, contact telephone number, and custom laser engraving text or uploaded artwork logos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">2. Confidentiality of Custom Artwork & Logos</h2>
            <p>
              Any logos, emblems, signatures, or proprietary designs uploaded by customers or corporate clients are used strictly for manufacturing the authorized merchandise. We never resell, distribute, or license your proprietary artwork to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">3. Payment Information Security</h2>
            <p>
              All online financial payments are securely processed through Razorpay, a PCI-DSS Level 1 certified payment gateway. RYNOCHI does not store or process your complete credit card numbers, CVVs, or net-banking credentials on our private servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">4. Courier & Delivery Partners</h2>
            <p>
              To complete physical fulfillment, your delivery contact details are shared exclusively with trusted courier aggregators and partners (such as Blue Dart, Delhivery, DTDC, and India Post) solely for shipping logistics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">5. Contact Our Privacy Officer</h2>
            <p>
              For any questions regarding personal data access or deletion requests, please contact: <a href="mailto:rynochioffice@gmail.com" className="text-[#D4AF37] hover:underline font-bold">rynochioffice@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

