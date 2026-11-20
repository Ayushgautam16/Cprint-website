import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS } from '@/lib/mockData';
import { getBreadcrumbStructuredData } from '@/lib/seo';
import CategoryDetailLive from '@/components/product/CategoryDetailLive';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Map legacy URL slugs so no external links or bookmarks break
const SLUG_ALIASES: Record<string, string> = {
  'gift-sets': 'diary-and-pen-gift-sets',
  'stylus-pens': 'stylus-pens-accessories',
  'keychains': 'keychain',
  'card-holder': 'cards-holder',
};

export function generateStaticParams() {
  const primarySlugs = CATEGORIES.map((c) => ({ slug: c.slug }));
  const legacySlugs = Object.keys(SLUG_ALIASES).map((slug) => ({ slug }));
  return [...primarySlugs, ...legacySlugs];
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const directCategory = CATEGORIES.find((c) => c.slug === params.slug);
  const aliasSlug = SLUG_ALIASES[params.slug];
  const category = directCategory || (aliasSlug ? CATEGORIES.find((c) => c.slug === aliasSlug) : undefined);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => {
    if (p.categoryId === category.id || p.categoryName === category.name) return true;
    const catSlug = category.slug;
    const pName = (p.name || '').toLowerCase();
    const pCat = (p.categoryName || '').toLowerCase();
    if (catSlug === 'personalized-pens') return pCat.includes('pen') || pName.includes('pen');
    if (catSlug === 'premium-metal-pens') return pName.includes('metal') || pName.includes('gold') || pName.includes('carbon') || pName.includes('rollerball');
    if (catSlug === 'customized-diaries') return pCat.includes('diary') || pName.includes('diary') || pName.includes('journal');
    if (catSlug === 'diary-and-pen-gift-sets') return (pName.includes('diary') && pName.includes('pen')) || pCat.includes('gift') || pName.includes('journal');
    if (catSlug === 'corporate-gifts') return pName.includes('corporate') || pName.includes('gift') || pName.includes('hamper') || p.isCustomizable;
    if (catSlug === 'stylus-pens-accessories') return pName.includes('stylus') || pName.includes('keychain') || (p.shortDescription || '').toLowerCase().includes('phone');
    if (catSlug === 'keychain') return pCat.includes('keychain') || pName.includes('keychain');
    if (catSlug === 'pen-and-keychain') return pCat.includes('pen') || pName.includes('pen') || pName.includes('keychain');
    if (catSlug === 'cards-holder') return pCat.includes('card') || pName.includes('card');
    if (catSlug === 'pen-diary-and-card-holder') return pCat.includes('diary') || pName.includes('diary') || pName.includes('card') || pName.includes('journal');
    if (catSlug === 'combo-gift-sets') return pCat.includes('gift') || pName.includes('gift') || pName.includes('hamper') || pName.includes('set');
    return false;
  });

  const breadcrumbsJsonLd = getBreadcrumbStructuredData([
    { name: 'Home', url: 'https://rynochi.com' },
    { name: 'Categories', url: 'https://rynochi.com/shop' },
    { name: category.name, url: `https://rynochi.com/category/${category.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <CategoryDetailLive initialCategory={category} initialProducts={categoryProducts} />
    </div>
  );
}

