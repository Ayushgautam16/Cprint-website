import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Shield, Award, Sparkles, CheckCircle2, Truck, Star, Quote, HelpCircle, MessageSquare } from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import ProductGallery from '@/components/product/ProductGallery';
import CustomizationEngine from '@/components/product/CustomizationEngine';
import ProductCard from '@/components/product/ProductCard';
import { getProductStructuredData, getBreadcrumbStructuredData } from '@/lib/seo';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId
  ).slice(0, 3);

  // Structured Data
  const productJsonLd = getProductStructuredData(product);
  const breadcrumbJsonLd = getBreadcrumbStructuredData([
    { name: 'Home', url: 'https://rynochi.com' },
    { name: 'Shop', url: 'https://rynochi.com/shop' },
    { name: product.categoryName, url: `https://rynochi.com/category/${product.categoryId}` },
    { name: product.name, url: `https://rynochi.com/product/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#070C1E] py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F3E5AB] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Studio Layout: Left Side (Gallery + Visuals) & Right Side (Customization Engine) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Multi-view Gallery & Zoom (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProductGallery images={product.images} productName={product.name} />

            {/* Artisanal Heritage Details */}
            <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-3 hidden lg:block">
              <h4 className="text-xs uppercase font-serif font-bold text-[#F3E5AB] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                The RYNOCHI Standard
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Permanent Laser Etch:</strong> Non-erasable high-contrast laser mark
                    penetrating into deep metallic layer.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Signature Rigid Box:</strong> Delivered presentation-ready with protective foam padding and gold satin pull.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>24-48h Dispatch:</strong> Individual personalized orders processed with priority turnaround.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Title, Customization Controls, Live Canvas (7 Cols) */}
          <div className="lg:col-span-7">
            <CustomizationEngine product={product} />
          </div>
        </div>

        {/* Detailed Product Specifications & Description Tabs */}
        <div className="mt-16 pt-12 border-t border-navy-800/80">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                Product Description & Craftsmanship
              </h2>
              <div className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* Technical Specs Table */}
            {product.specifications && (
              <div className="space-y-3 pt-4">
                <h3 className="text-lg font-serif font-bold text-[#F3E5AB] tracking-wide">
                  Technical Specifications
                </h3>
                <div className="rounded-2xl overflow-hidden border border-navy-800 bg-[#091126]">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? 'bg-navy-950/60' : 'bg-[#091126]'}
                        >
                          <td className="px-5 py-3 font-semibold text-gray-300 w-1/3 border-b border-navy-800/50">
                            {key}
                          </td>
                          <td className="px-5 py-3 text-gray-400 border-b border-navy-800/50">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verified Patron Reviews Section */}
        <div className="mt-16 pt-12 border-t border-navy-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">4.9 / 5.0</span>
                <span className="text-xs text-gray-400">(Based on verified orders)</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Client Testimonials & Unboxing Impressions
              </h3>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified Gifting Patrons
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 hover-luxury-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[#D4AF37]/30" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &quot;The laser marking on the solid brass nameplate is microscopic perfection. Ordered this for our executive director and he was thoroughly impressed by the presentation box.&quot;
              </p>
              <div className="pt-2 border-t border-navy-800/80">
                <strong className="text-xs text-white block">Saurabh Kumar</strong>
                <span className="text-[11px] text-gray-400">Verified Corporate Buyer • Gurugram</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 hover-luxury-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[#D4AF37]/30" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &quot;The weight of the pen and the magnetic lock of the diary feel so luxurious. The gold engraving doesn&apos;t smudge or scratch even with daily office usage.&quot;
              </p>
              <div className="pt-2 border-t border-navy-800/80">
                <strong className="text-xs text-white block">Sweta Saha</strong>
                <span className="text-[11px] text-gray-400">Verified Individual Patron • Mumbai</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 hover-luxury-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[#D4AF37]/30" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &quot;Delivered in just 48 hours to Bengaluru with our company crest perfectly engraved. Packaging was so secure that not a single edge was dented.&quot;
              </p>
              <div className="pt-2 border-t border-navy-800/80">
                <strong className="text-xs text-white block">Raghav Singhania</strong>
                <span className="text-[11px] text-gray-400">Managing Partner • Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Frequently Asked Questions */}
        <div className="mt-16 pt-12 border-t border-navy-800">
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Craftsmanship Inquiries
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Questions Regarding This Piece
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
            <div className="p-5 rounded-2xl bg-[#091126] border border-navy-800 space-y-2">
              <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Will the laser engraving fade or peel?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Never. We use high-precision German MOPA Fiber Lasers that etch deep into the underlying alloy/brass substrate, not topical ink. The engraving is permanent and impervious to moisture or friction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#091126] border border-navy-800 space-y-2">
              <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Can I inspect a digital proof before shipping?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Yes! The live preview studio renders your font and layout in real-time. Additionally, our artisan concierge sends a high-res photo proof via WhatsApp before dispatch upon request.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#091126] border border-navy-800 space-y-2">
              <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Is signature gift boxing included?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Yes, every RYNOCHI product arrives nested in our signature rigid matte navy presentation box with champagne gold satin pull-ribbons and custom-cut protective foam.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#091126] border border-navy-800 space-y-2">
              <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> What if there is a typographical error?
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Under our Zero-Defect Guarantee, if our engraving studio makes any typographical mistake against your order notes, we craft and dispatch a 100% free expedited replacement immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-navy-800">
            <div className="mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                You May Also Admire
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                Complementary Personalized Pieces
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

