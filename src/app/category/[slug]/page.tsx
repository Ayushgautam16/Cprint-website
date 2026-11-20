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

// Map legacy slugs to the new official 5 categories so no existing link breaks
const SLUG_ALIASES: Record<string, string> = {
  'personalized-pens': 'pen-and-keychain',
  'premium-metal-pens': 'pen-and-keychain',
  'customized-diaries': 'pen-diary-and-card-holder',
  'gift-sets': 'combo-gift-sets',
  'corporate-gifts': 'combo-gift-sets',
  'stylus-pens': 'keychain',
  'keychains': 'keychain',
  'card-holder': 'cards-holder',
};

export function generateStaticParams() {
  const primarySlugs = CATEGORIES.map((c) => ({ slug: c.slug }));
  const legacySlugs = Object.keys(SLUG_ALIASES).map((slug) => ({ slug }));
  return [...primarySlugs, ...legacySlugs];
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedSlug = SLUG_ALIASES[params.slug] || params.slug;
  const category = CATEGORIES.find((c) => c.slug === resolvedSlug || c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter(
    (p) => p.categoryId === category.id || p.categoryName === category.name
  );

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

