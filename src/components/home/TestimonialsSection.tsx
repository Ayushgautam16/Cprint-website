'use client';

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Saurabh Kumar',
      role: 'Director of Operations',
      city: 'Gurugram',
      product: 'Executive Diary & Pen Gift Set',
      comment:
        'The gold plaque engraving on the leather diary was stunningly crisp. The weight of the pen and the magnetic lock on the diary give it a true luxury feel. The packaging was immaculate.',
      rating: 5,
    },
    {
      author: 'Sweta Saha',
      role: 'Corporate Communications Lead',
      city: 'Mumbai',
      product: 'Imperial Blue Rollerball Pen with Logo',
      comment:
        'We ordered engraved pens with our emblem for our annual summit. The laser contrast against the navy blue lacquer is sharp and permanent. Delivered 2 days ahead of schedule.',
      rating: 5,
    },
    {
      author: 'Dr. Raghav Singhania',
      role: 'Senior Consultant',
      city: 'Bengaluru',
      product: 'Emerald Prestige Stylus Pen',
      comment:
        'The touch stylus works flawlessly on my iPad, and the ballpoint glides effortlessly on legal pads. The emerald crystal on the clip makes it a real conversation starter.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#070D1F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Treasured Words from Our Patrons
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Read verified feedback from patrons and corporate leaders across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#0B132B] border border-navy-800 hover-luxury-card shadow-xl flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#D4AF37]/30" />
                </div>

                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed font-sans">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-navy-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white">{rev.author}</h4>
                    <p className="text-[11px] text-gray-400">
                      {rev.role} • {rev.city}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Verified Order
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-[#C5A059] font-medium">
                  Item: {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

