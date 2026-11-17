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

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.categoryId === category.id);

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

