import React from 'react';

export const metadata = {
  title: 'Terms and Conditions | RYNOCHI',
  description: 'Terms governing personalized product ordering, customization proofs, and delivery on RYNOCHI.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-16 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-navy-800 pb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Client Agreement
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Terms and Conditions</h1>
          <p className="text-xs text-gray-500 mt-1">Last Updated: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and placing an order on rynochi.com, you agree to be bound by these terms. RYNOCHI specializes in bespoke personalized printing, laser engraving, and executive gifting solutions across India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">2. Customization Accuracy & Proofs</h2>
            <p>
              Customers are solely responsible for ensuring that all names, titles, initials, and text entered into the customization engine are spelled correctly. The live visual preview provided on product pages serves as an approximate mock-up. Minor variations in laser contrast and tone may occur depending on natural leather grain or metallic alloy composition.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">3. Intellectual Property in Artwork</h2>
            <p>
              When uploading logos or emblems for laser etching, you represent and warrant that you hold all legal rights, trademarks, or licenses for such marks. RYNOCHI reserves the right to decline engraving content that violates trademarks, hate speech, or obscenity standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif font-bold text-white">4. Governing Law & Jurisdiction</h2>
            <p>
              All transactions and disputes are governed under the laws of India, subject to the exclusive jurisdiction of the courts of New Delhi, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

