'use client';

import React, { useState } from 'react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 bg-gradient-to-br from-[#F6EBC8] to-[#E9D9A6] text-center overflow-hidden"
    >
      {/* Twinkling star decorations */}
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 14 14"
        className="absolute left-[14%] top-[30%] tw"
      >
        <path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" fill="#B88A2E" />
      </svg>
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 14 14"
        className="absolute right-[16%] top-[62%] tw2"
      >
        <path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" fill="#fff" />
      </svg>

      <div className="wrap max-w-[760px] mx-auto">
        <div className="eyebrow">Stay in touch</div>
        <h2 className="serif mt-4 text-[clamp(38px,5vw,62px)] leading-[1.05] font-semibold text-[#2A2620]">
          New designs, occasion ideas &amp; offers
        </h2>
        <p className="mt-4 text-[16px] text-[#5B5444] max-w-[540px] mx-auto">
          Join our Patron Circle for private seasonal catalog previews, corporate gifting discounts, and new product announcements.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 mt-9 justify-center items-center"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="field flex-1 basis-[300px] max-w-[440px] !bg-white"
          />
          <button
            type="submit"
            className="btn btn-gold !bg-white !text-[#2A2620] shadow-md"
          >
            {subscribed ? '✓ Subscribed' : 'Subscribe'}
          </button>
        </form>

        {subscribed && (
          <p className="mt-4 text-sm font-semibold text-[#7A5C16] animate-in fade-in">
            ✓ Welcome to the RYNOCHI Patron Circle. We respect your privacy.
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;

