'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FinishOption {
  name: string;
  body: string;
  ink: string;
}

const FINISHES: FinishOption[] = [
  { name: 'Matte Black', body: '#26262B', ink: '#E8D3A0' },
  { name: 'Silver', body: '#C4C9D2', ink: '#2A2620' },
  { name: 'Champagne Gold', body: '#D2AC55', ink: '#2A2620' },
  { name: 'Ivory', body: '#F4ECD8', ink: '#2A2620' },
  { name: 'Graphite', body: '#55555C', ink: '#F3E4B8' },
];

const FONTS = [
  { label: 'Classic', fam: "'Cinzel', serif", k: 1.35 },
  { label: 'Script', fam: "'Great Vibes', cursive", k: 1.9 },
  { label: 'Modern', fam: "'Manrope', sans-serif", k: 1.45 },
];

export const LiveCustomizerSection: React.FC = () => {
  const [name, setName] = useState('Aarav Sharma');
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);

  const curFinish = FINISHES[selectedFinish];
  const curFont = FONTS[selectedFont];
  const displayText = name.trim() || 'Your Name';
  const len = Math.max(displayText.length, 6);
  const fontSize = Math.max(20, Math.min(52, Math.floor((300 / len) * curFont.k)));
  const textY = 178 + Math.round(fontSize / 3);

  const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello RYNOCHI, I would like help customizing a gift. Engraving text: ${displayText}, finish: ${curFinish.name}, font: ${curFont.label}.`
  )}`;

  return (
    <section
      id="customizer"
      className="relative py-28 bg-gradient-to-b from-[#FFFDF8] to-[#FBF3DC] overflow-hidden"
    >
      {/* Decorative circle backdrop */}
      <div
        aria-hidden="true"
        className="absolute -left-52 -bottom-52 w-[620px] h-[620px] rounded-full border border-[#E6D49A] pointer-events-none"
      />

      <div className="wrap relative">
        <div className="text-center max-w-[760px] mx-auto">
          <div className="eyebrow">Try it live</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,70px)] leading-[1.04] font-semibold text-[#2A2620]">
            Your Design. Your Name. <span className="shimmer">Your Creation.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#5B5444]">
            Type a name or dedication, select your preferred finish and typography, and see your customized piece previewed instantly.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-12 lg:gap-16">
          {/* Left Controls */}
          <div className="flex-1 basis-[440px] min-w-0 space-y-7">
            {/* Input Name */}
            <div>
              <label
                htmlFor="engraving-name"
                className="block text-xs tracking-[.2em] font-bold text-[#7A5C16] mb-3 uppercase"
              >
                ENGRAVING TEXT
              </label>
              <input
                id="engraving-name"
                type="text"
                maxLength={22}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type a name or company"
                className="field"
              />
            </div>

            {/* Finish Selector */}
            <div>
              <div className="text-xs tracking-[.2em] font-bold text-[#7A5C16] mb-3 uppercase">
                BARREL FINISH — <span className="text-[#2A2620]">{curFinish.name}</span>
              </div>
              <div className="flex gap-3.5 flex-wrap">
                {FINISHES.map((f, i) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setSelectedFinish(i)}
                    aria-label={f.name}
                    className="swatch"
                    style={{
                      backgroundColor: f.body,
                      border: i === selectedFinish ? '3px solid #C9A24B' : '3px solid rgba(42,38,32,0.18)',
                      boxShadow: i === selectedFinish ? '0 0 0 4px rgba(201,162,75,0.3)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Lettering Style */}
            <div>
              <div className="text-xs tracking-[.2em] font-bold text-[#7A5C16] mb-3 uppercase">
                LETTERING STYLE
              </div>
              <div className="flex gap-3 flex-wrap">
                {FONTS.map((font, i) => (
                  <button
                    key={font.label}
                    type="button"
                    onClick={() => setSelectedFont(i)}
                    className="chip"
                    style={{
                      background: i === selectedFont ? 'linear-gradient(110deg,#C9A24B,#F0DFAE)' : '#fff',
                      color: i === selectedFont ? '#2A2620' : '#7A5C16',
                      border: i === selectedFont ? '1px solid #C9A24B' : '1px solid #D9C48C',
                    }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`/product/matte-black-engraved-pen`}
                className="btn btn-gold"
              >
                Customize This Pen
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line"
              >
                Ask on WhatsApp
              </a>
            </div>

            <p className="text-xs leading-relaxed text-[#6E675A]">
              Indicative preview. Your final artwork is shared with you for approval before production begins.
            </p>
          </div>

          {/* Right Live Preview Stage */}
          <div className="flex-1 basis-[460px] min-w-0 relative bg-[radial-gradient(circle_at_50%_45%,#FFFFFF_0%,#F8EFD2_80%)] border border-[#E6D49A] flex items-center justify-center min-h-[440px] p-5 shadow-[0_30px_60px_rgba(122,92,22,0.14)] overflow-hidden">
            <div className="sweepline" />
            <div
              aria-hidden="true"
              className="absolute top-4 left-5 text-[11px] tracking-[.24em] text-[#7A5C16] font-bold uppercase"
            >
              LIVE PREVIEW
            </div>

            <svg
              viewBox="0 0 640 360"
              role="img"
              aria-label="Live pen preview showing your engraving text"
              className="w-full max-w-[640px] drop-shadow-[0_26px_22px_rgba(80,60,20,0.28)]"
            >
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F3E4B8" />
                  <stop offset="0.5" stopColor="#C9A24B" />
                  <stop offset="1" stopColor="#8A6A1F" />
                </linearGradient>
                <linearGradient id="cn" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#E8D3A0" />
                  <stop offset="1" stopColor="#A8791F" />
                </linearGradient>
              </defs>

              <g transform="rotate(-14 320 180)">
                {/* Pen Barrel Body with Selected Finish */}
                <rect
                  className="pen-live"
                  x="40"
                  y="140"
                  width="440"
                  height="80"
                  rx="40"
                  fill={curFinish.body}
                  stroke="rgba(42,38,32,0.28)"
                />
                {/* Reflection highlight */}
                <rect x="40" y="145" width="440" height="22" rx="11" fill="#fff" opacity="0.2" />

                {/* Gold Rings & Trims */}
                <rect x="66" y="140" width="26" height="80" fill="url(#cg)" />
                <rect x="436" y="140" width="16" height="80" fill="url(#cg)" />

                {/* Nib & Cone */}
                <path d="M480 148h40l90 32-90 32h-40z" fill="url(#cn)" />

                {/* Pocket Clip */}
                <rect x="150" y="118" width="190" height="14" rx="7" fill="url(#cg)" />

                {/* Laser Engraved Name */}
                <text
                  className="engr"
                  x="262"
                  y={textY}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fill={curFinish.ink}
                  style={{
                    fontFamily: curFont.fam,
                    letterSpacing: curFont.label === 'Classic' ? '0.06em' : '0.02em',
                    fontWeight: 600,
                  }}
                >
                  {displayText}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveCustomizerSection;

